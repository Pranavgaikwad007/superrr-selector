import React from 'react';
import { BatterRecord, BowlerRecord } from '../../types';
import { X, Award, Shield, CheckCircle2, TrendingUp, Zap, Target, Crown } from 'lucide-react';
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#260C35]/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-[#3A174A] border border-[#F1DCE9] dark:border-[#673A70] rounded-3xl shadow-royals-lg overflow-hidden max-h-[90vh] flex flex-col text-[#23142E] dark:text-white transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header banner */}
        <div className="relative p-6 bg-gradient-to-r from-[#E5008A] via-[#C90079] to-[#650D73] text-white border-b border-white/20 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-xl font-black text-white shadow-lg">
              #{player.rank}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {player.player_name}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white border border-white/30">
                  {player.archetype}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-white/80 mt-0.5 font-medium">{player.teams}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white rounded-xl hover:bg-white/20 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Reliability Score & CI Card */}
          <div className="p-4 rounded-2xl bg-[#FFF1F8] dark:bg-[#2C0F3C] border border-[#F1DCE9] dark:border-[#673A70]">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#71677B] dark:text-[#C5B4CE] font-bold block">
                  Bayesian Reliability Score
                </span>
                <span className="text-2xl font-black text-[#E5008A] dark:text-[#FF4FAF] font-mono-num">
                  {player.reliability_score.toFixed(1)}{' '}
                  <span className="text-xs text-[#71677B] dark:text-[#C5B4CE] font-normal">/ 100</span>
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#71677B] dark:text-[#C5B4CE] block font-medium">95% Bootstrap Range</span>
                <span className="text-sm font-bold text-[#650D73] dark:text-[#E2D9E7] font-mono-num">
                  [{player.ci_lower.toFixed(1)} &ndash; {player.ci_upper.toFixed(1)}]
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

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {isBatter && batter && (
              <>
                <div className="p-3 rounded-2xl bg-white dark:bg-[#3A174A] border border-[#F1DCE9] dark:border-[#673A70] text-center shadow-royals-sm">
                  <span className="text-[11px] text-[#71677B] dark:text-[#C5B4CE] block font-semibold">Pressure SR</span>
                  <span className="text-base font-black text-[#E5008A] dark:text-[#FF4FAF] font-mono-num">
                    {batter.sr_pressure.toFixed(1)}
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-bold">
                    {batter.delta_sr >= 0 ? `+${batter.delta_sr.toFixed(1)}` : batter.delta_sr.toFixed(1)} &Delta;
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-white dark:bg-[#3A174A] border border-[#F1DCE9] dark:border-[#673A70] text-center shadow-royals-sm">
                  <span className="text-[11px] text-[#71677B] dark:text-[#C5B4CE] block font-semibold">Runs Added / 100</span>
                  <span className="text-base font-black text-[#650D73] dark:text-purple-300 font-mono-num">
                    +{batter.runs_added_per_100.toFixed(1)}
                  </span>
                  <span className="text-[10px] text-[#71677B] dark:text-[#C5B4CE] block font-medium">vs context par</span>
                </div>
                <div className="p-3 rounded-2xl bg-white dark:bg-[#3A174A] border border-[#F1DCE9] dark:border-[#673A70] text-center shadow-royals-sm">
                  <span className="text-[11px] text-[#71677B] dark:text-[#C5B4CE] block font-semibold">Boundary %</span>
                  <span className="text-base font-black text-amber-600 dark:text-amber-400 font-mono-num">
                    {batter.boundary_pct.toFixed(1)}%
                  </span>
                  <span className="text-[10px] text-[#71677B] dark:text-[#C5B4CE] block font-medium">Dot: {batter.dot_pct.toFixed(1)}%</span>
                </div>
                <div className="p-3 rounded-2xl bg-white dark:bg-[#3A174A] border border-[#F1DCE9] dark:border-[#673A70] text-center shadow-royals-sm">
                  <span className="text-[11px] text-[#71677B] dark:text-[#C5B4CE] block font-semibold">Consistency</span>
                  <span className="text-base font-black text-[#E5008A] dark:text-[#FF4FAF] font-mono-num">
                    {batter.consistency_pct.toFixed(1)}%
                  </span>
                  <span className="text-[10px] text-[#71677B] dark:text-[#C5B4CE] block font-medium">Positive matches</span>
                </div>
              </>
            )}

            {!isBatter && bowler && (
              <>
                <div className="p-3 rounded-2xl bg-white dark:bg-[#3A174A] border border-[#F1DCE9] dark:border-[#673A70] text-center shadow-royals-sm">
                  <span className="text-[11px] text-[#71677B] dark:text-[#C5B4CE] block font-semibold">Pressure Econ</span>
                  <span className="text-base font-black text-[#E5008A] dark:text-[#FF4FAF] font-mono-num">
                    {bowler.econ_pressure.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-bold">
                    {bowler.delta_econ <= 0 ? `${bowler.delta_econ.toFixed(2)}` : `+${bowler.delta_econ.toFixed(2)}`} &Delta;
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-white dark:bg-[#3A174A] border border-[#F1DCE9] dark:border-[#673A70] text-center shadow-royals-sm">
                  <span className="text-[11px] text-[#71677B] dark:text-[#C5B4CE] block font-semibold">Runs Saved / 6</span>
                  <span className="text-base font-black text-[#650D73] dark:text-purple-300 font-mono-num">
                    +{bowler.runs_prevented_per_6.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-[#71677B] dark:text-[#C5B4CE] block font-medium">per clutch over</span>
                </div>
                <div className="p-3 rounded-2xl bg-white dark:bg-[#3A174A] border border-[#F1DCE9] dark:border-[#673A70] text-center shadow-royals-sm">
                  <span className="text-[11px] text-[#71677B] dark:text-[#C5B4CE] block font-semibold">Dot %</span>
                  <span className="text-base font-black text-sky-600 dark:text-sky-400 font-mono-num">
                    {bowler.dot_pct.toFixed(1)}%
                  </span>
                  <span className="text-[10px] text-[#71677B] dark:text-[#C5B4CE] block font-medium">Bnd: {bowler.boundary_pct.toFixed(1)}%</span>
                </div>
                <div className="p-3 rounded-2xl bg-white dark:bg-[#3A174A] border border-[#F1DCE9] dark:border-[#673A70] text-center shadow-royals-sm">
                  <span className="text-[11px] text-[#71677B] dark:text-[#C5B4CE] block font-semibold">Wicket SR</span>
                  <span className="text-base font-black text-[#E5008A] dark:text-[#FF4FAF] font-mono-num">
                    {bowler.wicket_sr.toFixed(1)}
                  </span>
                  <span className="text-[10px] text-[#71677B] dark:text-[#C5B4CE] block font-medium">balls / wkt</span>
                </div>
              </>
            )}
          </div>

          {/* 5-Axis Clutch Radar Profile */}
          <div className="p-5 rounded-2xl bg-[#FFF1F8]/60 dark:bg-[#2C0F3C]/60 border border-[#F1DCE9] dark:border-[#673A70]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#650D73] dark:text-purple-300 mb-3 flex items-center gap-2">
              <Crown className="w-4 h-4 text-[#E5008A]" />
              5-Axis Clutch Radar Profile
            </h4>
            <RadarChartWrapper
              player1Name={player.player_name}
              player1Data={player.radar}
              player1Color="#E5008A"
              type={type}
              height={260}
            />
          </div>

          {/* Key Tactical Strengths */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#650D73] dark:text-purple-300">
              Key Tactical Strengths
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {player.key_strengths.map((str, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-white dark:bg-[#3A174A] border border-[#F1DCE9] dark:border-[#673A70] text-xs font-semibold text-[#23142E] dark:text-white shadow-royals-sm"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#E5008A] dark:text-[#FF4FAF] flex-shrink-0" />
                  <span>{str}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
