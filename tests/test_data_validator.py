"""Unit tests for data validator module."""

import json
from pathlib import Path
import pytest
import pandas as pd

from src.data_loader import load_all_datasets
from src.data_validator import DataValidator


@pytest.fixture(scope="module")
def datasets():
    return load_all_datasets("data/raw")


@pytest.fixture(scope="module")
def validator(datasets):
    return DataValidator(datasets)


def test_foreign_keys_integrity(validator):
    """Test foreign key referential integrity across all relational tables."""
    fk = validator.audit_foreign_keys()
    assert fk["matches_comp_id_valid"]["status"] is True
    assert fk["matches_teams_valid"]["status"] is True
    assert fk["bbb_matches_valid"]["status"] is True
    assert fk["bbb_teams_valid"]["status"] is True
    assert fk["bbb_players_in_mapping_valid"]["status"] is True


def test_player_identities_collisions(validator):
    """Verify player identity collision detection identifies known multi-ID names."""
    pi = validator.audit_player_identities()
    assert pi["names_with_multiple_ids_count"] >= 7
    collisions = pi["collisions"]
    assert "Abdul Samad" in collisions
    assert "Rashid Khan" in collisions
    assert "Haider Ali" in collisions

    # Verify Abdul Samad has 2 distinct player IDs (India / SRH vs Pakistan)
    assert len(collisions["Abdul Samad"]["player_ids"]) == 2
    assert 7446 in collisions["Abdul Samad"]["player_ids"]
    assert 6922 in collisions["Abdul Samad"]["player_ids"]


def test_match_completion_classification(validator):
    """Verify proper classification of DLS, Super Overs, and abandoned matches."""
    mc = validator.audit_match_completion()
    assert mc["total_matches_in_matches_table"] == 883
    assert mc["matches_with_deliveries"] == 867
    assert mc["matches_without_deliveries_count"] == 16
    assert mc["incomplete_matches_with_deliveries_count"] == 24
    assert mc["super_over_matches_count"] == 6
    assert mc["revised_target_matches_count"] == 23


def test_export_audit_json_and_markdown(validator, tmp_path):
    """Verify JSON export and Markdown generation execute without errors."""
    json_path = tmp_path / "test_audit.json"
    md_path = tmp_path / "test_report.md"

    exported_json = validator.export_audit_json(json_path)
    assert exported_json.exists()
    with open(exported_json, "r", encoding="utf-8") as f:
        data = json.load(f)
    assert "table_summaries" in data
    assert "competition_breakdown" in data

    exported_md = validator.generate_markdown_report(md_path)
    assert exported_md.exists()
    content = exported_md.read_text(encoding="utf-8")
    assert "# Phase 1 Data Audit & Schema Integrity Report" in content
    assert "Abdul Samad" in content
