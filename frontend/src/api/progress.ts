import { apiClient } from './client';
import { ToggleResult } from '@/types/progress';

export const progressApi = {
  toggleToday: async (habitId: number): Promise<ToggleResult> => {
    const response = await apiClient.post<ToggleResult>(`/progress/${habitId}/toggle`);
    return response.data;
  },

  getToday: async (): Promise<Record<number, boolean>> => {
    const response = await apiClient.get('/progress/today');
    return response.data;
  },

  getStreak: async (habitId: number): Promise<{ habit_id: number; streak: number; days_neglected: number }> => {
    const response = await apiClient.get(`/progress/${habitId}/streak`);
    return response.data;
  },

  getWeekly: async (): Promise<Array<{ date: string; completed: number }>> => {
    const response = await apiClient.get('/progress/weekly');
    return response.data;
  },
  getSummary: async (): Promise<{
    completed_today: number;
    total_habits: number;
    momentum_pct: number;
    streak_count: number;
    weekly_progress: Array<{ date: string; completed: number }>;
  }> => {
    const response = await apiClient.get('/progress/summary');
    return response.data;
  },
};
