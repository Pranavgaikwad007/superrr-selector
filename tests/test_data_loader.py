"""Unit tests for data loader module."""

from pathlib import Path
import pytest
import pandas as pd

from src.data_loader import (
    categorize_competition,
    find_dataset_zip,
    load_all_datasets,
    load_competitions,
    load_matches,
    load_teams,
)


def test_find_dataset_zip():
    """Verify automatic zip discovery."""
    zip_path = find_dataset_zip(".")
    assert zip_path is not None
    assert zip_path.exists()
    assert zip_path.suffix.lower() == ".zip"


def test_categorize_competition():
    """Verify accurate competition categorization."""
    assert categorize_competition("IPL 2024", "T20") == "IPL"
    assert categorize_competition("Indian Premier League 2023", "T20") == "IPL"
    assert categorize_competition("India in Australia T20I Series 2025", "T20I") == "T20I"
    assert categorize_competition("Mens T20 Emerging Teams Asia Cup 2024", "T20") == "Other_T20"
    assert categorize_competition("Asia Cup Rising Stars 2025", "T20") == "Other_T20"


def test_load_competitions():
    """Verify loading and schema of competitions dataset."""
    df = load_competitions("data/raw")
    assert len(df) == 141
    required_cols = ["comp_id", "comp_name", "match_format", "season", "competition_category", "is_eligible_competition"]
    for col in required_cols:
        assert col in df.columns

    # Verify eligibility counts
    ipl_count = (df["competition_category"] == "IPL").sum()
    t20i_count = (df["competition_category"] == "T20I").sum()
    other_count = (df["competition_category"] == "Other_T20").sum()
    assert ipl_count == 5
    assert t20i_count == 134
    assert other_count == 2
    assert (df["is_eligible_competition"]).sum() == 139


def test_load_teams():
    """Verify teams loading and unique team ids."""
    df = load_teams("data/raw")
    assert len(df) == 353
    assert df["team_id"].nunique() == 38


def test_load_matches():
    """Verify matches loading and expected records."""
    df = load_matches("data/raw")
    assert len(df) == 883
    assert "match_id" in df.columns
    assert "match_date" in df.columns
    assert "result" in df.columns
    assert df["match_id"].nunique() == 883


def test_load_all_datasets():
    """Verify all 6 datasets load cleanly."""
    datasets = load_all_datasets("data/raw")
    assert set(datasets.keys()) == {
        "competitions",
        "teams",
        "matches",
        "ball_by_ball",
        "competition_team_player_mapping",
        "playing_eleven",
    }
    assert len(datasets["ball_by_ball"]) == 200999
