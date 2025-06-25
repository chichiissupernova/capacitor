
import React from 'react';
import { ErrorBoundary } from '@/components/errors/ErrorBoundary';
import { StreakPointsSection } from '@/components/dashboard/StreakPointsSection';
import { WorkflowSection } from '@/components/dashboard/WorkflowSection';
import { TodaysMotivation } from '@/components/dashboard/TodaysMotivation';
import { UpcomingPosts } from '@/components/dashboard/UpcomingPosts';
import { QuickActionsSection } from '@/components/dashboard/QuickActionsSection';
import { YourWinsSection } from '@/components/dashboard/wins/YourWinsSection';
import { Leaderboard } from '@/components/dashboard/Leaderboard';
import { useIsMobile } from '@/hooks/use-mobile';

interface DashboardContentProps {
  userStats: {
    currentStreak: number;
    longestStreak: number;
    totalPoints: number;
    levelPoints: number;
    maxLevelPoints: number;
    level: number;
  };
  canRecoverStreak: boolean;
  upcomingPosts: any[];
  isLoadingPosts: boolean;
  handleCompletePost: (id: string) => Promise<void>;
}

export const DashboardContent: React.FC<DashboardContentProps> = ({
  userStats,
  canRecoverStreak,
  upcomingPosts,
  isLoadingPosts,
  handleCompletePost
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-3 md:space-y-6">
      {/* Content Workflow - Optimized for mobile */}
      <ErrorBoundary>
        <WorkflowSection />
      </ErrorBoundary>
      
      {/* Creator Progress */}
      <ErrorBoundary>
        <StreakPointsSection 
          currentStreak={userStats.currentStreak}
          longestStreak={userStats.longestStreak}
          totalPoints={userStats.totalPoints}
          levelPoints={userStats.levelPoints}
          maxLevelPoints={userStats.maxLevelPoints}
          level={userStats.level}
          canRecoverStreak={canRecoverStreak}
        />
      </ErrorBoundary>

      {/* Your Wins Section */}
      <ErrorBoundary>
        <YourWinsSection />
      </ErrorBoundary>
      
      {/* Additional sections in a mobile-optimized layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
        {/* Today's Motivation - Full width on mobile */}
        <div className="md:col-span-1 order-2 md:order-1">
          <ErrorBoundary>
            <TodaysMotivation />
          </ErrorBoundary>
        </div>
        
        {/* Quick Actions + Upcoming posts - Full width on mobile */}
        <div className="md:col-span-2 order-1 md:order-2 space-y-3 md:space-y-6">
          {/* Quick Actions Section */}
          <ErrorBoundary>
            <QuickActionsSection />
          </ErrorBoundary>
          
          {/* Upcoming Posts */}
          <ErrorBoundary>
            <UpcomingPosts 
              posts={upcomingPosts} 
              onComplete={handleCompletePost}
              isLoading={isLoadingPosts} 
            />
          </ErrorBoundary>
        </div>
      </div>

      {/* Leaderboard at the bottom */}
      <ErrorBoundary>
        <Leaderboard />
      </ErrorBoundary>
    </div>
  );
};
