import { apiClient } from './client';
import { Habit, HabitCreate, HabitUpdate } from '@/types/habit';

export const habitsApi = {
  getAll: async (): Promise<Habit[]> => {
    const response = await apiClient.get<Habit[]>('/habits/');
    return response.data;
  },

  create: async (data: HabitCreate): Promise<Habit> => {
    const response = await apiClient.post<Habit>('/habits/', data);
    return response.data;
  },

  update: async (id: number, data: HabitUpdate): Promise<Habit> => {
    const response = await apiClient.put<Habit>(`/habits/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/habits/${id}`);
  },
};
