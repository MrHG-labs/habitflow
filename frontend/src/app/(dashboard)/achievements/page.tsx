'use client';

import { useAchievements } from '@/hooks/useAchievements';
import { useI18nStore } from '@/stores/i18nStore';
import MedalCard from '@/components/achievements/MedalCard';

export default function AchievementsPage() {
  const { data: achievements, isLoading, error } = useAchievements();
  const { t } = useI18nStore();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
        <p className="text-app-secondary animate-pulse">{t('common.loading')}</p>
      </div>
    );
  }

  if (error || !achievements) {
    return (
      <div className="card p-10 flex flex-col items-center justify-center gap-4 text-center">
        <div className="text-6xl mb-2 opacity-20">⚠️</div>
        <h2 className="text-xl font-bold text-app-primary">{t('common.error')}</h2>
        <p className="text-app-secondary">{t('common.tryAgainLater')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold text-app-primary tracking-tight flex items-center gap-3">
          🏆 {t('achievements.title')}
        </h1>
        <p className="text-app-secondary">{t('achievements.subtitle')}</p>
        <div className="h-1 w-20 rounded-full" style={{ backgroundColor: 'var(--accent)' }} />
      </header>

      {achievements.length === 0 ? (
        <div className="card h-64 flex flex-col items-center justify-center text-center gap-4 p-10 border-dashed border-2 opacity-80 backdrop-grayscale-[0.5]">
          <div className="text-5xl opacity-40">🏅</div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-app-primary">{t('achievements.noData')}</h3>
            <p className="text-sm text-app-secondary max-w-xs">{t('achievements.startWorking')}</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {achievements.map((achievement, i) => (
            <MedalCard key={achievement.id} achievement={achievement} index={i} />
          ))}
        </div>
      )}

      {/* Stats summary section */}
      {achievements.length > 0 && (
          <div className="mt-12 bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-app)] rounded-3xl p-8 border border-white/10 shadow-lg relative overflow-hidden group">
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 justify-between">
                  <div>
                      <h2 className="text-xl font-bold text-app-primary mb-2">{t('achievements.statsSummary')}</h2>
                      <p className="text-sm text-app-secondary opacity-80">{t('achievements.keepItUp')}</p>
                  </div>
                  <div className="flex flex-wrap gap-4 items-center justify-center">
                      <div className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-center flex flex-col items-center gap-1 shadow-inner group-hover:scale-110 transition-transform duration-300">
                          <span className="text-2xl font-black text-app-primary">{achievements.length}</span>
                          <span className="text-[10px] uppercase font-bold text-app-muted spacing tracking-widest">{t('achievements.totalMedals')}</span>
                      </div>
                      <div className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-center flex flex-col items-center gap-1 shadow-inner group-hover:scale-110 transition-transform duration-300 transition-delay-[100ms]">
                          <span className="text-2xl font-black text-app-primary">
                              {achievements.filter(a => a.medal_type === 'Flame').length}
                          </span>
                          <span className="text-[10px] uppercase font-bold text-app-muted spacing tracking-widest">{t('achievements.flameCount')}</span>
                      </div>
                      <div className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-center flex flex-col items-center gap-1 shadow-inner group-hover:scale-110 transition-transform duration-300 transition-delay-[200ms]">
                          <span className="text-2xl font-black text-app-primary">
                              {achievements.filter(a => ['Gold', 'Diamond'].includes(a.medal_type)).length}
                          </span>
                          <span className="text-[10px] uppercase font-bold text-app-muted spacing tracking-widest">{t('achievements.topTierCount')}</span>
                      </div>
                  </div>
              </div>
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -mr-32 -mt-32 group-hover:bg-indigo-500/20 transition-colors" />
          </div>
      )}
    </div>
  );
}
