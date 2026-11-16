"""Integration tests for pipeline module."""

from pathlib import Path
import pytest
import pandas as pd

from src.pipeline import run_phase1_pipeline


def test_full_pipeline_execution():
    """Verify end-to-end execution of Phase 1 pipeline."""
    summary = run_phase1_pipeline()

    assert summary["total_deliveries_processed"] == 200999
    assert summary["matches_with_deliveries"] == 867
    assert summary["ipl_deliveries"] == 87687
    assert summary["t20i_deliveries"] == 106327
    assert summary["other_t20_deliveries"] == 6985

    # Check parquet output
    pq_path = Path(summary["parquet_path"])
    assert pq_path.exists()
    assert pq_path.stat().st_size > 1_000_000  # > 1MB

    # Verify parquet is readable
    df = pd.read_parquet(pq_path)
    assert len(df) == 200999
    assert "current_innings_runs" in df.columns
    assert "legal_balls_bowled" in df.columns
    assert "balls_remaining" in df.columns
    assert "match_phase" in df.columns

    # Check audit files
    assert Path(summary["audit_json_path"]).exists()
    assert Path(summary["audit_report_path"]).exists()
