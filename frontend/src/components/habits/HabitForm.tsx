'use client';

import { useState, useEffect } from 'react';
import { Habit, HabitCreate, HabitUpdate } from '@/types/habit';
import { useCreateHabit, useUpdateHabit } from '@/hooks/useHabits';

interface HabitFormProps {
  habit?: Habit | null;
  onClose: () => void;
}

const ICONS = ['📌', '💪', '📚', '💧', '🧘', '🏃', '🎯', '✍️', '🎵', '💤'];
const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#3b82f6', '#6b7280'];

export default function HabitForm({ habit, onClose }: HabitFormProps) {
  const createHabit = useCreateHabit();
  const updateHabit = useUpdateHabit();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('📌');
  const [color, setColor] = useState('#6366f1');
  const [frequency, setFrequency] = useState('daily');

  const isEditing = !!habit;

  useEffect(() => {
    if (habit) {
      setName(habit.name);
      setDescription(habit.description || '');
      setIcon(habit.icon);
      setColor(habit.color);
      setFrequency(habit.frequency);
    }
  }, [habit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && habit) {
      const data: HabitUpdate = { name, description: description || null, icon, color, frequency };
      updateHabit.mutate({ id: habit.id, data }, { onSuccess: onClose });
    } else {
      const data: HabitCreate = { name, description: description || null, icon, color, frequency };
      createHabit.mutate(data, { onSuccess: onClose });
    }
  };

  const isPending = createHabit.isPending || updateHabit.isPending;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* 5.2 Sheet on mobile, centered modal on sm+ */}
      <div
        className="card w-full sm:max-w-md p-6 rounded-t-2xl sm:rounded-2xl"
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Handle bar (mobile) */}
        <div className="flex justify-center mb-4 sm:hidden">
          <div className="w-10 h-1 rounded-full" style={{ backgroundColor: 'var(--border)' }} />
        </div>

        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-app-primary">
            {isEditing ? 'Edit Habit' : 'New Habit'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-app-muted transition-all hover:scale-110 active:scale-90"
            style={{ backgroundColor: 'var(--bg-app)' }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-1">
            <label htmlFor="habit-name" className="block text-sm font-medium text-app-secondary">Name</label>
            <input
              id="habit-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-lg text-app-primary text-sm focus:outline-none focus:ring-2 transition-all"
              style={{ backgroundColor: 'var(--bg-app)', border: '1px solid var(--border)' }}
              placeholder="e.g. Morning workout"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label htmlFor="habit-description" className="block text-sm font-medium text-app-secondary">Description</label>
            <input
              id="habit-description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg text-app-primary text-sm focus:outline-none focus:ring-2 transition-all"
              style={{ backgroundColor: 'var(--bg-app)', border: '1px solid var(--border)' }}
              placeholder="Optional"
            />
          </div>

          {/* Icon picker */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-app-secondary">Icon</label>
            <div className="flex flex-wrap gap-2">
              {ICONS.map((i) => (
                <button
                  key={i} type="button" onClick={() => setIcon(i)}
                  className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all duration-150 ${
                    icon === i ? 'ring-2 scale-110' : 'hover:scale-105'
                  }`}
                  style={{
                    backgroundColor: icon === i ? 'var(--accent-light)' : 'var(--bg-app)',
                    border: '1px solid var(--border)',
                  }}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          {/* Color picker */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-app-secondary">Color</label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((c) => (
                <button
                  key={c} type="button" onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full transition-all duration-150 ${color === c ? 'scale-125' : 'hover:scale-110'}`}
                  style={{
                    backgroundColor: c,
                    outline: color === c ? `3px solid var(--accent)` : 'none',
                    outlineOffset: '2px',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Frequency */}
          <div className="space-y-1">
            <label htmlFor="habit-frequency" className="block text-sm font-medium text-app-secondary">Frequency</label>
            <select
              id="habit-frequency"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg text-app-primary text-sm focus:outline-none focus:ring-2 transition-all"
              style={{ backgroundColor: 'var(--bg-app)', border: '1px solid var(--border)' }}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium text-app-secondary transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
              style={{ border: '1px solid var(--border)' }}
            >
              Cancel
            </button>
            <button
              type="submit" disabled={isPending}
              className="btn-primary flex-1 py-2.5 text-sm font-semibold disabled:opacity-50"
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Saving...
                </span>
              ) : isEditing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
