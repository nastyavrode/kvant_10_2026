import React, { useEffect, useState } from 'react';
import { Flame } from 'lucide-react';

export default function StreakBadge() {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const today = new Date().toDateString();
    const lastActive = localStorage.getItem('smartNotes_lastActive');
    const currentStreak = parseInt(localStorage.getItem('smartNotes_streak') || '0');

    if (lastActive !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastActive === yesterday.toDateString()) {
        setStreak(currentStreak + 1);
        localStorage.setItem('smartNotes_streak', (currentStreak + 1).toString());
      } else {
        setStreak(1);
        localStorage.setItem('smartNotes_streak', '1');
      }
      localStorage.setItem('smartNotes_lastActive', today);
    } else {
      setStreak(currentStreak);
    }
  }, []);

  if (streak === 0) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: 'rgba(251, 191, 36, 0.2)', border: '1px solid rgba(251, 191, 36, 0.3)' }}>
      <Flame className="w-4 h-4" style={{ color: '#FBBF24' }} />
      <span className="text-sm font-bold" style={{ color: '#FBBF24' }}>{streak}</span>
      <span className="text-xs" style={{ color: '#FCD34D' }}>дней</span>
    </div>
  );
}
