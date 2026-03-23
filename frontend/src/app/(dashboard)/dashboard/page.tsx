'use client';

import { useAuthStore } from '@/stores/authStore';

export default function DashboardPage() {
  const { user } = useAuthStore();

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          Welcome back, {user?.username}!
        </h2>
        <p className="text-gray-600">Here&apos;s your progress overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="text-sm text-gray-500 mb-1">Level</div>
          <div className="text-3xl font-bold text-indigo-600">{user?.level || 1}</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="text-sm text-gray-500 mb-1">Total XP</div>
          <div className="text-3xl font-bold text-purple-600">{user?.xp || 0}</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="text-sm text-gray-500 mb-1">Current Streak</div>
          <div className="text-3xl font-bold text-amber-500">0</div>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-indigo-50 rounded-lg text-center hover:bg-indigo-100 transition-colors">
            <div className="text-2xl mb-1">+</div>
            <div className="text-sm font-medium text-indigo-700">Add Habit</div>
          </button>
          <button className="p-4 bg-purple-50 rounded-lg text-center hover:bg-purple-100 transition-colors">
            <div className="text-2xl mb-1">🔥</div>
            <div className="text-sm font-medium text-purple-700">View Streaks</div>
          </button>
          <button className="p-4 bg-amber-50 rounded-lg text-center hover:bg-amber-100 transition-colors">
            <div className="text-2xl mb-1">📊</div>
            <div className="text-sm font-medium text-amber-700">Statistics</div>
          </button>
          <button className="p-4 bg-green-50 rounded-lg text-center hover:bg-green-100 transition-colors">
            <div className="text-2xl mb-1">🎯</div>
            <div className="text-sm font-medium text-green-700">Goals</div>
          </button>
        </div>
      </div>
    </div>
  );
}