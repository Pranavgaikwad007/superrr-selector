import React from 'react';
import {
  BookOpen,
  ShieldCheck,
  Award,
  Layers,
  Database,
  Calculator,
  Percent,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Info,
} from 'lucide-react';

export const MethodologyPage: React.FC = () => {
  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-400 mb-1">
          <BookOpen className="w-4 h-4" />
          <span>Technical Whitepaper &amp; Modeling Architecture</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          SupeRR Selector Methodology &amp; Analytical Formulation
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Comprehensive documentation of mathematical models, baseline comparisons, Bayesian shrinkage, and zero-leakage guarantees
        </p>
      </div>

      {/* Model Estimates vs Observed Statistics Callout */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-4">
        <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
        <div className="space-y-1 text-xs">
          <strong className="text-amber-300 font-semibold block text-sm">
            Methodological Transparency: Model Estimates vs. Observed Statistics
          </strong>
          <p className="text-slate-300 leading-relaxed">
            In compliance with sports analytics integrity guidelines, this dashboard clearly separates:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-300 pt-1">
            <li>
              <strong className="text-white">Observed Historical Statistics</strong>: Direct delivery records such as runs scored, boundaries hit, balls faced, wickets taken, economy rates, and dot-ball counts.
            </li>
            <li>
              <strong className="text-white">Model Estimates</strong>: Pre-delivery win probabilities (P_win), context expected runs (xRuns), empirical pressure scores [0-100], Bayesian reliability ratings, and 95% Confidence Intervals.
            </li>
          </ul>
        </div>
      </div>

      {/* Section 1: Dataset Sources & Schema Integrity */}
      <section className="glass-panel p-6 sm:p-8 rounded-2xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              1. Dataset Sources &amp; Referential Integrity
            </h3>
            <p className="text-xs text-slate-400">Audited across 883 scheduled fixtures (837 eligible matches with ball-by-ball delivery records) and 194,014 eligible contest deliveries</p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          The pipeline digests historical ball-by-ball IPL and T20 International (T20I) matches from 2022 onwards:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400 block font-medium">IPL Matches (2022-2026)</span>
            <span className="text-base font-bold text-white font-mono-num">367 matches</span>
            <span className="text-[11px] text-slate-500 block">87,687 deliveries</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400 block font-medium">T20I Matches (2022-2026)</span>
            <span className="text-base font-bold text-white font-mono-num">470 matches</span>
            <span className="text-[11px] text-slate-500 block">106,327 deliveries</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400 block font-medium">Reconciled Active Players</span>
            <span className="text-base font-bold text-emerald-400 font-mono-num">959 players</span>
            <span className="text-[11px] text-slate-500 block">Strict player_id disambiguation</span>
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          <strong>Entity Collision Handling</strong>: 7 player names share multiple identities in the registry (e.g., Abdul Samad in SRH/LSG vs. Pakistan A; Haider Ali in Pakistan vs. UAE). All calculations aggregate strictly by <code className="text-emerald-400 bg-slate-900 px-1 rounded">player_id</code>, guaranteeing zero entity cross-contamination.
        </p>
      </section>

      {/* Section 2: Match-State Reconstruction & Zero Leakage */}
      <section className="glass-panel p-6 sm:p-8 rounded-2xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              2. Pre-Delivery Match State &amp; Zero Data Leakage
            </h3>
            <p className="text-xs text-slate-400">Deterministic state reconstruction strictly before ball release</p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          A fundamental requirement for realistic pressure modeling is that the model must not peek into the future.
          Every feature is reconstructed strictly <em>prior</em> to delivery release:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="font-semibold text-emerald-400">Pre-Ball State Tracking:</span>
            <ul className="list-disc list-inside space-y-0.5 text-slate-400">
              <li>Current runs scored so far in innings (R_prior)</li>
              <li>Wickets fallen before current delivery (W_prior)</li>
              <li>Remaining allocated legal balls (B_rem)</li>
              <li>Required runs (RunsRequired = Target - R_prior)</li>
              <li>Required run rate (RRR = RunsRequired / (B_rem / 6))</li>
            </ul>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="font-semibold text-cyan-400">Outcome Invariance Proof:</span>
            <p className="text-slate-400 leading-relaxed">
              Automated testing demonstrates that altering the post-ball outcome (e.g. changing a wicket to a six)
              has zero effect on the pre-ball pressure index. Pressure is purely a function of the contest state
              facing the batter and bowler before delivery.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: Pressure Engine Modeling */}
      <section className="glass-panel p-6 sm:p-8 rounded-2xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              3. The Pressure Detection Engine
            </h3>
            <p className="text-xs text-slate-400">Win probability uncertainty, reachability tension, and empirical quantile calibration</p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Pressure is defined as a normalized continuous index on [0, 100]:
        </p>

        <div className="space-y-3 text-xs">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <span className="font-bold text-amber-400 text-sm block">Second Innings (Chasing Pressure):</span>
            <p className="text-slate-300 leading-relaxed">
              Driven by win probability (P_win) estimated via chronological logistic regression
              (Test ROC-AUC: <strong className="text-emerald-400">0.9051</strong>, Brier Score: <strong className="text-emerald-400">0.1269</strong>).
              Core uncertainty is symmetric:
            </p>
            <div className="p-2.5 rounded bg-slate-950 font-mono text-center text-emerald-400">
              Uncertainty = 4 &times; P_win &times; (1 - P_win)
            </div>
            <p className="text-slate-400 leading-relaxed">
              <strong>Reachability Correction</strong>: When R &le; 6 &times; B in death overs (B &le; 24), reachable chases maintain active reachability tension (Uncertainty_eff &ge; 0.40), preventing premature pressure collapse when P_win drops.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <span className="font-bold text-blue-400 text-sm block">First Innings (Setting Pressure):</span>
            <p className="text-slate-300 leading-relaxed">
              Evaluates deficit between current score and phase-expected par score modeled via Ridge Regression
              (Test MAE: <strong className="text-cyan-400">18.15 runs</strong>, R&sup2; = 0.6132).
              Wicket collapses (e.g. 3 down for 25 in the powerplay) rapidly inflate 1st innings pressure.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <span className="font-bold text-emerald-400 text-sm block">Monotonic Quantile Alignment:</span>
            <p className="text-slate-300 leading-relaxed">
              Raw scores are calibrated via empirical quantiles (P35, P65, P85) to produce 4 standardized tiers:
              <strong> Ordinary [0, 35)</strong>, <strong>Medium [35, 65)</strong>, <strong>High [65, 85)</strong>, and <strong>Extreme [85, 100]</strong>.
              Innings mean divergence is strictly <strong className="text-emerald-400">0.02 points</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: Batting & Bowling Metrics & Bayesian Shrinkage */}
      <section className="glass-panel p-6 sm:p-8 rounded-2xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              4. Reliability Rating &amp; Bayesian Shrinkage
            </h3>
            <p className="text-xs text-slate-400">Multi-dimensional scoring, prior shrinkage, and statistical confidence intervals</p>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            Players are evaluated only in <strong>High Pressure situations</strong> (Pressure &ge; 65.0) across eligible IPL and T20I fixtures.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="font-bold text-emerald-400 block text-sm">Batting Composite Score (100%):</span>
              <ul className="space-y-1 text-slate-300">
                <li>&bull; <strong className="text-white">Core Execution (30%)</strong>: Pressure SR (15%), Boundary % (10%), Dot % mitigation (5%)</li>
                <li>&bull; <strong className="text-white">Context Value Added (35%)</strong>: Runs Added / 100b vs xRuns (25%), Pressure Avg (10%)</li>
                <li>&bull; <strong className="text-white">Pressure Elevation (20%)</strong>: Delta SR = SR_press - SR_overall (20%)</li>
                <li>&bull; <strong className="text-white">Match Consistency (15%)</strong>: % of matches with positive contribution (15%)</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="font-bold text-cyan-400 block text-sm">Bowling Composite Score (100%):</span>
              <ul className="space-y-1 text-slate-300">
                <li>&bull; <strong className="text-white">Core Execution (30%)</strong>: Economy suppression (15%), Dot % generation (10%), Boundary suppression (5%)</li>
                <li>&bull; <strong className="text-white">Context Value Added (35%)</strong>: Runs Prevented / 6b vs xRuns (25%), Wicket Rate (10%)</li>
                <li>&bull; <strong className="text-white">Pressure Elevation (20%)</strong>: Delta Econ = Econ_press - Econ_overall (20%)</li>
                <li>&bull; <strong className="text-white">Match Consistency (15%)</strong>: % of matches with positive run prevention (15%)</li>
              </ul>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
            <span className="font-bold text-amber-400 text-sm block">Empirical Bayesian Shrinkage Formula:</span>
            <p className="text-slate-300 leading-relaxed">
              To eliminate spurious flukes from small sample sizes without unfair penalties to veterans,
              we apply Bayesian shrinkage with a prior strength of n_0 = 100 balls:
            </p>
            <div className="p-2.5 rounded bg-slate-950 font-mono text-center text-amber-400">
              Reliability Score = [n / (n + 100)] &times; RawScore + [100 / (n + 100)] &times; 50.0
            </div>
            <p className="text-slate-400">
              A player with 120 balls receives 54.5% weight on their raw score and 45.5% regression to the mean;
              a player with 600 balls (e.g. Suryakumar Yadav or Sunil Narine) retains 85.7% of their score.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
            <span className="font-bold text-slate-200 text-sm block">95% Statistical Confidence Intervals:</span>
            <div className="p-2.5 rounded bg-slate-950 font-mono text-center text-slate-300">
              SE(n) = 15.0 / &radic;(n / 50) &nbsp;&bull;&nbsp; CI_95% = [Score - 1.96 &times; SE, Score + 1.96 &times; SE]
            </div>
            <p className="text-slate-400">
              Clearly reflects estimation uncertainty: more balls bowled/faced leads to tighter confidence bounds.
            </p>
          </div>
        </div>
      </section>

      {/* Section 5: Eligibility & Limitations */}
      <section className="glass-panel p-6 sm:p-8 rounded-2xl space-y-4">
        <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <Info className="w-5 h-5 text-emerald-400" />
          5. Minimum Eligibility Thresholds &amp; Model Limitations
        </h3>

        <div className="space-y-2 text-xs text-slate-300">
          <p>
            <strong>Eligibility Criteria</strong>:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-400">
            <li>Minimum 120 high-pressure deliveries faced / legal balls bowled (Pressure &ge; 65.0)</li>
            <li>Minimum 8 distinct matches under high pressure</li>
            <li>Minimum 250 total eligible career balls within dataset scope</li>
          </ul>

          <p className="pt-2">
            <strong>Known Limitations</strong>:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-400">
            <li>Younger emerging players (120-200 balls) have wider confidence intervals (~15-18 points) than veterans with 600+ balls (~7-8 points).</li>
            <li>Runs added/prevented accounts for pitch and phase context via partition cells, but does not explicitly model boundary dimensions or altitude.</li>
          </ul>
        </div>
      </section>
    </div>
  );
};
