'use client';

import { useEffect } from 'react';

interface LevelUpModalProps {
  level: number;
  onClose: () => void;
}

/**
 * Full-screen celebration modal shown when the user levels up.
 * Auto-closes after 3 seconds.
 */
export default function LevelUpModal({ level, onClose }: LevelUpModalProps) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="bg-white rounded-2xl shadow-2xl p-10 text-center max-w-sm mx-4 animate-bounce">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-bold text-indigo-600 mb-2">Level Up!</h2>
        <p className="text-xl text-gray-700 font-semibold mb-1">
          You reached <span className="text-indigo-600">Level {level}</span>!
        </p>
        <p className="text-gray-500 text-sm mt-3">Keep building those habits! 💪</p>
        <button
          onClick={onClose}
          className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors text-sm font-medium"
        >
          Let&apos;s go!
        </button>
      </div>
    </div>
  );
}
