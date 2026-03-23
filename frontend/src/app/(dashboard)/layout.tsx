'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore } from '@/stores/themeStore';
import { useI18nStore } from '@/stores/i18nStore';
import LevelBadge from '@/components/dashboard/LevelBadge';

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

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  /* 5.3 — Loading state */
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center transition-colors" style={{ backgroundColor: 'var(--bg-app)' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
          <p className="text-app-secondary text-sm">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const navLinks = [
    { label: t('common.dashboard'), href: '/dashboard' },
    { label: t('common.habits'), href: '/habits' },
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
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    pathname === href
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
                className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  pathname === href ? 'text-white' : 'text-app-secondary'
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
        </div>
      </nav>

      {/* Main page content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}