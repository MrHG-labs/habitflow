'use client';

import { useHabitStreak } from '@/hooks/useProgress';
import { useI18nStore } from '@/stores/i18nStore';

interface StreakBadgeProps {
  habitId: number;
}

export default function StreakBadge({ habitId }: StreakBadgeProps) {
  const { t } = useI18nStore();
  const { data } = useHabitStreak(habitId);
  const streak = data?.streak ?? 0;
  const neglected = data?.days_neglected ?? 0;

  // Si no hay racha y ha sido descuidado por pocos días, no mostrar nada
  if (streak === 0 && neglected < 3) return null;

  // Estado de abandono/descuiro (Neglect)
  if (neglected >= 3) {
    return (
      <span
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold transition-all duration-300 hover:scale-105"
        style={{
          backgroundColor: '#fef2f2',
          color: '#991b1b',
          border: '1px solid #fecaca',
          boxShadow: '0 2px 4px rgba(239, 68, 68, 0.1)',
        }}
        title={`${neglected} ${t('common.days')} sin completar`}
      >
        <span className="text-xs animate-bounce" style={{ animationDuration: '3s' }}>😔</span>
        <span>{neglected}d</span>
      </span>
    );
  }

  // Estado de racha positiva (Streak)
  const getBadgeConfig = () => {
    if (streak >= 60) return { icon: '💎', label: 'Diamond', bg: 'linear-gradient(135deg, #e2e8f0 0%, #38bdf8 100%)', color: '#0369a1' };
    if (streak >= 40) return { icon: '🕊️', label: 'Platinum', bg: 'linear-gradient(135deg, #94a3b8 0%, #475569 100%)', color: '#f1f5f9' };
    if (streak >= 21) return { icon: '🥇', label: 'Gold', bg: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 100%)', color: '#92400e' };
    if (streak >= 7) return { icon: '🥈', label: 'Silver', bg: 'linear-gradient(135deg, #f1f5f9 0%, #cbd5e1 100%)', color: '#475569' };
    if (streak >= 3) return { icon: '🥉', label: 'Bronze', bg: 'linear-gradient(135deg, #ffedd5 0%, #d97706 100%)', color: '#451a03' };
    return { icon: '🔥', label: '', bg: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', color: '#b45309' };
  };

  const config = getBadgeConfig();

  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold transition-all duration-200 hover:scale-110 cursor-default"
      style={{
        background: config.bg,
        color: config.color,
        boxShadow: streak >= 10 ? '0 2px 10px rgba(0,0,0,0.1)' : '0 2px 8px rgba(251, 191, 36, 0.3)',
      }}
      title={`${streak} ${t('common.days')} streak`}
    >
      <span
        className="text-sm"
        style={{
          animation: streak >= 3 ? 'pulse 1.5s ease-in-out infinite' : 'none',
        }}
      >
        {config.icon}
      </span>
      <span className="font-black">{streak}</span>
      {streak >= 21 && <span className="ml-1 text-[8px] uppercase tracking-tighter opacity-70">{config.label}</span>}
    </span>
  );
}
