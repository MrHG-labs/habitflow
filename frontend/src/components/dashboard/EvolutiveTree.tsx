'use client';

import React from 'react';

interface EvolutiveTreeProps {
  level: number;
  size?: number;
  className?: string;
}

export default function EvolutiveTree({ level, size = 40, className = "" }: EvolutiveTreeProps) {
  // Clamp level between 1 and 10
  const currentLevel = Math.max(1, Math.min(10, level));

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md overflow-visible">
        {/* GROUND / POT (Present in all levels) */}
        <path d="M20 85 Q50 95 80 85" fill="none" stroke="#8b4513" strokeWidth="2" opacity="0.4" />
        
        {/* LEVEL 1: SEED */}
        {currentLevel >= 1 && (
          <ellipse cx="50" cy="85" rx="6" ry="4" fill="#a16207" />
        )}

        {/* LEVEL 2: SPROUT */}
        {currentLevel >= 2 && (
          <path d="M50 82 Q45 75 42 70" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
        )}

        {/* LEVEL 3: TWO LEAVES */}
        {currentLevel >= 3 && (
          <g>
            <path d="M42 70 Q35 70 30 65" fill="none" stroke="#22c55e" strokeWidth="2.5" />
            <path d="M42 70 Q50 70 55 65" fill="none" stroke="#22c55e" strokeWidth="2.5" />
            <circle cx="30" cy="65" r="3" fill="#4ade80" />
            <circle cx="55" cy="65" r="3" fill="#4ade80" />
          </g>
        )}

        {/* LEVEL 4: GROWING STEM */}
        {currentLevel >= 4 && (
          <path d="M50 82 L50 60" fill="none" stroke="#16a34a" strokeWidth="4" strokeLinecap="round" />
        )}

        {/* LEVEL 5: BUSHY LEAVES */}
        {currentLevel >= 5 && (
          <g fill="#22c55e" opacity="0.8">
            <circle cx="40" cy="55" r="8" />
            <circle cx="60" cy="55" r="8" />
            <circle cx="50" cy="45" r="10" />
          </g>
        )}

        {/* LEVEL 6: BROWN TRUNK */}
        {currentLevel >= 6 && (
          <path d="M50 82 L50 40" fill="none" stroke="#713f12" strokeWidth="6" strokeLinecap="round" />
        )}

        {/* LEVEL 7: ADULT CANOPY */}
        {currentLevel >= 7 && (
          <g fill="#15803d">
            <circle cx="35" cy="45" r="12" />
            <circle cx="65" cy="45" r="12" />
            <circle cx="50" cy="30" r="15" />
            <circle cx="50" cy="50" r="14" />
          </g>
        )}

        {/* LEVEL 8: FLOWERS (Pink Dots) */}
        {currentLevel >= 8 && (
          <g fill="#f472b6">
            <circle cx="30" cy="45" r="2" />
            <circle cx="70" cy="45" r="2" />
            <circle cx="50" cy="25" r="2" />
            <circle cx="40" cy="35" r="2" />
            <circle cx="60" cy="35" r="2" />
          </g>
        )}

        {/* LEVEL 9: FRUITS (Red Apples) */}
        {currentLevel >= 9 && (
          <g fill="#ef4444">
            <circle cx="35" cy="52" r="3" />
            <circle cx="65" cy="52" r="3" />
            <circle cx="55" cy="40" r="3" />
            <circle cx="45" cy="40" r="3" />
            <circle cx="50" cy="60" r="3" />
          </g>
        )}

        {/* LEVEL 10: WORLD TREE GLOW & CROWN */}
        {currentLevel >= 10 && (
          <g>
            <circle cx="50" cy="40" r="45" fill="none" stroke="#fbbf24" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" className="animate-spin-slow" />
            {/* Crown icon on top */}
            <path d="M40 20 L45 12 L50 16 L55 12 L60 20 Z" fill="#fbbf24" className="animate-bounce" style={{ animationDuration: '3s' }} />
          </g>
        )}
      </svg>
      
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          transform-origin: center;
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
