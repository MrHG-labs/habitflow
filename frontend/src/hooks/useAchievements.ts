import { useQuery } from '@tanstack/react-query';
import { achievementsApi } from '@/api/achievements';

export function useAchievements() {
  return useQuery({
    queryKey: ['achievements'],
    queryFn: achievementsApi.getAll,
  });
}
