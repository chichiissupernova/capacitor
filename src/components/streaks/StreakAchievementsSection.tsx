
import React from 'react';
import { Trophy } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { AchievementBadge } from '@/components/dashboard/AchievementBadge';
import { streakAchievements } from '@/utils/streakAchievements';

interface StreakAchievementsSectionProps {
  unlockedAchievementIds: string[];
}

export const StreakAchievementsSection: React.FC<StreakAchievementsSectionProps> = ({
  unlockedAchievementIds
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
          Streak Achievements
        </CardTitle>
        <CardDescription>
          Complete daily tasks consistently to unlock these badges
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {streakAchievements.map((achievement) => (
            <AchievementBadge
              key={achievement.id}
              name={achievement.name}
              description={`${achievement.description} (+${achievement.points} pts)`}
              icon={achievement.icon}
              unlocked={unlockedAchievementIds.includes(achievement.id)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
