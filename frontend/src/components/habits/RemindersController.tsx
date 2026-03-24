'use client';

import { useHabits } from '@/hooks/useHabits';
import { useReminders } from '@/hooks/useReminders';
import ReminderPermissionBanner from './ReminderPermissionBanner';

/**
 * RemindersController
 * 
 * Empty non-visual component (except for the permission banner) that mounts
 * at the root of the logged-in user experience. It fetches habits and hooks
 * up the browser notification logic.
 */
export default function RemindersController() {
  const { data: habits } = useHabits();
  
  // 1. Setup recurring notifications
  useReminders(habits);

  // 2. Determine if permission banner should be shown
  const hasReminders = Boolean(habits?.some(h => h.reminder_time));

  return (
    <ReminderPermissionBanner hasReminders={hasReminders} />
  );
}
