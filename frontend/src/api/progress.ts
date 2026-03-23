import { apiClient } from './client';

export const progressApi = {
  toggleToday: async (habitId: number): Promise<{ habit_id: number; completed: boolean; date: string }> => {
    const response = await apiClient.post(`/progress/${habitId}/toggle`);
    return response.data;
  },

  getToday: async (): Promise<Record<number, boolean>> => {
    const response = await apiClient.get('/progress/today');
    return response.data;
  },

  getStreak: async (habitId: number): Promise<{ habit_id: number; streak: number }> => {
    const response = await apiClient.get(`/progress/${habitId}/streak`);
    return response.data;
  },

  getWeekly: async (): Promise<Array<{ date: string; completed: number }>> => {
    const response = await apiClient.get('/progress/weekly');
    return response.data;
  },
};
