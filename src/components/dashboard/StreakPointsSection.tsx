
import React from 'react';
import { ErrorBoundary } from '@/components/errors/ErrorBoundary';
import { StreakCounter } from '@/components/dashboard/StreakCounter';
import { PointsCard } from '@/components/dashboard/PointsCard';
import { Card } from '@/components/ui/card';
import { SyncStatusIndicator } from '@/components/sync/SyncStatusIndicator';
import { useIsMobile } from '@/hooks/use-mobile';

interface StreakPointsSectionProps {
  currentStreak: number;
  longestStreak: number;
  totalPoints: number;
  levelPoints: number;
  maxLevelPoints: number;
  level: number;
  canRecoverStreak: boolean;
}

export const StreakPointsSection: React.FC<StreakPointsSectionProps> = ({
  currentStreak,
  longestStreak,
  totalPoints,
  levelPoints,
  maxLevelPoints,
  level,
  canRecoverStreak
}) => {
  const isMobile = useIsMobile();
  
  return (
    <Card className="p-3 md:p-6 relative">
      <SyncStatusIndicator className="absolute top-2 right-2" />
      <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Your Creator Progress</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
        <ErrorBoundary>
          <StreakCounter 
            currentStreak={currentStreak} 
            longestStreak={longestStreak} 
            canRecoverStreak={canRecoverStreak}
          />
        </ErrorBoundary>
        <ErrorBoundary>
          <PointsCard 
            totalPoints={totalPoints}
            levelPoints={levelPoints}
            maxLevelPoints={maxLevelPoints}
            level={level}
          />
        </ErrorBoundary>
      </div>
    </Card>
  );
};
