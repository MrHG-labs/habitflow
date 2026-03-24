'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useI18nStore } from '@/stores/i18nStore';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError, checkAuth } = useAuthStore();
  const { t, language, setLanguage } = useI18nStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [mounted, setMounted] = useState(false);

  // Clear errors and check auth on mount
  useEffect(() => {
    setMounted(true);
    clearError();
    checkAuth();
  }, [clearError, checkAuth]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 transition-all duration-700" style={{ background: 'linear-gradient(135deg, var(--accent) 0%, #8b5cf6 100%)' }}>
         <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await login({ email, password });
      router.push('/dashboard');
    } catch {
      // Error is handled by the store
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 transition-all duration-700"
      style={{
        background: 'linear-gradient(135deg, var(--accent) 0%, #8b5cf6 100%)',
      }}
    >
      {/* Floating Language Switcher */}
      <div className="absolute top-6 right-6 flex gap-2">
        <button
          onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
          className="px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-lg hover:scale-105 active:scale-95 text-white/90"
          style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}
        >
          {language === 'es' ? 'EN' : 'ES'}
        </button>
      </div>

      <div
        className="card w-full max-w-md p-8 sm:p-10 shadow-2xl animate-in fade-in zoom-in-95 duration-500 rounded-3xl"
        style={{ animation: 'fadeIn 0.4s ease-out' }}
      >
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-6xl mb-4 animate-bounce duration-[2000ms]" style={{ fontSize: '3.5rem' }}>⚡</div>
          <h1 className="text-4xl font-extrabold text-app-primary tracking-tight">HabitFlow</h1>
          <p className="text-app-secondary mt-2 font-medium opacity-80">{t('auth.welcomeHeader')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error state */}
          {error && (
            <div
              className="p-4 rounded-xl text-sm font-semibold flex items-center gap-2 animate-in slide-in-from-top-2 duration-300 shadow-inner"
              style={{ backgroundColor: '#fee2e2', color: 'var(--danger)', borderLeft: '4px solid var(--danger)' }}
            >
              <span>⚠️</span> {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-sm font-bold text-app-secondary px-1">
              {t('auth.email')}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-5 py-3.5 rounded-2xl text-app-primary text-sm
                         focus:outline-none focus:ring-4 ring-indigo-500/10 transition-all duration-300
                         focus:scale-[1.01] placeholder:transition-opacity"
              style={{
                backgroundColor: 'var(--bg-app)',
                border: '1px solid var(--border)',
              }}
              placeholder={t('auth.placeholderEmail')}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-sm font-bold text-app-secondary px-1">
              {t('auth.password')}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-5 py-3.5 rounded-2xl text-app-primary text-sm
                         focus:outline-none focus:ring-4 ring-indigo-500/10 transition-all duration-300
                         focus:scale-[1.01] placeholder:transition-opacity"
              style={{
                backgroundColor: 'var(--bg-app)',
                border: '1px solid var(--border)',
              }}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full py-4 text-base font-bold rounded-2xl shadow-xl shadow-indigo-600/20 
                       transition-all duration-300 hover:translate-y-[-2px] active:translate-y-[1px]
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-3">
                <span className="w-5 h-5 border-3 border-white/40 border-t-white rounded-full animate-spin" />
                {t('auth.signingIn')}
              </span>
            ) : (
              t('auth.signinBtn')
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-app-secondary text-sm font-medium">
          {t('auth.noAccount')}{' '}
          <Link
            href="/register"
            className="font-bold transition-all duration-150 hover:underline inline-flex items-center gap-1 group"
            style={{ color: 'var(--accent)' }}
          >
            {t('auth.signupLink')}
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </p>
      </div>
    </div>
  );
}