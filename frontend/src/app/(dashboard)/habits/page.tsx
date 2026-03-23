'use client';

import { useState } from 'react';
import { Habit } from '@/types/habit';
import HabitList from '@/components/habits/HabitList';
import HabitForm from '@/components/habits/HabitForm';

export default function HabitsPage() {
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
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">My Habits</h2>
          <p className="text-gray-600">Manage your daily habits</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          + Add Habit
        </button>
      </div>

      <HabitList onEdit={handleEdit} />

      {showForm && (
        <HabitForm habit={editingHabit} onClose={handleClose} />
      )}
    </div>
  );
}