"""Main execution pipeline for SupeRR Selector Season 2.

Orchestrates:
Phase 1:
1. Automatic data archive discovery & extraction
2. Dataset loading and schema normalization
3. Data quality and referential integrity audit
4. Audit reporting (JSON and Markdown)
5. Match state reconstruction strictly BEFORE each delivery
6. Enriched delivery Parquet persistence

Phase 2:
1. Win Probability Modeling (chronological train/test split)
2. First Innings Resource & Deficit Projection
3. Full Context-Aware Pressure Calculation (0-100 scale)
4. Empirical Quantile Calibration & Pressure Tiers
5. Sensitivity Analysis
6. Pressure Validation JSON and Methodology Markdown Export
7. deliveries_pressure.parquet persistence
"""

from pathlib import Path
import time
from typing import Any, Dict, Optional
import pandas as pd

from src.data_loader import extract_raw_dataset, find_dataset_zip, load_all_datasets, load_matches
from src.data_validator import DataValidator
from src.match_state import reconstruct_match_state
from src.pressure_engine import PressureEngine
from src.ranking_engine import RankingEngine


def run_phase1_pipeline(
    workspace_dir: str = ".",
    raw_dir: str = "data/raw",
    processed_dir: str = "data/processed",
    outputs_dir: str = "outputs",
    reports_dir: str = "reports",
) -> Dict[str, Any]:
    """Execute complete Phase 1 data preparation, audit, and enrichment pipeline."""
    start_time = time.time()
    print("=" * 70)
    print("STARTING SUPERR SELECTOR SEASON 2 — PHASE 1 PIPELINE")
    print("=" * 70)

    # 1. Locate and extract raw files if necessary
    raw_path = Path(raw_dir)
    required_csvs = [
        "competitions.csv",
        "teams.csv",
        "matches.csv",
        "ball_by_ball.csv",
        "competition_team_player_mapping.csv",
        "playing_eleven.csv",
    ]
    missing_csvs = [f for f in required_csvs if not (raw_path / f).exists()]
    if missing_csvs:
        print(f"Missing raw CSV files ({len(missing_csvs)}), searching for zip archive...")
        zip_path = find_dataset_zip(workspace_dir)
        if not zip_path:
            raise FileNotFoundError(f"Could not locate dataset ZIP archive in {workspace_dir}")
        print(f"Located archive: {zip_path.name}. Extracting...")
        extract_raw_dataset(zip_path, target_dir=raw_dir)
        print("Extraction complete.")
    else:
        print("Raw CSV files already present in data/raw/.")

    # 2. Load all raw datasets
    print("\n[Step 1/4] Loading raw datasets...")
    datasets = load_all_datasets(data_dir=raw_dir)
    for name, df in datasets.items():
        print(f"  Loaded {name:<35}: {len(df):>7,} rows, {len(df.columns):>2} cols")

    # 3. Perform data audit and validation
    print("\n[Step 2/4] Executing data audit and integrity validation...")
    validator = DataValidator(datasets)
    audit_json_path = Path(outputs_dir) / "data_audit.json"
    report_md_path = Path(reports_dir) / "phase1_data_audit.md"

    exported_json = validator.export_audit_json(audit_json_path)
    print(f"  Exported audit JSON: {exported_json}")

    exported_md = validator.generate_markdown_report(report_md_path)
    print(f"  Generated audit Markdown: {exported_md}")

    # 4. Reconstruct match state BEFORE each delivery
    print("\n[Step 3/4] Reconstructing pre-delivery match state...")
    enriched_df = reconstruct_match_state(
        ball_by_ball_df=datasets["ball_by_ball"],
        matches_df=datasets["matches"],
        competitions_df=datasets["competitions"],
        teams_df=datasets["teams"],
    )
    print(f"  Reconstructed {len(enriched_df):,} deliveries across {enriched_df['match_id'].nunique():,} matches.")

    # 5. Save enriched deliveries to Parquet
    print("\n[Step 4/4] Saving enriched deliveries to Parquet...")
    proc_path = Path(processed_dir)
    proc_path.mkdir(parents=True, exist_ok=True)
    parquet_out = proc_path / "deliveries_enriched.parquet"
    enriched_df.to_parquet(parquet_out, index=False, engine="pyarrow")
    parquet_size_mb = parquet_out.stat().st_size / (1024 * 1024)
    print(f"  Saved Parquet: {parquet_out} ({parquet_size_mb:.2f} MB)")

    elapsed = time.time() - start_time
    print("\n" + "=" * 70)
    print(f"PHASE 1 PIPELINE COMPLETED IN {elapsed:.2f}s")
    print("=" * 70)

    summary = {
        "execution_time_seconds": round(elapsed, 2),
        "total_deliveries_processed": len(enriched_df),
        "matches_with_deliveries": int(enriched_df["match_id"].nunique()),
        "eligible_competitions_deliveries": int(
            (enriched_df["is_eligible_competition"]).sum()
        ),
        "ipl_deliveries": int((enriched_df["competition_category"] == "IPL").sum()),
        "t20i_deliveries": int((enriched_df["competition_category"] == "T20I").sum()),
        "other_t20_deliveries": int((enriched_df["competition_category"] == "Other_T20").sum()),
        "parquet_path": str(parquet_out),
        "parquet_size_mb": round(parquet_size_mb, 2),
        "audit_json_path": str(exported_json),
        "audit_report_path": str(exported_md),
    }

    return summary


def run_phase2_pipeline(
    raw_dir: str = "data/raw",
    processed_dir: str = "data/processed",
    outputs_dir: str = "outputs",
    reports_dir: str = "reports",
) -> Dict[str, Any]:
    """Execute complete Phase 2 Cricket Pressure Detection Engine pipeline."""
    start_time = time.time()
    print("=" * 70)
    print("STARTING SUPERR SELECTOR SEASON 2 — PHASE 2 PRESSURE ENGINE")
    print("=" * 70)

    proc_path = Path(processed_dir)
    enriched_parquet = proc_path / "deliveries_enriched.parquet"

    # Ensure enriched parquet exists
    if not enriched_parquet.exists():
        print("deliveries_enriched.parquet not found. Executing Phase 1 first...")
        run_phase1_pipeline(raw_dir=raw_dir, processed_dir=processed_dir, outputs_dir=outputs_dir, reports_dir=reports_dir)

    print("\n[Step 1/4] Loading enriched deliveries and match metadata...")
    df_enriched = pd.read_parquet(enriched_parquet)
    matches_df = load_matches(raw_dir)
    print(f"  Loaded {len(df_enriched):,} deliveries from {enriched_parquet.name}")

    # 1. Fit Pressure Engine
    print("\n[Step 2/4] Initializing and training Pressure Detection Engine...")
    engine = PressureEngine()
    engine.fit(df_enriched, matches_df=matches_df)

    wp_metrics = engine.wp_model.metrics_
    proj_metrics = engine.proj_model.metrics_
    print(f"  Win Probability Test ROC-AUC: {wp_metrics.get('test_roc_auc', 0.0):.4f} (Brier: {wp_metrics.get('test_brier_score', 0.0):.4f})")
    print(f"  1st Innings Resource Test MAE: {proj_metrics.get('test_mae', 0.0):.2f} runs (R2: {proj_metrics.get('test_r2', 0.0):.4f})")

    # 2. Calculate Pressure for all deliveries
    print("\n[Step 3/4] Computing calibrated pressure scores and tiers...")
    df_pressure = engine.calculate_pressure(df_enriched, matches_df=matches_df)

    # 3. Export validation artifacts and Parquet
    print("\n[Step 4/4] Exporting validation metrics, methodology report, and Parquet...")
    pressure_parquet = proc_path / "deliveries_pressure.parquet"
    df_pressure.to_parquet(pressure_parquet, index=False, engine="pyarrow")
    parquet_size_mb = pressure_parquet.stat().st_size / (1024 * 1024)
    print(f"  Saved Parquet: {pressure_parquet} ({parquet_size_mb:.2f} MB)")

    json_out = Path(outputs_dir) / "pressure_validation.json"
    engine.export_validation_json(df_pressure, output_path=json_out)
    print(f"  Exported validation JSON: {json_out}")

    report_out = Path(reports_dir) / "phase2_pressure_methodology.md"
    engine.generate_methodology_report(df_pressure, output_path=report_out)
    print(f"  Generated methodology report: {report_out}")

    elapsed = time.time() - start_time
    print("\n" + "=" * 70)
    print(f"PHASE 2 PIPELINE COMPLETED IN {elapsed:.2f}s")
    print("=" * 70)

    # Summary
    tier_counts = df_pressure[df_pressure["is_valid_innings"]]["pressure_tier"].value_counts().to_dict()
    summary = {
        "execution_time_seconds": round(elapsed, 2),
        "total_deliveries_scored": len(df_pressure),
        "pressure_parquet_path": str(pressure_parquet),
        "pressure_parquet_size_mb": round(parquet_size_mb, 2),
        "validation_json_path": str(json_out),
        "methodology_report_path": str(report_out),
        "wp_model_test_auc": round(wp_metrics.get("test_roc_auc", 0.0), 4),
        "wp_model_test_brier": round(wp_metrics.get("test_brier_score", 0.0), 4),
        "proj_model_test_mae": round(proj_metrics.get("test_mae", 0.0), 2),
        "tier_distribution": tier_counts,
    }

    return summary


def run_phase3_pipeline(
    processed_dir: str = "data/processed",
    outputs_dir: str = "outputs",
    reports_dir: str = "reports",
) -> Dict[str, Any]:
    """Execute complete Phase 3 Player Performance & Reliability Ranking Engine pipeline."""
    start_time = time.time()
    print("=" * 70)
    print("STARTING SUPERR SELECTOR SEASON 2 — PHASE 3 RANKING ENGINE")
    print("=" * 70)

    proc_path = Path(processed_dir)
    pressure_parquet = proc_path / "deliveries_pressure.parquet"

    if not pressure_parquet.exists():
        print("deliveries_pressure.parquet not found. Executing Phase 2 first...")
        run_phase2_pipeline(processed_dir=processed_dir, outputs_dir=outputs_dir, reports_dir=reports_dir)

    print("\n[Step 1/3] Loading enriched pressure deliveries dataset...")
    df_pressure = pd.read_parquet(pressure_parquet)
    print(f"  Loaded {len(df_pressure):,} deliveries from {pressure_parquet.name}")

    print("\n[Step 2/3] Evaluating player reliability and generating Top 10 rankings...")
    ranking_engine = RankingEngine()
    artifacts = ranking_engine.export_all_rankings(
        df_deliveries=df_pressure,
        output_dir=outputs_dir,
        reports_dir=reports_dir,
    )

    for name, path in artifacts.items():
        print(f"  Exported deliverable {name:<25}: {path}")

    elapsed = time.time() - start_time
    print("\n" + "=" * 70)
    print(f"PHASE 3 PIPELINE COMPLETED IN {elapsed:.2f}s")
    print("=" * 70)

    # Load top 10 files for quick summary print
    top10_bat_df = pd.read_csv(artifacts["top10_batters_csv"])
    top10_bowl_df = pd.read_csv(artifacts["top10_bowlers_csv"])

    print("\n--- OFFICIAL TOP 10 BATTERS UNDER PRESSURE ---")
    for _, r in top10_bat_df.iterrows():
        print(f"  Rank {int(r['rank']):>2}: {r['striker_name']:<22} | Score: {r['reliability_score']:>5.1f} [{r['ci_lower']:>4.1f}, {r['ci_upper']:>4.1f}] | SR: {r['sr_pressure']:>5.1f} ({r['delta_sr']:>+5.1f}) | Balls: {int(r['pressure_balls']):>4}")

    print("\n--- OFFICIAL TOP 10 BOWLERS UNDER PRESSURE ---")
    for _, r in top10_bowl_df.iterrows():
        print(f"  Rank {int(r['rank']):>2}: {r['bowler_name']:<22} | Score: {r['reliability_score']:>5.1f} [{r['ci_lower']:>4.1f}, {r['ci_upper']:>4.1f}] | Econ: {r['econ_pressure']:>5.2f} ({r['delta_econ']:>+5.2f}) | Wkts: {int(r['pressure_wickets']):>2}")

    summary = {
        "execution_time_seconds": round(elapsed, 2),
        "total_deliveries_analyzed": len(df_pressure),
        "artifacts": {k: str(v) for k, v in artifacts.items()},
        "top_batter": top10_bat_df.iloc[0]["striker_name"],
        "top_bowler": top10_bowl_df.iloc[0]["bowler_name"],
    }

    return summary


def run_full_pipeline() -> Dict[str, Any]:
    """Execute end-to-end SupeRR Selector pipeline (Phases 1, 2, and 3)."""
    p1 = run_phase1_pipeline()
    p2 = run_phase2_pipeline()
    p3 = run_phase3_pipeline()
    return {"phase1": p1, "phase2": p2, "phase3": p3}


if __name__ == "__main__":
    run_phase3_pipeline()
