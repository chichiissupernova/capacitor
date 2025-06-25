
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, Target } from 'lucide-react';

interface LeaderboardUser {
  id: string;
  name: string;
  avatar?: string;
  points: number;
  rank: number;
  isMe?: boolean;
  todayPoints?: number;
}

interface ChallengeLeaderboardProps {
  users: LeaderboardUser[];
  challengeDay: number;
  totalDays: number;
}

export const ChallengeLeaderboard: React.FC<ChallengeLeaderboardProps> = ({
  users,
  challengeDay,
  totalDays
}) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-sm font-bold text-gray-500">#{rank}</span>;
    }
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return <Badge className="bg-yellow-500 text-white">🥇 1st</Badge>;
      case 2:
        return <Badge className="bg-gray-400 text-white">🥈 2nd</Badge>;
      case 3:
        return <Badge className="bg-amber-600 text-white">🥉 3rd</Badge>;
      default:
        return <Badge variant="outline">#{rank}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-chichi-orange" />
            Challenge Leaderboard
          </div>
          <Badge variant="secondary">
            Day {challengeDay}/{totalDays}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {users.map((user) => (
            <div
              key={user.id}
              className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                user.isMe 
                  ? 'bg-gradient-to-r from-orange-50 to-purple-50 border-orange-200 ring-2 ring-orange-200' 
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8">
                  {getRankIcon(user.rank)}
                </div>
                
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>
                    {user.name[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {user.isMe ? 'You' : user.name}
                    </span>
                    {user.isMe && <Badge variant="accent" className="text-xs">You</Badge>}
                  </div>
                  {user.todayPoints !== undefined && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Target className="h-3 w-3" />
                      +{user.todayPoints} today
                    </div>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                {getRankBadge(user.rank)}
                <p className="text-lg font-bold text-chichi-orange mt-1">
                  {user.points} pts
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
