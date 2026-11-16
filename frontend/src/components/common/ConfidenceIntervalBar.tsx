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
          <span className="text-[#71677B] dark:text-[#C5B4CE] font-medium">
            95% CI: [{ciLower.toFixed(1)}, {ciUpper.toFixed(1)}]
          </span>
          <span className="text-[#E5008A] dark:text-[#FF4FAF] font-black text-xs">
            {score.toFixed(1)} <span className="text-[10px] text-[#71677B] dark:text-[#C5B4CE] font-normal">/ 100</span>
          </span>
        </div>
      )}

      {/* Bar container */}
      <div className="relative w-full h-3 bg-[#FFF1F8] dark:bg-[#2C0F3C] rounded-full border border-[#F1DCE9] dark:border-[#673A70] overflow-hidden">
        {/* Baseline marker at 50 (Replacement level) */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-slate-300 dark:bg-slate-600 z-10"
          style={{ left: `${baseline50Percent}%` }}
          title="Baseline Prior (50.0)"
        />

        {/* 95% CI Range Bar */}
        <div
          className="absolute top-0.5 bottom-0.5 rounded-full bg-gradient-to-r from-[#E5008A]/30 via-[#C90079]/30 to-[#650D73]/30 dark:from-[#FF4FAF]/30 dark:to-[#650D73]/50 border-x-2 border-[#E5008A] dark:border-[#FF4FAF]"
          style={{
            left: `${leftPercent}%`,
            width: `${widthPercent}%`,
          }}
          title={`95% CI: [${ciLower.toFixed(1)}, ${ciUpper.toFixed(1)}]`}
        />

        {/* Point Estimate Dot */}
        <div
          className="absolute top-0 bottom-0 w-2 h-2 -mt-0.5 -ml-1 rounded-full bg-[#E5008A] dark:bg-[#FF4FAF] ring-2 ring-white dark:ring-[#3A174A] shadow-md z-20"
          style={{ left: `${scorePercent}%`, top: '50%', transform: 'translateY(-50%)' }}
          title={`Bayesian Score: ${score.toFixed(1)}`}
        />
      </div>

      {!compact && showLabels && (
        <div className="flex justify-between text-[9px] text-[#71677B] dark:text-[#C5B4CE] mt-1 font-mono-num px-0.5">
          <span>{minScale}</span>
          <span className="text-slate-400 dark:text-slate-500">50 (Par)</span>
          <span>{maxScale}</span>
        </div>
      )}
    </div>
  );
};
