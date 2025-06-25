
import { cn } from '@/lib/utils';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

interface BadgeDisplayProps {
  badges: Badge[];
  className?: string;
}

export const BadgeDisplay = ({ badges, className }: BadgeDisplayProps) => {
  const unlockedBadges = badges.filter(badge => badge.unlocked);
  const lockedBadges = badges.filter(badge => !badge.unlocked);
  
  return (
    <div className={cn("bg-white rounded-xl p-5 border border-border shadow-sm", className)}>
      <h3 className="font-semibold text-lg mb-4">Badges & Achievements</h3>
      
      {unlockedBadges.length > 0 ? (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {unlockedBadges.map(badge => (
            <div key={badge.id} className="badge-container flex flex-col items-center">
              <div className="badge-glow"></div>
              <div className="relative bg-gradient-to-br from-chichi-purple to-chichi-pink rounded-full p-3 text-white mb-2">
                {badge.icon}
              </div>
              <span className="text-xs font-medium text-center">{badge.name}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground mb-6">Complete tasks to earn your first badge!</p>
      )}
      
      {lockedBadges.length > 0 && (
        <>
          <h4 className="text-sm font-medium text-muted-foreground mb-3">Locked Badges</h4>
          <div className="grid grid-cols-3 gap-4 opacity-40">
            {lockedBadges.slice(0, 3).map(badge => (
              <div key={badge.id} className="flex flex-col items-center">
                <div className="bg-muted rounded-full p-3 mb-2">
                  {badge.icon}
                </div>
                <span className="text-xs font-medium text-center">???</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
