import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';

export interface AnalyticsData {
  heatmap: { date: string; count: number }[];
  categories: { category: string; value: number }[];
  days_of_week: { day: number; count: number }[];
}

export function useAnalytics() {
  return useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const { data } = await apiClient.get<AnalyticsData>('/progress/analytics');
      return data;
    },
    staleTime: 60 * 1000 * 5, // 5 min
  });
}
