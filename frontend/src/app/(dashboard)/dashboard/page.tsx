'use client';

import { useAuthStore } from '@/stores/authStore';
import { useI18nStore } from '@/stores/i18nStore';
import { useHabits } from '@/hooks/useHabits';
import { useTodayProgress, useWeeklyProgress } from '@/hooks/useProgress';
import LevelBadge from '@/components/dashboard/LevelBadge';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { t, language } = useI18nStore();
  const { data: habits, isLoading: habitsLoading } = useHabits();
  const { data: todayProgress } = useTodayProgress();
  const { data: weekly } = useWeeklyProgress();

  const totalHabits = habits?.length ?? 0;
  const completedToday = todayProgress
    ? Object.values(todayProgress).filter(Boolean).length
    : 0;
  const pct = totalHabits > 0 ? (completedToday / totalHabits) * 100 : 0;
  const maxWeeklyDay = weekly ? Math.max(...weekly.map((d) => d.completed), 0) : 0;

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold text-app-primary">
          {t('dashboard.welcome', { name: user?.username ?? '' })}
        </h2>
        <p className="text-app-secondary mt-1">{t('dashboard.overview')}</p>
      </div>

      {/* Stats row — responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* Level */}
        <div className="card p-5 flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-app-muted">{t('dashboard.yourLevel')}</p>
          <LevelBadge level={user?.level ?? 1} xp={user?.xp ?? 0} />
        </div>

        {/* Today */}
        <div className="card p-5 flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-app-muted">{t('dashboard.todayStats')}</p>
          {habitsLoading ? (
            <div className="h-8 w-16 rounded animate-pulse" style={{ backgroundColor: 'var(--border)' }} />
          ) : (
            <>
              <p className="text-3xl font-bold text-app-primary">
                {completedToday}
                <span className="text-lg font-normal text-app-muted"> / {totalHabits}</span>
              </p>
              {totalHabits > 0 && (
                <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border)' }}>
                  <div
                    className="h-2 rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, backgroundColor: 'var(--success)' }}
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* Best weekly */}
        <div className="card p-5 flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-app-muted">{t('dashboard.bestDay')}</p>
          <p className="text-3xl font-bold" style={{ color: '#f59e0b' }}>
            {maxWeeklyDay}
            <span className="text-lg font-normal text-app-muted"> {t('dashboard.habitsCount')}</span>
          </p>
        </div>
      </div>

      {/* Weekly chart */}
      <div className="card p-6">
        <h3 className="text-base font-semibold text-app-primary mb-4">{t('dashboard.weeklyProgress')}</h3>
        {weekly && weekly.length > 0 ? (
          <div className="flex items-end gap-2" style={{ height: '120px' }}>
            {weekly.map((day) => {
              const barPct = totalHabits > 0 ? (day.completed / totalHabits) * 100 : 0;
              // Proper local date calculation to avoid UTC drift
              const now = new Date();
              const localTodayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
              const isToday = day.date === localTodayStr;
              const dayLabel = new Date(day.date + 'T12:00:00').toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { weekday: 'narrow' });
              return (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col justify-end" style={{ height: '96px' }}>
                    <div
                      className="w-full rounded-t-md transition-all duration-700 hover:scale-x-105"
                      style={{
                        height: `${Math.max(barPct, 4)}%`,
                        backgroundColor: isToday ? 'var(--accent)' : 'var(--accent-light)',
                      }}
                      title={`${day.completed} / ${totalHabits}`}
                    />
                  </div>
                  <span className="text-xs text-app-muted">{dayLabel}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-app-muted text-sm">{t('dashboard.noData')}</p>
        )}
      </div>

      {/* XP total */}
      <div className="card p-6">
        <h3 className="text-base font-semibold text-app-primary mb-1">{t('dashboard.totalXp')}</h3>
        <p className="text-3xl font-bold" style={{ color: '#a855f7' }}>{user?.xp ?? 0}</p>
        <p className="text-app-muted text-sm mt-1">{t('dashboard.xpGoal')}</p>
      </div>
    </div>
  );
}