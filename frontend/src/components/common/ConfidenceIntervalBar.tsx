import React from 'react';

interface ConfidenceIntervalBarProps {
  score: number;
  ciLower: number;
  ciUpper: number;
  minScale?: number;
  maxScale?: number;
  showLabels?: boolean;
  compact?: boolean;
}

export const ConfidenceIntervalBar: React.FC<ConfidenceIntervalBarProps> = ({
  score,
  ciLower,
  ciUpper,
  minScale = 20,
  maxScale = 100,
  showLabels = true,
  compact = false,
}) => {
  // Normalize percentage within [minScale, maxScale]
  const range = maxScale - minScale;
  const toPercent = (val: number) => {
    const clamped = Math.min(Math.max(val, minScale), maxScale);
    return ((clamped - minScale) / range) * 100;
  };

  const leftPercent = toPercent(ciLower);
  const rightPercent = toPercent(ciUpper);
  const scorePercent = toPercent(score);
  const widthPercent = Math.max(rightPercent - leftPercent, 2);
  const baseline50Percent = toPercent(50);

  return (
    <div className={`w-full ${compact ? 'py-1' : 'py-2'}`}>
      {showLabels && (
        <div className="flex items-center justify-between text-[11px] mb-1 font-mono-num">
          <span className="text-slate-400">
            95% CI: [{ciLower.toFixed(1)}, {ciUpper.toFixed(1)}]
          </span>
          <span className="text-emerald-400 font-bold">{score.toFixed(1)}</span>
        </div>
      )}

      {/* Bar container */}
      <div className="relative w-full h-3 bg-slate-900/90 rounded-full border border-slate-800 overflow-hidden">
        {/* Baseline marker at 50 (Replacement level) */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-slate-700 z-10"
          style={{ left: `${baseline50Percent}%` }}
          title="Baseline Prior (50.0)"
        />

        {/* 95% CI Range Bar */}
        <div
          className="absolute top-0.5 bottom-0.5 rounded-full bg-emerald-500/25 border-x border-emerald-400/60"
          style={{
            left: `${leftPercent}%`,
            width: `${widthPercent}%`,
          }}
        />

        {/* Point Estimate Marker */}
        <div
          className="absolute top-0 bottom-0 w-2 -ml-1 rounded-full bg-emerald-400 shadow-md shadow-emerald-400/50 z-20"
          style={{ left: `${scorePercent}%` }}
        />
      </div>

      {!compact && (
        <div className="flex justify-between text-[9px] text-slate-500 mt-1 font-mono-num">
          <span>{minScale}</span>
          <span>50 (Prior)</span>
          <span>{maxScale}</span>
        </div>
      )}
    </div>
  );
};
