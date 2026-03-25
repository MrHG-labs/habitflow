'use client';

import React from 'react';

export type MedalTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';

interface EvolutiveMedalProps {
  tier: MedalTier;
  size?: number;
  className?: string;
}

export default function EvolutiveMedal({ tier, size = 120, className = "" }: EvolutiveMedalProps) {
  const colors = {
    Bronze: { main: '#b57a58', border: '#8c533c', accent: '#d99d7b' },
    Silver: { main: '#cbd5e1', border: '#94a3b8', accent: '#f8fafc' },
    Gold: { main: '#fbbf24', border: '#d97706', accent: '#fef3c7' },
    Platinum: { main: '#94a3b8', border: '#334155', accent: '#f1f5f9' },
    Diamond: { main: '#f1f5f9', border: '#0ea5e9', accent: '#ffffff' }
  };

  const c = colors[tier];

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xl overflow-visible">
        <defs>
          <linearGradient id={`grad-${tier}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={c.accent} />
            <stop offset="50%" stopColor={c.main} />
            <stop offset="100%" stopColor={c.border} />
          </linearGradient>
          <radialGradient id="shine-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="0.8" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* DIAMOND BACKGROUND RAYS */}
        {tier === 'Diamond' && (
          <g className="animate-pulse">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
              <path
                key={a}
                d="M60 60 L130 60"
                transform={`rotate(${a} 60 60)`}
                stroke={c.border}
                strokeWidth="1.5"
                strokeDasharray="5 10"
                opacity="0.3"
              />
            ))}
          </g>
        )}

        {/* WINGS (Platinum/Diamond) */}
        {(tier === 'Platinum' || tier === 'Diamond') && (
          <g fill={c.main} stroke={c.border} strokeWidth="1.5">
            {/* Left Wing - Elegant 3-layer Feather */}
            <path d="M40 60 C15 60, -5 45, 10 25 C15 40, 25 50, 40 55" />
            <path d="M40 70 C10 75, -10 60, 5 45 C15 55, 25 65, 40 68" />
            <path d="M40 80 C20 85, 5 75, 15 65 C25 70, 35 75, 40 78" />
            {/* Right Wing - Elegant 3-layer Feather */}
            <path d="M80 60 C105 60, 125 45, 110 25 C105 40, 95 50, 80 55" />
            <path d="M80 70 C110 75, 130 60, 115 45 C105 55, 95 65, 80 68" />
            <path d="M80 80 C100 85, 115 75, 105 65 C95 70, 85 75, 80 78" />
          </g>
        )}

        {/* OUTER BORDER (Concentric Effect) */}
        <circle cx="60" cy="60" r="48" fill="none" stroke={c.border} strokeWidth="2" opacity="0.2" />

        {/* MAIN BODY */}
        <circle cx="60" cy="60" r="42" fill={`url(#grad-${tier})`} stroke={c.border} strokeWidth="3" />
        
        {/* INNER RINGS */}
        {tier !== 'Bronze' && (
          <g>
            <circle cx="60" cy="60" r="37" stroke={c.accent} strokeWidth="1" strokeDasharray={tier === 'Silver' ? "3 3" : "none"} opacity="0.4" fill="none" />
            <circle cx="60" cy="60" r="32" stroke={c.border} strokeWidth="0.5" opacity="0.2" fill="none" />
          </g>
        )}

        {/* CROWN (Gold/Platinum) */}
        {(tier === 'Gold' || tier === 'Platinum') && (
          <path 
            d="M50 30 L45 20 L52 24 L60 15 L68 24 L75 20 L70 30 Z" 
            fill={c.border} 
            stroke={c.accent} 
            strokeWidth="0.5"
          />
        )}

        {/* SHINE EFFECT */}
        <path d="M35 45 C35 35, 45 25, 60 25" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.2" />

        {/* CENTRAL SYMBOL */}
        {tier === 'Diamond' ? (
          <g transform="translate(48, 48) scale(1.2)">
            <path d="M10 5 L18 5 L20 10 L10 25 L0 10 L2 5 Z" fill="white" stroke={c.border} strokeWidth="1.5" />
            <line x1="2" y1="5" x2="18" y2="5" stroke={c.border} strokeWidth="0.5" />
            <line x1="2" y1="5" x2="10" y2="25" stroke={c.border} strokeWidth="0.5" />
            <line x1="18" y1="5" x2="10" y2="25" stroke={c.border} strokeWidth="0.5" />
          </g>
        ) : (
          <circle cx="60" cy="60" r="2" fill={c.border} opacity="0.2" />
        )}
      </svg>
    </div>
  );
}
