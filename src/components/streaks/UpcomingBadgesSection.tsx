
import React from 'react';
import { Award } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { UpcomingBadge } from '@/data/badgeData';

interface UpcomingBadgesSectionProps {
  badges: UpcomingBadge[];
}

export const UpcomingBadgesSection: React.FC<UpcomingBadgesSectionProps> = ({ badges }) => {
  return (
    <div className="bg-white rounded-xl p-5 border border-border shadow-sm">
      <h3 className="font-semibold text-lg mb-4 flex items-center">
        <Award className="h-5 w-5 text-chichi-purple mr-2" />
        Up Next
      </h3>
      
      <div className="space-y-4">
        {badges.map(badge => (
          <div key={badge.id} className="p-3 border border-border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center text-lg">
                {badge.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-base">{badge.name}</h4>
                <p className="text-sm text-muted-foreground">{badge.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <Progress value={badge.progress} className="h-2" />
                  <span className="text-xs font-medium text-muted-foreground ml-3">
                    {badge.current}/{badge.target}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
