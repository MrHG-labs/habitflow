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

  useEffect(() => {
    if (trigger === 0) return;
    setVisible(true);
    const timeout = setTimeout(() => setVisible(false), 1200);
    return () => clearTimeout(timeout);
  }, [trigger]);

  if (!visible || xpGained <= 0) return null;

  return (
    <span
      className="pointer-events-none absolute -top-4 right-1 text-sm font-bold text-green-600 animate-bounce"
      style={{ animation: 'xpFloat 1.2s ease-out forwards' }}
    >
      +{xpGained} XP
    </span>
  );
}
