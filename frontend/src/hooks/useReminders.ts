'use client';

import { useEffect, useRef, useCallback } from 'react';
import { Habit } from '@/types/habit';

/**
 * useReminders — Web Notifications API integration
 *
 * Fires a browser notification when the current time matches a habit's
 * reminder_time ("HH:MM"). Polling every 30 s; fires at most once per habit
 * per calendar day using a Set stored in a ref.
 */
export function useReminders(habits: Habit[] | undefined) {
  // Track which (habitId + date) pairs have already been notified today
  const firedRef = useRef<Set<string>>(new Set());

  const checkAndNotify = useCallback(() => {
    if (!habits || habits.length === 0) return;
    if (typeof window === 'undefined') return;
    if (Notification.permission !== 'granted') return;

    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const currentTime = `${hh}:${mm}`;
    const today = now.toDateString();

    habits.forEach((habit) => {
      if (!habit.reminder_time) return;
      if (habit.reminder_time !== currentTime) return;

      const key = `${habit.id}::${today}`;
      if (firedRef.current.has(key)) return;

      firedRef.current.add(key);

      new Notification(`${habit.icon} ¡Hora de tu hábito!`, {
        body: `No olvides completar: ${habit.name}`,
        icon: '/favicon.ico',
        tag: `habit-${habit.id}`, // prevents duplicate system-level toasts
        badge: '/favicon.ico',
        silent: false,
      });
    });
  }, [habits]);

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
