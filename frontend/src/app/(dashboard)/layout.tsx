'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { apiClient } from '@/api/client';
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore } from '@/stores/themeStore';
import { useI18nStore } from '@/stores/i18nStore';
import { usePomodoroStore } from '@/stores/pomodoroStore';
import LevelBadge from '@/components/dashboard/LevelBadge';
import RemindersController from '@/components/habits/RemindersController';
import { toast } from 'sonner';

export default function DashboardLayout({

  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, checkAuth, user } = useAuthStore();
  const { theme, toggle: toggleTheme } = useThemeStore();
  const { language, setLanguage, t } = useI18nStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    const handleLevelUp = (e: any) => {
      const { level } = e.detail;
      toast.success(t('gamification.levelUp', { level }), {
        description: t('gamification.congrats'),
        duration: 5000,
        icon: '🎊',
      });
    };

    window.addEventListener('level_up', handleLevelUp);
    return () => window.removeEventListener('level_up', handleLevelUp);
  }, [t]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {

      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Global Pomodoro Ticker
  useEffect(() => {
    if (!isAuthenticated) return;
    const timer = setInterval(() => {
      usePomodoroStore.getState().tick();
    }, 1000);
    return () => clearInterval(timer);
  }, [isAuthenticated]);

  /* 5.3 — Loading state */
  if (isLoading || !mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center transition-colors" style={{ backgroundColor: 'var(--bg-app)' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
          <p className="text-app-secondary text-sm">{mounted ? t('common.loading') : 'Cargando...'}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const handleExport = async () => {
    toast.info(t('common.loading'));
    try {
      const { data } = await apiClient.get('/auth/export');
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `habitflow_export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(t('common.exportSuccess'));
    } catch (err) {
      console.error('Failed to export data', err);
      toast.error(t('common.exportError'));
    }
  };

  const navLinks = [
    { label: t('common.dashboard'), href: '/dashboard' },
    { label: t('common.habits'), href: '/habits' },
    { label: t('common.analytics'), href: '/analytics' },
    { label: t('common.focus'), href: '/focus' },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-app)' }}>
      {/* 5.2 Responsive navbar */}
      <nav className="nav-bg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">

            {/* Brand */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-2xl">⚡</span>
              <h1 className="text-lg font-bold" style={{ color: 'var(--accent)' }}>
                HabitFlow
              </h1>
            </div>

            {/* Nav links — hidden on mobile, visible sm+ */}
            <div className="hidden sm:flex items-center gap-1">
              {navLinks.map(({ label, href }) => (
                <button
                  key={href}
                  onClick={() => router.push(href)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${pathname === href
                      ? 'text-white'
                      : 'text-app-secondary hover:text-app-primary'
                    }`}
                  style={
                    pathname === href
                      ? { backgroundColor: 'var(--accent)' }
                      : {}
                  }
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Right side: badge + dark toggle + logout */}
            <div className="flex items-center gap-2">
              {/* Level badge (hidden on xs) */}
              {user && (
                <div className="hidden sm:block">
                  <LevelBadge level={user.level} xp={user.xp} compact />
                </div>
              )}

              {/* Language toggle */}
              <button
                onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
                aria-label="Toggle language"
                className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs transition-all duration-150 hover:scale-110 active:scale-95"
                style={{ backgroundColor: 'var(--bg-app)', border: '1px solid var(--border)', color: 'var(--app-primary)' }}
                title={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
              >
                {language === 'es' ? 'ES' : 'EN'}
              </button>

              {/* Export Data */}
              <button
                onClick={handleExport}
                aria-label={t('common.exportData')}
                className="hidden sm:flex w-9 h-9 rounded-lg items-center justify-center font-bold text-lg transition-all duration-150 hover:scale-110 active:scale-95"
                style={{ backgroundColor: 'var(--bg-app)', border: '1px solid var(--border)' }}
                title={t('common.exportData')}
              >
                📥
              </button>

              {/* 5.1 Dark / Light toggle */}
              <button
                onClick={toggleTheme}
                aria-label="Toggle dark mode"
                className="w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-all duration-150 hover:scale-110 active:scale-95"
                style={{ backgroundColor: 'var(--bg-app)', border: '1px solid var(--border)' }}
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>

              {/* Logout */}
              <button
                onClick={() => {
                  useAuthStore.getState().logout();
                  router.push('/login');
                  toast.success(t('auth.logoutSuccess'));
                }}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-app-secondary border transition-all duration-150 hover:text-danger hover:border-danger"
                style={{ borderColor: 'var(--border)' }}
              >
                <span className="hidden sm:inline">{t('common.logout')}</span>
                <span className="sm:hidden">↩</span>
              </button>
            </div>
          </div>

          {/* Mobile nav links — only on xs */}
          <div className="sm:hidden flex items-center gap-1 pb-2">
            {navLinks.map(({ label, href }) => (
              <button
                key={href}
                onClick={() => router.push(href)}
                className={`flex-1 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${pathname === href ? 'text-white' : 'text-app-secondary'
                  } hover:bg-black/10 dark:hover:bg-white/10`}
                style={{
                  backgroundColor: pathname === href ? 'var(--accent)' : 'transparent',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main page content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Global generic reminders controller and popup */}
      <RemindersController />
    </div>
  );
}