import React from 'react';
import { FrontendData, PageId } from '../types';
import { useTheme } from '../context/ThemeContext';
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
  CheckCircle2,
  Crown,
  Zap,
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
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const topBatter = top10_batters[0];
  const topBowler = top10_bowlers[0];

  // 4 Distinguishable Tier Colors (NOT 4 shades of pink!)
  const tierColors: Record<string, string> = {
    Ordinary: '#64748B', // Cool Slate
    Medium: '#0284C7',   // Vibrant Sky Blue
    High: '#D97706',     // Royal Amber Gold
    Extreme: '#E5008A',  // Signature Royal Pink
  };

  const tierChartData = pressure_tiers_detail
    ? Object.entries(pressure_tiers_detail).map(([tier, details]) => ({
        tier,
        count: details.count,
        percentage: details.percentage,
        color: tierColors[tier] || '#E5008A',
      }))
    : [
        { tier: 'Ordinary', percentage: 35.0, count: 69686, color: '#64748B' },
        { tier: 'Medium', percentage: 30.1, count: 59897, color: '#0284C7' },
        { tier: 'High', percentage: 20.0, count: 39884, color: '#D97706' },
        { tier: 'Extreme', percentage: 14.9, count: 29779, color: '#E5008A' },
      ];

  return (
    <div className="space-y-10">
      {/* Hero Section — Premium Sports Branding */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#260C35] via-[#3D0A4E] to-[#650D73] text-white p-8 sm:p-12 shadow-royals-lg border border-white/10">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-[#E5008A]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/25 text-amber-300 text-xs font-bold tracking-wide shadow-sm backdrop-blur-md">
            <Crown className="w-4 h-4 text-amber-300" />
            <span>Rajasthan Royals &middot; SupeRR Selector Season 2</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Identify the Most Reliable Players{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4FAF] via-pink-300 to-amber-300">
              Under Pressure
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#E2D9E7] leading-relaxed font-normal">
            Some players thrive when the game is on the line; others see their output collapse.
            Using 194,014 eligible deliveries across 837 senior IPL &amp; T20I matches (from 883 scheduled fixtures since 2022),
            we model real-time win probability, quantify clutch leverage, and rank the top-performing batters and bowlers.
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('batting')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E5008A] hover:bg-[#C90079] text-white font-bold text-sm transition-all shadow-royals-pink shadow-lg"
            >
              <Award className="w-4 h-4" />
              <span>Explore Top 10 Batters</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
            <button
              onClick={() => onNavigate('bowling')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm border border-white/25 backdrop-blur-md transition-all"
            >
              <Shield className="w-4 h-4 text-pink-200" />
              <span>Explore Top 10 Bowlers</span>
            </button>
            <button
              onClick={() => onNavigate('explorer')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black/30 hover:bg-black/40 text-amber-300 text-sm font-semibold border border-amber-300/30 transition-all"
            >
              <Layers className="w-4 h-4 text-amber-300" />
              <span>IPL 2023 Case Study</span>
            </button>
          </div>
        </div>
      </section>

      {/* Dataset Core Metrics Grid — 4 Clean Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="royals-card royals-card-hover p-6 rounded-2xl">
          <span className="text-xs uppercase tracking-wider text-[#71677B] dark:text-[#C5B4CE] font-bold block">
            Deliveries Analyzed
          </span>
          <span className="text-2xl sm:text-3xl font-black text-[#23142E] dark:text-white font-mono-num mt-1 block">
            {(metadata.eligible_deliveries || 194014).toLocaleString()}
          </span>
          <span className="text-xs text-[#71677B] dark:text-[#C5B4CE] mt-1.5 block font-medium">
            {metadata.eligible_matches || 837} matches with deliveries ({metadata.scheduled_matches || 883} scheduled)
          </span>
        </div>

        <div className="royals-card royals-card-hover p-6 rounded-2xl">
          <span className="text-xs uppercase tracking-wider text-[#71677B] dark:text-[#C5B4CE] font-bold block">
            High Pressure Balls
          </span>
          <span className="text-2xl sm:text-3xl font-black text-[#E5008A] dark:text-[#FF4FAF] font-mono-num mt-1 block">
            {metadata.high_pressure_deliveries.toLocaleString()}
          </span>
          <span className="text-xs text-[#71677B] dark:text-[#C5B4CE] mt-1.5 block font-medium">
            {metadata.high_pressure_percentage}% of eligible contest balls (&Psi; &ge; 65.0)
          </span>
        </div>

        <div className="royals-card royals-card-hover p-6 rounded-2xl">
          <span className="text-xs uppercase tracking-wider text-[#71677B] dark:text-[#C5B4CE] font-bold block">
            Qualified Batters
          </span>
          <span className="text-2xl sm:text-3xl font-black text-[#650D73] dark:text-purple-300 font-mono-num mt-1 block">
            {metadata.total_eligible_batters}
          </span>
          <span className="text-xs text-[#71677B] dark:text-[#C5B4CE] mt-1.5 block font-medium">
            &ge;120 pressure balls &amp; 8+ matches
          </span>
        </div>

        <div className="royals-card royals-card-hover p-6 rounded-2xl">
          <span className="text-xs uppercase tracking-wider text-[#71677B] dark:text-[#C5B4CE] font-bold block">
            Qualified Bowlers
          </span>
          <span className="text-2xl sm:text-3xl font-black text-[#0284C7] dark:text-sky-300 font-mono-num mt-1 block">
            {metadata.total_eligible_bowlers}
          </span>
          <span className="text-xs text-[#71677B] dark:text-[#C5B4CE] mt-1.5 block font-medium">
            &ge;120 pressure balls &amp; 8+ matches
          </span>
        </div>
      </section>

      {/* Top 1 Callouts (Batting & Bowling) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Batter Card */}
        {topBatter && (
          <div className="royals-card royals-card-hover p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-6 opacity-5 dark:opacity-10 pointer-events-none">
              <Award className="w-36 h-36 text-[#E5008A]" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3.5 py-1 rounded-full bg-[#FFF1F8] dark:bg-[#E5008A]/20 border border-[#F1DCE9] dark:border-[#FF4FAF]/30 text-[#E5008A] dark:text-[#FF4FAF] text-xs font-black uppercase tracking-wider">
                  #1 Pressure Batter
                </span>
                <span className="text-2xl font-black text-[#E5008A] dark:text-[#FF4FAF] font-mono-num">
                  {topBatter.reliability_score.toFixed(1)}{' '}
                  <span className="text-xs font-normal text-[#71677B] dark:text-[#C5B4CE]">/ 100</span>
                </span>
              </div>
              <h3 className="text-2xl font-black text-[#23142E] dark:text-white tracking-tight">
                {topBatter.player_name}
              </h3>
              <p className="text-sm text-[#71677B] dark:text-[#C5B4CE] mt-0.5 font-medium">{topBatter.teams}</p>
              <div className="my-3">
                <Badge label={topBatter.archetype} variant="pink" />
              </div>

              <div className="grid grid-cols-3 gap-3 my-4 p-4 rounded-2xl bg-[#FFF1F8] dark:bg-[#2C0F3C] border border-[#F1DCE9] dark:border-[#673A70] text-center font-mono-num">
                <div>
                  <span className="text-[11px] text-[#71677B] dark:text-[#C5B4CE] block font-semibold">Pressure SR</span>
                  <span className="text-base font-black text-[#23142E] dark:text-white">{topBatter.sr_pressure.toFixed(1)}</span>
                </div>
                <div>
                  <span className="text-[11px] text-[#71677B] dark:text-[#C5B4CE] block font-semibold">SR Delta</span>
                  <span className="text-base font-black text-emerald-600 dark:text-emerald-400">+{topBatter.delta_sr.toFixed(1)}</span>
                </div>
                <div>
                  <span className="text-[11px] text-[#71677B] dark:text-[#C5B4CE] block font-semibold">Runs Added/100</span>
                  <span className="text-base font-black text-[#E5008A] dark:text-[#FF4FAF]">+{topBatter.runs_added_per_100.toFixed(1)}</span>
                </div>
              </div>

              <p className="text-xs text-[#71677B] dark:text-[#C5B4CE] leading-relaxed mb-4 font-medium">
                {topBatter.key_strengths[0]} with a 28.6% boundary rate under extreme pressure.
              </p>
            </div>

            <button
              onClick={() => {
                onSelectBatter(topBatter.player_id);
              }}
              className="w-full py-2.5 rounded-xl bg-[#FFF1F8] dark:bg-[#2C0F3C] hover:bg-[#E5008A] hover:text-white text-[#E5008A] dark:text-[#FF4FAF] dark:hover:bg-[#E5008A] dark:hover:text-white text-xs font-bold flex items-center justify-center gap-2 border border-[#F1DCE9] dark:border-[#673A70] transition-all shadow-sm"
            >
              <span>View Full Player Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Top Bowler Card */}
        {topBowler && (
          <div className="royals-card royals-card-hover p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-6 opacity-5 dark:opacity-10 pointer-events-none">
              <Shield className="w-36 h-36 text-[#650D73]" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3.5 py-1 rounded-full bg-[#650D73]/10 dark:bg-[#650D73]/30 border border-[#650D73]/20 dark:border-[#673A70] text-[#650D73] dark:text-purple-300 text-xs font-black uppercase tracking-wider">
                  #1 Pressure Bowler
                </span>
                <span className="text-2xl font-black text-[#650D73] dark:text-purple-300 font-mono-num">
                  {topBowler.reliability_score.toFixed(1)}{' '}
                  <span className="text-xs font-normal text-[#71677B] dark:text-[#C5B4CE]">/ 100</span>
                </span>
              </div>
              <h3 className="text-2xl font-black text-[#23142E] dark:text-white tracking-tight">
                {topBowler.player_name}
              </h3>
              <p className="text-sm text-[#71677B] dark:text-[#C5B4CE] mt-0.5 font-medium">{topBowler.teams}</p>
              <div className="my-3">
                <Badge label={topBowler.archetype} variant="purple" />
              </div>

              <div className="grid grid-cols-3 gap-3 my-4 p-4 rounded-2xl bg-[#FFF1F8] dark:bg-[#2C0F3C] border border-[#F1DCE9] dark:border-[#673A70] text-center font-mono-num">
                <div>
                  <span className="text-[11px] text-[#71677B] dark:text-[#C5B4CE] block font-semibold">Pressure Econ</span>
                  <span className="text-base font-black text-[#23142E] dark:text-white">{topBowler.econ_pressure.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-[11px] text-[#71677B] dark:text-[#C5B4CE] block font-semibold">Econ Delta</span>
                  <span className="text-base font-black text-emerald-600 dark:text-emerald-400">{topBowler.delta_econ.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-[11px] text-[#71677B] dark:text-[#C5B4CE] block font-semibold">Runs Prev / 6b</span>
                  <span className="text-base font-black text-[#650D73] dark:text-purple-300">+{topBowler.runs_prevented_per_6.toFixed(2)}</span>
                </div>
              </div>

              <p className="text-xs text-[#71677B] dark:text-[#C5B4CE] leading-relaxed mb-4 font-medium">
                {topBowler.key_strengths[0]} with a 49.5% dot ball rate and 10.6 wicket strike rate.
              </p>
            </div>

            <button
              onClick={() => {
                onSelectBowler(topBowler.player_id);
              }}
              className="w-full py-2.5 rounded-xl bg-[#FFF1F8] dark:bg-[#2C0F3C] hover:bg-[#650D73] hover:text-white text-[#650D73] dark:text-purple-300 dark:hover:bg-[#650D73] dark:hover:text-white text-xs font-bold flex items-center justify-center gap-2 border border-[#F1DCE9] dark:border-[#673A70] transition-all shadow-sm"
            >
              <span>View Full Player Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </section>

      {/* Pressure Distribution Overview Chart */}
      <section className="royals-card p-6 sm:p-8 rounded-3xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
          <div>
            <h3 className="text-lg font-black text-[#23142E] dark:text-white tracking-tight flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#E5008A]" />
              Empirical Pressure Score Distribution
            </h3>
            <p className="text-xs text-[#71677B] dark:text-[#C5B4CE] font-medium">
              Calibrated into 4 empirical tiers based on pre-delivery match state &amp; outcome leverage
            </p>
          </div>
          <button
            onClick={() => onNavigate('explorer')}
            className="text-xs text-[#E5008A] dark:text-[#FF4FAF] hover:underline font-bold flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Open Pressure Explorer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={tierChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDark ? '#673A70' : '#F1DCE9'}
                vertical={false}
              />
              <XAxis
                dataKey="tier"
                stroke={isDark ? '#C5B4CE' : '#71677B'}
                tick={{ fontSize: 12, fontWeight: 600 }}
              />
              <YAxis
                stroke={isDark ? '#C5B4CE' : '#71677B'}
                tick={{ fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#3A174A' : '#FFFFFF',
                  borderColor: isDark ? '#673A70' : '#F1DCE9',
                  borderRadius: '12px',
                  color: isDark ? '#FFF' : '#23142E',
                  boxShadow: '0 4px 20px rgba(101, 13, 115, 0.1)',
                }}
                formatter={(val: any, name: any, item: any) => [
                  `${item.payload.count.toLocaleString()} balls (${item.payload.percentage.toFixed(1)}%)`,
                  'Deliveries',
                ]}
              />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {tierChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 4 Distinguishable Tiers Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-[#F1DCE9] dark:border-[#673A70] text-xs">
          <div className="p-3.5 rounded-2xl bg-[#F8FAFC] dark:bg-[#2C0F3C] border border-slate-200 dark:border-[#673A70]">
            <span className="text-slate-600 dark:text-slate-300 block font-bold">Ordinary [0, 35)</span>
            <span className="text-slate-900 dark:text-white font-black text-sm">35.0%</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Low stakes / lopsided</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800">
            <span className="text-sky-700 dark:text-sky-300 block font-bold">Medium [35, 65)</span>
            <span className="text-sky-950 dark:text-white font-black text-sm">30.1%</span>
            <span className="text-[10px] text-sky-600 dark:text-sky-400 block font-medium">Active contest balance</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
            <span className="text-amber-800 dark:text-amber-300 block font-bold">High [65, 85)</span>
            <span className="text-amber-950 dark:text-white font-black text-sm">20.0%</span>
            <span className="text-[10px] text-amber-700 dark:text-amber-400 block font-medium">Critical escalation</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#FFF1F8] dark:bg-[#E5008A]/20 border border-[#F1DCE9] dark:border-[#FF4FAF]/30">
            <span className="text-[#E5008A] dark:text-[#FF4FAF] block font-bold">Extreme [85, 100]</span>
            <span className="text-[#23142E] dark:text-white font-black text-sm">14.9%</span>
            <span className="text-[10px] text-[#E5008A] dark:text-[#FF4FAF] block font-medium">Game on the line</span>
          </div>
        </div>
      </section>

      {/* Analytical Pillars Overview — 3 Royals Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="royals-card p-6 rounded-3xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#FFF1F8] dark:bg-[#E5008A]/20 border border-[#F1DCE9] dark:border-[#FF4FAF]/30 flex items-center justify-center text-[#E5008A] dark:text-[#FF4FAF]">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h4 className="text-base font-black text-[#23142E] dark:text-white">Context-Aware Expected Baselines</h4>
          <p className="text-xs text-[#71677B] dark:text-[#C5B4CE] leading-relaxed font-medium">
            Every ball is compared against an expected baseline conditioned on match phase, innings,
            and leverage. Eliminates death-overs pacer vs middle-overs spinner role bias.
          </p>
        </div>

        <div className="royals-card p-6 rounded-3xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#650D73]/10 dark:bg-[#650D73]/30 border border-[#650D73]/20 dark:border-[#673A70] flex items-center justify-center text-[#650D73] dark:text-purple-300">
            <Percent className="w-5 h-5" />
          </div>
          <h4 className="text-base font-black text-[#23142E] dark:text-white">Empirical Bayesian Regularization</h4>
          <p className="text-xs text-[#71677B] dark:text-[#C5B4CE] leading-relaxed font-medium">
            Applies prior shrinkage ($n_0 = 100$ pseudo-balls) toward population mean (50.0).
            Stabilizes small-sample outliers without penalizing high-volume stalwarts like Suryakumar Yadav or Sunil Narine.
          </p>
        </div>

        <div className="royals-card p-6 rounded-3xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h4 className="text-base font-black text-[#23142E] dark:text-white">Strict Zero Data Leakage</h4>
          <p className="text-xs text-[#71677B] dark:text-[#C5B4CE] leading-relaxed font-medium">
            Match state is reconstructed strictly before each delivery. Win probability and pressure are invariant
            to post-ball outcomes, ensuring authentic predictive realism.
          </p>
        </div>
      </section>
    </div>
  );
};
