import { Habit } from '@/types/habit';
import { useHabits } from '@/hooks/useHabits';
import { useTodayProgress } from '@/hooks/useProgress';
import { useI18nStore } from '@/stores/i18nStore';
import HabitCard from './HabitCard';

interface HabitListProps {
  onEdit: (habit: Habit) => void;
}

/* 5.3 — Skeleton loader */
function HabitSkeleton() {
  return (
    <div className="card p-4 flex items-center gap-4 animate-pulse">
      <div className="w-10 h-10 rounded-full" style={{ backgroundColor: 'var(--border)' }} />
      <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: 'var(--border)' }} />
      <div className="flex-1 space-y-2">
        <div className="h-4 rounded w-1/3" style={{ backgroundColor: 'var(--border)' }} />
        <div className="h-3 rounded w-1/2" style={{ backgroundColor: 'var(--bg-app)' }} />
      </div>
    </div>
  );
}

export default function HabitList({ onEdit }: HabitListProps) {
  const { t } = useI18nStore();
  const { data: habits, isLoading, error } = useHabits();
  const { data: todayProgress } = useTodayProgress();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => <HabitSkeleton key={i} />)}
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-5 border-l-4 rounded-xl flex items-center gap-3" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}>
        <span className="text-xl">⚠️</span>
        <p className="font-semibold text-sm">{t('common.error')}</p>
      </div>
    );
  }

  if (!habits || habits.length === 0) {
    return (
      <div className="card p-10 text-center flex flex-col items-center">
        <div className="text-5xl mb-4 grayscale opacity-30">🎯</div>
        <p className="font-bold text-xl text-app-primary mb-2">{t('habits.noHabits')}</p>
        <p className="max-w-[280px] text-app-secondary text-sm leading-relaxed">{t('habits.createFirst')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          completed={todayProgress?.[habit.id] ?? false}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
