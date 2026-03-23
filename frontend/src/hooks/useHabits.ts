import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { habitsApi } from '@/api/habits';
import { HabitCreate, HabitUpdate } from '@/types/habit';

export function useHabits() {
  return useQuery({
    queryKey: ['habits'],
    queryFn: habitsApi.getAll,
  });
}

export function useCreateHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: HabitCreate) => habitsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
  });
}

export function useUpdateHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: HabitUpdate }) =>
      habitsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
  });
}

export function useDeleteHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => habitsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
  });
}
