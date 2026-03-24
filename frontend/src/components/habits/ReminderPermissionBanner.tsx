'use client';

import { useState, useEffect } from 'react';
import { requestNotificationPermission, notificationsSupported } from '@/hooks/useReminders';
import { useI18nStore } from '@/stores/i18nStore';

/**
 * ReminderPermissionBanner
 *
 * Shown once (per session) when:
 *  - The browser supports notifications
 *  - Permission is still "default" (not granted nor denied)
 *  - At least one habit has a reminder_time set
 *
 * The banner slides in from the bottom and disappears after granting/dismissing.
 */
interface Props {
  hasReminders: boolean;
}

export default function ReminderPermissionBanner({ hasReminders }: Props) {
  const { t } = useI18nStore();
  const [show, setShow] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if (!notificationsSupported()) return;
    const perm = Notification.permission;
    setPermission(perm);
    if (perm === 'default' && hasReminders) {
      // Small delay so it doesn't flash immediately on page load
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [hasReminders]);

  const handleAllow = async () => {
    const result = await requestNotificationPermission();
    setPermission(result);
    setShow(false);
  };

  const handleDismiss = () => setShow(false);

  if (!show || permission !== 'default') return null;

  return (
    <div
      className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-sm z-40"
      style={{ animation: 'slideUpFade 0.4s cubic-bezier(0.34,1.56,0.64,1) both' }}
    >
      <div
        className="card p-4 rounded-2xl shadow-2xl flex gap-3 items-start"
        style={{
          border: '1px solid var(--border)',
          background: 'var(--bg-card)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Bell icon */}
        <div
          className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xl"
          style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}
        >
          🔔
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-app-primary leading-snug">
            {t('reminders.permissionBanner')}
          </p>

          <div className="flex gap-2 mt-3">
            <button
              onClick={handleAllow}
              className="btn-primary px-4 py-1.5 text-xs font-bold rounded-lg shadow-sm"
            >
              {t('reminders.permissionRequest')}
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 py-1.5 text-xs font-medium rounded-lg text-app-secondary transition-all hover:bg-black/5 dark:hover:bg-white/5"
              style={{ border: '1px solid var(--border)' }}
            >
              {t('reminders.dismiss')}
            </button>
          </div>
        </div>

        {/* Close */}
        <button
          onClick={handleDismiss}
          className="shrink-0 text-app-muted hover:text-app-primary transition-colors text-sm"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
