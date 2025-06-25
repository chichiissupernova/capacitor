
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserRank } from '@/hooks/useLeaderboard';

interface UserRankDisplayProps {
  user: {
    id: string;
    name?: string;
    username?: string;
    avatarUrl?: string;
  };
  userRank: UserRank;
}

export const UserRankDisplay: React.FC<UserRankDisplayProps> = ({ user, userRank }) => {
  // Use username if available, otherwise fall back to name
  const displayName = user.username || user.name || 'You';

  return (
    <div className="mt-6 pt-4 border-t border-gray-200">
      <div className="bg-chichi-purple-soft rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatarUrl || ""} alt={displayName} />
              <AvatarFallback>{displayName[0]?.toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <span className="font-medium text-gray-900">You're #{userRank.rank}</span>
              <div className="text-sm text-gray-600">
                {userRank.points.toLocaleString()} points
              </div>
            </div>
          </div>
          <div className="text-right text-sm text-gray-500">
            of {userRank.total_users} creators
          </div>
        </div>
      </div>
    </div>
  );
};
