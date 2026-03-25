import { apiClient } from './client';
import { Achievement } from '@/types/achievement';

export const achievementsApi = {
  getAll: async (): Promise<Achievement[]> => {
    const response = await apiClient.get<Achievement[]>('/achievements/');
    return response.data;
  },
};
