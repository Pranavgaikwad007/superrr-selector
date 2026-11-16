import React from 'react';

interface BadgeProps {
  label: string;
  variant?:
    | 'pink'
    | 'purple'
    | 'gold'
    | 'blue'
    | 'slate'
    | 'emerald'
    | 'extreme'
    | 'high'
    | 'medium'
    | 'ordinary';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'pink', size = 'sm' }) => {
  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-[11px]' : 'px-3 py-1 text-xs';

  const variantMap: Record<string, string> = {
    // Royals Pink
    pink: 'bg-[#FFF1F8] text-[#E5008A] border-[#F1DCE9] dark:bg-[#E5008A]/20 dark:text-[#FF4FAF] dark:border-[#FF4FAF]/30 font-semibold',
    // Royals Deep Purple
    purple: 'bg-[#650D73]/10 text-[#650D73] border-[#650D73]/20 dark:bg-[#650D73]/40 dark:text-[#E2D9E7] dark:border-[#673A70] font-semibold',
    // Gold / Amber
    gold: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800 font-semibold',
    // Sky / Royal Blue
    blue: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800 font-semibold',
    // Muted Slate
    slate: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-[#2C0F3C] dark:text-[#C5B4CE] dark:border-[#673A70]',
    // Emerald Green
    emerald: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 font-semibold',
    // 4 Distinguishable Pressure Tiers
    extreme: 'bg-[#FFF1F8] text-[#E5008A] border-[#E5008A]/30 dark:bg-[#E5008A]/25 dark:text-[#FF4FAF] dark:border-[#FF4FAF]/40 font-bold',
    high: 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-700 font-bold',
    medium: 'bg-sky-50 text-sky-700 border-sky-300 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-700 font-bold',
    ordinary: 'bg-slate-100 text-slate-600 border-slate-300 dark:bg-[#2C0F3C] dark:text-[#C5B4CE] dark:border-[#673A70] font-medium',
  };

  const selectedClass = variantMap[variant.toLowerCase()] || variantMap.pink;

  return (
    <span
      className={`inline-flex items-center rounded-full border transition-colors ${sizeClasses} ${selectedClass}`}
    >
      {label}
    </span>
  );
};
