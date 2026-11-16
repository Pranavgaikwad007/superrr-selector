import React from 'react';

interface BadgeProps {
  label: string;
  variant?: 'emerald' | 'amber' | 'rose' | 'blue' | 'slate' | 'extreme' | 'high' | 'medium' | 'ordinary';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'slate', size = 'sm' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  const variantMap: Record<string, string> = {
    emerald: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    amber: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    rose: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    blue: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    slate: 'bg-slate-800/80 text-slate-300 border-slate-700',
    extreme: 'bg-rose-500/15 text-rose-400 border-rose-500/30 font-semibold',
    high: 'bg-amber-500/15 text-amber-400 border-amber-500/30 font-semibold',
    medium: 'bg-blue-500/15 text-blue-400 border-blue-500/30 font-semibold',
    ordinary: 'bg-slate-800/60 text-slate-400 border-slate-700/80',
  };

  const selectedClass = variantMap[variant.toLowerCase()] || variantMap.slate;

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${sizeClasses} ${selectedClass}`}
    >
      {label}
    </span>
  );
};
