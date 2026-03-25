'use client';

import { useEffect, useRef, useCallback } from 'react';
import { Habit } from '@/types/habit';
import { useI18nStore } from '@/stores/i18nStore';

/**
 * useReminders — Web Notifications API integration
 *
 * Fires a browser notification when the current time matches a habit's
 * reminder_time ("HH:MM"). Polling every 30 s; fires at most once per habit
 * per calendar day using a Set stored in a ref.
 */
export function useReminders(habits: Habit[] | undefined) {
  const { t } = useI18nStore();
  // Track which (habitId + date) pairs have already been notified today
  const firedRef = useRef<Set<string>>(new Set());

  const checkAndNotify = useCallback(() => {
    if (!habits || habits.length === 0) return;
    if (typeof window === 'undefined') return;
    if (!('Notification' in window) || Notification.permission !== 'granted') return;

    const now = new Date();
    const todayStr = now.toDateString();
    const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();

    habits.forEach((habit) => {
      if (!habit.reminder_time) return;

      const [h, m] = habit.reminder_time.split(':').map(Number);
      const reminderTotalMinutes = h * 60 + m;
      const key = `${habit.id}::${todayStr}`;

      if (firedRef.current.has(key)) return;

      // Allow a 2-minute window to handle interval skips/throttling
      const diff = currentTotalMinutes - reminderTotalMinutes;
      if (diff >= 0 && diff < 2) {
        firedRef.current.add(key);

        const title = `${habit.icon} ${t('reminders.notifTitle')}`;
        const body = t('reminders.notifBody', { habit: habit.name });

        const notification = new Notification(title, {
          body: body,
          icon: '/favicon.ico',
          tag: `habit-${habit.id}-${todayStr}`,
          badge: '/favicon.ico',
          requireInteraction: true,
        });

        notification.onclick = () => {
          window.focus();
          notification.close();
        };
      }
    });
  }, [habits, t]);

  useEffect(() => {
    // Run immediately on mount / habit change
    checkAndNotify();

    // Poll every 30 seconds
    const interval = setInterval(checkAndNotify, 30_000);
    return () => clearInterval(interval);
  }, [checkAndNotify]);
}

/** Request browser notification permission. Returns the new permission state. */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined') return 'default';
  if (!('Notification' in window)) return 'denied';
  if (Notification.permission === 'granted') return 'granted';
  return await Notification.requestPermission();
}

/** Returns true only when Notifications are supported by the browser */
export function notificationsSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}
