import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { progressApi } from '@/api/progress';

/** Today's completion map: { habitId: boolean } */
export function useTodayProgress() {
  return useQuery({
    queryKey: ['progress', 'today'],
    queryFn: progressApi.getToday,
  });
}

/** Toggle a habit's completed state for today */
export function useToggleHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (habitId: number) => progressApi.toggleToday(habitId),
    onSuccess: () => {
      // Refresh today's state and streaks
      queryClient.invalidateQueries({ queryKey: ['progress'] });
    },
  });
}

/** Streak for a specific habit */
export function useHabitStreak(habitId: number) {
  return useQuery({
    queryKey: ['progress', 'streak', habitId],
    queryFn: () => progressApi.getStreak(habitId),
  });
}

/** Last 7 days completion counts for the dashboard */
export function useWeeklyProgress() {
  return useQuery({
    queryKey: ['progress', 'weekly'],
    queryFn: progressApi.getWeekly,
  });
}
