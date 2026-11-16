"""Match state reconstruction engine for SupeRR Selector Season 2.

Accurately reconstructs the exact match situation strictly BEFORE every delivery
without future information leakage. Handles all cricket edge cases including:
- Wides, no-balls (Overstep and other), byes, leg-byes, penalty runs
- Team wickets vs bowler-credited wickets (RunOuts, Retire Outs, etc.)
- Shortened matches, DLS revised targets, and Super Overs
- Flagging incomplete / abandoned match states with documented reasons
"""

from typing import Dict, Optional, Tuple, Union
import numpy as np
import pandas as pd


def identify_delivery_properties(df: pd.DataFrame) -> pd.DataFrame:
    """Classify delivery legality, credited runs, and dismissal credits.

    Args:
        df: Raw ball_by_ball DataFrame.

    Returns:
        DataFrame with computed delivery-level columns.
    """
    out = df.copy()

    # Total runs on delivery scored by batting team
    r = out["runs"].fillna(0).astype(int)
    e1 = out["extras1_runs"].fillna(0).astype(int)
    e2 = out["extras_2_runs"].fillna(0).astype(int)
    out["delivery_team_runs"] = r + e1 + e2

    # Legal delivery flag: wides and no-balls (Overstep / other) are illegal
    extras = out["extras_type"].fillna("").astype(str).str.strip().str.lower()
    is_illegal = extras.isin(["wide", "overstep", "other"])
    out["is_legal_delivery"] = ~is_illegal

    # Batter credited runs and balls faced
    out["delivery_batter_runs"] = r
    out["is_batter_ball_faced"] = extras != "wide"

    # Bowler runs conceded:
    # Off bat + wides + no-ball penalties (extras1 on overstep/other).
    # Byes, leg-byes, penalties, and fielding extras on no-balls are not bowler runs.
    is_wide = extras == "wide"
    is_noball = extras.isin(["overstep", "other"])
    bowler_extras = np.where(is_wide, e1, np.where(is_noball, e1, 0))
    out["delivery_bowler_runs"] = r + bowler_extras

    # Dismissals:
    # Team wicket: any dismissal in the delivery
    out["is_team_wicket"] = out["is_wicket"].fillna(False).astype(bool)

    # Bowler wicket: only dismissals credited to bowler
    bowler_wicket_types = ["caught", "bowled", "lbw", "stump", "hit wicket"]
    d_type = out["dismissal_type"].fillna("").astype(str).str.strip().str.lower()
    out["is_bowler_wicket"] = out["is_team_wicket"] & d_type.isin(bowler_wicket_types)

    return out


def calculate_match_overs_and_targets(
    bbb_df: pd.DataFrame,
    matches_df: pd.DataFrame,
) -> Tuple[Dict[Tuple[int, int], int], Dict[Tuple[int, int], float]]:
    """Determine allocated legal balls and target score for each (match_id, innings).

    Args:
        bbb_df: Prepared ball_by_ball DataFrame with delivery_team_runs.
        matches_df: Matches DataFrame with revised targets and revised overs.

    Returns:
        Tuple of:
          - allocated_balls_map: (match_id, innings) -> total legal balls
          - target_runs_map: (match_id, innings) -> target runs (or NaN for 1st/3rd inn)
    """
    m_info = matches_df.set_index("match_id").to_dict("index")

    # Calculate actual 1st and 3rd innings totals
    inn_totals = bbb_df.groupby(["match_id", "innings"])["delivery_team_runs"].sum().to_dict()

    allocated_balls_map: Dict[Tuple[int, int], int] = {}
    target_runs_map: Dict[Tuple[int, int], float] = {}

    match_innings_pairs = bbb_df[["match_id", "innings"]].drop_duplicates().values

    for mid, inn in match_innings_pairs:
        mid_int = int(mid)
        inn_int = int(inn)
        m = m_info.get(mid_int, {})

        first_rev_overs = m.get("first_inn_revised_overs")
        second_rev_overs = m.get("second_inn_revised_overs")
        rev_target = m.get("revised_target")

        # Determine allocated balls
        if inn_int in [3, 4]:
            # Super Over: standard 1 over = 6 balls
            alloc_balls = 6
        elif inn_int == 1:
            if pd.notna(first_rev_overs) and first_rev_overs > 0:
                alloc_balls = int(first_rev_overs)
            else:
                alloc_balls = 120
        elif inn_int == 2:
            if pd.notna(second_rev_overs) and second_rev_overs > 0:
                alloc_balls = int(second_rev_overs)
            elif pd.notna(first_rev_overs) and first_rev_overs > 0:
                alloc_balls = int(first_rev_overs)
            else:
                alloc_balls = 120
        else:
            alloc_balls = 120

        allocated_balls_map[(mid_int, inn_int)] = alloc_balls

        # Determine target
        if inn_int in [1, 3]:
            # First innings of regular or super over has no target
            target_runs_map[(mid_int, inn_int)] = np.nan
        elif inn_int == 2:
            if pd.notna(rev_target) and rev_target > 0:
                target_runs_map[(mid_int, inn_int)] = float(rev_target)
            else:
                inn1_runs = inn_totals.get((mid_int, 1), np.nan)
                target_runs_map[(mid_int, inn_int)] = (
                    float(inn1_runs + 1) if pd.notna(inn1_runs) else np.nan
                )
        elif inn_int == 4:
            inn3_runs = inn_totals.get((mid_int, 3), np.nan)
            target_runs_map[(mid_int, inn_int)] = (
                float(inn3_runs + 1) if pd.notna(inn3_runs) else np.nan
            )
        else:
            target_runs_map[(mid_int, inn_int)] = np.nan

    return allocated_balls_map, target_runs_map


def assign_match_phase(overid: int, allocated_balls: int, innings: int) -> str:
    """Determine match phase (Powerplay, Middle, Death) based on match structure.

    Args:
        overid: 1-indexed over number (1 to 20).
        allocated_balls: Total allocated legal balls in the innings.
        innings: Innings number (1, 2, 3, 4).

    Returns:
        'Powerplay', 'Middle', or 'Death'.
    """
    if innings in [3, 4]:
        # Super Overs are entirely high-leverage Death situations
        return "Death"

    alloc_overs = max(1, allocated_balls // 6)

    if alloc_overs >= 20:
        if overid <= 6:
            return "Powerplay"
        elif overid >= 16:
            return "Death"
        else:
            return "Middle"
    else:
        # Proportionate phases for shortened matches
        pp_overs = max(1, int(round(alloc_overs * 0.3)))
        death_start_over = max(pp_overs + 1, alloc_overs - 4)
        if overid <= pp_overs:
            return "Powerplay"
        elif overid >= death_start_over:
            return "Death"
        else:
            return "Middle"


def reconstruct_match_state(
    ball_by_ball_df: pd.DataFrame,
    matches_df: pd.DataFrame,
    competitions_df: pd.DataFrame,
    teams_df: pd.DataFrame,
) -> pd.DataFrame:
    """Reconstruct complete ball-by-ball match state strictly BEFORE each delivery.

    Args:
        ball_by_ball_df: Raw or prepared ball_by_ball DataFrame.
        matches_df: Matches DataFrame.
        competitions_df: Competitions DataFrame.
        teams_df: Teams DataFrame.

    Returns:
        Enriched DataFrame with pre-delivery state columns.
    """
    # 1. Identify delivery properties (runs, legality, wickets)
    df = identify_delivery_properties(ball_by_ball_df)

    # 2. Ensure deterministic sequential order
    df = df.sort_values(
        by=["match_id", "innings", "innings_ball_num", "overid", "over_ball_num"]
    ).reset_index(drop=True)

    # 3. Compute match-level allocations and targets
    alloc_map, target_map = calculate_match_overs_and_targets(df, matches_df)

    # Map allocations and targets to rows
    pair_series = list(zip(df["match_id"].astype(int), df["innings"].astype(int)))
    df["allocated_legal_balls"] = [alloc_map.get(p, 120) for p in pair_series]
    df["target_runs"] = [target_map.get(p, np.nan) for p in pair_series]

    # 4. Calculate cumulative metrics BEFORE each ball (zero leakage)
    # Group by match_id and innings
    grp = df.groupby(["match_id", "innings"], sort=False)

    df["current_innings_runs"] = grp["delivery_team_runs"].cumsum() - df["delivery_team_runs"]
    df["current_innings_wickets"] = grp["is_team_wicket"].cumsum() - df["is_team_wicket"].astype(int)
    df["legal_balls_bowled"] = grp["is_legal_delivery"].cumsum() - df["is_legal_delivery"].astype(int)

    # 5. Balls remaining
    df["balls_remaining"] = np.maximum(
        0, df["allocated_legal_balls"] - df["legal_balls_bowled"]
    )

    # 6. Runs required (only for chasing innings: 2 and 4)
    df["runs_required"] = np.where(
        df["target_runs"].notna(),
        np.maximum(0.0, df["target_runs"] - df["current_innings_runs"]),
        np.nan,
    )

    # 7. Current Run Rate (CRR)
    # CRR = (runs so far / legal balls so far) * 6
    df["current_run_rate"] = np.where(
        df["legal_balls_before"] if "legal_balls_before" in df else df["legal_balls_bowled"] > 0,
        (df["current_innings_runs"] / df["legal_balls_bowled"]) * 6.0,
        0.0,
    )

    # 8. Required Run Rate (RRR)
    # RRR = (runs required / balls remaining) * 6
    # Defined when chasing and balls remaining > 0
    can_calc_rrr = df["runs_required"].notna() & (df["balls_remaining"] > 0)
    df["required_run_rate"] = np.where(
        can_calc_rrr,
        (df["runs_required"] / df["balls_remaining"]) * 6.0,
        np.where(df["runs_required"].notna() & (df["runs_required"] == 0), 0.0, np.nan),
    )

    # 9. Match Phase
    df["match_phase"] = [
        assign_match_phase(int(oid), int(alloc), int(inn))
        for oid, alloc, inn in zip(df["overid"], df["allocated_legal_balls"], df["innings"])
    ]

    # 10. Metadata & context enrichment
    # Merge competition details
    m_cols = [
        "match_id",
        "comp_id",
        "match_date",
        "result",
        "first_inn_revised_overs",
        "second_inn_revised_overs",
        "revised_target",
    ]
    matches_sub = matches_df[m_cols].drop_duplicates("match_id")
    df = df.merge(matches_sub, on="match_id", how="left")

    comp_cols = ["comp_id", "comp_name", "match_format", "season", "competition_category", "is_eligible_competition"]
    comp_sub = competitions_df[comp_cols].drop_duplicates("comp_id")
    df = df.merge(comp_sub, on="comp_id", how="left")

    # Team names mapping
    team_dict = teams_df.drop_duplicates("team_id").set_index("team_id")["team_name"].to_dict()
    df["batting_team_name"] = df["batting_team_id"].map(team_dict)
    df["bowling_team_name"] = df["bowling_team_id"].map(team_dict)

    # 11. Validity and anomaly flags
    # Flag abandoned or no-result matches
    is_abandoned = df["result"].isin(["Match Abandoned", "No Result"])
    df["is_valid_innings"] = ~is_abandoned
    df["invalidation_reason"] = np.where(is_abandoned, df["result"], None)

    # Super over flag
    df["is_super_over"] = df["innings"].isin([3, 4])

    # Shortened match flag
    df["is_shortened_match"] = df["allocated_legal_balls"] < 120

    return df
