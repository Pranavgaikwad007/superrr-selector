import React, { useState, useMemo } from 'react';
import { FrontendData, BowlerRecord, AllBowlerRecord } from '../types';
import {
  Shield,
  Search,
  ArrowUpDown,
  Download,
  CheckCircle2,
  TrendingDown,
  ChevronRight,
  Info,
} from 'lucide-react';
import { ConfidenceIntervalBar } from '../components/common/ConfidenceIntervalBar';
import { Badge } from '../components/common/Badge';

interface BowlingLeaderboardPageProps {
  data: FrontendData;
  onSelectPlayer: (player: BowlerRecord) => void;
}

type SortField =
  | 'rank'
  | 'reliability_score'
  | 'econ_pressure'
  | 'delta_econ'
  | 'runs_prevented_per_6'
  | 'pressure_wickets'
  | 'dot_pct'
  | 'wicket_sr'
  | 'pressure_overs';

export const BowlingLeaderboardPage: React.FC<BowlingLeaderboardPageProps> = ({
  data,
  onSelectPlayer,
}) => {
  const { top10_bowlers, all_bowlers } = data;
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'top10' | 'all'>('top10');
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortAsc, setSortAsc] = useState(true);

  const activeCohort = useMemo(() => {
    return viewMode === 'top10' ? top10_bowlers : (all_bowlers || top10_bowlers);
  }, [viewMode, top10_bowlers, all_bowlers]);

  const filteredAndSorted = useMemo(() => {
    let result = [...activeCohort];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          ('player_name' in p ? p.player_name : p.bowler_name).toLowerCase().includes(q) ||
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
      // For economy, ascending is better, but rank default is asc
      setSortAsc(field === 'rank' || field === 'econ_pressure');
    }
  };

  const getPlayerName = (p: any) => p.player_name || p.bowler_name;
  const getPlayerId = (p: any) => p.player_id || p.bowler_id;

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-1">
            <Shield className="w-4 h-4" />
            <span>Bowling Reliability Rankings</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Official Top 10 Bowlers Under Pressure
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Quantifying run containment, dot-ball pressure, and context-adjusted runs prevented in High & Extreme tiers
          </p>
        </div>

        {/* View toggles & CSV download */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="flex rounded-xl bg-slate-900 border border-slate-800 p-1 text-xs">
            <button
              onClick={() => setViewMode('top10')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                viewMode === 'top10'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Top 10 Official
            </button>
            <button
              onClick={() => setViewMode('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                viewMode === 'all'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Qualified ({all_bowlers ? all_bowlers.length : 156})
            </button>
          </div>

          <a
            href={viewMode === 'top10' ? '/data/top10_bowlers.csv' : '/data/bowling_rankings.csv'}
            download
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium transition-colors"
            title="Download CSV"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">CSV</span>
          </a>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 glass-panel p-4 rounded-xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search bowler or franchise..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 w-full sm:w-auto justify-between sm:justify-end">
          <span>
            Showing <strong className="text-white">{filteredAndSorted.length}</strong> bowlers
          </span>
          <span className="text-slate-600">&bull;</span>
          <span className="text-[11px] text-slate-500">Threshold: &ge;120 pressure balls</span>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800 text-[11px]">
              <tr>
                <th
                  onClick={() => handleSort('rank')}
                  className="py-3.5 px-4 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>Rank</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Player & Team</th>
                <th
                  onClick={() => handleSort('reliability_score')}
                  className="py-3.5 px-4 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>Reliability Score</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th className="py-3.5 px-4 hidden md:table-cell">95% Confidence Interval</th>
                <th
                  onClick={() => handleSort('econ_pressure')}
                  className="py-3.5 px-3 cursor-pointer hover:text-white text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Pressure Econ</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('delta_econ')}
                  className="py-3.5 px-3 cursor-pointer hover:text-white text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Delta Econ</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('runs_prevented_per_6')}
                  className="py-3.5 px-3 cursor-pointer hover:text-white text-right hidden sm:table-cell"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>RP / 6b</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('pressure_wickets')}
                  className="py-3.5 px-3 cursor-pointer hover:text-white text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Wickets</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('dot_pct')}
                  className="py-3.5 px-3 cursor-pointer hover:text-white text-right hidden lg:table-cell"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Dot %</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('wicket_sr')}
                  className="py-3.5 px-3 cursor-pointer hover:text-white text-right hidden lg:table-cell"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Wkt SR</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('pressure_overs')}
                  className="py-3.5 px-4 cursor-pointer hover:text-white text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Overs</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th className="py-3.5 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono-num">
              {filteredAndSorted.map((p) => {
                const name = getPlayerName(p);
                const id = getPlayerId(p);
                const top10Match = top10_bowlers.find((b) => b.player_id === id);

                return (
                  <tr
                    key={id}
                    onClick={() => {
                      if (top10Match) onSelectPlayer(top10Match);
                    }}
                    className="hover:bg-slate-800/50 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-200">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black ${
                            p.rank === 1
                              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                              : p.rank === 2
                              ? 'bg-slate-300/20 text-slate-200 border border-slate-300/40'
                              : p.rank === 3
                              ? 'bg-amber-700/20 text-amber-500 border border-amber-700/40'
                              : 'text-slate-400'
                          }`}
                        >
                          {p.rank}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-sans">
                      <div className="font-bold text-white group-hover:text-cyan-400 transition-colors">
                        {name}
                      </div>
                      <div className="text-[11px] text-slate-400">{p.teams}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-extrabold text-sm text-cyan-400">
                        {p.reliability_score.toFixed(1)}
                      </div>
                      <div className="text-[10px] text-slate-500 md:hidden">
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
                    <td className="py-3.5 px-3 text-right font-bold text-white">
                      {p.econ_pressure.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <span
                        className={`font-semibold ${
                          p.delta_econ <= 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {p.delta_econ.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right hidden sm:table-cell">
                      <span className="text-cyan-400 font-semibold">
                        +{p.runs_prevented_per_6.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right font-bold text-slate-200">
                      {p.pressure_wickets}
                    </td>
                    <td className="py-3.5 px-3 text-right hidden lg:table-cell text-slate-300">
                      {p.dot_pct.toFixed(1)}%
                    </td>
                    <td className="py-3.5 px-3 text-right hidden lg:table-cell text-slate-400">
                      {p.wicket_sr.toFixed(1)}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-300 font-medium">
                      {(p as any).pressure_overs ?? ((p as any).pressure_balls / 6.0).toFixed(1)}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (top10Match) onSelectPlayer(top10Match);
                        }}
                        className="p-1 rounded hover:bg-slate-700 text-slate-400 group-hover:text-cyan-400 transition-colors"
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
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
        <Info className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
        <div>
          <strong className="text-slate-200">How to interpret Bowling Reliability</strong>:{' '}
          Bowling reliability rewards economy suppression under pressure (Delta Econ &lt; 0), dot-ball generation,
          and context runs prevented (RP6). A death bowler like Matheesha Pathirana (+1.44 RP6) or Lockie Ferguson
          (+1.20 RP6) receives fair credit against death-overs run expectations, preventing structural role bias.
        </div>
      </div>
    </div>
  );
};
