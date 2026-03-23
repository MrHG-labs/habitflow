'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setValidationError('');

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return;
    }

    try {
      await register({ email, username, password });
      router.push('/dashboard');
    } catch {
      // Error is handled by the store
    }
  };

  const displayError = error || validationError;

  const fields = [
    { id: 'email',           label: 'Email',            type: 'email',    value: email,           setter: setEmail,           placeholder: 'you@example.com' },
    { id: 'username',        label: 'Username',         type: 'text',     value: username,        setter: setUsername,        placeholder: 'johndoe' },
    { id: 'password',        label: 'Password',         type: 'password', value: password,        setter: setPassword,        placeholder: '••••••••' },
    { id: 'confirmPassword', label: 'Confirm Password', type: 'password', value: confirmPassword, setter: setConfirmPassword, placeholder: '••••••••' },
  ];

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, var(--accent) 0%, #8b5cf6 100%)',
      }}
    >
      <div className="card w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">⚡</div>
          <h1 className="text-3xl font-bold text-app-primary">HabitFlow</h1>
          <p className="text-app-secondary mt-1">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 5.3 Error state */}
          {displayError && (
            <div
              className="p-3 rounded-lg text-sm font-medium"
              style={{ backgroundColor: '#fee2e2', color: 'var(--danger)' }}
            >
              ⚠️ {displayError}
            </div>
          )}

          {fields.map(({ id, label, type, value, setter, placeholder }) => (
            <div key={id} className="space-y-1">
              <label htmlFor={id} className="block text-sm font-medium text-app-secondary">
                {label}
              </label>
              <input
                id={id}
                type={type}
                value={value}
                onChange={(e) => setter(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg text-app-primary text-sm
                           focus:outline-none focus:ring-2 transition-all duration-150"
                style={{
                  backgroundColor: 'var(--bg-app)',
                  border: '1px solid var(--border)',
                }}
                placeholder={placeholder}
              />
            </div>
          ))}

          {/* 5.4 Micro-interaction on button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full py-3 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Creating account...
              </span>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-app-secondary text-sm">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-semibold transition-colors duration-150"
            style={{ color: 'var(--accent)' }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}