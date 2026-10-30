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
      } else if (lastActive) {
        setStreak(1);
        localStorage.setItem('smartNotes_streak', '1');
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
    <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 rounded-full">
      <Flame className="w-4 h-4 text-orange-500" />
      <span className="text-sm font-bold text-orange-700 dark:text-orange-400">{streak}</span>
      <span className="text-xs text-orange-600 dark:text-orange-500">дней</span>
    </div>
  );
}
