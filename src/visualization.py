"""Visualizations and chart generator for Phase 2 Pressure Engine.

Generates:
1. Interactive Plotly charts (HTML) in outputs/
2. Optimized JSON chart datasets in outputs/charts_data.json for Vercel React frontend
"""

import json
from pathlib import Path
import numpy as np
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go


def generate_pressure_charts(
    parquet_path: str = "data/processed/deliveries_pressure.parquet",
    outputs_dir: str = "outputs",
) -> Dict[str, Path]:
    """Generate interactive charts and frontend-optimized JSON payloads."""
    out_dir = Path(outputs_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    print("Loading deliveries_pressure.parquet for visualization...")
    df = pd.read_parquet(parquet_path)
    valid_df = df[df["is_valid_innings"]].copy()

    generated_files = {}

    # 1. Overall & Innings-Wise Pressure Distribution Histogram
    print("Generating pressure distribution chart...")
    fig_dist = go.Figure()
    fig_dist.add_trace(go.Histogram(
        x=valid_df[valid_df["innings"] == 1]["pressure_score"],
        name="1st Innings (Setting Target)",
        opacity=0.6,
        nbinsx=50,
        marker_color="#3b82f6",
    ))
    fig_dist.add_trace(go.Histogram(
        x=valid_df[valid_df["innings"] == 2]["pressure_score"],
        name="2nd Innings (Chasing Target)",
        opacity=0.6,
        nbinsx=50,
        marker_color="#ef4444",
    ))

    # Add threshold vertical lines
    fig_dist.add_vline(x=35, line_dash="dash", line_color="#10b981", annotation_text="Ordinary/Medium (35)")
    fig_dist.add_vline(x=65, line_dash="dash", line_color="#f59e0b", annotation_text="Medium/High (65)")
    fig_dist.add_vline(x=85, line_dash="dash", line_color="#dc2626", annotation_text="High/Extreme (85)")

    fig_dist.update_layout(
        title="<b>Empirical Pressure Score Distribution & Calibrated Tiers</b>",
        xaxis_title="Normalized Pressure Score (0–100)",
        yaxis_title="Delivery Count",
        barmode="overlay",
        template="plotly_white",
        legend=dict(x=0.02, y=0.98),
        font=dict(family="sans-serif", size=12),
    )
    dist_html = out_dir / "pressure_distribution.html"
    fig_dist.write_html(str(dist_html))
    generated_files["distribution_chart"] = dist_html

    # 2. Case Study: IPL 2023 Final (CSK vs GT, Match 21586)
    print("Generating IPL 2023 Final case study chart...")
    csk_match = df[(df["match_id"] == 21586) & (df["innings"] == 2)].sort_values("innings_ball_num").copy()
    csk_match["ball_label"] = [f"{o}.{b}" for o, b in zip(csk_match["overid"], csk_match["over_ball_num"])]

    fig_csk = go.Figure()
    fig_csk.add_trace(go.Scatter(
        x=csk_match["innings_ball_num"],
        y=csk_match["pressure_score"],
        mode="lines+markers",
        name="Pressure Score",
        line=dict(color="#ec4899", width=3),
        text=[f"Ball: {lbl}<br>Striker: {s}<br>Runs Req: {r}<br>Balls Left: {b}<br>Pressure: {p}"
              for lbl, s, r, b, p in zip(
                  csk_match["ball_label"], csk_match["striker_name"],
                  csk_match["runs_required"], csk_match["balls_remaining"], csk_match["pressure_score"]
              )],
        hoverinfo="text",
    ))
    fig_csk.add_trace(go.Scatter(
        x=csk_match["innings_ball_num"],
        y=csk_match["win_probability"] * 100.0,
        mode="lines",
        name="CSK Win Probability (%)",
        line=dict(color="#3b82f6", width=2, dash="dot"),
    ))

    fig_csk.update_layout(
        title="<b>Case Study: IPL 2023 Final (CSK vs GT) — High-Leverage Pressure Arc</b>",
        xaxis_title="Innings Delivery Number",
        yaxis_title="Score / Probability (%)",
        template="plotly_white",
        legend=dict(x=0.02, y=0.98),
        font=dict(family="sans-serif", size=12),
    )
    csk_html = out_dir / "case_study_ipl_2023_final.html"
    fig_csk.write_html(str(csk_html))
    generated_files["csk_final_chart"] = csk_html

    # 3. Export Optimized JSON for Frontend (JAMstack / React on Vercel)
    print("Exporting optimized JSON charts payload for Vercel React frontend...")
    # Generate binned histogram data
    hist_counts_inn1, bin_edges = np.histogram(valid_df[valid_df["innings"] == 1]["pressure_score"], bins=20, range=(0, 100))
    hist_counts_inn2, _ = np.histogram(valid_df[valid_df["innings"] == 2]["pressure_score"], bins=20, range=(0, 100))

    hist_data = []
    for i in range(len(bin_edges) - 1):
        hist_data.append({
            "bin": f"{int(bin_edges[i])}-{int(bin_edges[i+1])}",
            "range": [float(bin_edges[i]), float(bin_edges[i+1])],
            "innings_1_count": int(hist_counts_inn1[i]),
            "innings_2_count": int(hist_counts_inn2[i]),
            "total_count": int(hist_counts_inn1[i] + hist_counts_inn2[i]),
        })

    # CSK match sample deliveries
    csk_deliveries = csk_match.tail(12)[[
        "overid", "over_ball_num", "striker_name", "bowler_name", "delivery_team_runs",
        "current_innings_runs", "current_innings_wickets", "balls_remaining", "runs_required",
        "win_probability", "pressure_score", "pressure_tier"
    ]].to_dict(orient="records")

    frontend_payload = {
        "metadata": {
            "title": "SupeRR Selector Season 2 — Pressure Intelligence",
            "total_deliveries": len(df),
            "valid_deliveries": len(valid_df),
        },
        "histogram": hist_data,
        "tiers": {
            "Ordinary": {"range": [0, 35], "count": int((valid_df["pressure_tier"] == "Ordinary").sum()), "percentage": 34.97},
            "Medium": {"range": [35, 65], "count": int((valid_df["pressure_tier"] == "Medium").sum()), "percentage": 30.06},
            "High": {"range": [65, 85], "count": int((valid_df["pressure_tier"] == "High").sum()), "percentage": 20.02},
            "Extreme": {"range": [85, 100], "count": int((valid_df["pressure_tier"] == "Extreme").sum()), "percentage": 14.95},
        },
        "case_studies": {
            "ipl_2023_final": {
                "match_id": 21586,
                "title": "IPL 2023 Final: CSK vs GT",
                "deliveries": csk_deliveries,
            }
        }
    }

    charts_json_path = out_dir / "charts_data.json"
    with open(charts_json_path, "w", encoding="utf-8") as f:
        json.dump(frontend_payload, f, indent=2)

    generated_files["frontend_charts_json"] = charts_json_path
    print(f"  Successfully exported: {charts_json_path}")

    return generated_files


if __name__ == "__main__":
    generate_pressure_charts()
