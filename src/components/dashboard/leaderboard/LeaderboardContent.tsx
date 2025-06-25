
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trophy } from 'lucide-react';
import { LeaderboardUser, UserRank } from '@/hooks/useLeaderboard';
import { UserCard } from './UserCard';
import { UserRankDisplay } from './UserRankDisplay';

interface LeaderboardContentProps {
  topUsers: LeaderboardUser[];
  userRank: UserRank | null;
  user: any;
  isLoading: boolean;
  error: string | null;
  onRefetch: () => void;
}

export const LeaderboardContent: React.FC<LeaderboardContentProps> = ({
  topUsers,
  userRank,
  user,
  isLoading,
  error,
  onRefetch
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-20 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-2">Failed to load leaderboard</p>
        <Button variant="outline" onClick={onRefetch}>
          Try Again
        </Button>
      </div>
    );
  }

  if (topUsers.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Trophy className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>No creators on the leaderboard yet.</p>
        <p className="text-sm">Complete tasks to be the first!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top 3 creators */}
      {topUsers.map((topUser) => (
        <UserCard
          key={topUser.id}
          user={topUser}
          isAnimated={topUser.rank_change > 0}
        />
      ))}
      
      {/* User's rank if not in top 3 */}
      {user && userRank && !topUsers.find(u => u.id === user.id) && (
        <UserRankDisplay user={user} userRank={userRank} />
      )}
    </div>
  );
};
