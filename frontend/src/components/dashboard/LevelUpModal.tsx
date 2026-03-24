'use client';

import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

interface LevelUpModalProps {
  level: number;
  onClose: () => void;
}

/**
 * Full-screen celebration modal shown when the user levels up.
 * Auto-closes after 4 seconds with confetti celebration.
 */
export default function LevelUpModal({ level, onClose }: LevelUpModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger confetti on mount
    const duration = 2000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#6366f1', '#a855f7', '#f59e0b', '#22c55e'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#6366f1', '#a855f7', '#f59e0b', '#22c55e'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    // Show modal with animation
    setTimeout(() => setIsVisible(true), 100);

    // Auto close after 4 seconds
    const t = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 4000);

    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl p-10 text-center max-w-sm mx-4 transition-all duration-500 ${
          isVisible ? 'scale-100 translate-y-0 opacity-100' : 'scale-75 translate-y-4 opacity-0'
        }`}
        style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
      >
        <div className="text-7xl mb-4 animate-bounce" style={{ animationDuration: '0.6s' }}>🎉</div>
        <h2
          className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2"
          style={{ animation: 'pulse 1s ease-in-out infinite' }}
        >
          Level Up!
        </h2>
        <p className="text-xl text-gray-700 font-semibold mb-1">
          You reached{' '}
          <span
            className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 font-bold"
          >
            Level {level}
          </span>
          !
        </p>
        <p className="text-gray-500 text-sm mt-3">Keep building those habits! 💪</p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="mt-6 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 text-sm font-medium hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
        >
          Let&apos;s go!
        </button>
      </div>
    </div>
  );
}
