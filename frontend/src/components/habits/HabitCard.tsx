'use client';

import { useState } from 'react';
import { Habit } from '@/types/habit';
import { useDeleteHabit } from '@/hooks/useHabits';
import { useToggleHabit } from '@/hooks/useProgress';
import { useAuthStore } from '@/stores/authStore';
import { useI18nStore } from '@/stores/i18nStore';
import StreakBadge from './StreakBadge';
import XpPopup from '@/components/dashboard/XpPopup';
import LevelUpModal from '@/components/dashboard/LevelUpModal';
import confetti from 'canvas-confetti';

interface HabitCardProps {
  habit: Habit;
  completed: boolean;
  onEdit: (habit: Habit) => void;
  index?: number;
}

export default function HabitCard({ habit, completed, onEdit, index = 0 }: HabitCardProps) {
  const { t } = useI18nStore();
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

          // Confetti burst on completion
          confetti({
            particleCount: 30,
            spread: 50,
            origin: { x: 0.1, y: 0.5 },
            colors: ['#22c55e', '#4ade80', '#16a34a'],
            disableForReducedMotion: true,
          });

          if (result.leveled_up) {
            setNewLevel(result.user_level);
            setShowLevelUp(true);
          }
        }
        checkAuth();
      },
    });
  };

  const handleDelete = () => {
    deleteHabit.mutate(habit.id);
    setShowConfirm(false);
  };

  const translatedFreq = habit.frequency.toLowerCase() === 'daily' ? t('habits.daily') : t('habits.weekly');

  return (
    <>
      <div
        className={`card relative p-4 flex items-center gap-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
          completed ? 'opacity-70' : ''
        }`}
        style={{
          borderLeftColor: habit.color,
          borderLeftWidth: '4px',
          animationDelay: `${index * 75}ms`,
        }}
      >
        {/* Checkbox */}
        <button
          onClick={handleToggle}
          disabled={toggleHabit.isPending}
          aria-label={completed ? t('common.save') : t('common.save')}
          className={`relative w-12 h-12 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 group ${
            completed ? 'border-transparent scale-110' : ''
          } ${animating && completed ? 'animate-check-bounce' : ''}`}
          style={completed
            ? { backgroundColor: 'var(--success)', borderColor: 'transparent' }
            : { borderColor: habit.color }
          }
        >
          {/* Ripple effect */}
          {!completed && (
            <span className="absolute inset-0 rounded-full opacity-0 group-active:animate-ripple" style={{ borderColor: habit.color }} />
          )}

          {completed ? (
            <svg className="w-6 h-6 text-white animate-check-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <div
              className="w-3 h-3 rounded-full transition-transform duration-200 group-hover:scale-150"
              style={{ backgroundColor: habit.color }}
            />
          )}
          <XpPopup xpGained={xpGained} trigger={xpTrigger} />
        </button>

        {/* Icon */}
        <div className="text-3xl transition-transform duration-200 hover:scale-110">
          {habit.icon}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3
              className={`font-semibold truncate transition-all duration-300 ${
                completed ? 'line-through text-app-muted' : 'text-app-primary'
              }`}
            >
              {habit.name}
            </h3>
            <StreakBadge habitId={habit.id} />
          </div>
          {habit.description && (
            <p className="text-sm text-app-secondary truncate">{habit.description}</p>
          )}
          <span
            className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full transition-colors duration-200 hover:bg-opacity-80"
            style={{ backgroundColor: 'var(--bg-app)', color: 'var(--text-muted)' }}
          >
            {translatedFreq}
          </span>
        </div>

        {/* Edit / Delete */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onEdit(habit)}
            className="p-2 rounded-lg text-app-muted transition-all duration-150 hover:scale-110 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 active:scale-90"
            style={{ backgroundColor: 'transparent' }}
            title={t('common.edit')}
          >
            ✏️
          </button>

          {showConfirm ? (
            <div className="flex items-center gap-1 animate-fade-in-scale">
              <button
                onClick={handleDelete}
                disabled={deleteHabit.isPending}
                className="px-3 py-1.5 text-xs font-medium text-white rounded-lg transition-all hover:bg-red-600 disabled:opacity-50"
                style={{ backgroundColor: 'var(--danger)' }}
              >
                {t('common.delete').includes('Eliminar') ? 'Sí' : 'Yes'}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg text-app-secondary transition-all hover:bg-gray-100 dark:hover:bg-gray-700"
                style={{ backgroundColor: 'var(--bg-app)', border: '1px solid var(--border)' }}
              >
                No
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirm(true)}
              className="p-2 rounded-lg text-app-muted transition-all duration-150 hover:scale-110 hover:bg-red-50 dark:hover:bg-red-900/30 active:scale-90"
              title={t('common.delete')}
            >
              🗑️
            </button>
          )}
        </div>

        {/* Flash overlay */}
        {animating && completed && (
          <div
            className="absolute inset-0 rounded-xl opacity-40 pointer-events-none"
            style={{
              backgroundColor: 'var(--success)',
              animation: 'pulse 0.6s ease-out',
            }}
          />
        )}
      </div>

      {showLevelUp && (
        <LevelUpModal level={newLevel} onClose={() => setShowLevelUp(false)} />
      )}
    </>
  );
}
