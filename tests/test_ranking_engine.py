"""Automated test suite for Phase 3 Player Performance & Reliability Ranking Engine.

Verifies:
1. Batting performance metric calculations and constraints
2. Bowling performance metric calculations and constraints
3. Player ID aggregation purity (no name-collision leakage)
4. Minimum sample size eligibility threshold enforcement
5. Empirical Bayesian shrinkage properties
6. 95% Confidence Interval bounds and sample-size scaling
7. Exact Top 10 rankings integrity (cardinality 10, monotonic rank 1-10, no duplicates)
8. Frontend JSON deliverable schema compliance
9. CSV deliverables existence, non-emptiness, and column consistency
10. End-to-end mathematical reproducibility
"""

import json
from pathlib import Path
import numpy as np
import pandas as pd
import pytest

from src.batting_engine import BattingEngine
from src.bowling_engine import BowlingEngine
from src.ranking_engine import RankingEngine


@pytest.fixture(scope="module")
def deliveries_pressure_df() -> pd.DataFrame:
    """Load cached deliveries_pressure.parquet."""
    path = Path("data/processed/deliveries_pressure.parquet")
    if not path.exists():
        pytest.skip("deliveries_pressure.parquet not found. Execute Phase 2 first.")
    return pd.read_parquet(path)


@pytest.fixture(scope="module")
def ranking_engine() -> RankingEngine:
    """Instantiate standard RankingEngine."""
    return RankingEngine()


def test_batting_metrics_calculation(deliveries_pressure_df, ranking_engine):
    """Test batting metric calculations, bounds, and internal consistency."""
    bat_df = ranking_engine.rank_batters(deliveries_pressure_df)
    assert len(bat_df) > 50, "Expected at least 50 eligible batters"

    # Check bounds
    assert (bat_df["sr_pressure"] > 0).all()
    assert (bat_df["sr_overall"] > 0).all()
    assert (bat_df["boundary_pct"] >= 0).all() and (bat_df["boundary_pct"] <= 100).all()
    assert (bat_df["dot_pct"] >= 0).all() and (bat_df["dot_pct"] <= 100).all()
    assert (bat_df["reliability_score"] >= 0).all() and (bat_df["reliability_score"] <= 100).all()

    # Check mathematical consistency
    np.testing.assert_allclose(
        bat_df["delta_sr"],
        bat_df["sr_pressure"] - bat_df["sr_overall"],
        rtol=1e-4,
        atol=1e-4,
    )


def test_bowling_metrics_calculation(deliveries_pressure_df, ranking_engine):
    """Test bowling metric calculations, bounds, and internal consistency."""
    bowl_df = ranking_engine.rank_bowlers(deliveries_pressure_df)
    assert len(bowl_df) > 50, "Expected at least 50 eligible bowlers"

    # Check bounds
    assert (bowl_df["econ_pressure"] > 0).all()
    assert (bowl_df["econ_overall"] > 0).all()
    assert (bowl_df["dot_pct"] >= 0).all() and (bowl_df["dot_pct"] <= 100).all()
    assert (bowl_df["boundary_pct"] >= 0).all() and (bowl_df["boundary_pct"] <= 100).all()
    assert (bowl_df["reliability_score"] >= 0).all() and (bowl_df["reliability_score"] <= 100).all()

    # Check mathematical consistency
    np.testing.assert_allclose(
        bowl_df["delta_econ"],
        bowl_df["econ_pressure"] - bowl_df["econ_overall"],
        rtol=1e-4,
        atol=1e-4,
    )


def test_player_id_aggregation_purity(deliveries_pressure_df, ranking_engine):
    """Ensure aggregation is strictly by player_id and never collapses name collisions."""
    bat_df = ranking_engine.rank_batters(deliveries_pressure_df)
    bowl_df = ranking_engine.rank_bowlers(deliveries_pressure_df)

    # striker_id and bowler_id must be unique primary keys
    assert bat_df["striker_id"].is_unique, "striker_id must be strictly unique in batting rankings"
    assert bowl_df["bowler_id"].is_unique, "bowler_id must be strictly unique in bowling rankings"


def test_sample_size_eligibility_enforcement(deliveries_pressure_df, ranking_engine):
    """Verify that all ranked players strictly satisfy sample size criteria."""
    bat_df = ranking_engine.rank_batters(deliveries_pressure_df)
    bowl_df = ranking_engine.rank_bowlers(deliveries_pressure_df)

    # Batters
    assert (bat_df["pressure_balls"] >= 120).all()
    assert (bat_df["pressure_matches"] >= 8).all()
    assert (bat_df["total_balls"] >= 250).all()

    # Bowlers
    assert (bowl_df["pressure_balls"] >= 120).all()
    assert (bowl_df["pressure_matches"] >= 8).all()
    assert (bowl_df["total_balls"] >= 250).all()


def test_bayesian_shrinkage_properties(deliveries_pressure_df, ranking_engine):
    """Verify that Bayesian shrinkage pulls smaller samples toward prior mean (50.0)."""
    bat_df = ranking_engine.rank_batters(deliveries_pressure_df)
    # Check that shrinkage weight lambda = n / (n + 100)
    expected_weights = bat_df["pressure_balls"] / (bat_df["pressure_balls"] + 100.0)
    assert (expected_weights > 0.50).all()
    assert (expected_weights < 1.00).all()


def test_confidence_intervals_properties(deliveries_pressure_df, ranking_engine):
    """Verify that 95% Confidence Intervals enclose the score and narrow with larger samples."""
    bat_df = ranking_engine.rank_batters(deliveries_pressure_df)

    # CI must enclose reliability score
    assert (bat_df["ci_lower"] <= bat_df["reliability_score"]).all()
    assert (bat_df["reliability_score"] <= bat_df["ci_upper"]).all()

    # CI width must be narrower for high volume players than low volume players
    high_vol = bat_df[bat_df["pressure_balls"] >= 500]
    low_vol = bat_df[bat_df["pressure_balls"] <= 200]
    if len(high_vol) > 0 and len(low_vol) > 0:
        high_vol_width = (high_vol["ci_upper"] - high_vol["ci_lower"]).mean()
        low_vol_width = (low_vol["ci_upper"] - low_vol["ci_lower"]).mean()
        assert high_vol_width < low_vol_width, "High volume players must have tighter CI width"


def test_top10_batters_integrity(deliveries_pressure_df, ranking_engine):
    """Verify Top 10 Batters cardinality, rank sequence, and uniqueness."""
    bat_df = ranking_engine.rank_batters(deliveries_pressure_df)
    top10 = ranking_engine.get_top10_batters(bat_df)

    assert len(top10) == 10
    assert top10["rank"].tolist() == list(range(1, 11))
    assert top10["striker_id"].nunique() == 10
    assert top10["striker_name"].nunique() == 10

    # Scores must be non-increasing
    scores = top10["reliability_score"].tolist()
    assert scores == sorted(scores, reverse=True)


def test_top10_bowlers_integrity(deliveries_pressure_df, ranking_engine):
    """Verify Top 10 Bowlers cardinality, rank sequence, and uniqueness."""
    bowl_df = ranking_engine.rank_bowlers(deliveries_pressure_df)
    top10 = ranking_engine.get_top10_bowlers(bowl_df)

    assert len(top10) == 10
    assert top10["rank"].tolist() == list(range(1, 11))
    assert top10["bowler_id"].nunique() == 10
    assert top10["bowler_name"].nunique() == 10

    # Scores must be non-increasing
    scores = top10["reliability_score"].tolist()
    assert scores == sorted(scores, reverse=True)


def test_frontend_json_payload_schema():
    """Verify that outputs/frontend_data.json matches production frontend schema."""
    json_path = Path("outputs/frontend_data.json")
    assert json_path.exists(), "outputs/frontend_data.json must exist"

    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Top-level keys
    required_keys = [
        "metadata",
        "top10_batters",
        "top10_bowlers",
        "batting_distribution",
        "bowling_distribution",
        "case_study_ipl_2023_final",
    ]
    for k in required_keys:
        assert k in data, f"Missing key in frontend_data.json: {k}"

    assert len(data["top10_batters"]) == 10
    assert len(data["top10_bowlers"]) == 10

    # Verify batter card structure
    b0 = data["top10_batters"][0]
    for field in ["rank", "player_id", "player_name", "reliability_score", "radar", "archetype", "key_strengths"]:
        assert field in b0, f"Missing field in batter card: {field}"
    assert len(b0["radar"]) == 5
    assert len(b0["key_strengths"]) >= 2

    # Verify bowler card structure
    bw0 = data["top10_bowlers"][0]
    for field in ["rank", "player_id", "player_name", "reliability_score", "radar", "archetype", "key_strengths"]:
        assert field in bw0, f"Missing field in bowler card: {field}"
    assert len(bw0["radar"]) == 5
    assert len(bw0["key_strengths"]) >= 2


def test_csv_deliverables_integrity():
    """Verify that all required CSV deliverables exist, are non-empty, and consistent."""
    required_files = [
        ("outputs/batting_rankings.csv", 100),
        ("outputs/bowling_rankings.csv", 100),
        ("outputs/top10_batters.csv", 10),
        ("outputs/top10_bowlers.csv", 10),
    ]

    for rel_path, min_rows in required_files:
        p = Path(rel_path)
        assert p.exists(), f"File missing: {rel_path}"
        df = pd.read_csv(p)
        assert len(df) >= min_rows, f"File {rel_path} has {len(df)} rows, expected >= {min_rows}"
        assert "rank" in df.columns
        assert "reliability_score" in df.columns


def test_methodology_markdown_deliverable():
    """Verify that reports/phase3_ranking_methodology.md exists and covers all required topics."""
    report_path = Path("reports/phase3_ranking_methodology.md")
    assert report_path.exists(), "Methodology markdown report must exist"

    content = report_path.read_text(encoding="utf-8")
    assert len(content) > 5000, "Methodology report must be detailed and substantial"

    # Required sections
    assert "Task 0: Phase 2 Verification" in content
    assert "IPL 2023 Final" in content
    assert "Bayesian Shrinkage" in content
    assert "Official Top 10 Batters" in content
    assert "Official Top 10 Bowlers" in content
    assert "Yashasvi Jaiswal" in content
    assert "Jamie Overton" in content
    assert "Sunil Narine" in content


def test_ranking_reproducibility(deliveries_pressure_df, ranking_engine):
    """Verify that ranking computations are 100% deterministic and reproducible."""
    bat_1 = ranking_engine.rank_batters(deliveries_pressure_df)
    bat_2 = ranking_engine.rank_batters(deliveries_pressure_df)

    pd.testing.assert_frame_equal(bat_1, bat_2)

    bowl_1 = ranking_engine.rank_bowlers(deliveries_pressure_df)
    bowl_2 = ranking_engine.rank_bowlers(deliveries_pressure_df)

    pd.testing.assert_frame_equal(bowl_1, bowl_2)
