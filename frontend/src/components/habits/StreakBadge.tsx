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
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700"
      title={`${streak} day streak`}
    >
      🔥 {streak}
    </span>
  );
}
