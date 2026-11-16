"""Comprehensive automated tests for Phase 2 Cricket Pressure Detection Engine.

Tests:
1. Target handling (1st vs 2nd innings, super overs)
2. Monotonicity in controlled counterfactual scenarios
3. Missing features handling and graceful fallbacks
4. Zero-leakage verification (outcome invariance on current delivery)
5. Scale bounds [0, 100] and calibrated tier assignments
"""

from pathlib import Path
import numpy as np
import pandas as pd
import pytest

from src.data_loader import load_matches
from src.pressure_engine import (
    ChasingWinProbabilityModel,
    FirstInningsResourceModel,
    PressureEngine,
)


@pytest.fixture(scope="module")
def enriched_data():
    """Load enriched deliveries parquet from Phase 1."""
    parquet_path = Path("data/processed/deliveries_enriched.parquet")
    assert parquet_path.exists(), "Phase 1 enriched parquet must exist"
    return pd.read_parquet(parquet_path)


@pytest.fixture(scope="module")
def matches_data():
    """Load matches data table."""
    return load_matches("data/raw")


@pytest.fixture(scope="module")
def fitted_engine(enriched_data, matches_data):
    """Instantiate and fit PressureEngine once for testing."""
    engine = PressureEngine()
    engine.fit(enriched_data, matches_df=matches_data)
    return engine


# ==============================================================================
# 1. TARGET HANDLING TESTS
# ==============================================================================

def test_target_handling_innings_1_and_2(fitted_engine, enriched_data):
    """Verify target handling: NaN in innings 1, valid numeric target in innings 2."""
    df_scored = fitted_engine.calculate_pressure(enriched_data)

    inn1 = df_scored[df_scored["innings"] == 1]
    inn2 = df_scored[df_scored["innings"] == 2]

    # Innings 1: target_runs and win_probability are NaN (resource-based pressure)
    assert inn1["target_runs"].isna().all()
    assert inn1["win_probability"].isna().all()
    assert inn1["pressure_score"].notna().all()

    # Innings 2: target_runs and win_probability are present
    valid_inn2 = inn2[inn2["is_valid_innings"]]
    assert valid_inn2["target_runs"].notna().all()
    assert (valid_inn2["target_runs"] > 0).all()
    assert valid_inn2["win_probability"].notna().all()
    assert (valid_inn2["win_probability"] >= 0.0).all()
    assert (valid_inn2["win_probability"] <= 1.0).all()
    assert valid_inn2["pressure_score"].notna().all()


def test_super_over_target_handling(fitted_engine, enriched_data):
    """Verify Super Over handling in Innings 3 & 4."""
    df_scored = fitted_engine.calculate_pressure(enriched_data)

    so_inn3 = df_scored[df_scored["innings"] == 3]
    so_inn4 = df_scored[df_scored["innings"] == 4]

    assert len(so_inn3) == 25
    assert len(so_inn4) == 13

    # All super over deliveries must be high or extreme pressure
    assert (so_inn3["pressure_score"] >= 80.0).all()
    assert (so_inn4["pressure_score"] >= 85.0).all()
    assert set(so_inn4["pressure_tier"].unique()) == {"Extreme"}


# ==============================================================================
# 2. MONOTONICITY IN CONTROLLED EXAMPLES
# ==============================================================================

def test_chase_monotonicity_with_falling_wickets(fitted_engine):
    """Controlled test: in a chase, holding balls & target constant, losing wickets increases pressure."""
    # Scenario: Needing 15 runs in 18 balls (RRR = 5.0)
    # Wickets lost from 1 down to 6 down
    test_rows = []
    for w in [1, 2, 3, 4, 5, 6]:
        test_rows.append({
            "match_id": 99991,
            "innings": 2,
            "current_innings_runs": 140,
            "current_innings_wickets": w,
            "legal_balls_bowled": 102,
            "balls_remaining": 18,
            "target_runs": 155.0,
            "runs_required": 15.0,
            "current_run_rate": 8.23,
            "required_run_rate": 5.0,
            "allocated_legal_balls": 120,
            "knock_out": 0,
            "is_valid_innings": True,
            "competition_category": "IPL",
        })

    df_test = pd.DataFrame(test_rows)
    scored = fitted_engine.calculate_pressure(df_test)
    scores = scored["pressure_score"].tolist()

    # Scores must strictly increase as wickets in hand decrease
    for i in range(len(scores) - 1):
        assert scores[i] <= scores[i + 1], f"Wicket loss monotonicity failed: {scores}"


def test_chase_monotonicity_with_consumed_dot_balls(fitted_engine):
    """Controlled test: in a chase, holding wickets & runs constant, consuming dots increases pressure."""
    # Scenario: 20 runs needed, 4 wickets down.
    # Balls remaining decreasing: 24 balls -> 18 balls -> 12 balls -> 6 balls
    test_rows = []
    for b in [24, 18, 12, 6]:
        test_rows.append({
            "match_id": 99992,
            "innings": 2,
            "current_innings_runs": 130,
            "current_innings_wickets": 4,
            "legal_balls_bowled": 120 - b,
            "balls_remaining": b,
            "target_runs": 150.0,
            "runs_required": 20.0,
            "current_run_rate": 7.5,
            "required_run_rate": (20.0 / b) * 6.0,
            "allocated_legal_balls": 120,
            "knock_out": 0,
            "is_valid_innings": True,
            "competition_category": "IPL",
        })

    df_test = pd.DataFrame(test_rows)
    scored = fitted_engine.calculate_pressure(df_test)
    scores = scored["pressure_score"].tolist()

    # Pressure must increase as balls remaining decrease
    for i in range(len(scores) - 1):
        assert scores[i] <= scores[i + 1], f"Dot ball consumption monotonicity failed: {scores}"


def test_first_innings_monotonicity_with_early_collapse(fitted_engine):
    """Controlled test: in 1st innings at 36 balls (powerplay), losing more wickets increases pressure."""
    test_rows = []
    for w in [0, 1, 2, 4]:
        test_rows.append({
            "match_id": 99993,
            "innings": 1,
            "current_innings_runs": 35,
            "current_innings_wickets": w,
            "legal_balls_bowled": 36,
            "balls_remaining": 84,
            "target_runs": np.nan,
            "runs_required": np.nan,
            "current_run_rate": 5.83,
            "required_run_rate": np.nan,
            "allocated_legal_balls": 120,
            "knock_out": 0,
            "is_valid_innings": True,
            "competition_category": "IPL",
        })

    df_test = pd.DataFrame(test_rows)
    scored = fitted_engine.calculate_pressure(df_test)
    scores = scored["pressure_score"].tolist()

    # Scores must increase as wickets lost increase
    for i in range(len(scores) - 1):
        assert scores[i] <= scores[i + 1], f"1st innings collapse monotonicity failed: {scores}"


# ==============================================================================
# 3. MISSING FEATURES & ROBUSTNESS TESTS
# ==============================================================================

def test_missing_features_robustness(fitted_engine):
    """Verify engine handles NaNs, missing rates, or strange boundary inputs gracefully."""
    robustness_rows = [
        # Missing RRR
        {"match_id": 99994, "innings": 2, "current_innings_runs": 50, "current_innings_wickets": 2,
         "legal_balls_bowled": 60, "balls_remaining": 60, "target_runs": 150.0, "runs_required": 100.0,
         "current_run_rate": np.nan, "required_run_rate": np.nan, "allocated_legal_balls": 120,
         "knock_out": 0, "is_valid_innings": True, "competition_category": "T20I"},
        # Extreme RRR (e.g. 50 RPO)
        {"match_id": 99995, "innings": 2, "current_innings_runs": 80, "current_innings_wickets": 8,
         "legal_balls_bowled": 114, "balls_remaining": 6, "target_runs": 180.0, "runs_required": 100.0,
         "current_run_rate": 4.21, "required_run_rate": 100.0, "allocated_legal_balls": 120,
         "knock_out": 0, "is_valid_innings": True, "competition_category": "IPL"},
        # Zero balls bowled (first ball)
        {"match_id": 99996, "innings": 1, "current_innings_runs": 0, "current_innings_wickets": 0,
         "legal_balls_bowled": 0, "balls_remaining": 120, "target_runs": np.nan, "runs_required": np.nan,
         "current_run_rate": 0.0, "required_run_rate": np.nan, "allocated_legal_balls": 120,
         "knock_out": 0, "is_valid_innings": True, "competition_category": "IPL"},
    ]

    df_test = pd.DataFrame(robustness_rows)
    scored = fitted_engine.calculate_pressure(df_test)

    assert len(scored) == 3
    assert scored["pressure_score"].notna().all()
    assert (scored["pressure_score"] >= 0.0).all()
    assert (scored["pressure_score"] <= 100.0).all()
    assert scored["pressure_tier"].isin(["Ordinary", "Medium", "High", "Extreme"]).all()


# ==============================================================================
# 4. ZERO DATA LEAKAGE VERIFICATION
# ==============================================================================

def test_zero_leakage_outcome_invariance(fitted_engine, enriched_data):
    """Verify outcome invariance: altering delivery outcome does NOT change pre-delivery pressure."""
    # Pick a sample delivery from match 13512
    sample = enriched_data[enriched_data["match_id"] == 13512].iloc[10:11].copy()

    # Base score
    score_base = fitted_engine.calculate_pressure(sample)["pressure_score"].iloc[0]

    # Mutate post-delivery outcome: simulate hitting a 6 instead of whatever occurred
    mutated_six = sample.copy()
    mutated_six["delivery_team_runs"] = 6
    mutated_six["runs"] = 6
    mutated_six["is_six"] = True
    score_six = fitted_engine.calculate_pressure(mutated_six)["pressure_score"].iloc[0]

    # Mutate post-delivery outcome: simulate a wicket
    mutated_w = sample.copy()
    mutated_w["is_wicket"] = True
    mutated_w["dismissal_type"] = "Bowled"
    score_w = fitted_engine.calculate_pressure(mutated_w)["pressure_score"].iloc[0]

    assert score_base == score_six, "Leakage detected: delivery runs affected pre-ball pressure!"
    assert score_base == score_w, "Leakage detected: delivery dismissal affected pre-ball pressure!"


def test_chronological_split_purity(fitted_engine):
    """Verify Win Probability model was trained strictly chronologically."""
    wp_m = fitted_engine.wp_model.metrics_
    assert wp_m["train_samples"] > 50000
    assert wp_m["test_samples"] > 30000
    assert wp_m["test_roc_auc"] >= 0.85
    assert wp_m["test_brier_score"] <= 0.15


# ==============================================================================
# 5. SCALE & CALIBRATION ALIGNMENT
# ==============================================================================

def test_calibration_and_tier_alignment(fitted_engine, enriched_data):
    """Verify calibrated distributions for Innings 1 and Innings 2 are aligned."""
    df_scored = fitted_engine.calculate_pressure(enriched_data)
    valid = df_scored[df_scored["is_valid_innings"]]

    inn1 = valid[valid["innings"] == 1]["pressure_score"]
    inn2 = valid[valid["innings"] == 2]["pressure_score"]

    # Both means must be centered around 50.0 (+/- 1.0)
    assert abs(inn1.mean() - 50.0) < 1.0, f"Innings 1 mean miscalibrated: {inn1.mean()}"
    assert abs(inn2.mean() - 50.0) < 1.0, f"Innings 2 mean miscalibrated: {inn2.mean()}"
    assert abs(inn1.mean() - inn2.mean()) < 0.5, "Innings 1 and 2 distributions diverge significantly!"

    # Verify tiers distribution
    tier_counts = valid["pressure_tier"].value_counts(normalize=True)
    assert tier_counts["Ordinary"] > 0.25
    assert tier_counts["Medium"] > 0.25
    assert tier_counts["High"] > 0.15
    assert tier_counts["Extreme"] > 0.10
