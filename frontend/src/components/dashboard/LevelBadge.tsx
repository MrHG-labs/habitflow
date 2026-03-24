'use client';

import { useI18nStore } from '@/stores/i18nStore';

interface LevelBadgeProps {
  level: number;
  xp: number;
  compact?: boolean;
}

const LEVEL_METADATA: Record<number, { emoji: string; color: string; gradient: string }> = {
  1:  { emoji: '🌱', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300', gradient: 'from-gray-300 to-gray-400' },
  2:  { emoji: '🔍', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300', gradient: 'from-blue-300 to-blue-500' },
  3:  { emoji: '⚡', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300', gradient: 'from-indigo-300 to-indigo-500' },
  4:  { emoji: '🏅', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300', gradient: 'from-purple-300 to-purple-500' },
  5:  { emoji: '⭐', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300', gradient: 'from-yellow-300 to-yellow-500' },
  6:  { emoji: '💎', color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300', gradient: 'from-cyan-300 to-cyan-500' },
  7:  { emoji: '🚀', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300', gradient: 'from-orange-300 to-orange-500' },
  8:  { emoji: '🦸', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300', gradient: 'from-red-300 to-red-500' },
  9:  { emoji: '🌟', color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300', gradient: 'from-pink-300 to-pink-500' },
  10: { emoji: '👑', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300', gradient: 'from-amber-300 to-amber-500' },
};

export default function LevelBadge({ level, xp, compact = false }: LevelBadgeProps) {
  const { t } = useI18nStore();
  const meta = LEVEL_METADATA[level] ?? LEVEL_METADATA[10];
  const translatedLabel = t(`levels.${level}` as any) || t('levels.10');

  if (compact) {
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-all duration-200 shadow-sm hover:scale-105 ${meta.color}`}>
        {meta.emoji} Lv.{level}
      </span>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl font-bold transition-all duration-300 shadow-md group hover:shadow-lg hover:scale-105 ${meta.color}`}>
      <span
        className="text-2xl transition-transform group-hover:scale-125 duration-300"
        style={{ animation: 'pulse 2s ease-in-out infinite' }}
      >
        {meta.emoji}
      </span>
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
        <span className="text-sm">Lv.{level} · {translatedLabel}</span>
        <span className="text-[10px] uppercase tracking-wider opacity-60 font-black">{xp} XP</span>
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
