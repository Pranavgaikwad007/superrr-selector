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
  Crown,
  TrendingUp,
} from 'lucide-react';

export const MethodologyPage: React.FC = () => {
  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E5008A] dark:text-[#FF4FAF] mb-1">
          <BookOpen className="w-4 h-4 text-[#E5008A] dark:text-[#FF4FAF]" />
          <span>Technical Whitepaper &amp; Modeling Architecture</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#23142E] dark:text-white tracking-tight">
          SupeRR Selector Methodology &amp; Analytical Formulation
        </h2>
        <p className="text-xs sm:text-sm text-[#71677B] dark:text-[#C5B4CE] mt-1 font-medium">
          Comprehensive documentation of mathematical models, baseline comparisons, Bayesian shrinkage, and zero-leakage guarantees
        </p>
      </div>

      {/* Model Estimates vs Observed Statistics Callout */}
      <div className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex items-start gap-4">
        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
        <div className="space-y-1.5 text-xs">
          <strong className="text-amber-900 dark:text-amber-300 font-bold block text-sm">
            Methodological Transparency: Model Estimates vs. Observed Statistics
          </strong>
          <p className="text-amber-950 dark:text-[#E2D9E7] leading-relaxed font-medium">
            In compliance with sports analytics integrity guidelines, this dashboard strictly separates:
          </p>
          <ul className="list-disc list-inside space-y-1 text-amber-900 dark:text-[#C5B4CE] pt-1 font-medium">
            <li>
              <strong className="text-black dark:text-white">Observed Historical Statistics</strong>: Direct delivery records such as runs scored, boundaries hit, balls faced, wickets taken, economy rates, and dot-ball counts.
            </li>
            <li>
              <strong className="text-black dark:text-white">Model Estimates</strong>: Pre-delivery win probabilities (P_win), context expected runs (xRuns), empirical pressure scores [0-100], Bayesian reliability ratings, and 95% Confidence Intervals.
            </li>
          </ul>
        </div>
      </div>

      {/* Section 1: Dataset Sources & Schema Integrity */}
      <section className="royals-card p-6 sm:p-8 rounded-3xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FFF1F8] dark:bg-[#E5008A]/20 border border-[#F1DCE9] dark:border-[#FF4FAF]/30 flex items-center justify-center text-[#E5008A] dark:text-[#FF4FAF]">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-[#23142E] dark:text-white tracking-tight">
              1. Dataset Sources &amp; Referential Integrity
            </h3>
            <p className="text-xs text-[#71677B] dark:text-[#C5B4CE] font-medium">
              Audited across 883 scheduled fixtures (837 eligible matches with ball-by-ball delivery records) and 194,014 eligible contest deliveries
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[#71677B] dark:text-[#C5B4CE] leading-relaxed font-medium">
          The pipeline digests historical ball-by-ball IPL and T20 International (T20I) matches from 2022 onwards:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
          <div className="p-4 rounded-2xl bg-[#FFF1F8] dark:bg-[#2C0F3C] border border-[#F1DCE9] dark:border-[#673A70]">
            <span className="text-[#71677B] dark:text-[#C5B4CE] block font-bold">IPL Matches (2022-2026)</span>
            <span className="text-base font-black text-[#23142E] dark:text-white font-mono-num">367 matches</span>
            <span className="text-[11px] text-[#71677B] dark:text-[#C5B4CE] block font-medium mt-0.5">87,687 deliveries</span>
          </div>
          <div className="p-4 rounded-2xl bg-[#FFF1F8] dark:bg-[#2C0F3C] border border-[#F1DCE9] dark:border-[#673A70]">
            <span className="text-[#71677B] dark:text-[#C5B4CE] block font-bold">T20I Matches (2022-2026)</span>
            <span className="text-base font-black text-[#23142E] dark:text-white font-mono-num">470 matches</span>
            <span className="text-[11px] text-[#71677B] dark:text-[#C5B4CE] block font-medium mt-0.5">106,327 deliveries</span>
          </div>
          <div className="p-4 rounded-2xl bg-[#FFF1F8] dark:bg-[#2C0F3C] border border-[#F1DCE9] dark:border-[#673A70]">
            <span className="text-[#71677B] dark:text-[#C5B4CE] block font-bold">Reconciled Active Players</span>
            <span className="text-base font-black text-[#E5008A] dark:text-[#FF4FAF] font-mono-num">959 players</span>
            <span className="text-[11px] text-[#71677B] dark:text-[#C5B4CE] block font-medium mt-0.5">Strict player_id disambiguation</span>
          </div>
        </div>

        <p className="text-xs text-[#71677B] dark:text-[#C5B4CE] leading-relaxed font-medium">
          <strong className="text-[#23142E] dark:text-white">Entity Collision Handling</strong>: 7 player names share multiple identities in the registry (e.g., Abdul Samad in SRH/LSG vs. Pakistan A; Haider Ali in Pakistan vs. UAE). All calculations aggregate strictly by <code className="text-[#E5008A] dark:text-[#FF4FAF] bg-[#FFF1F8] dark:bg-[#2C0F3C] px-1.5 py-0.5 rounded font-bold">player_id</code>, guaranteeing zero entity cross-contamination.
        </p>
      </section>

      {/* Section 2: Match-State Reconstruction & Zero Leakage */}
      <section className="royals-card p-6 sm:p-8 rounded-3xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#650D73]/10 dark:bg-[#650D73]/30 border border-[#650D73]/20 dark:border-[#673A70] flex items-center justify-center text-[#650D73] dark:text-purple-300">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-[#23142E] dark:text-white tracking-tight">
              2. Pre-Delivery Match State &amp; Zero Data Leakage
            </h3>
            <p className="text-xs text-[#71677B] dark:text-[#C5B4CE] font-medium">Deterministic state reconstruction strictly before ball release</p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[#71677B] dark:text-[#C5B4CE] leading-relaxed font-medium">
          A fundamental requirement for realistic pressure modeling is that the model must not peek into the future.
          Every feature is reconstructed strictly <em>prior</em> to delivery release:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-[#FFF1F8] dark:bg-[#2C0F3C] border border-[#F1DCE9] dark:border-[#673A70] space-y-1.5">
            <span className="font-bold text-[#E5008A] dark:text-[#FF4FAF] text-sm block">Pre-Ball State Tracking:</span>
            <ul className="list-disc list-inside space-y-1 text-[#23142E] dark:text-[#E2D9E7] font-medium">
              <li>Current runs scored so far in innings (R_prior)</li>
              <li>Wickets fallen before current delivery (W_prior)</li>
              <li>Remaining allocated legal balls (B_rem)</li>
              <li>Required runs (RunsRequired = Target - R_prior)</li>
              <li>Required run rate (RRR = RunsRequired / (B_rem / 6))</li>
            </ul>
          </div>
          <div className="p-4 rounded-2xl bg-[#FFF1F8] dark:bg-[#2C0F3C] border border-[#F1DCE9] dark:border-[#673A70] space-y-1.5">
            <span className="font-bold text-[#650D73] dark:text-purple-300 text-sm block">Outcome Invariance Proof:</span>
            <p className="text-[#23142E] dark:text-[#E2D9E7] leading-relaxed font-medium">
              Automated testing demonstrates that altering the post-ball outcome (e.g. changing a wicket to a six)
              has zero effect on the pre-ball pressure index. Pressure is purely a function of the contest state
              facing the batter and bowler before delivery release.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: Pressure Engine Modeling */}
      <section className="royals-card p-6 sm:p-8 rounded-3xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FFF1F8] dark:bg-[#E5008A]/20 border border-[#F1DCE9] dark:border-[#FF4FAF]/30 flex items-center justify-center text-[#E5008A] dark:text-[#FF4FAF]">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-[#23142E] dark:text-white tracking-tight">
              3. The Pressure Detection Engine
            </h3>
            <p className="text-xs text-[#71677B] dark:text-[#C5B4CE] font-medium">Win probability uncertainty, reachability tension, and empirical quantile calibration</p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[#71677B] dark:text-[#C5B4CE] leading-relaxed font-medium">
          Pressure is formulated as an objective, normalized continuous index on [0, 100]:
        </p>

        <div className="space-y-3 text-xs">
          <div className="p-5 rounded-2xl bg-[#FFF1F8] dark:bg-[#2C0F3C] border border-[#F1DCE9] dark:border-[#673A70] space-y-2">
            <span className="font-black text-[#E5008A] dark:text-[#FF4FAF] text-sm block">Second Innings (Chasing Pressure):</span>
            <p className="text-[#23142E] dark:text-[#E2D9E7] leading-relaxed font-medium">
              Driven by win probability (P_win) estimated via chronological logistic regression
              (Test ROC-AUC: <strong className="text-[#E5008A] dark:text-[#FF4FAF]">0.9051</strong>, Brier Score: <strong className="text-[#E5008A] dark:text-[#FF4FAF]">0.1269</strong>).
              Core uncertainty is symmetric:
            </p>
            <div className="p-3 rounded-xl bg-white dark:bg-[#1E072C] font-mono-num font-black text-center text-[#E5008A] dark:text-[#FF4FAF] border border-[#F1DCE9] dark:border-[#673A70]">
              Uncertainty = 4 &times; P_win &times; (1 - P_win)
            </div>
            <p className="text-[#71677B] dark:text-[#C5B4CE] leading-relaxed font-medium">
              <strong className="text-[#23142E] dark:text-white">Reachability Tension Rule</strong>: When R &le; 6 &times; B in death overs (B &le; 24), reachable chases maintain active reachability tension (Uncertainty_eff &ge; 0.40), preventing premature pressure collapse when win probability drops.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FFF1F8] dark:bg-[#2C0F3C] border border-[#F1DCE9] dark:border-[#673A70] space-y-2">
            <span className="font-black text-[#650D73] dark:text-purple-300 text-sm block">First Innings (Setting Pressure):</span>
            <p className="text-[#23142E] dark:text-[#E2D9E7] leading-relaxed font-medium">
              Evaluates deficit between current score and phase-expected par score modeled via Ridge Regression
              (Test MAE: <strong className="text-[#650D73] dark:text-purple-300">18.15 runs</strong>, $R^2 = 0.6132$).
              Wicket collapses (e.g. 3 down for 25 in the powerplay) rapidly inflate 1st innings pressure.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FFF1F8] dark:bg-[#2C0F3C] border border-[#F1DCE9] dark:border-[#673A70] space-y-2">
            <span className="font-black text-amber-600 dark:text-amber-400 text-sm block">Monotonic Quantile Alignment:</span>
            <p className="text-[#23142E] dark:text-[#E2D9E7] leading-relaxed font-medium">
              Raw scores are calibrated via empirical quantiles (P35, P65, P85) to produce 4 standardized tiers:
              <strong> Ordinary [0, 35)</strong>, <strong>Medium [35, 65)</strong>, <strong>High [65, 85)</strong>, and <strong>Extreme [85, 100]</strong>.
              Innings mean divergence is strictly <strong className="text-[#E5008A] dark:text-[#FF4FAF]">0.02 points</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: Batting & Bowling Metrics & Bayesian Shrinkage */}
      <section className="royals-card p-6 sm:p-8 rounded-3xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#650D73]/10 dark:bg-[#650D73]/30 border border-[#650D73]/20 dark:border-[#673A70] flex items-center justify-center text-[#650D73] dark:text-purple-300">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-[#23142E] dark:text-white tracking-tight">
              4. Reliability Rating &amp; Bayesian Shrinkage
            </h3>
            <p className="text-xs text-[#71677B] dark:text-[#C5B4CE] font-medium">Multi-dimensional scoring, prior shrinkage, and statistical confidence intervals</p>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-[#71677B] dark:text-[#C5B4CE] leading-relaxed font-medium">
          <p>
            Players are evaluated only in <strong className="text-[#23142E] dark:text-white">High Pressure situations</strong> ($\Psi \ge 65.0$) across eligible IPL and T20I fixtures.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-5 rounded-2xl bg-[#FFF1F8] dark:bg-[#2C0F3C] border border-[#F1DCE9] dark:border-[#673A70] space-y-2">
              <span className="font-black text-[#E5008A] dark:text-[#FF4FAF] block text-sm">Batting Composite Score (100%):</span>
              <ul className="space-y-1 text-[#23142E] dark:text-[#E2D9E7] font-medium">
                <li>&bull; <strong className="text-black dark:text-white">Core Execution (30%)</strong>: Pressure SR (15%), Boundary % (10%), Dot % mitigation (5%)</li>
                <li>&bull; <strong className="text-black dark:text-white">Context Value Added (35%)</strong>: Runs Added / 100b vs xRuns (25%), Pressure Avg (10%)</li>
                <li>&bull; <strong className="text-black dark:text-white">Pressure Elevation (20%)</strong>: Delta SR = SR_press - SR_overall (20%)</li>
                <li>&bull; <strong className="text-black dark:text-white">Match Consistency (15%)</strong>: % of matches with positive contribution (15%)</li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFF1F8] dark:bg-[#2C0F3C] border border-[#F1DCE9] dark:border-[#673A70] space-y-2">
              <span className="font-black text-[#650D73] dark:text-purple-300 block text-sm">Bowling Composite Score (100%):</span>
              <ul className="space-y-1 text-[#23142E] dark:text-[#E2D9E7] font-medium">
                <li>&bull; <strong className="text-black dark:text-white">Core Execution (30%)</strong>: Economy suppression (15%), Dot % generation (10%), Boundary suppression (5%)</li>
                <li>&bull; <strong className="text-black dark:text-white">Context Value Added (35%)</strong>: Runs Prevented / 6b vs xRuns (25%), Wicket Rate (10%)</li>
                <li>&bull; <strong className="text-black dark:text-white">Pressure Elevation (20%)</strong>: Delta Econ = Econ_press - Econ_overall (20%)</li>
                <li>&bull; <strong className="text-black dark:text-white">Match Consistency (15%)</strong>: % of matches with positive run prevention (15%)</li>
              </ul>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#FFF1F8] dark:bg-[#2C0F3C] border border-[#F1DCE9] dark:border-[#673A70] space-y-2 text-xs">
            <span className="font-black text-[#E5008A] dark:text-[#FF4FAF] text-sm block">Empirical Bayesian Shrinkage Formula:</span>
            <p className="text-[#23142E] dark:text-[#E2D9E7] leading-relaxed font-medium">
              To eliminate spurious flukes from small sample sizes without unfair penalties to veterans,
              we apply Bayesian shrinkage with a prior strength of $n_0 = 100$ balls:
            </p>
            <div className="p-3 rounded-xl bg-white dark:bg-[#1E072C] font-mono-num font-black text-center text-[#E5008A] dark:text-[#FF4FAF] border border-[#F1DCE9] dark:border-[#673A70]">
              Reliability Score = [n / (n + 100)] &times; RawScore + [100 / (n + 100)] &times; 50.0
            </div>
            <p className="text-[#71677B] dark:text-[#C5B4CE] font-medium">
              A player with 120 balls receives 54.5% weight on their raw score and 45.5% regression to the mean;
              a player with 600 balls (e.g. Suryakumar Yadav or Sunil Narine) retains 85.7% of their score.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FFF1F8] dark:bg-[#2C0F3C] border border-[#F1DCE9] dark:border-[#673A70] space-y-2 text-xs">
            <span className="font-black text-[#23142E] dark:text-white text-sm block">95% Statistical Confidence Intervals:</span>
            <div className="p-3 rounded-xl bg-white dark:bg-[#1E072C] font-mono-num font-bold text-center text-[#23142E] dark:text-white border border-[#F1DCE9] dark:border-[#673A70]">
              SE(n) = 15.0 / &radic;(n / 50) &nbsp;&bull;&nbsp; CI_95% = [Score - 1.96 &times; SE, Score + 1.96 &times; SE]
            </div>
            <p className="text-[#71677B] dark:text-[#C5B4CE] font-medium">
              Clearly reflects estimation uncertainty: more balls bowled/faced leads to tighter confidence bounds.
            </p>
          </div>
        </div>
      </section>

      {/* Section 5: Eligibility & Limitations */}
      <section className="royals-card p-6 sm:p-8 rounded-3xl space-y-4">
        <h3 className="text-lg font-black text-[#23142E] dark:text-white tracking-tight flex items-center gap-2">
          <Info className="w-5 h-5 text-[#E5008A]" />
          5. Minimum Eligibility Thresholds &amp; Model Limitations
        </h3>

        <div className="space-y-3 text-xs text-[#71677B] dark:text-[#C5B4CE] font-medium">
          <p>
            <strong className="text-[#23142E] dark:text-white">Eligibility Criteria</strong>:
          </p>
          <ul className="list-disc list-inside space-y-1 text-[#23142E] dark:text-[#E2D9E7]">
            <li>Minimum 120 high-pressure deliveries faced / legal balls bowled (Pressure &ge; 65.0)</li>
            <li>Minimum 8 distinct matches under high pressure</li>
            <li>Minimum 250 total eligible career balls within dataset scope</li>
          </ul>

          <p className="pt-2">
            <strong className="text-[#23142E] dark:text-white">Known Limitations</strong>:
          </p>
          <ul className="list-disc list-inside space-y-1 text-[#71677B] dark:text-[#C5B4CE]">
            <li>Younger emerging players (120-200 balls) have wider confidence intervals (~15-18 points) than veterans with 600+ balls (~7-8 points).</li>
            <li>Runs added/prevented accounts for pitch and phase context via partition cells, but does not explicitly model boundary dimensions or altitude.</li>
          </ul>
        </div>
      </section>
    </div>
  );
};
