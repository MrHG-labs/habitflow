'use client';

import { useHabitStreak } from '@/hooks/useProgress';

interface StreakBadgeProps {
  habitId: number;
}

export default function StreakBadge({ habitId }: StreakBadgeProps) {
  const { data } = useHabitStreak(habitId);
  const streak = data?.streak ?? 0;

  if (streak === 0) return null;

  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold transition-all duration-200 hover:scale-110 cursor-default"
      style={{
        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
        color: '#b45309',
        boxShadow: '0 2px 8px rgba(251, 191, 36, 0.3)',
      }}
      title={`${streak} day streak`}
    >
      <span
        className="text-sm"
        style={{
          animation: streak >= 3 ? 'pulse 1.5s ease-in-out infinite' : 'none',
        }}
      >
        🔥
      </span>
      <span className="font-black">{streak}</span>
      {streak >= 7 && <span className="text-xs opacity-75">🔥</span>}
      {streak >= 30 && <span className="text-xs opacity-50">🔥</span>}
    </span>
  );
}
