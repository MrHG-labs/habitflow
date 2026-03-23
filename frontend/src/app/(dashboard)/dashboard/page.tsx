'use client';

import { useAuthStore } from '@/stores/authStore';
import { useHabits } from '@/hooks/useHabits';
import { useTodayProgress, useWeeklyProgress } from '@/hooks/useProgress';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { data: habits } = useHabits();
  const { data: todayProgress } = useTodayProgress();
  const { data: weekly } = useWeeklyProgress();

  const totalHabits = habits?.length ?? 0;
  const completedToday = todayProgress
    ? Object.values(todayProgress).filter(Boolean).length
    : 0;

  // Best current streak across all habits (derived from weekly for now)
  const maxWeeklyDay = weekly
    ? Math.max(...weekly.map((d) => d.completed))
    : 0;

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          Welcome back, {user?.username}! 👋
        </h2>
        <p className="text-gray-600">Here&apos;s your progress overview</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="text-sm text-gray-500 mb-1">Level</div>
          <div className="text-3xl font-bold text-indigo-600">{user?.level || 1}</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="text-sm text-gray-500 mb-1">Completed today</div>
          <div className="text-3xl font-bold text-green-600">
            {completedToday}
            <span className="text-lg text-gray-400 font-normal"> / {totalHabits}</span>
          </div>
          {totalHabits > 0 && (
            <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-2 bg-green-500 rounded-full transition-all duration-500"
                style={{ width: `${totalHabits ? (completedToday / totalHabits) * 100 : 0}%` }}
              />
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="text-sm text-gray-500 mb-1">Best day (7d)</div>
          <div className="text-3xl font-bold text-amber-500">
            {maxWeeklyDay}
            <span className="text-lg text-gray-400 font-normal"> habits</span>
          </div>
        </div>
      </div>

      {/* Weekly progress chart */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Weekly Progress</h3>
        {weekly && weekly.length > 0 ? (
          <div className="flex items-end gap-2 h-32">
            {weekly.map((day) => {
              const pct = totalHabits > 0 ? (day.completed / totalHabits) * 100 : 0;
              const isToday =
                day.date === new Date().toISOString().split('T')[0];
              return (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex items-end" style={{ height: '96px' }}>
                    <div
                      className={`w-full rounded-t-md transition-all duration-500 ${
                        isToday ? 'bg-indigo-500' : 'bg-indigo-200'
                      }`}
                      style={{ height: `${Math.max(pct, 4)}%` }}
                      title={`${day.completed} / ${totalHabits}`}
                    />
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(day.date + 'T12:00:00').toLocaleDateString('en', { weekday: 'narrow' })}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">No data yet. Start completing habits!</p>
        )}
      </div>

      {/* Total XP */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">Total XP</h3>
        <div className="text-3xl font-bold text-purple-600">{user?.xp ?? 0}</div>
        <p className="text-sm text-gray-500 mt-1">Keep completing habits to earn more XP!</p>
      </div>
    </div>
  );
}