"""Validation tests for match state reconstruction engine."""

import numpy as np
import pandas as pd
import pytest

from src.data_loader import load_all_datasets
from src.match_state import (
    assign_match_phase,
    identify_delivery_properties,
    reconstruct_match_state,
)


@pytest.fixture(scope="module")
def loaded_data():
    return load_all_datasets("data/raw")


# ==============================================================================
# 1. SYNTHETIC TESTS
# ==============================================================================

def test_synthetic_delivery_properties():
    """Verify delivery classification on synthetic edge cases."""
    synth_df = pd.DataFrame([
        # 1. Normal dot ball
        {"runs": 0, "extras_type": np.nan, "extras1_runs": 0, "extras_2_runs": 0, "is_wicket": False, "dismissal_type": np.nan},
        # 2. Normal boundary 4
        {"runs": 4, "extras_type": np.nan, "extras1_runs": 0, "extras_2_runs": 0, "is_wicket": False, "dismissal_type": np.nan},
        # 3. Wide (1 run penalty)
        {"runs": 0, "extras_type": "wide", "extras1_runs": 1, "extras_2_runs": 0, "is_wicket": False, "dismissal_type": np.nan},
        # 4. Single
        {"runs": 1, "extras_type": np.nan, "extras1_runs": 0, "extras_2_runs": 0, "is_wicket": False, "dismissal_type": np.nan},
        # 5. Front-foot no-ball with boundary hit (4 off bat + 1 penalty = 5 total)
        {"runs": 4, "extras_type": "Overstep", "extras1_runs": 1, "extras_2_runs": 0, "is_wicket": False, "dismissal_type": np.nan},
        # 6. Caught dismissal (bowler credited)
        {"runs": 0, "extras_type": np.nan, "extras1_runs": 0, "extras_2_runs": 0, "is_wicket": True, "dismissal_type": "Caught"},
        # 7. RunOut dismissal (team wicket, NOT bowler wicket)
        {"runs": 1, "extras_type": np.nan, "extras1_runs": 0, "extras_2_runs": 0, "is_wicket": True, "dismissal_type": "RunOut"},
        # 8. Other no-ball with byes (1 penalty + 4 byes = 5 total)
        {"runs": 0, "extras_type": "other", "extras1_runs": 1, "extras_2_runs": 4, "is_wicket": False, "dismissal_type": np.nan},
        # 9. Retire Out dismissal (team wicket, NOT bowler wicket)
        {"runs": 0, "extras_type": np.nan, "extras1_runs": 0, "extras_2_runs": 0, "is_wicket": True, "dismissal_type": "Retire Out"},
        # 10. Legbyes (1 legbye extra)
        {"runs": 0, "extras_type": "legbyes", "extras1_runs": 1, "extras_2_runs": 0, "is_wicket": False, "dismissal_type": np.nan},
    ])

    res = identify_delivery_properties(synth_df)

    # 1. Team runs
    expected_team_runs = [0, 4, 1, 1, 5, 0, 1, 5, 0, 1]
    assert res["delivery_team_runs"].tolist() == expected_team_runs

    # 2. Legal delivery
    # Wides (idx 2), Overstep (idx 4), other (idx 7) are illegal
    expected_legal = [True, True, False, True, False, True, True, False, True, True]
    assert res["is_legal_delivery"].tolist() == expected_legal

    # 3. Balls faced by batter (wides are not faced; no-balls and leg-byes are faced)
    expected_faced = [True, True, False, True, True, True, True, True, True, True]
    assert res["is_batter_ball_faced"].tolist() == expected_faced

    # 4. Bowler wickets vs Team wickets
    assert res["is_team_wicket"].tolist() == [False, False, False, False, False, True, True, False, True, False]
    assert res["is_bowler_wicket"].tolist() == [False, False, False, False, False, True, False, False, False, False]

    # 5. Bowler runs conceded
    # idx 4 (Overstep): 4 (bat) + 1 (penalty) = 5
    # idx 7 (other + 4 byes): 0 (bat) + 1 (penalty) = 1 (byes not charged to bowler!)
    # idx 9 (legbyes): 0 (bat) + 0 = 0 (legbyes not charged to bowler!)
    assert res.loc[4, "delivery_bowler_runs"] == 5
    assert res.loc[7, "delivery_bowler_runs"] == 1
    assert res.loc[9, "delivery_bowler_runs"] == 0


def test_synthetic_match_state_strictly_before_delivery():
    """Verify state strictly represents conditions BEFORE the delivery (zero leakage)."""
    # Create two synthetic innings
    b_records = []
    # Innings 1: 5 deliveries (runs: 1, 0, 4, wide(1), 6)
    # Ball 1: 1 run
    b_records.append({"match_id": 99999, "innings": 1, "overid": 1, "over_ball_num": 1, "innings_ball_num": 1,
                      "batting_team_id": 10, "bowling_team_id": 20, "striker_id": 101, "striker_name": "A",
                      "non_striker_id": 102, "non_striker_name": "B", "bowler_id": 201, "bowler_name": "X",
                      "runs": 1, "extras_type": np.nan, "extras1_runs": 0, "extras_2_runs": 0,
                      "is_wicket": False, "dismissal_type": np.nan, "is_four": False, "is_six": False})
    # Ball 2: 0 run
    b_records.append({"match_id": 99999, "innings": 1, "overid": 1, "over_ball_num": 2, "innings_ball_num": 2,
                      "batting_team_id": 10, "bowling_team_id": 20, "striker_id": 102, "striker_name": "B",
                      "non_striker_id": 101, "non_striker_name": "A", "bowler_id": 201, "bowler_name": "X",
                      "runs": 0, "extras_type": np.nan, "extras1_runs": 0, "extras_2_runs": 0,
                      "is_wicket": False, "dismissal_type": np.nan, "is_four": False, "is_six": False})
    # Ball 3: 4 runs + wicket (caught)
    b_records.append({"match_id": 99999, "innings": 1, "overid": 1, "over_ball_num": 3, "innings_ball_num": 3,
                      "batting_team_id": 10, "bowling_team_id": 20, "striker_id": 102, "striker_name": "B",
                      "non_striker_id": 101, "non_striker_name": "A", "bowler_id": 201, "bowler_name": "X",
                      "runs": 4, "extras_type": np.nan, "extras1_runs": 0, "extras_2_runs": 0,
                      "is_wicket": True, "dismissal_type": "Caught", "is_four": True, "is_six": False})
    # Ball 4: wide (1 extra run)
    b_records.append({"match_id": 99999, "innings": 1, "overid": 1, "over_ball_num": 4, "innings_ball_num": 4,
                      "batting_team_id": 10, "bowling_team_id": 20, "striker_id": 103, "striker_name": "C",
                      "non_striker_id": 101, "non_striker_name": "A", "bowler_id": 201, "bowler_name": "X",
                      "runs": 0, "extras_type": "wide", "extras1_runs": 1, "extras_2_runs": 0,
                      "is_wicket": False, "dismissal_type": np.nan, "is_four": False, "is_six": False})
    # Ball 5: 6 runs
    b_records.append({"match_id": 99999, "innings": 1, "overid": 1, "over_ball_num": 5, "innings_ball_num": 5,
                      "batting_team_id": 10, "bowling_team_id": 20, "striker_id": 103, "striker_name": "C",
                      "non_striker_id": 101, "non_striker_name": "A", "bowler_id": 201, "bowler_name": "X",
                      "runs": 6, "extras_type": np.nan, "extras1_runs": 0, "extras_2_runs": 0,
                      "is_wicket": False, "dismissal_type": np.nan, "is_four": False, "is_six": True})

    # Innings 2: chasing target
    b_records.append({"match_id": 99999, "innings": 2, "overid": 1, "over_ball_num": 1, "innings_ball_num": 1,
                      "batting_team_id": 20, "bowling_team_id": 10, "striker_id": 201, "striker_name": "X",
                      "non_striker_id": 202, "non_striker_name": "Y", "bowler_id": 101, "bowler_name": "A",
                      "runs": 0, "extras_type": np.nan, "extras1_runs": 0, "extras_2_runs": 0,
                      "is_wicket": False, "dismissal_type": np.nan, "is_four": False, "is_six": False})
    b_records.append({"match_id": 99999, "innings": 2, "overid": 1, "over_ball_num": 2, "innings_ball_num": 2,
                      "batting_team_id": 20, "bowling_team_id": 10, "striker_id": 201, "striker_name": "X",
                      "non_striker_id": 202, "non_striker_name": "Y", "bowler_id": 101, "bowler_name": "A",
                      "runs": 4, "extras_type": np.nan, "extras1_runs": 0, "extras_2_runs": 0,
                      "is_wicket": False, "dismissal_type": np.nan, "is_four": True, "is_six": False})

    bbb = pd.DataFrame(b_records)
    matches = pd.DataFrame([{
        "match_id": 99999, "comp_id": 1001, "match_date": "2024-05-01", "result": "Team 10 Won by 8 Runs",
        "first_inn_revised_overs": np.nan, "second_inn_revised_overs": np.nan, "revised_target": np.nan
    }])
    competitions = pd.DataFrame([{
        "comp_id": 1001, "comp_name": "IPL 2024", "match_format": "T20", "season": "2024",
        "competition_category": "IPL", "is_eligible_competition": True
    }])
    teams = pd.DataFrame([
        {"team_id": 10, "team_name": "Team 10"},
        {"team_id": 20, "team_name": "Team 20"}
    ])

    enriched = reconstruct_match_state(bbb, matches, competitions, teams)

    # Ball 1 Innings 1: situation BEFORE ball 1
    ball1 = enriched.iloc[0]
    assert ball1["current_innings_runs"] == 0
    assert ball1["current_innings_wickets"] == 0
    assert ball1["legal_balls_bowled"] == 0
    assert ball1["balls_remaining"] == 120
    assert ball1["current_run_rate"] == 0.0
    assert pd.isna(ball1["target_runs"])

    # Ball 2: after 1 run
    ball2 = enriched.iloc[1]
    assert ball2["current_innings_runs"] == 1
    assert ball2["current_innings_wickets"] == 0
    assert ball2["legal_balls_bowled"] == 1
    assert ball2["balls_remaining"] == 119
    assert ball2["current_run_rate"] == 6.0

    # Ball 4 (wide): after Ball 3 (which had 4 runs and a wicket)
    # Runs before ball 4: 1 + 0 + 4 = 5. Wickets: 1. Legal balls: 3.
    ball4 = enriched.iloc[3]
    assert ball4["current_innings_runs"] == 5
    assert ball4["current_innings_wickets"] == 1
    assert ball4["legal_balls_bowled"] == 3
    assert ball4["balls_remaining"] == 117

    # Ball 5: after the wide (ball 4 had 1 extra run, 0 legal balls)
    # Runs before ball 5: 5 + 1 = 6. Wickets: 1. Legal balls: 3 (wide didn't advance legal balls!).
    ball5 = enriched.iloc[4]
    assert ball5["current_innings_runs"] == 6
    assert ball5["current_innings_wickets"] == 1
    assert ball5["legal_balls_bowled"] == 3
    assert ball5["balls_remaining"] == 117

    # Innings 2: total innings 1 runs = 1 + 0 + 4 + 1 + 6 = 12.
    # Target = 12 + 1 = 13!
    inn2_ball1 = enriched.iloc[5]
    assert inn2_ball1["target_runs"] == 13.0
    assert inn2_ball1["runs_required"] == 13.0
    assert inn2_ball1["balls_remaining"] == 120
    assert inn2_ball1["required_run_rate"] == (13.0 / 120) * 6.0

    # Innings 2 Ball 2: after dot ball
    inn2_ball2 = enriched.iloc[6]
    assert inn2_ball2["runs_required"] == 13.0
    assert inn2_ball2["balls_remaining"] == 119
    assert inn2_ball2["required_run_rate"] == (13.0 / 119) * 6.0


def test_match_phase_assignment():
    """Verify match phase definitions in standard and shortened matches."""
    # Standard 20 overs (120 balls)
    assert assign_match_phase(1, 120, 1) == "Powerplay"
    assert assign_match_phase(6, 120, 1) == "Powerplay"
    assert assign_match_phase(7, 120, 1) == "Middle"
    assert assign_match_phase(15, 120, 1) == "Middle"
    assert assign_match_phase(16, 120, 1) == "Death"
    assert assign_match_phase(20, 120, 1) == "Death"

    # Super over: always Death
    assert assign_match_phase(1, 6, 3) == "Death"
    assert assign_match_phase(1, 6, 4) == "Death"

    # Shortened match: 10 overs (60 balls)
    assert assign_match_phase(1, 60, 1) == "Powerplay"
    assert assign_match_phase(3, 60, 1) == "Powerplay"
    assert assign_match_phase(4, 60, 1) == "Middle"
    assert assign_match_phase(7, 60, 1) == "Death"


# ==============================================================================
# 2. REAL RECORD VALIDATION TESTS
# ==============================================================================

def test_real_match_runs_accumulation(loaded_data):
    """Verify runs accumulated across entire match match official scorecard totals."""
    df = reconstruct_match_state(
        loaded_data["ball_by_ball"],
        loaded_data["matches"],
        loaded_data["competitions"],
        loaded_data["teams"],
    )

    # Test on match 13512 (England 171 vs West Indies 170, England won by 1 run)
    m12 = df[df["match_id"] == 13512]
    inn1 = m12[m12["innings"] == 1]
    inn2 = m12[m12["innings"] == 2]

    # Innings 1 total
    last_b_inn1 = inn1.iloc[-1]
    inn1_total = last_b_inn1["current_innings_runs"] + last_b_inn1["delivery_team_runs"]
    assert inn1_total == 171

    # Innings 2 total
    last_b_inn2 = inn2.iloc[-1]
    inn2_total = last_b_inn2["current_innings_runs"] + last_b_inn2["delivery_team_runs"]
    assert inn2_total == 170

    # Chasing target in Innings 2
    assert inn2.iloc[0]["target_runs"] == 172.0
    assert inn2.iloc[0]["runs_required"] == 172.0


def test_real_dls_revised_target(loaded_data):
    """Verify shortened and DLS match targets."""
    df = reconstruct_match_state(
        loaded_data["ball_by_ball"],
        loaded_data["matches"],
        loaded_data["competitions"],
        loaded_data["teams"],
    )

    # Match 21586: IPL 2023 Final (CSK vs GT, revised target 171 in 15 overs = 90 balls)
    final_match = df[df["match_id"] == 21586]
    inn2 = final_match[final_match["innings"] == 2]
    first_ball_chase = inn2.iloc[0]

    assert first_ball_chase["target_runs"] == 171.0
    assert first_ball_chase["allocated_legal_balls"] == 90
    assert first_ball_chase["balls_remaining"] == 90
    assert bool(first_ball_chase["is_shortened_match"]) is True


def test_no_duplicate_delivery_identifiers(loaded_data):
    """Verify zero duplicate deliveries in final reconstructed dataset."""
    df = reconstruct_match_state(
        loaded_data["ball_by_ball"],
        loaded_data["matches"],
        loaded_data["competitions"],
        loaded_data["teams"],
    )
    dups = df.duplicated(subset=["match_id", "innings", "innings_ball_num"]).sum()
    assert dups == 0


def test_invalid_innings_flagged(loaded_data):
    """Verify incomplete or abandoned matches are cleanly flagged."""
    df = reconstruct_match_state(
        loaded_data["ball_by_ball"],
        loaded_data["matches"],
        loaded_data["competitions"],
        loaded_data["teams"],
    )

    # Match 15410 was abandoned after 22 balls
    m_aband = df[df["match_id"] == 15410]
    assert len(m_aband) == 22
    assert (m_aband["is_valid_innings"] == False).all()
    assert (m_aband["invalidation_reason"] == "Match Abandoned").all()

    # Normal completed match (13511)
    m_valid = df[df["match_id"] == 13511]
    assert (m_valid["is_valid_innings"] == True).all()
    assert m_valid["invalidation_reason"].isna().all()
