
import React from 'react';
import { BadgeDisplay } from '@/components/dashboard/BadgeDisplay';
import { StreakAchievementsSection } from './StreakAchievementsSection';
import { UpcomingBadgesSection } from './UpcomingBadgesSection';
import { BadgeEarningGuide } from './BadgeEarningGuide';
import { Badge, UpcomingBadge } from '@/data/badgeData';

interface StreaksMainContentProps {
  unlockedAchievementIds: string[];
  badges: Badge[];
  upcomingBadges: UpcomingBadge[];
}

export const StreaksMainContent: React.FC<StreaksMainContentProps> = ({
  unlockedAchievementIds,
  badges,
  upcomingBadges
}) => {
  return (
    <div className="md:col-span-2 space-y-6">
      <StreakAchievementsSection unlockedAchievementIds={unlockedAchievementIds} />
      <BadgeDisplay badges={badges} />
      <UpcomingBadgesSection badges={upcomingBadges} />
      <BadgeEarningGuide />
    </div>
  );
};
