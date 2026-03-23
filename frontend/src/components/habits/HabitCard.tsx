'use client';

import { useState, useRef } from 'react';
import { Habit } from '@/types/habit';
import { useDeleteHabit } from '@/hooks/useHabits';
import { useToggleHabit } from '@/hooks/useProgress';
import { useAuthStore } from '@/stores/authStore';
import StreakBadge from './StreakBadge';
import XpPopup from '@/components/dashboard/XpPopup';
import LevelUpModal from '@/components/dashboard/LevelUpModal';

interface HabitCardProps {
  habit: Habit;
  completed: boolean;
  onEdit: (habit: Habit) => void;
}

export default function HabitCard({ habit, completed, onEdit }: HabitCardProps) {
  const deleteHabit = useDeleteHabit();
  const toggleHabit = useToggleHabit();
  const { checkAuth } = useAuthStore();

  const [showConfirm, setShowConfirm] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [xpTrigger, setXpTrigger] = useState(0);
  const [xpGained, setXpGained] = useState(10);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState(1);

  const handleToggle = () => {
    if (toggleHabit.isPending) return;

    toggleHabit.mutate(habit.id, {
      onSuccess: (result) => {
        if (result.completed) {
          setAnimating(true);
          setTimeout(() => setAnimating(false), 600);
          setXpGained(result.xp_gained);
          setXpTrigger((t) => t + 1);

          if (result.leveled_up) {
            setNewLevel(result.user_level);
            setShowLevelUp(true);
          }
        }
        // Sync user XP/level in the auth store
        checkAuth();
      },
    });
  };

  const handleDelete = () => {
    deleteHabit.mutate(habit.id);
    setShowConfirm(false);
  };

  return (
    <>
      <div
        className={`relative bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4 transition-all duration-300 ${
          completed ? 'opacity-75' : ''
        }`}
        style={{ borderLeftColor: habit.color, borderLeftWidth: '4px' }}
      >
        {/* Checkbox with animation */}
        <button
          onClick={handleToggle}
          disabled={toggleHabit.isPending}
          aria-label={completed ? 'Mark incomplete' : 'Mark complete'}
          className={`relative w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 ${
            completed
              ? 'border-transparent bg-green-500 scale-110'
              : 'border-gray-300 hover:border-green-400'
          } ${animating && completed ? 'animate-bounce' : ''}`}
          style={completed ? {} : { borderColor: habit.color }}
        >
          {completed && (
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}

          {/* XP floating popup */}
          <XpPopup xpGained={xpGained} trigger={xpTrigger} />
        </button>

        {/* Icon + habit info */}
        <div className="text-2xl">{habit.icon}</div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3
              className={`font-semibold text-gray-800 truncate transition-all duration-300 ${
                completed ? 'line-through text-gray-400' : ''
              }`}
            >
              {habit.name}
            </h3>
            <StreakBadge habitId={habit.id} />
          </div>
          {habit.description && (
            <p className="text-sm text-gray-500 truncate">{habit.description}</p>
          )}
          <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
            {habit.frequency}
          </span>
        </div>

        {/* Edit / Delete */}
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

        {/* Completion flash overlay */}
        {animating && completed && (
          <div className="absolute inset-0 rounded-xl bg-green-100 opacity-40 pointer-events-none animate-ping" />
        )}
      </div>

      {/* Level-up modal (4.4) */}
      {showLevelUp && (
        <LevelUpModal level={newLevel} onClose={() => setShowLevelUp(false)} />
      )}
    </>
  );
}
