'use client';

import { useEffect, useState } from 'react';

interface XpPopupProps {
  xpGained: number;
  trigger: number; // increment this to retrigger
}

/**
 * Shows a floating "+10 XP" popup that fades out automatically.
 * Trigger prop controls when a new animation fires.
 */
export default function XpPopup({ xpGained, trigger }: XpPopupProps) {
  const [visible, setVisible] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (trigger === 0) return;
    setVisible(true);
    setKey((k) => k + 1);
    const timeout = setTimeout(() => setVisible(false), 1500);
    return () => clearTimeout(timeout);
  }, [trigger]);

  if (!visible || xpGained <= 0) return null;

  return (
    <span
      key={key}
      className="pointer-events-none absolute -top-5 -right-2 text-sm font-bold whitespace-nowrap"
      style={{
        animation: 'xpFloat 1.5s ease-out forwards',
        background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        filter: 'drop-shadow(0 2px 4px rgba(34, 197, 94, 0.3))',
      }}
    >
      +{xpGained} XP
    </span>
  );
}
