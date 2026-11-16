import React from 'react';
import { FrontendData, PageId } from '../types';
import {
  Flame,
  Activity,
  Award,
  Shield,
  BarChart3,
  GitCompare,
  Layers,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Percent,
  Compass,
  CheckCircle2,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Badge } from '../components/common/Badge';

interface OverviewPageProps {
  data: FrontendData;
  onNavigate: (page: PageId) => void;
  onSelectBatter: (id: number) => void;
  onSelectBowler: (id: number) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  data,
  onNavigate,
  onSelectBatter,
  onSelectBowler,
}) => {
  const { metadata, top10_batters, top10_bowlers, pressure_tiers_detail } = data;

  const topBatter = top10_batters[0];
  const topBowler = top10_bowlers[0];

  // Prepare tier chart data
  const tierColors: Record<string, string> = {
    Ordinary: '#64748B',
    Medium: '#3B82F6',
    High: '#F59E0B',
    Extreme: '#EF4444',
  };

  const tierChartData = pressure_tiers_detail
    ? Object.entries(pressure_tiers_detail).map(([tier, details]) => ({
        tier,
        count: details.count,
        percentage: details.percentage,
        color: tierColors[tier] || '#10B981',
      }))
    : [
        { tier: 'Ordinary', percentage: 35.0, count: 69686, color: '#64748B' },
        { tier: 'Medium', percentage: 30.1, count: 59897, color: '#3B82F6' },
        { tier: 'High', percentage: 20.0, count: 39884, color: '#F59E0B' },
        { tier: 'Extreme', percentage: 14.9, count: 29779, color: '#EF4444' },
      ];

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-[#0D1526] to-[#061A19] border border-slate-800/80 p-8 sm:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wide">
            <Flame className="w-3.5 h-3.5" />
            <span>SupeRR Selector Season 2 Official Analytics</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Identify the Most Reliable Players{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Under Pressure
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Some players thrive when the game is on the line; others see their output collapse.
            Using 194,014 eligible deliveries across 837 senior IPL &amp; T20I matches (from 883 scheduled fixtures since 2022), we model real-time win
            probability, quantify clutch context, and rank the top-performing batters and bowlers.
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('batting')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm transition-all shadow-lg shadow-emerald-500/20"
            >
              <Award className="w-4 h-4" />
              <span>Explore Top 10 Batters</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
            <button
              onClick={() => onNavigate('bowling')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-sm border border-slate-700 transition-all"
            >
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>Explore Top 10 Bowlers</span>
            </button>
            <button
              onClick={() => onNavigate('explorer')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 text-sm border border-slate-800 transition-all"
            >
              <Layers className="w-4 h-4 text-rose-400" />
              <span>IPL 2023 Case Study</span>
            </button>
          </div>
        </div>
      </section>

      {/* Dataset Core Metrics Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="glass-panel p-5 rounded-2xl">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-medium block">
            Deliveries Analyzed
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono-num mt-1 block">
            {(metadata.eligible_deliveries || 194014).toLocaleString()}
          </span>
          <span className="text-xs text-slate-500 mt-1 block">
            {metadata.eligible_matches || 837} matches with deliveries ({metadata.scheduled_matches || 883} scheduled)
          </span>
        </div>

        <div className="glass-panel p-5 rounded-2xl">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-medium block">
            High Pressure Balls
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono-num mt-1 block">
            {metadata.high_pressure_deliveries.toLocaleString()}
          </span>
          <span className="text-xs text-slate-500 mt-1 block">
            {metadata.high_pressure_percentage}% of eligible contest balls
          </span>
        </div>

        <div className="glass-panel p-5 rounded-2xl">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-medium block">
            Qualified Batters
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono-num mt-1 block">
            {metadata.total_eligible_batters}
          </span>
          <span className="text-xs text-slate-500 mt-1 block">
            &ge;120 pressure balls & 8+ matches
          </span>
        </div>

        <div className="glass-panel p-5 rounded-2xl">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-medium block">
            Qualified Bowlers
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono-num mt-1 block">
            {metadata.total_eligible_bowlers}
          </span>
          <span className="text-xs text-slate-500 mt-1 block">
            &ge;120 pressure balls & 8+ matches
          </span>
        </div>
      </section>

      {/* Top 1 Callouts (Batting & Bowling) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Batter Card */}
        {topBatter && (
          <div className="glass-panel glass-panel-hover p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Award className="w-32 h-32 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  #1 Pressure Batter
                </span>
                <span className="text-2xl font-black text-emerald-400 font-mono-num">
                  {topBatter.reliability_score.toFixed(1)} / 100
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">{topBatter.player_name}</h3>
              <p className="text-sm text-slate-400 mt-0.5">{topBatter.teams}</p>
              <div className="my-3">
                <Badge label={topBatter.archetype} variant="emerald" />
              </div>

              <div className="grid grid-cols-3 gap-3 my-4 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center font-mono-num">
                <div>
                  <span className="text-[11px] text-slate-400 block">Pressure SR</span>
                  <span className="text-base font-bold text-white">{topBatter.sr_pressure.toFixed(1)}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">SR Delta</span>
                  <span className="text-base font-bold text-emerald-400">+{topBatter.delta_sr.toFixed(1)}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Runs Added/100</span>
                  <span className="text-base font-bold text-emerald-400">+{topBatter.runs_added_per_100.toFixed(1)}</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                {topBatter.key_strengths[0]} with a 28.6% boundary rate under extreme pressure.
              </p>
            </div>

            <button
              onClick={() => {
                onSelectBatter(topBatter.player_id);
              }}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 transition-colors"
            >
              <span>View Full Player Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Top Bowler Card */}
        {topBowler && (
          <div className="glass-panel glass-panel-hover p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Shield className="w-32 h-32 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                  #1 Pressure Bowler
                </span>
                <span className="text-2xl font-black text-cyan-400 font-mono-num">
                  {topBowler.reliability_score.toFixed(1)} / 100
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">{topBowler.player_name}</h3>
              <p className="text-sm text-slate-400 mt-0.5">{topBowler.teams}</p>
              <div className="my-3">
                <Badge label={topBowler.archetype} variant="blue" />
              </div>

              <div className="grid grid-cols-3 gap-3 my-4 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center font-mono-num">
                <div>
                  <span className="text-[11px] text-slate-400 block">Pressure Econ</span>
                  <span className="text-base font-bold text-white">{topBowler.econ_pressure.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Econ Delta</span>
                  <span className="text-base font-bold text-cyan-400">{topBowler.delta_econ.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Runs Prev / 6b</span>
                  <span className="text-base font-bold text-cyan-400">+{topBowler.runs_prevented_per_6.toFixed(2)}</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                {topBowler.key_strengths[0]} with a 49.5% dot ball rate and 10.6 wicket strike rate.
              </p>
            </div>

            <button
              onClick={() => {
                onSelectBowler(topBowler.player_id);
              }}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 transition-colors"
            >
              <span>View Full Player Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </section>

      {/* Pressure Distribution Overview Chart */}
      <section className="glass-panel p-6 sm:p-8 rounded-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              Empirical Pressure Score Distribution
            </h3>
            <p className="text-xs text-slate-400">
              Calibrated into 4 empirical tiers based on pre-delivery match state & outcome uncertainty
            </p>
          </div>
          <button
            onClick={() => onNavigate('explorer')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Open Pressure Explorer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={tierChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="tier" stroke="#64748B" tick={{ fontSize: 12 }} />
              <YAxis stroke="#64748B" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#334155',
                  borderRadius: '8px',
                  color: '#FFF',
                }}
                formatter={(val: any, name: any, item: any) => [
                  `${item.payload.count.toLocaleString()} balls (${item.payload.percentage.toFixed(1)}%)`,
                  'Deliveries',
                ]}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {tierChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800 text-xs">
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400 block font-medium">Ordinary [0, 35)</span>
            <span className="text-slate-200 font-bold text-sm">35.0%</span>
            <span className="text-[10px] text-slate-500 block">Low stakes / lopsided</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="text-blue-400 block font-medium">Medium [35, 65)</span>
            <span className="text-slate-200 font-bold text-sm">30.1%</span>
            <span className="text-[10px] text-slate-500 block">Active equilibrium</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="text-amber-400 block font-medium">High [65, 85)</span>
            <span className="text-slate-200 font-bold text-sm">20.0%</span>
            <span className="text-[10px] text-slate-500 block">Critical escalation</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="text-rose-400 block font-medium">Extreme [85, 100]</span>
            <span className="text-slate-200 font-bold text-sm">14.9%</span>
            <span className="text-[10px] text-slate-500 block">Game on the line</span>
          </div>
        </div>
      </section>

      {/* Analytical Pillars Overview */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-white">Context-Aware Expected Metrics</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every ball is compared against an expected baseline ($xRuns$) partitioned by competition,
            match phase, and pressure tier. Eliminates death-overs pacer vs middle-overs spinner role bias.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Percent className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-white">Empirical Bayesian Shrinkage</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Applies prior shrinkage ($n_0 = 100$ pseudo-balls) toward population mean (50.0).
            Stabilizes small-sample outliers without penalizing high-volume stalwarts like Suryakumar Yadav or Sunil Narine.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-white">Strict Zero Data Leakage</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Match state is reconstructed strictly before each delivery. Win probability and pressure are invariant
            to post-ball outcomes, ensuring authentic predictive realism.
          </p>
        </div>
      </section>
    </div>
  );
};
