'use client';

import { useI18nStore } from '@/stores/i18nStore';

interface LevelBadgeProps {
  level: number;
  xp: number;
  compact?: boolean;
}

const LEVEL_METADATA: Record<number, { emoji: string; color: string }> = {
  1:  { emoji: '🌱', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' },
  2:  { emoji: '🔍', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
  3:  { emoji: '⚡', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' },
  4:  { emoji: '🏅', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
  5:  { emoji: '⭐', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' },
  6:  { emoji: '💎', color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300' },
  7:  { emoji: '🚀', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' },
  8:  { emoji: '🦸', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' },
  9:  { emoji: '🌟', color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300' },
  10: { emoji: '👑', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
};

export default function LevelBadge({ level, xp, compact = false }: LevelBadgeProps) {
  const { t } = useI18nStore();
  const meta = LEVEL_METADATA[level] ?? LEVEL_METADATA[10];
  const translatedLabel = t(`levels.${level}` as any) || t('levels.10');

  if (compact) {
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-all shadow-sm ${meta.color}`}>
        {meta.emoji} Lv.{level}
      </span>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl font-bold transition-all shadow-md group ${meta.color}`}>
      <span className="text-xl transition-transform group-hover:scale-125 duration-300">{meta.emoji}</span>
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
        <span className="text-sm">Lv.{level} · {translatedLabel}</span>
        <span className="text-[10px] uppercase tracking-wider opacity-60 font-black">{xp} XP</span>
      </div>
    </div>
  );
}
