import React from 'react';
import { BatterRecord, BowlerRecord } from '../../types';
import { X, Award, Shield, CheckCircle2, TrendingUp, Zap, Target } from 'lucide-react';
import { ConfidenceIntervalBar } from './ConfidenceIntervalBar';
import { RadarChartWrapper } from './RadarChartWrapper';
import { Badge } from './Badge';

interface PlayerDetailModalProps {
  player: BatterRecord | BowlerRecord | null;
  type: 'batter' | 'bowler';
  onClose: () => void;
}

export const PlayerDetailModal: React.FC<PlayerDetailModalProps> = ({
  player,
  type,
  onClose,
}) => {
  if (!player) return null;

  const isBatter = type === 'batter';
  const batter = isBatter ? (player as BatterRecord) : null;
  const bowler = !isBatter ? (player as BowlerRecord) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-[#0F172A] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header banner */}
        <div className="relative p-6 bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/40 border-b border-slate-800 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 flex items-center justify-center text-xl font-extrabold text-white shadow-lg">
              #{player.rank}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {player.player_name}
                </h3>
                <Badge label={player.archetype} variant="emerald" />
              </div>
              <p className="text-sm text-slate-400 mt-0.5">{player.teams}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Reliability Score & CI Card */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  Bayesian Reliability Score
                </span>
                <p className="text-xs text-slate-500">
                  Prior Mean: 50.0 &middot; Shrinkage: n/(n + 100)
                </p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-extrabold text-emerald-400 font-mono-num">
                  {player.reliability_score.toFixed(1)}
                </span>
                <span className="text-xs text-slate-400 block font-mono-num">
                  95% CI: [{player.ci_lower.toFixed(1)}, {player.ci_upper.toFixed(1)}]
                </span>
              </div>
            </div>
            <ConfidenceIntervalBar
              score={player.reliability_score}
              ciLower={player.ci_lower}
              ciUpper={player.ci_upper}
              showLabels={false}
            />
          </div>

          {/* Key Strengths */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Key Analytical Strengths
            </h4>
            <div className="space-y-2">
              {player.key_strengths.map((str, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                  <span>{str}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Comparison Grid */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              Pressure vs Career Performance
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              {isBatter && batter && (
                <>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Pressure SR</span>
                    <span className="text-base font-bold text-white font-mono-num">
                      {batter.sr_pressure.toFixed(1)}
                    </span>
                    <span className="text-[10px] text-emerald-400 block">
                      {batter.delta_sr >= 0 ? `+${batter.delta_sr.toFixed(1)}` : batter.delta_sr.toFixed(1)} vs normal
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Runs Added / 100b</span>
                    <span className="text-base font-bold text-emerald-400 font-mono-num">
                      +{batter.runs_added_per_100.toFixed(1)}
                    </span>
                    <span className="text-[10px] text-slate-400 block">vs context exp.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Boundary %</span>
                    <span className="text-base font-bold text-white font-mono-num">
                      {batter.boundary_pct.toFixed(1)}%
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      Dot: {batter.dot_pct.toFixed(1)}%
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Pressure Balls</span>
                    <span className="text-base font-bold text-white font-mono-num">
                      {batter.pressure_balls}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {batter.pressure_matches} matches
                    </span>
                  </div>
                </>
              )}

              {!isBatter && bowler && (
                <>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Pressure Econ</span>
                    <span className="text-base font-bold text-white font-mono-num">
                      {bowler.econ_pressure.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-emerald-400 block">
                      {bowler.delta_econ.toFixed(2)} vs normal
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Runs Prevented / 6b</span>
                    <span className="text-base font-bold text-emerald-400 font-mono-num">
                      +{bowler.runs_prevented_per_6.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-slate-400 block">vs context exp.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Wickets & SR</span>
                    <span className="text-base font-bold text-white font-mono-num">
                      {bowler.pressure_wickets} wkts
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      SR: {bowler.wicket_sr.toFixed(1)}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Pressure Overs</span>
                    <span className="text-base font-bold text-white font-mono-num">
                      {bowler.pressure_overs} ov
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      Dot: {bowler.dot_pct.toFixed(1)}%
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Radar Chart */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2 flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-400" />
              Pressure Skill Profile (0-100 Benchmark)
            </h4>
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <RadarChartWrapper
                player1Name={player.player_name}
                player1Data={player.radar}
                type={type}
                height={260}
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
