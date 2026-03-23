'use client';

import { useState } from 'react';
import { Habit } from '@/types/habit';
import { useDeleteHabit } from '@/hooks/useHabits';

interface HabitCardProps {
  habit: Habit;
  onEdit: (habit: Habit) => void;
}

export default function HabitCard({ habit, onEdit }: HabitCardProps) {
  const deleteHabit = useDeleteHabit();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    deleteHabit.mutate(habit.id);
    setShowConfirm(false);
  };

  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4"
      style={{ borderLeftColor: habit.color, borderLeftWidth: '4px' }}
    >
      <div className="text-2xl">{habit.icon}</div>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-800 truncate">{habit.name}</h3>
        {habit.description && (
          <p className="text-sm text-gray-500 truncate">{habit.description}</p>
        )}
        <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
          {habit.frequency}
        </span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => onEdit(habit)}
          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          aria-label="Edit habit"
        >
          ✏️
        </button>

        {showConfirm ? (
          <div className="flex items-center gap-1">
            <button
              onClick={handleDelete}
              disabled={deleteHabit.isPending}
              className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {deleteHabit.isPending ? '...' : 'Yes'}
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
            >
              No
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowConfirm(true)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            aria-label="Delete habit"
          >
            🗑️
          </button>
        )}
      </div>
    </div>
  );
}
