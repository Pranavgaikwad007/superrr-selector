"""Bowling Performance & Reliability Engine for SupeRR Selector Season 2.

Quantifies bowler performance and reliability under high pressure match situations:
- Identifies High and Extreme pressure deliveries (pressure_score >= 65.0)
- Context-adjusted Expected Runs Conceded (xRuns) across (competition_category, match_phase, pressure_tier)
- Pressure Economy vs Overall Baseline Economy (Delta Econ)
- Context Runs Prevented per 6 Balls (RP6)
- Dot-ball generation and Boundary suppression under pressure
- Pressure wicket-taking strike rate and dismissal impact
- Cross-match consistency and variance stability
- Bayesian shrinkage stabilization (prior strength n0 = 100 pseudo-balls)
- 95% Confidence Intervals
"""

from typing import Any, Dict, List, Optional
import numpy as np
import pandas as pd


class BowlingEngine:
    """Evaluates and scores bowler reliability under match pressure."""

    def __init__(self, config: Optional[Dict[str, Any]] = None):
        """Initialize the BowlingEngine with evaluation parameters.

        Args:
            config: Optional dictionary of configuration parameters.
        """
        self.config = config or {}
        self.pressure_threshold: float = float(self.config.get("pressure_threshold", 65.0))
        self.min_pressure_balls: int = int(self.config.get("min_pressure_balls", 120))
        self.min_pressure_matches: int = int(self.config.get("min_pressure_matches", 8))
        self.min_total_balls: int = int(self.config.get("min_total_balls", 250))
        self.prior_balls_n0: float = float(self.config.get("prior_balls_n0", 100.0))
        self.prior_mean: float = float(self.config.get("prior_mean", 50.0))
        self.score_scale: float = float(self.config.get("score_scale", 18.0))

    def compute_context_baselines(self, df: pd.DataFrame) -> pd.DataFrame:
        """Compute expected bowler runs conceded and wicket rate by match context partition.

        Partitions by: (competition_category, match_phase, pressure_tier)
        using only eligible competitions (IPL and T20I) and legal deliveries.

        Args:
            df: Deliveries DataFrame with pressure scores and tiers.

        Returns:
            DataFrame of context cells and expected bowler metrics.
        """
        mask_elig = df["is_eligible_competition"] & df["is_legal_delivery"]
        df_sub = df[mask_elig]

        group_cols = ["competition_category", "match_phase", "pressure_tier"]
        baselines = (
            df_sub.groupby(group_cols)
            .agg(
                x_bowler_runs=("delivery_bowler_runs", "mean"),
                x_wicket_rate=("is_bowler_wicket", "mean"),
                cell_balls=("is_legal_delivery", "count"),
            )
            .reset_index()
        )
        return baselines

    def compute_bowling_metrics(self, df: pd.DataFrame) -> pd.DataFrame:
        """Compute comprehensive pressure bowling metrics and reliability ratings.

        Args:
            df: Deliveries DataFrame with enriched match state and pressure scores.

        Returns:
            DataFrame of eligible bowlers with performance metrics, reliability score, and CIs.
        """
        # 1. Filter to eligible competitions
        df_elig = df[df["is_eligible_competition"]].copy()

        # 2. Attach context baselines
        baselines = self.compute_context_baselines(df_elig)
        cell_cols = ["competition_category", "match_phase", "pressure_tier"]
        df_elig = df_elig.merge(baselines, on=cell_cols, how="left")
        # Fallbacks for any unmapped cells
        df_elig["x_bowler_runs"] = df_elig["x_bowler_runs"].fillna(1.35)
        df_elig["x_wicket_rate"] = df_elig["x_wicket_rate"].fillna(0.055)

        # 3. Identify pressure deliveries
        is_press = df_elig["pressure_score"] >= self.pressure_threshold
        df_press = df_elig[is_press].copy()

        # 4. Overall Career Bowling Aggregation (in dataset scope)
        df_legal = df_elig[df_elig["is_legal_delivery"]]
        bowl_total = (
            df_legal.groupby(["bowler_id", "bowler_name"])
            .agg(
                total_balls=("is_legal_delivery", "sum"),
                total_runs=("delivery_bowler_runs", "sum"),
                total_wickets=("is_bowler_wicket", "sum"),
                total_matches=("match_id", "nunique"),
            )
            .reset_index()
        )

        # 5. High-Pressure Bowling Aggregation
        df_press_legal = df_press[df_press["is_legal_delivery"]]
        bowl_press = (
            df_press_legal.groupby(["bowler_id", "bowler_name"])
            .agg(
                pressure_balls=("is_legal_delivery", "sum"),
                pressure_matches=("match_id", "nunique"),
                pressure_runs=("delivery_bowler_runs", "sum"),
                pressure_wickets=("is_bowler_wicket", "sum"),
                pressure_fours=("is_four", "sum"),
                pressure_sixes=("is_six", "sum"),
                pressure_dots=("delivery_bowler_runs", lambda s: (s == 0).sum()),
                pressure_xruns=("x_bowler_runs", "sum"),
            )
            .reset_index()
        )

        # 6. Match-Level Consistency
        match_bowl = (
            df_press_legal.groupby(["bowler_id", "match_id"])
            .agg(
                m_runs=("delivery_bowler_runs", "sum"),
                m_xruns=("x_bowler_runs", "sum"),
                m_balls=("is_legal_delivery", "sum"),
            )
            .reset_index()
        )
        match_bowl["m_rp"] = match_bowl["m_xruns"] - match_bowl["m_runs"]
        bowl_cons = (
            match_bowl.groupby("bowler_id")
            .agg(
                positive_impact_match_pct=("m_rp", lambda s: (s >= 0).mean() * 100.0),
            )
            .reset_index()
        )

        # 7. Primary Franchise / Team Association
        b_teams = (
            df_legal.groupby(["bowler_id", "bowling_team_name"])
            .size()
            .reset_index(name="ball_count")
        )
        top_teams = (
            b_teams.sort_values(by=["bowler_id", "ball_count"], ascending=[True, False])
            .groupby("bowler_id")
            .head(2)
        )
        team_summary = (
            top_teams.groupby("bowler_id")["bowling_team_name"]
            .apply(lambda s: " / ".join(s))
            .reset_index(name="teams")
        )

        # 8. Merge all dimensions
        bowl_df = bowl_press.merge(bowl_total, on=["bowler_id", "bowler_name"], how="inner")
        bowl_df = bowl_df.merge(bowl_cons, on="bowler_id", how="left")
        bowl_df = bowl_df.merge(team_summary, on="bowler_id", how="left")

        # 9. Apply Minimum Sample Size Eligibility Filters
        mask_eligible = (
            (bowl_df["pressure_balls"] >= self.min_pressure_balls)
            & (bowl_df["pressure_matches"] >= self.min_pressure_matches)
            & (bowl_df["total_balls"] >= self.min_total_balls)
        )
        eligible_df = bowl_df[mask_eligible].copy()

        if len(eligible_df) == 0:
            return pd.DataFrame()

        # 10. Compute Analytical Rates
        eligible_df["pressure_overs"] = (eligible_df["pressure_balls"] / 6.0).round(1)
        eligible_df["econ_overall"] = (
            eligible_df["total_runs"] / eligible_df["total_balls"]
        ) * 6.0
        eligible_df["econ_pressure"] = (
            eligible_df["pressure_runs"] / eligible_df["pressure_balls"]
        ) * 6.0
        eligible_df["delta_econ"] = (
            eligible_df["econ_pressure"] - eligible_df["econ_overall"]
        )
        eligible_df["runs_prevented_per_6"] = (
            (eligible_df["pressure_xruns"] - eligible_df["pressure_runs"])
            / eligible_df["pressure_balls"]
        ) * 6.0
        eligible_df["dot_pct"] = (
            eligible_df["pressure_dots"] / eligible_df["pressure_balls"]
        ) * 100.0
        eligible_df["boundary_pct"] = (
            (eligible_df["pressure_fours"] + eligible_df["pressure_sixes"])
            / eligible_df["pressure_balls"]
        ) * 100.0
        eligible_df["wicket_sr"] = (
            eligible_df["pressure_balls"] / eligible_df["pressure_wickets"].clip(lower=1)
        )
        eligible_df["wicket_rate"] = (
            eligible_df["pressure_wickets"] / eligible_df["pressure_balls"]
        )
        eligible_df["avg_pressure"] = (
            eligible_df["pressure_runs"] / eligible_df["pressure_wickets"].clip(lower=1)
        )

        # 11. Multi-Dimensional Standardized Scoring
        def _z(col: pd.Series) -> pd.Series:
            s = col.std()
            return (col - col.mean()) / (s if s > 0 else 1.0)

        # Weighting:
        # Core Execution (30%): Economy suppression (-15%), Dot ball generation (+10%), Boundary suppression (-5%)
        # Context-Adjusted Value (35%): Runs Prevented per 6 balls (+25%), Wicket Rate (+10%)
        # Pressure Elevation (20%): Delta Economy suppression (-20%)
        # Cross-Match Consistency (15%): Positive Impact Match % (+15%)
        z_comp = (
            -0.15 * _z(eligible_df["econ_pressure"])
            + 0.10 * _z(eligible_df["dot_pct"])
            - 0.05 * _z(eligible_df["boundary_pct"])
            + 0.25 * _z(eligible_df["runs_prevented_per_6"])
            + 0.10 * _z(eligible_df["wicket_rate"])
            - 0.20 * _z(eligible_df["delta_econ"])
            + 0.15 * _z(eligible_df["positive_impact_match_pct"])
        )

        # Normalize composite z to unit variance
        z_standardized = _z(z_comp)

        # Raw score before shrinkage (centered at 50, standard deviation = 18)
        raw_score = self.prior_mean + self.score_scale * z_standardized

        # 12. Bayesian Shrinkage (Sample-Size Stabilization)
        # lambda(n) = n / (n + n0)
        shrinkage_weights = eligible_df["pressure_balls"] / (
            eligible_df["pressure_balls"] + self.prior_balls_n0
        )
        eligible_df["reliability_score"] = (
            shrinkage_weights * raw_score + (1.0 - shrinkage_weights) * self.prior_mean
        ).round(2)

        # 13. Statistical Confidence Intervals (95% CI)
        # SE decreases with sample size: SE = 15.0 / sqrt(n / 50)
        se = 15.0 / np.sqrt(eligible_df["pressure_balls"] / 50.0)
        eligible_df["ci_lower"] = (
            eligible_df["reliability_score"] - 1.96 * se
        ).clip(lower=0.0, upper=100.0).round(2)
        eligible_df["ci_upper"] = (
            eligible_df["reliability_score"] + 1.96 * se
        ).clip(lower=0.0, upper=100.0).round(2)

        # 14. Sort by Reliability Score Descending
        eligible_df = eligible_df.sort_values(
            by=["reliability_score", "pressure_balls"], ascending=[False, False]
        ).reset_index(drop=True)

        return eligible_df
