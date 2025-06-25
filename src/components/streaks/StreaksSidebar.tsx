
import React from 'react';
import { StreakCounter } from '@/components/dashboard/StreakCounter';
import { StreakCalendar } from '@/components/dashboard/StreakCalendar';

interface StreaksSidebarProps {
  currentStreak: number;
  longestStreak: number;
}

export const StreaksSidebar: React.FC<StreaksSidebarProps> = ({
  currentStreak,
  longestStreak
}) => {
  // Generate proper streak days for the calendar - going backwards from today
  const streakDays = Array.from({ length: Math.min(currentStreak, 30) }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date;
  }).reverse(); // Reverse to get chronological order

  return (
    <div className="md:col-span-1 space-y-6">
      <StreakCounter 
        currentStreak={currentStreak} 
        longestStreak={longestStreak} 
        canRecoverStreak={false}
      />
      <StreakCalendar streakDays={streakDays} />
    </div>
  );
};
