
import React from 'react';
import { Crown, Award, Trophy } from 'lucide-react';

interface LeaderboardRankIconProps {
  rank: number;
}

export const LeaderboardRankIcon: React.FC<LeaderboardRankIconProps> = ({ rank }) => {
  if (rank === 1) {
    return <Crown className="h-6 w-6 text-yellow-500" />;
  } else if (rank === 2) {
    return <Award className="h-6 w-6 text-gray-400" />;
  } else if (rank === 3) {
    return <Trophy className="h-6 w-6 text-amber-600" />;
  }
  return null;
};
