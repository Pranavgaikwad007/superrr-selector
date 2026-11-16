export interface RadarMetricsBatter {
  power_hitting: number;
  run_rate_acceleration: number;
  dot_mitigation: number;
  situational_value: number;
  consistency: number;
}

export interface RadarMetricsBowler {
  run_containment: number;
  pressure_elevation: number;
  dot_generation: number;
  runs_prevented: number;
  wicket_threat: number;
}

export interface BatterRecord {
  rank: number;
  player_id: number;
  player_name: string;
  teams: string;
  reliability_score: number;
  ci_lower: number;
  ci_upper: number;
  pressure_balls: number;
  pressure_matches: number;
  pressure_runs: number;
  sr_pressure: number;
  sr_overall: number;
  delta_sr: number;
  runs_added_per_100: number;
  boundary_pct: number;
  dot_pct: number;
  avg_pressure: number;
  consistency_pct: number;
  archetype: string;
  key_strengths: string[];
  radar: RadarMetricsBatter;
}

export interface BowlerRecord {
  rank: number;
  player_id: number;
  player_name: string;
  teams: string;
  reliability_score: number;
  ci_lower: number;
  ci_upper: number;
  pressure_overs: number;
  pressure_balls: number;
  pressure_matches: number;
  pressure_wickets: number;
  econ_pressure: number;
  econ_overall: number;
  delta_econ: number;
  runs_prevented_per_6: number;
  dot_pct: number;
  boundary_pct: number;
  wicket_sr: number;
  consistency_pct: number;
  archetype: string;
  key_strengths: string[];
  radar: RadarMetricsBowler;
}

export interface AllBatterRecord {
  rank: number;
  striker_id: number;
  striker_name: string;
  teams: string;
  reliability_score: number;
  ci_lower: number;
  ci_upper: number;
  pressure_balls: number;
  pressure_matches: number;
  pressure_runs: number;
  sr_pressure: number;
  sr_overall: number;
  delta_sr: number;
  runs_added_per_100: number;
  boundary_pct: number;
  dot_pct: number;
  avg_pressure: number;
  positive_impact_match_pct: number;
}

export interface AllBowlerRecord {
  rank: number;
  bowler_id: number;
  bowler_name: string;
  teams: string;
  reliability_score: number;
  ci_lower: number;
  ci_upper: number;
  pressure_balls: number;
  pressure_overs: number;
  pressure_matches: number;
  pressure_wickets: number;
  econ_pressure: number;
  econ_overall: number;
  delta_econ: number;
  runs_prevented_per_6: number;
  dot_pct: number;
  boundary_pct: number;
  wicket_sr: number;
  positive_impact_match_pct: number;
}

export interface DistributionStats {
  mean_score: number;
  median_score: number;
  min_score: number;
  max_score: number;
  percentiles: {
    p25: number;
    p50: number;
    p75: number;
    p90: number;
  };
}

export interface CaseStudyBall {
  ball: number;
  over: number;
  over_ball: number;
  striker: string;
  bowler: string;
  runs: number;
  is_boundary: boolean;
  runs_required: number;
  balls_remaining: number;
  win_probability: number;
  pressure_score: number;
  pressure_tier: 'Ordinary' | 'Medium' | 'High' | 'Extreme';
}

export interface PressureTierDetail {
  range: [number, number];
  count: number;
  percentage: number;
}

export interface PressureHistogramBin {
  bin: string;
  range: [number, number];
  innings_1_count: number;
  innings_2_count: number;
  total_count: number;
}

export interface FrontendData {
  metadata: {
    project_name: string;
    generated_at: string;
    dataset_scope: string;
    total_deliveries: number;
    eligible_deliveries: number;
    high_pressure_deliveries: number;
    high_pressure_percentage: number;
    scheduled_matches?: number;
    matches_with_deliveries?: number;
    eligible_matches?: number;
    ipl_matches?: number;
    t20i_matches?: number;
    excluded_matches?: number;
    thresholds: {
      pressure_threshold: number;
      min_pressure_balls: number;
      min_pressure_matches: number;
      min_total_balls: number;
      bayesian_prior_balls_n0: number;
    };
    total_eligible_batters: number;
    total_eligible_bowlers: number;
  };
  top10_batters: BatterRecord[];
  top10_bowlers: BowlerRecord[];
  all_batters?: AllBatterRecord[];
  all_bowlers?: AllBowlerRecord[];
  batting_distribution: DistributionStats;
  bowling_distribution: DistributionStats;
  pressure_tiers_detail?: Record<string, PressureTierDetail>;
  pressure_histogram?: PressureHistogramBin[];
  model_performance?: {
    win_probability?: {
      train_samples: number;
      test_samples: number;
      train_roc_auc: number;
      test_roc_auc: number;
      test_log_loss: number;
      test_brier_score: number;
    };
    first_innings_projection?: {
      train_samples: number;
      test_samples: number;
      train_mae: number;
      test_mae: number;
      test_r2: number;
    };
    sensitivity_analysis?: {
      knockout_stakes_sensitivity?: {
        knockout_deliveries_count: number;
        knockout_mean_pressure: number;
        regular_mean_pressure: number;
        delta_mean: number;
      };
      innings_calibration_alignment?: {
        innings_1: { mean: number; median: number };
        innings_2: { mean: number; median: number };
        mean_divergence: number;
      };
    };
  };
  case_study_ipl_2023_final: {
    match_id: number;
    title: string;
    summary: string;
    deliveries: CaseStudyBall[];
  };
}

export type PageId = 'overview' | 'batting' | 'bowling' | 'comparison' | 'explorer' | 'methodology';
