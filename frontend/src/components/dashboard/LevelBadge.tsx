'use client';

interface LevelBadgeProps {
  level: number;
  xp: number;
  compact?: boolean;
}

const LEVEL_LABELS: Record<number, { label: string; emoji: string; color: string }> = {
  1:  { label: 'Novice',    emoji: '🌱', color: 'bg-gray-100 text-gray-700' },
  2:  { label: 'Explorer',  emoji: '🔍', color: 'bg-blue-100 text-blue-700' },
  3:  { label: 'Achiever',  emoji: '⚡', color: 'bg-indigo-100 text-indigo-700' },
  4:  { label: 'Champion',  emoji: '🏅', color: 'bg-purple-100 text-purple-700' },
  5:  { label: 'Legend',    emoji: '⭐', color: 'bg-yellow-100 text-yellow-700' },
  6:  { label: 'Master',    emoji: '💎', color: 'bg-cyan-100 text-cyan-700' },
  7:  { label: 'Elite',     emoji: '🚀', color: 'bg-orange-100 text-orange-700' },
  8:  { label: 'Hero',      emoji: '🦸', color: 'bg-red-100 text-red-700' },
  9:  { label: 'Myth',      emoji: '🌟', color: 'bg-pink-100 text-pink-700' },
  10: { label: 'Immortal',  emoji: '👑', color: 'bg-amber-100 text-amber-700' },
};

export default function LevelBadge({ level, xp, compact = false }: LevelBadgeProps) {
  const info = LEVEL_LABELS[level] ?? LEVEL_LABELS[10];

  if (compact) {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${info.color}`}>
        {info.emoji} Lv.{level}
      </span>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-semibold ${info.color}`}>
      <span className="text-lg">{info.emoji}</span>
      <span>Lv.{level} · {info.label}</span>
      <span className="text-xs opacity-70">{xp} XP</span>
    </div>
  );
}
