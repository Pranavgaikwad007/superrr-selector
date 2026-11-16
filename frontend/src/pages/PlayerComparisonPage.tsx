import React, { useState } from 'react';
import { FrontendData, BatterRecord, BowlerRecord } from '../types';
import {
  GitCompare,
  Award,
  Shield,
  CheckCircle2,
  TrendingUp,
  Percent,
  ArrowRight,
  Crown,
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
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E5008A] dark:text-[#FF4FAF] mb-1">
            <GitCompare className="w-4 h-4 text-[#E5008A] dark:text-[#FF4FAF]" />
            <span>Head-to-Head Analytics</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#23142E] dark:text-white tracking-tight">
            Player Pressure Comparison
          </h2>
          <p className="text-xs sm:text-sm text-[#71677B] dark:text-[#C5B4CE] mt-1 font-medium">
            Direct statistical matchup of skill profiles, context value, and sample size certainty
          </p>
        </div>

        {/* Role Toggle */}
        <div className="flex rounded-2xl bg-white dark:bg-[#3A174A] border border-[#F1DCE9] dark:border-[#673A70] p-1 text-xs self-start md:self-auto shadow-royals-sm">
          <button
            onClick={() => handleRoleChange('batter')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
              isBatter
                ? 'bg-[#E5008A] text-white shadow-royals-pink shadow-sm'
                : 'text-[#71677B] dark:text-[#C5B4CE] hover:text-[#23142E] dark:hover:text-white'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Compare Batters</span>
          </button>
          <button
            onClick={() => handleRoleChange('bowler')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
              !isBatter
                ? 'bg-[#650D73] text-white shadow-sm'
                : 'text-[#71677B] dark:text-[#C5B4CE] hover:text-[#23142E] dark:hover:text-white'
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
        <div className="royals-card p-5 rounded-3xl border-l-4 border-l-[#E5008A]">
          <label className="text-xs font-bold text-[#E5008A] dark:text-[#FF4FAF] block mb-2 uppercase tracking-wider">
            Player 1 (Royal Pink)
          </label>
          <select
            value={player1Id}
            onChange={(e) => setPlayer1Id(Number(e.target.value))}
            className="w-full bg-[#FFF1F8] dark:bg-[#2C0F3C] border border-[#F1DCE9] dark:border-[#673A70] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#23142E] dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-[#E5008A]"
          >
            {playerList.map((p) => (
              <option key={p.player_id} value={p.player_id}>
                #{p.rank} {p.player_name} ({p.teams}) &mdash; Score: {p.reliability_score.toFixed(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Player 2 Dropdown */}
        <div className="royals-card p-5 rounded-3xl border-l-4 border-l-[#650D73]">
          <label className="text-xs font-bold text-[#650D73] dark:text-purple-300 block mb-2 uppercase tracking-wider">
            Player 2 (Royals Purple)
          </label>
          <select
            value={player2Id}
            onChange={(e) => setPlayer2Id(Number(e.target.value))}
            className="w-full bg-[#FFF1F8] dark:bg-[#2C0F3C] border border-[#F1DCE9] dark:border-[#673A70] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#23142E] dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-[#650D73]"
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
        <div className="royals-card royals-card-hover p-6 sm:p-7 rounded-3xl border-t-4 border-t-[#E5008A] space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-black text-[#E5008A] dark:text-[#FF4FAF] uppercase tracking-wider">
                Rank #{p1.rank} &middot; {role.toUpperCase()}
              </span>
              <h3 className="text-2xl font-black text-[#23142E] dark:text-white tracking-tight mt-0.5">
                {p1.player_name}
              </h3>
              <p className="text-xs text-[#71677B] dark:text-[#C5B4CE] font-medium">{p1.teams}</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-[#E5008A] dark:text-[#FF4FAF] font-mono-num">
                {p1.reliability_score.toFixed(1)}
              </span>
              <span className="text-[11px] text-[#71677B] dark:text-[#C5B4CE] block font-mono-num font-medium">
                CI: [{p1.ci_lower.toFixed(1)}, {p1.ci_upper.toFixed(1)}]
              </span>
            </div>
          </div>
          <Badge label={p1.archetype} variant="pink" />
          <ConfidenceIntervalBar
            score={p1.reliability_score}
            ciLower={p1.ci_lower}
            ciUpper={p1.ci_upper}
            showLabels={false}
          />
          <div className="space-y-1.5 pt-2">
            {p1.key_strengths.map((str: string, i: number) => (
              <div key={i} className="text-xs text-[#23142E] dark:text-[#E2D9E7] font-semibold flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E5008A] mt-1.5 flex-shrink-0" />
                <span>{str}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Player 2 Card */}
        <div className="royals-card royals-card-hover p-6 sm:p-7 rounded-3xl border-t-4 border-t-[#650D73] space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-black text-[#650D73] dark:text-purple-300 uppercase tracking-wider">
                Rank #{p2.rank} &middot; {role.toUpperCase()}
              </span>
              <h3 className="text-2xl font-black text-[#23142E] dark:text-white tracking-tight mt-0.5">
                {p2.player_name}
              </h3>
              <p className="text-xs text-[#71677B] dark:text-[#C5B4CE] font-medium">{p2.teams}</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-[#650D73] dark:text-purple-300 font-mono-num">
                {p2.reliability_score.toFixed(1)}
              </span>
              <span className="text-[11px] text-[#71677B] dark:text-[#C5B4CE] block font-mono-num font-medium">
                CI: [{p2.ci_lower.toFixed(1)}, {p2.ci_upper.toFixed(1)}]
              </span>
            </div>
          </div>
          <Badge label={p2.archetype} variant="purple" />
          <ConfidenceIntervalBar
            score={p2.reliability_score}
            ciLower={p2.ci_lower}
            ciUpper={p2.ci_upper}
            showLabels={false}
          />
          <div className="space-y-1.5 pt-2">
            {p2.key_strengths.map((str: string, i: number) => (
              <div key={i} className="text-xs text-[#23142E] dark:text-[#E2D9E7] font-semibold flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#650D73] dark:bg-purple-400 mt-1.5 flex-shrink-0" />
                <span>{str}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Head-to-Head Skill Radar Chart */}
      <section className="royals-card p-6 sm:p-8 rounded-3xl">
        <div className="mb-4">
          <h3 className="text-lg font-black text-[#23142E] dark:text-white tracking-tight flex items-center gap-2">
            <Crown className="w-5 h-5 text-[#E5008A]" />
            5-Dimensional Skill Profile Overlay
          </h3>
          <p className="text-xs text-[#71677B] dark:text-[#C5B4CE] font-medium">
            Standardized 0-100 radar comparison across core clutch capabilities (Pink vs Purple)
          </p>
        </div>

        <div className="h-80 w-full">
          <RadarChartWrapper
            player1Name={p1.player_name}
            player1Data={p1.radar}
            player1Color="#E5008A"
            player2Name={p2.player_name}
            player2Data={p2.radar}
            player2Color="#650D73"
            type={role}
            height={320}
          />
        </div>
      </section>

      {/* Detailed Metrics Comparison Table */}
      <section className="royals-card rounded-3xl overflow-hidden">
        <div className="p-5 sm:p-6 bg-[#FFF1F8] dark:bg-[#2C0F3C] border-b border-[#F1DCE9] dark:border-[#673A70]">
          <h3 className="text-base font-black text-[#23142E] dark:text-white tracking-tight">
            Statistical Head-to-Head Breakdown
          </h3>
          <p className="text-xs text-[#71677B] dark:text-[#C5B4CE] font-medium">
            Comparing pre-ball context efficiency, baseline improvement, and sample reliability
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono-num">
            <thead className="bg-[#FFF1F8] dark:bg-[#2C0F3C] text-[#650D73] dark:text-purple-300 uppercase text-[11px] font-bold border-b border-[#F1DCE9] dark:border-[#673A70]">
              <tr>
                <th className="py-3.5 px-6 font-sans">Performance Metric</th>
                <th className="py-3.5 px-6 text-[#E5008A] dark:text-[#FF4FAF] font-black">{p1.player_name}</th>
                <th className="py-3.5 px-6 text-[#650D73] dark:text-purple-300 font-black">{p2.player_name}</th>
                <th className="py-3.5 px-6 font-sans">Statistical Edge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1DCE9] dark:divide-[#673A70] text-xs">
              {/* Reliability Score */}
              <tr className="hover:bg-[#FFF5FA] dark:hover:bg-[#431454] transition-colors">
                <td className="py-3.5 px-6 font-sans text-[#23142E] dark:text-white font-bold">
                  Reliability Score
                </td>
                <td className="py-3.5 px-6 font-black text-[#E5008A] dark:text-[#FF4FAF]">
                  {p1.reliability_score.toFixed(1)}
                </td>
                <td className="py-3.5 px-6 font-black text-[#650D73] dark:text-purple-300">
                  {p2.reliability_score.toFixed(1)}
                </td>
                <td className="py-3.5 px-6 font-sans font-bold">
                  {p1.reliability_score > p2.reliability_score ? (
                    <span className="text-[#E5008A] dark:text-[#FF4FAF]">
                      {p1.player_name} (+{(p1.reliability_score - p2.reliability_score).toFixed(1)})
                    </span>
                  ) : (
                    <span className="text-[#650D73] dark:text-purple-300">
                      {p2.player_name} (+{(p2.reliability_score - p1.reliability_score).toFixed(1)})
                    </span>
                  )}
                </td>
              </tr>

              {/* Batting Specific Metrics */}
              {isBatter && batter1 && batter2 && (
                <>
                  <tr className="hover:bg-[#FFF5FA] dark:hover:bg-[#431454] transition-colors">
                    <td className="py-3.5 px-6 font-sans text-[#23142E] dark:text-white font-medium">Pressure Strike Rate</td>
                    <td className="py-3.5 px-6 font-bold">{batter1.sr_pressure.toFixed(1)}</td>
                    <td className="py-3.5 px-6 font-bold">{batter2.sr_pressure.toFixed(1)}</td>
                    <td className="py-3.5 px-6 font-sans font-bold">
                      {batter1.sr_pressure > batter2.sr_pressure ? (
                        <span className="text-[#E5008A] dark:text-[#FF4FAF]">{p1.player_name} (+{(batter1.sr_pressure - batter2.sr_pressure).toFixed(1)})</span>
                      ) : (
                        <span className="text-[#650D73] dark:text-purple-300">{p2.player_name} (+{(batter2.sr_pressure - batter1.sr_pressure).toFixed(1)})</span>
                      )}
                    </td>
                  </tr>
                  <tr className="hover:bg-[#FFF5FA] dark:hover:bg-[#431454] transition-colors">
                    <td className="py-3.5 px-6 font-sans text-[#23142E] dark:text-white font-medium">Strike Rate Delta (vs Baseline)</td>
                    <td className="py-3.5 px-6 font-bold">{batter1.delta_sr >= 0 ? `+${batter1.delta_sr.toFixed(1)}` : batter1.delta_sr.toFixed(1)}</td>
                    <td className="py-3.5 px-6 font-bold">{batter2.delta_sr >= 0 ? `+${batter2.delta_sr.toFixed(1)}` : batter2.delta_sr.toFixed(1)}</td>
                    <td className="py-3.5 px-6 font-sans font-bold">
                      {batter1.delta_sr > batter2.delta_sr ? (
                        <span className="text-[#E5008A] dark:text-[#FF4FAF]">{p1.player_name}</span>
                      ) : (
                        <span className="text-[#650D73] dark:text-purple-300">{p2.player_name}</span>
                      )}
                    </td>
                  </tr>
                  <tr className="hover:bg-[#FFF5FA] dark:hover:bg-[#431454] transition-colors">
                    <td className="py-3.5 px-6 font-sans text-[#23142E] dark:text-white font-medium">Context Runs Added / 100b</td>
                    <td className="py-3.5 px-6 text-[#E5008A] dark:text-[#FF4FAF] font-black">+{batter1.runs_added_per_100.toFixed(1)}</td>
                    <td className="py-3.5 px-6 text-[#650D73] dark:text-purple-300 font-black">+{batter2.runs_added_per_100.toFixed(1)}</td>
                    <td className="py-3.5 px-6 font-sans font-bold">
                      {batter1.runs_added_per_100 > batter2.runs_added_per_100 ? (
                        <span className="text-[#E5008A] dark:text-[#FF4FAF]">{p1.player_name}</span>
                      ) : (
                        <span className="text-[#650D73] dark:text-purple-300">{p2.player_name}</span>
                      )}
                    </td>
                  </tr>
                  <tr className="hover:bg-[#FFF5FA] dark:hover:bg-[#431454] transition-colors">
                    <td className="py-3.5 px-6 font-sans text-[#23142E] dark:text-white font-medium">Boundary Execution %</td>
                    <td className="py-3.5 px-6 font-bold">{batter1.boundary_pct.toFixed(1)}%</td>
                    <td className="py-3.5 px-6 font-bold">{batter2.boundary_pct.toFixed(1)}%</td>
                    <td className="py-3.5 px-6 font-sans font-bold">
                      {batter1.boundary_pct > batter2.boundary_pct ? (
                        <span className="text-[#E5008A] dark:text-[#FF4FAF]">{p1.player_name}</span>
                      ) : (
                        <span className="text-[#650D73] dark:text-purple-300">{p2.player_name}</span>
                      )}
                    </td>
                  </tr>
                  <tr className="hover:bg-[#FFF5FA] dark:hover:bg-[#431454] transition-colors">
                    <td className="py-3.5 px-6 font-sans text-[#23142E] dark:text-white font-medium">Dot Ball % (Lower is better)</td>
                    <td className="py-3.5 px-6 font-bold">{batter1.dot_pct.toFixed(1)}%</td>
                    <td className="py-3.5 px-6 font-bold">{batter2.dot_pct.toFixed(1)}%</td>
                    <td className="py-3.5 px-6 font-sans font-bold">
                      {batter1.dot_pct < batter2.dot_pct ? (
                        <span className="text-[#E5008A] dark:text-[#FF4FAF]">{p1.player_name} (fewer dots)</span>
                      ) : (
                        <span className="text-[#650D73] dark:text-purple-300">{p2.player_name} (fewer dots)</span>
                      )}
                    </td>
                  </tr>
                  <tr className="hover:bg-[#FFF5FA] dark:hover:bg-[#431454] transition-colors">
                    <td className="py-3.5 px-6 font-sans text-[#23142E] dark:text-white font-medium">Pressure Balls (Volume)</td>
                    <td className="py-3.5 px-6 font-bold">{batter1.pressure_balls}</td>
                    <td className="py-3.5 px-6 font-bold">{batter2.pressure_balls}</td>
                    <td className="py-3.5 px-6 font-sans font-bold">
                      {batter1.pressure_balls > batter2.pressure_balls ? (
                        <span className="text-[#E5008A] dark:text-[#FF4FAF]">{p1.player_name} (more volume)</span>
                      ) : (
                        <span className="text-[#650D73] dark:text-purple-300">{p2.player_name} (more volume)</span>
                      )}
                    </td>
                  </tr>
                </>
              )}

              {/* Bowling Specific Metrics */}
              {!isBatter && bowler1 && bowler2 && (
                <>
                  <tr className="hover:bg-[#FFF5FA] dark:hover:bg-[#431454] transition-colors">
                    <td className="py-3.5 px-6 font-sans text-[#23142E] dark:text-white font-medium">Pressure Economy (Lower is better)</td>
                    <td className="py-3.5 px-6 font-bold">{bowler1.econ_pressure.toFixed(2)}</td>
                    <td className="py-3.5 px-6 font-bold">{bowler2.econ_pressure.toFixed(2)}</td>
                    <td className="py-3.5 px-6 font-sans font-bold">
                      {bowler1.econ_pressure < bowler2.econ_pressure ? (
                        <span className="text-[#E5008A] dark:text-[#FF4FAF]">{p1.player_name}</span>
                      ) : (
                        <span className="text-[#650D73] dark:text-purple-300">{p2.player_name}</span>
                      )}
                    </td>
                  </tr>
                  <tr className="hover:bg-[#FFF5FA] dark:hover:bg-[#431454] transition-colors">
                    <td className="py-3.5 px-6 font-sans text-[#23142E] dark:text-white font-medium">Economy Delta (&Delta;Econ)</td>
                    <td className="py-3.5 px-6 font-bold">{bowler1.delta_econ.toFixed(2)}</td>
                    <td className="py-3.5 px-6 font-bold">{bowler2.delta_econ.toFixed(2)}</td>
                    <td className="py-3.5 px-6 font-sans font-bold">
                      {bowler1.delta_econ < bowler2.delta_econ ? (
                        <span className="text-[#E5008A] dark:text-[#FF4FAF]">{p1.player_name}</span>
                      ) : (
                        <span className="text-[#650D73] dark:text-purple-300">{p2.player_name}</span>
                      )}
                    </td>
                  </tr>
                  <tr className="hover:bg-[#FFF5FA] dark:hover:bg-[#431454] transition-colors">
                    <td className="py-3.5 px-6 font-sans text-[#23142E] dark:text-white font-medium">Context Runs Prevented / 6b</td>
                    <td className="py-3.5 px-6 text-[#E5008A] dark:text-[#FF4FAF] font-black">+{bowler1.runs_prevented_per_6.toFixed(2)}</td>
                    <td className="py-3.5 px-6 text-[#650D73] dark:text-purple-300 font-black">+{bowler2.runs_prevented_per_6.toFixed(2)}</td>
                    <td className="py-3.5 px-6 font-sans font-bold">
                      {bowler1.runs_prevented_per_6 > bowler2.runs_prevented_per_6 ? (
                        <span className="text-[#E5008A] dark:text-[#FF4FAF]">{p1.player_name}</span>
                      ) : (
                        <span className="text-[#650D73] dark:text-purple-300">{p2.player_name}</span>
                      )}
                    </td>
                  </tr>
                  <tr className="hover:bg-[#FFF5FA] dark:hover:bg-[#431454] transition-colors">
                    <td className="py-3.5 px-6 font-sans text-[#23142E] dark:text-white font-medium">Dot Ball %</td>
                    <td className="py-3.5 px-6 font-bold">{bowler1.dot_pct.toFixed(1)}%</td>
                    <td className="py-3.5 px-6 font-bold">{bowler2.dot_pct.toFixed(1)}%</td>
                    <td className="py-3.5 px-6 font-sans font-bold">
                      {bowler1.dot_pct > bowler2.dot_pct ? (
                        <span className="text-[#E5008A] dark:text-[#FF4FAF]">{p1.player_name}</span>
                      ) : (
                        <span className="text-[#650D73] dark:text-purple-300">{p2.player_name}</span>
                      )}
                    </td>
                  </tr>
                  <tr className="hover:bg-[#FFF5FA] dark:hover:bg-[#431454] transition-colors">
                    <td className="py-3.5 px-6 font-sans text-[#23142E] dark:text-white font-medium">Pressure Wickets</td>
                    <td className="py-3.5 px-6 font-bold">{bowler1.pressure_wickets} wkts</td>
                    <td className="py-3.5 px-6 font-bold">{bowler2.pressure_wickets} wkts</td>
                    <td className="py-3.5 px-6 font-sans font-bold">
                      {bowler1.pressure_wickets > bowler2.pressure_wickets ? (
                        <span className="text-[#E5008A] dark:text-[#FF4FAF]">{p1.player_name}</span>
                      ) : (
                        <span className="text-[#650D73] dark:text-purple-300">{p2.player_name}</span>
                      )}
                    </td>
                  </tr>
                  <tr className="hover:bg-[#FFF5FA] dark:hover:bg-[#431454] transition-colors">
                    <td className="py-3.5 px-6 font-sans text-[#23142E] dark:text-white font-medium">Wicket Strike Rate</td>
                    <td className="py-3.5 px-6 font-bold">{bowler1.wicket_sr.toFixed(1)}</td>
                    <td className="py-3.5 px-6 font-bold">{bowler2.wicket_sr.toFixed(1)}</td>
                    <td className="py-3.5 px-6 font-sans font-bold">
                      {bowler1.wicket_sr < bowler2.wicket_sr ? (
                        <span className="text-[#E5008A] dark:text-[#FF4FAF]">{p1.player_name} (more frequent)</span>
                      ) : (
                        <span className="text-[#650D73] dark:text-purple-300">{p2.player_name} (more frequent)</span>
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
