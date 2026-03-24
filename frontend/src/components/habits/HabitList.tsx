'use client';

import { useState } from 'react';
import { Habit } from '@/types/habit';
import { useHabits } from '@/hooks/useHabits';
import { useTodayProgress } from '@/hooks/useProgress';
import { useI18nStore } from '@/stores/i18nStore';
import HabitCard from './HabitCard';

interface HabitListProps {
  onEdit: (habit: Habit) => void;
}

const CATEGORY_META: Record<string, { icon: string; color: string; labelKey: string }> = {
  health:   { icon: '💪', color: '#22c55e', labelKey: 'categories.health' },
  work:     { icon: '💼', color: '#3b82f6', labelKey: 'categories.work' },
  personal: { icon: '💫', color: '#8b5cf6', labelKey: 'categories.personal' },
  other:    { icon: '✨', color: '#f97316', labelKey: 'categories.other' },
};

const CATEGORY_ORDER = ['health', 'work', 'personal', 'other'];

/* Skeleton loader */
function HabitSkeleton() {
  return (
    <div className="card p-4 flex items-center gap-4 animate-pulse">
      <div className="w-10 h-10 rounded-full" style={{ backgroundColor: 'var(--border)' }} />
      <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: 'var(--border)' }} />
      <div className="flex-1 space-y-2">
        <div className="h-4 rounded w-1/3" style={{ backgroundColor: 'var(--border)' }} />
        <div className="h-3 rounded w-1/2" style={{ backgroundColor: 'var(--bg-app)' }} />
      </div>
    </div>
  );
}

export default function HabitList({ onEdit }: HabitListProps) {
  const { t } = useI18nStore();
  const { data: habits, isLoading, error } = useHabits();
  const { data: todayProgress } = useTodayProgress();
  const [activeFilter, setActiveFilter] = useState<string>('all');

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => <HabitSkeleton key={i} />)}
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-5 border-l-4 rounded-xl flex items-center gap-3" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}>
        <span className="text-xl">⚠️</span>
        <p className="font-semibold text-sm">{t('common.error')}</p>
      </div>
    );
  }

  if (!habits || habits.length === 0) {
    return (
      <div className="card p-10 text-center flex flex-col items-center">
        <div className="text-5xl mb-4 grayscale opacity-30">🎯</div>
        <p className="font-bold text-xl text-app-primary mb-2">{t('habits.noHabits')}</p>
        <p className="max-w-[280px] text-app-secondary text-sm leading-relaxed">{t('habits.createFirst')}</p>
      </div>
    );
  }

  // Collect unique categories present in habits
  const presentCategories = Array.from(new Set(habits.map((h) => h.category || 'personal')));
  const orderedCategories = CATEGORY_ORDER.filter((c) => presentCategories.includes(c));
  // Include any unknown categories
  presentCategories.forEach((c) => { if (!orderedCategories.includes(c)) orderedCategories.push(c); });

  // Filter tabs: "all" + categories that have habits
  const filterOptions = ['all', ...orderedCategories];

  // Apply filter
  const filteredHabits = activeFilter === 'all'
    ? habits
    : habits.filter((h) => (h.category || 'personal') === activeFilter);

  // Group filtered habits by category
  const grouped: Record<string, Habit[]> = {};
  filteredHabits.forEach((habit) => {
    const cat = habit.category || 'personal';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(habit);
  });

  const groupKeys = activeFilter === 'all'
    ? CATEGORY_ORDER.filter((k) => grouped[k]?.length)
    : [activeFilter];

  let globalIndex = 0;

  return (
    <div className="space-y-6">
      {/* Category filter pills */}
      {orderedCategories.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {filterOptions.map((filter) => {
            const meta = CATEGORY_META[filter];
            const isActive = activeFilter === filter;
            const label = filter === 'all' ? t('categories.all') : t(meta?.labelKey || filter);
            const color = meta?.color ?? 'var(--accent)';

            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
                style={{
                  backgroundColor: isActive ? `${color}20` : 'var(--bg-card)',
                  border: `1.5px solid ${isActive ? color : 'var(--border)'}`,
                  color: isActive ? color : 'var(--text-muted)',
                  transform: isActive ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: isActive ? `0 0 0 3px ${color}15` : 'none',
                }}
              >
                {filter !== 'all' && <span>{meta?.icon}</span>}
                {label}
              </button>
            );
          })}
        </div>
      )}

      {/* Grouped habit sections */}
      {groupKeys.map((cat) => {
        const catHabits = grouped[cat] ?? [];
        if (catHabits.length === 0) return null;
        const meta = CATEGORY_META[cat] ?? { icon: '📂', color: 'var(--accent)', labelKey: cat };
        const catLabel = t(meta.labelKey);

        return (
          <div key={cat} className="space-y-3">
            {/* Section header — show only when "all" tab is active */}
            {activeFilter === 'all' && (
              <div className="flex items-center gap-2">
                <span
                  className="flex items-center justify-center w-7 h-7 rounded-lg text-sm shadow-sm"
                  style={{ backgroundColor: `${meta.color}20`, color: meta.color }}
                >
                  {meta.icon}
                </span>
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: meta.color }}>
                  {catLabel}
                </span>
                <div
                  className="flex-1 h-px"
                  style={{ backgroundColor: `${meta.color}30` }}
                />
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: `${meta.color}15`, color: meta.color }}
                >
                  {catHabits.length}
                </span>
              </div>
            )}

            {/* Habit cards */}
            <div className="space-y-3">
              {catHabits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  completed={todayProgress?.[habit.id] ?? false}
                  onEdit={onEdit}
                  index={globalIndex++}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
