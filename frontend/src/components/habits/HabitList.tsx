'use client';

import { Habit } from '@/types/habit';
import { useHabits } from '@/hooks/useHabits';
import HabitCard from './HabitCard';

interface HabitListProps {
  onEdit: (habit: Habit) => void;
}

export default function HabitList({ onEdit }: HabitListProps) {
  const { data: habits, isLoading, error } = useHabits();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 animate-pulse"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-200 rounded-lg" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm">
        Error loading habits. Please try again.
      </div>
    );
  }

  if (!habits || habits.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 text-center">
        <div className="text-4xl mb-3">🎯</div>
        <div className="text-gray-400 mb-1 font-medium">No habits yet</div>
        <p className="text-gray-500 text-sm">
          Create your first habit to start building better routines!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {habits.map((habit) => (
        <HabitCard key={habit.id} habit={habit} onEdit={onEdit} />
      ))}
    </div>
  );
}
