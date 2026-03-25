'use client';

import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { useI18nStore } from '@/stores/i18nStore';
import { useHabits } from '@/hooks/useHabits';
import { useTodayProgress, useWeeklyProgress, useDashboardSummary } from '@/hooks/useProgress';
import { useAchievements } from '@/hooks/useAchievements';
import LevelBadge from '@/components/dashboard/LevelBadge';
import MedalCard from '@/components/achievements/MedalCard';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { t, language } = useI18nStore();
  const { data: habits, isLoading: habitsLoading } = useHabits();
  const { data: summary, isLoading: summaryLoading } = useDashboardSummary();
  // Falling back to specialized queries if needed, though summary covers most
  const { data: todayProgress } = useTodayProgress();
  const { data: weekly } = useWeeklyProgress();
  const { data: achievementsData } = useAchievements();

  // Group by habit to show only the highest achievement per habit (evolutionary approach)
  const groupedAchievements = (achievementsData || []).reduce((acc: any, curr) => {
    const key = curr.habit_name_snapshot;
    if (!acc[key] || curr.milestone_days > acc[key].milestone_days) {
      acc[key] = curr;
    }
    return acc;
  }, {});

  const achievements = Object.values(groupedAchievements) as typeof achievementsData;


  const totalHabits = summary?.total_habits ?? habits?.length ?? 0;
  const completedToday = summary?.completed_today ?? (todayProgress
    ? Object.values(todayProgress).filter(Boolean).length
    : 0);
  const pct = totalHabits > 0 ? (completedToday / totalHabits) * 100 : 0;
  
  const momentum = summary?.momentum_pct ?? 100;
  const weeklyData = summary?.weekly_progress ?? weekly;
  const maxWeeklyDay = weeklyData ? Math.max(...weeklyData.map((d) => d.completed), 0) : 0;

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="animate-fade-in-up">
        <h2 className="text-2xl font-bold text-app-primary">
          {t('dashboard.welcome', { name: user?.username ?? '' })}
        </h2>
        <p className="text-app-secondary mt-1">{t('dashboard.overview')}</p>
      </div>

      {/* Stats row — responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* Level */}
        <div className="card p-5 flex flex-col gap-2 animate-fade-in-up" style={{ animationDelay: '75ms' }}>
          <p className="text-xs font-semibold uppercase tracking-wide text-app-muted">{t('dashboard.yourLevel')}</p>
          <LevelBadge level={user?.level ?? 1} xp={user?.xp ?? 0} />
        </div>

        {/* Today */}
        <div className="card p-5 flex flex-col gap-2 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
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
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: 'var(--success)',
                      animation: 'progressGrow 0.7s ease-out forwards',
                    }}
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* Best weekly */}
        <div className="card p-5 flex flex-col gap-2 animate-fade-in-up" style={{ animationDelay: '225ms' }}>
          <p className="text-xs font-semibold uppercase tracking-wide text-app-muted">{t('dashboard.bestDay')}</p>
          <p className="text-3xl font-bold" style={{ color: '#f59e0b' }}>
            {maxWeeklyDay}
            <span className="text-lg font-normal text-app-muted"> {t('dashboard.habitsCount')}</span>
          </p>
        </div>
      </div>

      {/* Momentum / Energy Section */}
      <div className="grid grid-cols-1 gap-6 animate-fade-in-up" style={{ animationDelay: '275ms' }}>
        <div className="card p-6 overflow-hidden relative border-l-4 bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-app)] shadow-lg" style={{ borderLeftColor: momentum > 70 ? 'var(--success)' : momentum > 30 ? '#f59e0b' : 'var(--danger)' }}>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-app-primary flex items-center gap-2">
                {momentum > 70 ? '⚡' : momentum > 30 ? '🔋' : '🪫'} {t('dashboard.momentum')}
              </h3>
              <p className="text-sm text-app-secondary mt-1">
                {momentum > 70 ? t('dashboard.momentumHigh') : momentum > 30 ? t('dashboard.momentumMid') : t('dashboard.momentumLow')}
              </p>
            </div>
            <div className="flex items-center gap-4">
               <div className="text-4xl font-black" style={{ color: momentum > 70 ? 'var(--success)' : momentum > 30 ? '#f59e0b' : 'var(--danger)' }}>
                  {momentum}%
               </div>
               <div className="w-32 h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all duration-1000 ease-out fill-mode-forwards"
                    style={{ 
                      width: `${momentum}%`, 
                      backgroundColor: momentum > 70 ? 'var(--success)' : momentum > 30 ? '#f59e0b' : 'var(--danger)',
                      boxShadow: `0 0 10px ${momentum > 70 ? 'var(--success)' : momentum > 30 ? '#f59e0b' : 'var(--danger)'}`
                    }}
                  />
               </div>
            </div>
          </div>
          {/* Subtle background icon */}
          <div className="absolute -bottom-6 -right-6 text-9xl opacity-5 pointer-events-none select-none">
            {momentum > 70 ? '🔥' : '🧊'}
          </div>
        </div>
      </div>

      {/* Weekly chart */}
      <div className="card p-6 animate-fade-in-up" style={{ animationDelay: '350ms' }}>
        <h3 className="text-base font-semibold text-app-primary mb-4">{t('dashboard.weeklyProgress')}</h3>
        {weeklyData && weeklyData.length > 0 ? (
          <div className="flex items-end gap-2" style={{ height: '120px' }}>
            {weeklyData.map((day, index) => {
              const barPct = totalHabits > 0 ? (day.completed / totalHabits) * 100 : 0;
              // Proper local date calculation to avoid UTC drift
              const now = new Date();
              const localTodayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
              const isToday = day.date === localTodayStr;
              const dayLabel = new Date(day.date + 'T12:00:00').toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { weekday: 'narrow' });
              return (
                <div
                  key={day.date}
                  className="flex-1 flex flex-col items-center gap-1 group"
                  style={{ animationDelay: `${350 + index * 75}ms` }}
                >
                  <div className="w-full flex flex-col justify-end" style={{ height: '96px' }}>
                    <div
                      className="w-full rounded-t-md transition-all duration-500 hover:scale-x-110 cursor-pointer relative overflow-hidden"
                      style={{
                        height: `${Math.max(barPct, 4)}%`,
                        backgroundColor: isToday ? 'var(--accent)' : 'var(--accent-light)',
                        animation: 'barGrow 0.6s ease-out forwards',
                        animationDelay: `${index * 75}ms`,
                        transformOrigin: 'bottom',
                      }}
                      title={`${day.completed} / ${totalHabits}`}
                    >
                      {/* Shine effect */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-200"
                        style={{
                          background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 50%)',
                        }}
                      />
                    </div>
                  </div>
                  <span className={`text-xs transition-colors duration-200 ${isToday ? 'text-app-primary font-semibold' : 'text-app-muted group-hover:text-app-secondary'}`}>
                    {dayLabel}
                  </span>
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

      {/* Achievements Section */}
      <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-app-primary flex items-center gap-2">
            🏆 {t('achievements.title')}
          </h3>
        </div>
        
        {!achievements || achievements.length === 0 ? (
          <div className="card h-40 flex flex-col items-center justify-center text-center p-6 border-dashed border-2 opacity-60">
            <p className="text-sm text-app-secondary">{t('achievements.noData')}</p>
            <p className="text-xs text-app-muted mt-1">{t('achievements.startWorking')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-10">
            {achievements.slice(0, 4).map((achievement, i) => (
              <MedalCard key={achievement.id} achievement={achievement} index={i} />
            ))}
            {achievements.length > 4 && (
              <Link href="/achievements" className="card p-6 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-all hover:scale-105">
                <span className="text-2xl mb-1">➕</span>
                <span className="text-xs font-bold text-app-secondary">{t('achievements.totalMedals')}: {achievements.length}</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}