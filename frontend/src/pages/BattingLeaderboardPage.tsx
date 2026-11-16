import React, { useState, useMemo } from 'react';
import { FrontendData, BatterRecord, AllBatterRecord } from '../types';
import {
  Award,
  Search,
  ArrowUpDown,
  Download,
  Filter,
  CheckCircle2,
  TrendingUp,
  ChevronRight,
  Info,
  Crown,
} from 'lucide-react';
import { ConfidenceIntervalBar } from '../components/common/ConfidenceIntervalBar';
import { Badge } from '../components/common/Badge';

interface BattingLeaderboardPageProps {
  data: FrontendData;
  onSelectPlayer: (player: BatterRecord) => void;
}

type SortField =
  | 'rank'
  | 'reliability_score'
  | 'sr_pressure'
  | 'delta_sr'
  | 'runs_added_per_100'
  | 'pressure_balls'
  | 'boundary_pct'
  | 'dot_pct';

export const BattingLeaderboardPage: React.FC<BattingLeaderboardPageProps> = ({
  data,
  onSelectPlayer,
}) => {
  const { top10_batters, all_batters } = data;
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'top10' | 'all'>('top10');
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortAsc, setSortAsc] = useState(true);

  const activeCohort = useMemo(() => {
    return viewMode === 'top10' ? top10_batters : (all_batters || top10_batters);
  }, [viewMode, top10_batters, all_batters]);

  const filteredAndSorted = useMemo(() => {
    let result = [...activeCohort];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          ('player_name' in p ? p.player_name : p.striker_name).toLowerCase().includes(q) ||
          p.teams.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      let aVal = (a as any)[sortField];
      let bVal = (b as any)[sortField];

      if (sortField === 'rank') {
        aVal = a.rank;
        bVal = b.rank;
      }

      if (aVal < bVal) return sortAsc ? -1 : 1;
      if (aVal > bVal) return sortAsc ? 1 : -1;
      return 0;
    });

    return result;
  }, [activeCohort, searchTerm, sortField, sortAsc]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(field === 'rank');
    }
  };

  const getPlayerName = (p: any) => p.player_name || p.striker_name;
  const getPlayerId = (p: any) => p.player_id || p.striker_id;

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E5008A] dark:text-[#FF4FAF] mb-1">
            <Award className="w-4 h-4 text-[#E5008A] dark:text-[#FF4FAF]" />
            <span>Batting Reliability Intelligence</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#23142E] dark:text-white tracking-tight">
            Official Top 10 Batters Under Pressure
          </h2>
          <p className="text-xs sm:text-sm text-[#71677B] dark:text-[#C5B4CE] mt-1 font-medium">
            Quantifying strike-rate elevation, boundary execution, and context-adjusted runs added in High &amp; Extreme pressure tiers
          </p>
        </div>

        {/* View toggles & CSV download */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="flex rounded-2xl bg-white dark:bg-[#3A174A] border border-[#F1DCE9] dark:border-[#673A70] p-1 text-xs shadow-royals-sm">
            <button
              onClick={() => setViewMode('top10')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                viewMode === 'top10'
                  ? 'bg-[#E5008A] text-white shadow-royals-pink shadow-sm'
                  : 'text-[#71677B] dark:text-[#C5B4CE] hover:text-[#23142E] dark:hover:text-white'
              }`}
            >
              Top 10 Official
            </button>
            <button
              onClick={() => setViewMode('all')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                viewMode === 'all'
                  ? 'bg-[#E5008A] text-white shadow-royals-pink shadow-sm'
                  : 'text-[#71677B] dark:text-[#C5B4CE] hover:text-[#23142E] dark:hover:text-white'
              }`}
            >
              All Qualified ({all_batters ? all_batters.length : 135})
            </button>
          </div>

          <a
            href={viewMode === 'top10' ? '/data/top10_batters.csv' : '/data/batting_rankings.csv'}
            download
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white dark:bg-[#3A174A] hover:bg-[#FFF1F8] dark:hover:bg-[#2C0F3C] border border-[#F1DCE9] dark:border-[#673A70] text-[#E5008A] dark:text-[#FF4FAF] text-xs font-bold transition-colors shadow-royals-sm"
            title="Download CSV"
          >
            <Download className="w-3.5 h-3.5 text-[#E5008A] dark:text-[#FF4FAF]" />
            <span className="hidden sm:inline">CSV</span>
          </a>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 royals-card p-4 rounded-2xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#71677B] dark:text-[#C5B4CE] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search batter or franchise..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#FFF1F8] dark:bg-[#2C0F3C] border border-[#F1DCE9] dark:border-[#673A70] rounded-xl text-xs text-[#23142E] dark:text-white placeholder-[#71677B] dark:placeholder-[#C5B4CE] focus:outline-none focus:ring-2 focus:ring-[#E5008A]"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-[#71677B] dark:text-[#C5B4CE] w-full sm:w-auto justify-between sm:justify-end font-medium">
          <span>
            Showing <strong className="text-[#23142E] dark:text-white">{filteredAndSorted.length}</strong> batters
          </span>
          <span>&bull;</span>
          <span className="text-[11px]">Threshold: &ge;120 pressure balls &middot; 8+ matches</span>
        </div>
      </div>

      {/* Leaderboard Table — Clean White Table */}
      <div className="royals-card rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FFF1F8] dark:bg-[#2C0F3C] text-[#650D73] dark:text-purple-300 uppercase tracking-wider font-bold border-b border-[#F1DCE9] dark:border-[#673A70] text-[11px]">
              <tr>
                <th
                  onClick={() => handleSort('rank')}
                  className="py-4 px-4 cursor-pointer hover:text-[#E5008A]"
                >
                  <div className="flex items-center gap-1">
                    <span>Rank</span>
                    <ArrowUpDown className="w-3 h-3 text-[#71677B]" />
                  </div>
                </th>
                <th className="py-4 px-4">Player &amp; Team</th>
                <th
                  onClick={() => handleSort('reliability_score')}
                  className="py-4 px-4 cursor-pointer hover:text-[#E5008A]"
                >
                  <div className="flex items-center gap-1">
                    <span>Reliability Score</span>
                    <ArrowUpDown className="w-3 h-3 text-[#71677B]" />
                  </div>
                </th>
                <th className="py-4 px-4 hidden md:table-cell">95% Confidence Interval</th>
                <th
                  onClick={() => handleSort('sr_pressure')}
                  className="py-4 px-3 cursor-pointer hover:text-[#E5008A] text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Pressure SR</span>
                    <ArrowUpDown className="w-3 h-3 text-[#71677B]" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('delta_sr')}
                  className="py-4 px-3 cursor-pointer hover:text-[#E5008A] text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Delta SR</span>
                    <ArrowUpDown className="w-3 h-3 text-[#71677B]" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('runs_added_per_100')}
                  className="py-4 px-3 cursor-pointer hover:text-[#E5008A] text-right hidden sm:table-cell"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>RA / 100b</span>
                    <ArrowUpDown className="w-3 h-3 text-[#71677B]" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('boundary_pct')}
                  className="py-4 px-3 cursor-pointer hover:text-[#E5008A] text-right hidden lg:table-cell"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Boundary %</span>
                    <ArrowUpDown className="w-3 h-3 text-[#71677B]" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('dot_pct')}
                  className="py-4 px-3 cursor-pointer hover:text-[#E5008A] text-right hidden lg:table-cell"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Dot %</span>
                    <ArrowUpDown className="w-3 h-3 text-[#71677B]" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('pressure_balls')}
                  className="py-4 px-4 cursor-pointer hover:text-[#E5008A] text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Balls</span>
                    <ArrowUpDown className="w-3 h-3 text-[#71677B]" />
                  </div>
                </th>
                <th className="py-4 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1DCE9] dark:divide-[#673A70] font-mono-num">
              {filteredAndSorted.map((p) => {
                const name = getPlayerName(p);
                const id = getPlayerId(p);
                const top10Match = top10_batters.find((b) => b.player_id === id);

                return (
                  <tr
                    key={id}
                    onClick={() => {
                      if (top10Match) onSelectPlayer(top10Match);
                    }}
                    className="hover:bg-[#FFF5FA] dark:hover:bg-[#431454] cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-4 font-bold text-[#23142E] dark:text-white">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shadow-sm ${
                            p.rank === 1
                              ? 'bg-[#E5008A] text-white shadow-royals-pink'
                              : p.rank === 2
                              ? 'bg-[#650D73] text-white'
                              : p.rank === 3
                              ? 'bg-amber-500 text-white'
                              : 'bg-[#FFF1F8] dark:bg-[#2C0F3C] text-[#E5008A] dark:text-purple-300 border border-[#F1DCE9] dark:border-[#673A70]'
                          }`}
                        >
                          {p.rank}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-sans">
                      <div className="font-bold text-[#23142E] dark:text-white group-hover:text-[#E5008A] dark:group-hover:text-[#FF4FAF] transition-colors">
                        {name}
                      </div>
                      <div className="text-[11px] text-[#71677B] dark:text-[#C5B4CE] font-medium">{p.teams}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-black text-sm text-[#E5008A] dark:text-[#FF4FAF]">
                        {p.reliability_score.toFixed(1)}
                      </div>
                      <div className="text-[10px] text-[#71677B] dark:text-[#C5B4CE] md:hidden">
                        [{p.ci_lower.toFixed(1)}, {p.ci_upper.toFixed(1)}]
                      </div>
                    </td>
                    <td className="py-3.5 px-4 hidden md:table-cell w-44">
                      <ConfidenceIntervalBar
                        score={p.reliability_score}
                        ciLower={p.ci_lower}
                        ciUpper={p.ci_upper}
                        showLabels={false}
                        compact
                      />
                    </td>
                    <td className="py-3.5 px-3 text-right font-bold text-[#23142E] dark:text-white">
                      {p.sr_pressure.toFixed(1)}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <span
                        className={`font-bold ${
                          p.delta_sr >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#71677B] dark:text-[#C5B4CE]'
                        }`}
                      >
                        {p.delta_sr >= 0 ? `+${p.delta_sr.toFixed(1)}` : p.delta_sr.toFixed(1)}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right hidden sm:table-cell">
                      <span className="text-[#650D73] dark:text-purple-300 font-bold">
                        +{p.runs_added_per_100.toFixed(1)}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right hidden lg:table-cell text-[#23142E] dark:text-white font-medium">
                      {p.boundary_pct.toFixed(1)}%
                    </td>
                    <td className="py-3.5 px-3 text-right hidden lg:table-cell text-[#71677B] dark:text-[#C5B4CE] font-medium">
                      {p.dot_pct.toFixed(1)}%
                    </td>
                    <td className="py-3.5 px-4 text-right text-[#23142E] dark:text-white font-medium">
                      {p.pressure_balls}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (top10Match) onSelectPlayer(top10Match);
                        }}
                        className="p-1.5 rounded-lg hover:bg-[#FFF1F8] dark:hover:bg-[#2C0F3C] text-[#71677B] group-hover:text-[#E5008A] transition-colors"
                        title="View Profile"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Explanatory Callout */}
      <div className="p-4 rounded-2xl bg-[#FFF1F8] dark:bg-[#2C0F3C] border border-[#F1DCE9] dark:border-[#673A70] text-xs text-[#71677B] dark:text-[#C5B4CE] flex items-start gap-3">
        <Info className="w-4 h-4 text-[#E5008A] dark:text-[#FF4FAF] mt-0.5 flex-shrink-0" />
        <div className="leading-relaxed font-medium">
          <strong className="text-[#23142E] dark:text-white font-bold">How to interpret Batting Reliability</strong>:
          Reliability score combines raw execution (strike rate, boundary execution, dot suppression) with
          context expected performance ($RA100$). It applies Bayesian shrinkage with prior strength $n_0=100$
          pseudo-balls. The 95% Confidence Interval illustrates estimation certainty based on sample size.
        </div>
      </div>
    </div>
  );
};
