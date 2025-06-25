
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Flame, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LeaderboardUser } from '@/hooks/useLeaderboard';
import { LeaderboardRankIcon } from './LeaderboardRankIcon';

interface UserCardProps {
  user: LeaderboardUser;
  isAnimated?: boolean;
}

export const UserCard: React.FC<UserCardProps> = ({ user, isAnimated = false }) => {
  const getBorderColor = (rank: number) => {
    if (rank === 1) return "border-yellow-400 bg-gradient-to-r from-yellow-50 to-yellow-100";
    if (rank === 2) return "border-gray-400 bg-gradient-to-r from-gray-50 to-gray-100";
    if (rank === 3) return "border-amber-600 bg-gradient-to-r from-amber-50 to-amber-100";
    return "border-gray-200 bg-white";
  };

  // Use username if available, otherwise fall back to name
  const displayName = user.username || user.name;

  return (
    <div className={cn(
      "relative p-4 rounded-lg border-2 transition-all duration-300",
      getBorderColor(user.rank),
      isAnimated && "animate-pulse"
    )}>
      {/* Rank badge */}
      <div className="absolute -top-2 -left-2">
        <div className={cn(
          "flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold",
          user.rank === 1 && "bg-yellow-500 text-white",
          user.rank === 2 && "bg-gray-400 text-white",
          user.rank === 3 && "bg-amber-600 text-white"
        )}>
          {user.rank}
        </div>
      </div>

      {/* Crown for first place */}
      {user.rank <= 3 && (
        <div className="absolute -top-3 right-2">
          <LeaderboardRankIcon rank={user.rank} />
        </div>
      )}

      <div className="flex items-center gap-3 mt-2">
        <Avatar className="h-12 w-12">
          <AvatarImage src={user.avatar_url || ""} alt={displayName} />
          <AvatarFallback>{displayName[0]?.toUpperCase() || "U"}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">{displayName}</h3>
            {user.rank_change > 0 && (
              <Badge variant="accent" className="text-xs">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{user.rank_change}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-4 mt-1">
            <span className="text-lg font-bold text-chichi-purple">
              {user.points.toLocaleString()} pts
            </span>
            
            {user.current_streak > 0 && (
              <div className="flex items-center gap-1 text-sm text-orange-600">
                <Flame className="h-4 w-4" />
                <span>{user.current_streak}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sparkle animation for rank changes */}
      {user.rank_change > 0 && (
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-yellow-200/20 to-orange-200/20 animate-pulse" />
      )}
    </div>
  );
};
