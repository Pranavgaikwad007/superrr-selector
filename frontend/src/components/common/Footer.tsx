import React from 'react';
import { Flame, ShieldCheck, Github, ExternalLink, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-[#060910] text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand column */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <Flame className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="font-bold text-white text-base">
              SupeRR Selector &middot; <span className="text-emerald-400">Pressure Intelligence</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-md leading-relaxed">
            Data-driven intelligence engine developed for Rajasthan Royals SupeRR Selector Season 2.
            Evaluates historical ball-by-ball IPL and T20 International data from 2022 onwards to identify
            and rank the most reliable players when match pressure is highest.
          </p>
          <div className="flex items-center gap-3 text-xs text-slate-500 pt-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Zero Data Leakage Certified
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              Bayesian Shrinkage Calibrated
            </span>
          </div>
        </div>

        {/* Deliverables column */}
        <div>
          <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
            Data Deliverables
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <a
                href="/data/top10_batters.csv"
                download
                className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
              >
                Top 10 Batters (CSV)
              </a>
            </li>
            <li>
              <a
                href="/data/top10_bowlers.csv"
                download
                className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
              >
                Top 10 Bowlers (CSV)
              </a>
            </li>
            <li>
              <a
                href="/data/batting_rankings.csv"
                download
                className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
              >
                Full Batting Cohort (135)
              </a>
            </li>
            <li>
              <a
                href="/data/bowling_rankings.csv"
                download
                className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
              >
                Full Bowling Cohort (156)
              </a>
            </li>
            <li>
              <a
                href="/data/frontend_data.json"
                download
                className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
              >
                Production JSON Payload
              </a>
            </li>
          </ul>
        </div>

        {/* Methodology column */}
        <div>
          <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
            Analytical Pillars
          </h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li>Win Probability & Resource Projections</li>
            <li>Context-Aware Expected Runs ($xRuns$)</li>
            <li>Empirical Quantile Pressure Tiers</li>
            <li>Empirical Bayesian Shrinkage ($n_0=100$)</li>
            <li>95% Statistical Confidence Intervals</li>
            <li>Chronological Split Validation</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>
          &copy; {new Date().getFullYear()} SupeRR Selector &middot; Developed for Rajasthan Royals Cricket Analytics
        </p>
        <p className="flex items-center gap-2">
          <span>Static Vercel Deployment</span>
          <span>&bull;</span>
          <span>Zero Server Overhead</span>
        </p>
      </div>
    </footer>
  );
};
