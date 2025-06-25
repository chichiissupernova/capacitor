
import React from 'react';
import { useAuth } from '@/contexts/auth/useAuth';
import { Leaderboard } from '@/components/dashboard/Leaderboard';
import { StreakPageHeader } from '@/components/streaks/StreakPageHeader';
import { StreaksSidebar } from '@/components/streaks/StreaksSidebar';
import { StreaksMainContent } from '@/components/streaks/StreaksMainContent';
import { sampleBadges, upcomingBadges } from '@/data/badgeData';

const StreaksPage = () => {
  const { user } = useAuth();
  
  console.log('StreaksPage rendering with user:', !!user, user?.email);
  
  // Use the user's real streak data instead of hardcoded values
  const userStats = {
    currentStreak: user?.currentStreak || 0,
    longestStreak: user?.longestStreak || 0,
  };
  
  // Get unlockedAchievements from user data
  const unlockedAchievementIds = user?.unlockedAchievements || [];
  
  console.log('StreaksPage userStats:', userStats);
  
  return (
    <div className="animate-fade-in">
      <StreakPageHeader />
      
      {/* Leaderboard at the top */}
      <div className="mb-8">
        <Leaderboard />
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StreaksSidebar 
          currentStreak={userStats.currentStreak}
          longestStreak={userStats.longestStreak}
        />
        
        <StreaksMainContent
          unlockedAchievementIds={unlockedAchievementIds}
          badges={sampleBadges}
          upcomingBadges={upcomingBadges}
        />
      </div>
    </div>
  );
};

export default StreaksPage;
