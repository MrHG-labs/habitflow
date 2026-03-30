'use client';

import EvolutiveTree from './EvolutiveTree';
import { useI18nStore } from '@/stores/i18nStore';

interface LevelBadgeProps {
  level: number;
  xp: number;
  compact?: boolean;
}

const LEVEL_METADATA: Record<number, { color: string; gradient: string }> = {
  1:  { color: 'bg-green-50 text-green-700 dark:bg-green-900/10 dark:text-green-300', gradient: 'from-green-100 to-green-200' },
  2:  { color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200', gradient: 'from-green-200 to-green-300' },
  3:  { color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200', gradient: 'from-emerald-200 to-emerald-300' },
  4:  { color: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-200', gradient: 'from-teal-200 to-teal-300' },
  5:  { color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-200', gradient: 'from-cyan-200 to-cyan-300' },
  6:  { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200', gradient: 'from-blue-200 to-blue-300' },
  7:  { color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200', gradient: 'from-indigo-200 to-indigo-300' },
  8:  { color: 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-200', gradient: 'from-violet-200 to-violet-300' },
  9:  { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200', gradient: 'from-purple-200 to-purple-300' },
  10: { color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200', gradient: 'from-amber-200 to-amber-300' },
};

export default function LevelBadge({ level, xp, compact = false }: LevelBadgeProps) {
  const { t } = useI18nStore();
  const meta = LEVEL_METADATA[level] ?? LEVEL_METADATA[10];
  const translatedLabel = t(`levels.${level}` as any) || t('levels.10');

  if (compact) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 shadow-sm border border-black/5 dark:border-white/5 hover:scale-105 ${meta.color}`}>
        <EvolutiveTree level={level} size={18} />
        Lv.{level}
      </span>
    );
  }

  return (
    <div className={`inline-flex items-center gap-3.5 px-6 py-3 rounded-2xl font-bold transition-all duration-500 shadow-lg group hover:shadow-xl hover:scale-105 relative overflow-hidden backdrop-blur-md border border-white/20 dark:border-white/5 ${meta.color}`}>
      <EvolutiveTree level={level} size={48} className="transition-transform group-hover:scale-110 duration-500" />
      <div className="flex flex-col sm:items-baseline sm:gap-2">
        <span className="text-sm font-black tracking-tight">{t('dashboard.yourLevel')}: <span className="text-base text-app-primary">{translatedLabel}</span></span>
        <div className="flex items-center gap-2">
           <span className="text-xs opacity-60">Lv.{level}</span>
           <span className="text-[11px] uppercase tracking-wider opacity-50 font-black">· {xp} XP</span>
        </div>
      </div>
      {/* Shine effect on hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.8) 50%, transparent 60%)`,
          backgroundSize: '200% 200%',
          animation: 'shimmer 2s ease-in-out infinite',
        }}
      />
    </div>
  );
}
