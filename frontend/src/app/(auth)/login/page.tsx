'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, var(--accent) 0%, #8b5cf6 100%)',
      }}
    >
      <div
        className="card w-full max-w-md p-8 animate-fade-in"
        style={{ animation: 'fadeIn 0.35s ease-out' }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">⚡</div>
          <h1 className="text-3xl font-bold text-app-primary">HabitFlow</h1>
          <p className="text-app-secondary mt-1">Welcome back!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 5.3 Error state */}
          {error && (
            <div
              className="p-3 rounded-lg text-sm font-medium"
              style={{ backgroundColor: '#fee2e2', color: 'var(--danger)' }}
            >
              ⚠️ {error}
            </div>
          )}

          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-medium text-app-secondary">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg text-app-primary text-sm
                         focus:outline-none focus:ring-2 transition-all duration-150"
              style={{
                backgroundColor: 'var(--bg-app)',
                border: '1px solid var(--border)',
              }}
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="block text-sm font-medium text-app-secondary">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg text-app-primary text-sm
                         focus:outline-none focus:ring-2 transition-all duration-150"
              style={{
                backgroundColor: 'var(--bg-app)',
                border: '1px solid var(--border)',
              }}
              placeholder="••••••••"
            />
          </div>

          {/* 5.4 Micro-interaction on button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full py-3 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-app-secondary text-sm">
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="font-semibold transition-colors duration-150"
            style={{ color: 'var(--accent)' }}
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}