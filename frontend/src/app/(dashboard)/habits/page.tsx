'use client';

import { useState } from 'react';
import { Habit } from '@/types/habit';
import { useI18nStore } from '@/stores/i18nStore';
import HabitList from '@/components/habits/HabitList';
import HabitForm from '@/components/habits/HabitForm';

export default function HabitsPage() {
  const { t } = useI18nStore();
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  const handleAdd = () => {
    setEditingHabit(null);
    setShowForm(true);
  };

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingHabit(null);
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in-up">
        <div>
          <h2 className="text-2xl font-bold text-app-primary">{t('habits.title')}</h2>
          <p className="text-app-secondary">{t('habits.createFirst')}</p>
        </div>
        <button
          onClick={handleAdd}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 hover:scale-105 active:scale-95 text-white hover:shadow-lg"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          + {t('habits.add')}
        </button>
      </div>

      <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <HabitList onEdit={handleEdit} />
      </div>

      {showForm && (
        <HabitForm habit={editingHabit} onClose={handleClose} />
      )}
    </div>
  );
}