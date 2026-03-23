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

interface HabitCardProps {
  habit: Habit;
  completed: boolean;
  onEdit: (habit: Habit) => void;
}

export default function HabitCard({ habit, completed, onEdit }: HabitCardProps) {
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

  const translatedFreq = habit.frequency.toLowerCase() === 'daily' ? t('habits.daily') : t('habits.weekly');

  return (
    <>
      <div
        className={`card relative p-4 flex items-center gap-4 transition-all duration-300 hover:scale-[1.01] ${
          completed ? 'opacity-70' : ''
        }`}
        style={{ borderLeftColor: habit.color, borderLeftWidth: '4px' }}
      >
        {/* Checkbox */}
        <button
          onClick={handleToggle}
          disabled={toggleHabit.isPending}
          aria-label={completed ? t('common.save') : t('common.save')}
          className={`relative w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 ${
            completed ? 'border-transparent scale-110' : ''
          } ${animating && completed ? 'animate-bounce' : ''}`}
          style={completed
            ? { backgroundColor: 'var(--success)', borderColor: 'transparent' }
            : { borderColor: habit.color }}
        >
          {completed && (
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
          <XpPopup xpGained={xpGained} trigger={xpTrigger} />
        </button>

        {/* Icon */}
        <div className="text-2xl">{habit.icon}</div>

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
            className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full"
            style={{ backgroundColor: 'var(--bg-app)', color: 'var(--text-muted)' }}
          >
            {translatedFreq}
          </span>
        </div>

        {/* Edit / Delete */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onEdit(habit)}
            className="p-2 rounded-lg text-app-muted transition-all duration-150 hover:scale-110 active:scale-90"
            style={{ backgroundColor: 'transparent' }}
            title={t('common.edit')}
          >
            ✏️
          </button>

          {showConfirm ? (
            <div className="flex items-center gap-1">
              <button
                onClick={handleDelete}
                disabled={deleteHabit.isPending}
                className="px-2 py-1 text-xs font-medium text-white rounded-lg transition-all disabled:opacity-50"
                style={{ backgroundColor: 'var(--danger)' }}
              >
                {t('common.delete').includes('Eliminar') ? 'Sí' : 'Yes'}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-2 py-1 text-xs font-medium rounded-lg text-app-secondary transition-all"
                style={{ backgroundColor: 'var(--bg-app)', border: '1px solid var(--border)' }}
              >
                No
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirm(true)}
              className="p-2 rounded-lg text-app-muted transition-all duration-150 hover:scale-110 active:scale-90"
              title={t('common.delete')}
            >
              🗑️
            </button>
          )}
        </div>

        {/* Flash overlay */}
        {animating && completed && (
          <div
            className="absolute inset-0 rounded-xl opacity-30 pointer-events-none animate-ping"
            style={{ backgroundColor: 'var(--success)' }}
          />
        )}
      </div>

      {showLevelUp && (
        <LevelUpModal level={newLevel} onClose={() => setShowLevelUp(false)} />
      )}
    </>
  );
}
