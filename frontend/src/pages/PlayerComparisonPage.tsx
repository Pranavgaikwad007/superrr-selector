import React, { useState } from 'react';
import { FrontendData, BatterRecord, BowlerRecord } from '../types';
import {
  GitCompare,
  Award,
  Shield,
  CheckCircle2,
  TrendingUp,
  Percent,
  Compass,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { RadarChartWrapper } from '../components/common/RadarChartWrapper';
import { ConfidenceIntervalBar } from '../components/common/ConfidenceIntervalBar';
import { Badge } from '../components/common/Badge';

interface PlayerComparisonPageProps {
  data: FrontendData;
}

export const PlayerComparisonPage: React.FC<PlayerComparisonPageProps> = ({ data }) => {
  const { top10_batters, top10_bowlers } = data;

  const [role, setRole] = useState<'batter' | 'bowler'>('batter');
  const [player1Id, setPlayer1Id] = useState<number>(top10_batters[0]?.player_id || 6819);
  const [player2Id, setPlayer2Id] = useState<number>(top10_batters[1]?.player_id || 7216);

  // Switch role handler
  const handleRoleChange = (newRole: 'batter' | 'bowler') => {
    setRole(newRole);
    if (newRole === 'batter') {
      setPlayer1Id(top10_batters[0]?.player_id || 6819);
      setPlayer2Id(top10_batters[1]?.player_id || 7216);
    } else {
      setPlayer1Id(top10_bowlers[0]?.player_id || 2382);
      setPlayer2Id(top10_bowlers[1]?.player_id || 781);
    }
  };

  const isBatter = role === 'batter';
  const playerList = isBatter ? top10_batters : top10_bowlers;

  const p1 = (playerList as any[]).find((p) => p.player_id === player1Id) || playerList[0];
  const p2 = (playerList as any[]).find((p) => p.player_id === player2Id) || playerList[1];

  const batter1 = isBatter ? (p1 as BatterRecord) : null;
  const batter2 = isBatter ? (p2 as BatterRecord) : null;
  const bowler1 = !isBatter ? (p1 as BowlerRecord) : null;
  const bowler2 = !isBatter ? (p2 as BowlerRecord) : null;

  return (
    <div className="space-y-8">
      {/* Header and Role Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
            <GitCompare className="w-4 h-4" />
            <span>Head-to-Head Analytics</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Player Pressure Comparison
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Direct statistical matchup of skill profiles, context value, and sample size certainty
          </p>
        </div>

        {/* Role Toggle */}
        <div className="flex rounded-xl bg-slate-900 border border-slate-800 p-1 text-xs self-start md:self-auto">
          <button
            onClick={() => handleRoleChange('batter')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              isBatter
                ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Compare Batters</span>
          </button>
          <button
            onClick={() => handleRoleChange('bowler')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              !isBatter
                ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Compare Bowlers</span>
          </button>
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Player 1 Dropdown */}
        <div className="glass-panel p-4 rounded-xl border-l-4 border-l-emerald-400">
          <label className="text-xs font-medium text-slate-400 block mb-2">
            Select Player 1 (Emerald)
          </label>
          <select
            value={player1Id}
            onChange={(e) => setPlayer1Id(Number(e.target.value))}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-semibold focus:outline-none focus:border-emerald-500"
          >
            {playerList.map((p) => (
              <option key={p.player_id} value={p.player_id}>
                #{p.rank} {p.player_name} ({p.teams}) &mdash; Score: {p.reliability_score.toFixed(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Player 2 Dropdown */}
        <div className="glass-panel p-4 rounded-xl border-l-4 border-l-sky-400">
          <label className="text-xs font-medium text-slate-400 block mb-2">
            Select Player 2 (Sky Blue)
          </label>
          <select
            value={player2Id}
            onChange={(e) => setPlayer2Id(Number(e.target.value))}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-semibold focus:outline-none focus:border-sky-500"
          >
            {playerList.map((p) => (
              <option key={p.player_id} value={p.player_id}>
                #{p.rank} {p.player_name} ({p.teams}) &mdash; Score: {p.reliability_score.toFixed(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Side-by-Side Player Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Player 1 Card */}
        <div className="glass-panel p-6 rounded-2xl border-t-2 border-t-emerald-400 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Rank #{p1.rank} &middot; {role.toUpperCase()}
              </span>
              <h3 className="text-2xl font-black text-white tracking-tight">{p1.player_name}</h3>
              <p className="text-xs text-slate-400">{p1.teams}</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-extrabold text-emerald-400 font-mono-num">
                {p1.reliability_score.toFixed(1)}
              </span>
              <span className="text-[11px] text-slate-500 block font-mono-num">
                CI: [{p1.ci_lower.toFixed(1)}, {p1.ci_upper.toFixed(1)}]
              </span>
            </div>
          </div>
          <Badge label={p1.archetype} variant="emerald" />
          <ConfidenceIntervalBar
            score={p1.reliability_score}
            ciLower={p1.ci_lower}
            ciUpper={p1.ci_upper}
            showLabels={false}
          />
          <div className="space-y-1.5 pt-2">
            {p1.key_strengths.map((str: string, i: number) => (
              <div key={i} className="text-xs text-slate-300 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                <span>{str}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Player 2 Card */}
        <div className="glass-panel p-6 rounded-2xl border-t-2 border-t-sky-400 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                Rank #{p2.rank} &middot; {role.toUpperCase()}
              </span>
              <h3 className="text-2xl font-black text-white tracking-tight">{p2.player_name}</h3>
              <p className="text-xs text-slate-400">{p2.teams}</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-extrabold text-sky-400 font-mono-num">
                {p2.reliability_score.toFixed(1)}
              </span>
              <span className="text-[11px] text-slate-500 block font-mono-num">
                CI: [{p2.ci_lower.toFixed(1)}, {p2.ci_upper.toFixed(1)}]
              </span>
            </div>
          </div>
          <Badge label={p2.archetype} variant="blue" />
          <ConfidenceIntervalBar
            score={p2.reliability_score}
            ciLower={p2.ci_lower}
            ciUpper={p2.ci_upper}
            showLabels={false}
          />
          <div className="space-y-1.5 pt-2">
            {p2.key_strengths.map((str: string, i: number) => (
              <div key={i} className="text-xs text-slate-300 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 flex-shrink-0" />
                <span>{str}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Head-to-Head Skill Radar Chart */}
      <section className="glass-panel p-6 sm:p-8 rounded-2xl">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-white tracking-tight">
            5-Dimensional Skill Profile Overlay
          </h3>
          <p className="text-xs text-slate-400">
            Standardized 0-100 radar comparison across core clutch capabilities
          </p>
        </div>

        <div className="h-80 w-full">
          <RadarChartWrapper
            player1Name={p1.player_name}
            player1Data={p1.radar}
            player1Color="#10B981"
            player2Name={p2.player_name}
            player2Data={p2.radar}
            player2Color="#38BDF8"
            type={role}
            height={320}
          />
        </div>
      </section>

      {/* Detailed Metrics Comparison Table */}
      <section className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
        <div className="p-4 sm:p-6 bg-slate-900/80 border-b border-slate-800">
          <h3 className="text-base font-bold text-white tracking-tight">
            Statistical Head-to-Head Breakdown
          </h3>
          <p className="text-xs text-slate-400">
            Comparing pre-ball context efficiency, baseline improvement, and sample reliability
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono-num">
            <thead className="bg-slate-900 text-slate-400 uppercase text-[11px] font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-6 text-slate-300 font-sans">Performance Metric</th>
                <th className="py-3 px-6 text-emerald-400 font-bold">{p1.player_name}</th>
                <th className="py-3 px-6 text-sky-400 font-bold">{p2.player_name}</th>
                <th className="py-3 px-6 text-slate-400 font-sans">Edge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-xs">
              {/* Reliability Score */}
              <tr>
                <td className="py-3 px-6 font-sans text-slate-300 font-medium">
                  Reliability Score
                </td>
                <td className="py-3 px-6 font-bold text-emerald-400">
                  {p1.reliability_score.toFixed(1)}
                </td>
                <td className="py-3 px-6 font-bold text-sky-400">
                  {p2.reliability_score.toFixed(1)}
                </td>
                <td className="py-3 px-6 font-sans">
                  {p1.reliability_score > p2.reliability_score ? (
                    <span className="text-emerald-400 font-semibold">{p1.player_name} (+{(p1.reliability_score - p2.reliability_score).toFixed(1)})</span>
                  ) : (
                    <span className="text-sky-400 font-semibold">{p2.player_name} (+{(p2.reliability_score - p1.reliability_score).toFixed(1)})</span>
                  )}
                </td>
              </tr>

              {/* Batting Specific Metrics */}
              {isBatter && batter1 && batter2 && (
                <>
                  <tr>
                    <td className="py-3 px-6 font-sans text-slate-300">Pressure Strike Rate</td>
                    <td className="py-3 px-6 font-bold">{batter1.sr_pressure.toFixed(1)}</td>
                    <td className="py-3 px-6 font-bold">{batter2.sr_pressure.toFixed(1)}</td>
                    <td className="py-3 px-6 font-sans">
                      {batter1.sr_pressure > batter2.sr_pressure ? (
                        <span className="text-emerald-400 font-semibold">{p1.player_name} (+{(batter1.sr_pressure - batter2.sr_pressure).toFixed(1)})</span>
                      ) : (
                        <span className="text-sky-400 font-semibold">{p2.player_name} (+{(batter2.sr_pressure - batter1.sr_pressure).toFixed(1)})</span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 font-sans text-slate-300">Strike Rate Delta (vs Normal)</td>
                    <td className="py-3 px-6">{batter1.delta_sr >= 0 ? `+${batter1.delta_sr.toFixed(1)}` : batter1.delta_sr.toFixed(1)}</td>
                    <td className="py-3 px-6">{batter2.delta_sr >= 0 ? `+${batter2.delta_sr.toFixed(1)}` : batter2.delta_sr.toFixed(1)}</td>
                    <td className="py-3 px-6 font-sans">
                      {batter1.delta_sr > batter2.delta_sr ? (
                        <span className="text-emerald-400 font-semibold">{p1.player_name}</span>
                      ) : (
                        <span className="text-sky-400 font-semibold">{p2.player_name}</span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 font-sans text-slate-300">Context Runs Added / 100b</td>
                    <td className="py-3 px-6 text-emerald-400 font-bold">+{batter1.runs_added_per_100.toFixed(1)}</td>
                    <td className="py-3 px-6 text-sky-400 font-bold">+{batter2.runs_added_per_100.toFixed(1)}</td>
                    <td className="py-3 px-6 font-sans">
                      {batter1.runs_added_per_100 > batter2.runs_added_per_100 ? (
                        <span className="text-emerald-400 font-semibold">{p1.player_name}</span>
                      ) : (
                        <span className="text-sky-400 font-semibold">{p2.player_name}</span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 font-sans text-slate-300">Boundary Execution %</td>
                    <td className="py-3 px-6">{batter1.boundary_pct.toFixed(1)}%</td>
                    <td className="py-3 px-6">{batter2.boundary_pct.toFixed(1)}%</td>
                    <td className="py-3 px-6 font-sans">
                      {batter1.boundary_pct > batter2.boundary_pct ? (
                        <span className="text-emerald-400 font-semibold">{p1.player_name}</span>
                      ) : (
                        <span className="text-sky-400 font-semibold">{p2.player_name}</span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 font-sans text-slate-300">Dot Ball Mitigation (Lower is better)</td>
                    <td className="py-3 px-6">{batter1.dot_pct.toFixed(1)}%</td>
                    <td className="py-3 px-6">{batter2.dot_pct.toFixed(1)}%</td>
                    <td className="py-3 px-6 font-sans">
                      {batter1.dot_pct < batter2.dot_pct ? (
                        <span className="text-emerald-400 font-semibold">{p1.player_name} (fewer dots)</span>
                      ) : (
                        <span className="text-sky-400 font-semibold">{p2.player_name} (fewer dots)</span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 font-sans text-slate-300">Pressure Balls (Sample Volume)</td>
                    <td className="py-3 px-6">{batter1.pressure_balls}</td>
                    <td className="py-3 px-6">{batter2.pressure_balls}</td>
                    <td className="py-3 px-6 font-sans">
                      {batter1.pressure_balls > batter2.pressure_balls ? (
                        <span className="text-emerald-400 font-semibold">{p1.player_name} (more volume)</span>
                      ) : (
                        <span className="text-sky-400 font-semibold">{p2.player_name} (more volume)</span>
                      )}
                    </td>
                  </tr>
                </>
              )}

              {/* Bowling Specific Metrics */}
              {!isBatter && bowler1 && bowler2 && (
                <>
                  <tr>
                    <td className="py-3 px-6 font-sans text-slate-300">Pressure Economy (Lower is better)</td>
                    <td className="py-3 px-6 font-bold">{bowler1.econ_pressure.toFixed(2)}</td>
                    <td className="py-3 px-6 font-bold">{bowler2.econ_pressure.toFixed(2)}</td>
                    <td className="py-3 px-6 font-sans">
                      {bowler1.econ_pressure < bowler2.econ_pressure ? (
                        <span className="text-emerald-400 font-semibold">{p1.player_name}</span>
                      ) : (
                        <span className="text-sky-400 font-semibold">{p2.player_name}</span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 font-sans text-slate-300">Economy Delta (Lower is better)</td>
                    <td className="py-3 px-6">{bowler1.delta_econ.toFixed(2)}</td>
                    <td className="py-3 px-6">{bowler2.delta_econ.toFixed(2)}</td>
                    <td className="py-3 px-6 font-sans">
                      {bowler1.delta_econ < bowler2.delta_econ ? (
                        <span className="text-emerald-400 font-semibold">{p1.player_name}</span>
                      ) : (
                        <span className="text-sky-400 font-semibold">{p2.player_name}</span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 font-sans text-slate-300">Context Runs Prevented / 6b</td>
                    <td className="py-3 px-6 text-emerald-400 font-bold">+{bowler1.runs_prevented_per_6.toFixed(2)}</td>
                    <td className="py-3 px-6 text-sky-400 font-bold">+{bowler2.runs_prevented_per_6.toFixed(2)}</td>
                    <td className="py-3 px-6 font-sans">
                      {bowler1.runs_prevented_per_6 > bowler2.runs_prevented_per_6 ? (
                        <span className="text-emerald-400 font-semibold">{p1.player_name}</span>
                      ) : (
                        <span className="text-sky-400 font-semibold">{p2.player_name}</span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 font-sans text-slate-300">Dot Ball Generation %</td>
                    <td className="py-3 px-6">{bowler1.dot_pct.toFixed(1)}%</td>
                    <td className="py-3 px-6">{bowler2.dot_pct.toFixed(1)}%</td>
                    <td className="py-3 px-6 font-sans">
                      {bowler1.dot_pct > bowler2.dot_pct ? (
                        <span className="text-emerald-400 font-semibold">{p1.player_name}</span>
                      ) : (
                        <span className="text-sky-400 font-semibold">{p2.player_name}</span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 font-sans text-slate-300">Pressure Wickets</td>
                    <td className="py-3 px-6">{bowler1.pressure_wickets} wkts</td>
                    <td className="py-3 px-6">{bowler2.pressure_wickets} wkts</td>
                    <td className="py-3 px-6 font-sans">
                      {bowler1.pressure_wickets > bowler2.pressure_wickets ? (
                        <span className="text-emerald-400 font-semibold">{p1.player_name}</span>
                      ) : (
                        <span className="text-sky-400 font-semibold">{p2.player_name}</span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-6 font-sans text-slate-300">Wicket Strike Rate (Balls / Wkt)</td>
                    <td className="py-3 px-6">{bowler1.wicket_sr.toFixed(1)}</td>
                    <td className="py-3 px-6">{bowler2.wicket_sr.toFixed(1)}</td>
                    <td className="py-3 px-6 font-sans">
                      {bowler1.wicket_sr < bowler2.wicket_sr ? (
                        <span className="text-emerald-400 font-semibold">{p1.player_name} (more frequent)</span>
                      ) : (
                        <span className="text-sky-400 font-semibold">{p2.player_name} (more frequent)</span>
                      )}
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
