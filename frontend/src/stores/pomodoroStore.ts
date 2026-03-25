'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '@/api/client';
import { useAuthStore } from './authStore';

export type PomodoroMode = 'focus' | 'break';

interface PomodoroState {
  mode: PomodoroMode;
  timeLeft: number;      // Current time left in seconds
  isRunning: boolean;
  targetEndTime: number | null; // Date.now() timestamp of when it should end

  focusDuration: number; // in seconds
  breakDuration: number; // in seconds

  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  tick: () => void;
  setMode: (mode: PomodoroMode) => void;
  completeSession: () => Promise<void>;
  updateConfig: (focusMin: number, breakMin: number) => void;
}

export const usePomodoroStore = create<PomodoroState>()(
  persist(
    (set, get) => ({
      mode: 'focus',
      focusDuration: 25 * 60,
      breakDuration: 5 * 60,
      timeLeft: 25 * 60,
      isRunning: false,
      targetEndTime: null,

      startTimer: () => {
        const { timeLeft, isRunning } = get();
        if (isRunning) return;
        set({ isRunning: true, targetEndTime: Date.now() + timeLeft * 1000 });
      },

      pauseTimer: () => {
        set({ isRunning: false, targetEndTime: null });
      },

      resetTimer: () => {
        const { mode, focusDuration, breakDuration } = get();
        set({
          isRunning: false,
          targetEndTime: null,
          timeLeft: mode === 'focus' ? focusDuration : breakDuration
        });
      },

      tick: () => {
        const state = get();
        if (!state.isRunning || !state.targetEndTime) return;

        const now = Date.now();
        const remaining = Math.round((state.targetEndTime - now) / 1000);

        if (remaining > 0) {
          if (remaining !== state.timeLeft) {
            set({ timeLeft: remaining });
          }
        } else {
          // Timer finished
          try {
            // Play notification sound (browser will block if no prior user interaction, but usually fine here)
            const audio = new Audio('/notification.mp3');
            audio.play().catch(() => { });
          } catch (e) { }

          if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
            new Notification(state.mode === 'focus' ? '¡Tiempo Completo!' : '¡Descanso Terminado!', {
              body: state.mode === 'focus' ? 'Excelente trabajo. Toma un descanso.' : 'Volvamos al trabajo.',
            });
          }

          if (state.mode === 'focus') {
            state.completeSession().then(() => {
              get().setMode('break');
              get().startTimer(); // auto-start break
            });
          } else {
            get().setMode('focus');
            // Do not auto-start focus again to prevent infinite loops if user is away.
          }
        }
      },

      setMode: (newMode) => {
        const { focusDuration, breakDuration } = get();
        set({
          mode: newMode,
          isRunning: false,
          targetEndTime: null,
          timeLeft: newMode === 'focus' ? focusDuration : breakDuration
        });
      },

      completeSession: async () => {
        const { focusDuration } = get();
        try {
          const res = await apiClient.post('/progress/focus/reward', {
            duration_minutes: Math.round(focusDuration / 60)
          });
          const { user_xp, new_level, leveled_up, xp_gained } = res.data;

          if (leveled_up && typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('level_up', { detail: { level: new_level } }));
          }

          const authUpdateXp = useAuthStore.getState();
          if (authUpdateXp.checkAuth) {
            authUpdateXp.checkAuth();
          }
        } catch (e) {
          console.error("Error rewarding XP", e);
        }
      },

      updateConfig: (f, b) => {
        set({
          focusDuration: f * 60,
          breakDuration: b * 60,
          isRunning: false,
          targetEndTime: null,
          timeLeft: get().mode === 'focus' ? f * 60 : b * 60,
        });
      }
    }),
    {
      name: 'habitflow-pomodoro'
    }
  )
);
