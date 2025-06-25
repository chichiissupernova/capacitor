
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Trophy, Zap, Target, Flame } from 'lucide-react';
import { Challenge } from '@/hooks/useChallenges';

interface PlayerVsPlayerCardProps {
  challenge: Challenge;
  currentUserId: string;
}

export const PlayerVsPlayerCard: React.FC<PlayerVsPlayerCardProps> = ({
  challenge,
  currentUserId
}) => {
  const isUserChallenger = challenge.challenger_id === currentUserId;
  const player1 = isUserChallenger ? 
    { 
      name: 'You', 
      avatar: null, 
      points: challenge.challenger_points,
      isCurrentUser: true 
    } : 
    { 
      name: challenge.challenger_profile?.name || 'Player 1', 
      avatar: challenge.challenger_profile?.avatar_url, 
      points: challenge.challenger_points,
      isCurrentUser: false 
    };
  
  const player2 = isUserChallenger ? 
    { 
      name: challenge.opponent_profile?.name || 'Player 2', 
      avatar: challenge.opponent_profile?.avatar_url, 
      points: challenge.opponent_points,
      isCurrentUser: false 
    } : 
    { 
      name: 'You', 
      avatar: null, 
      points: challenge.opponent_points,
      isCurrentUser: true 
    };

  const getCurrentDay = () => {
    const startDate = new Date(challenge.start_date);
    const today = new Date();
    const diffTime = today.getTime() - startDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(1, Math.min(diffDays, challenge.challenge_length));
  };

  const currentDay = getCurrentDay();
  const isActive = challenge.status === 'active';

  return (
    <Card className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white border-2 border-purple-500 shadow-2xl">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Battle Status Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Flame className="h-6 w-6 text-orange-500" />
              <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                SHOWDOWN IN PROGRESS
              </h2>
              <Flame className="h-6 w-6 text-orange-500" />
            </div>
            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 text-sm px-4 py-1">
              Day {currentDay} of {challenge.challenge_length}
            </Badge>
          </div>

          {/* VS Section */}
          <div className="relative">
            <div className="grid grid-cols-3 items-center gap-4">
              {/* Player 1 */}
              <div className={`text-center space-y-3 ${player1.isCurrentUser ? 'ring-2 ring-orange-400 rounded-lg p-4 bg-orange-500/10' : ''}`}>
                <div className="relative">
                  <Avatar className="h-16 w-16 mx-auto border-4 border-blue-400">
                    <AvatarImage src={player1.avatar || ""} />
                    <AvatarFallback className="bg-blue-500 text-white text-xl font-bold">
                      {player1.name[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {player1.isCurrentUser && (
                    <div className="absolute -top-2 -right-2 bg-orange-500 rounded-full p-1">
                      <Zap className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-blue-300">
                    {player1.name}
                  </h3>
                  <div className="flex items-center justify-center gap-1 text-2xl font-bold text-yellow-400">
                    <Trophy className="h-5 w-5" />
                    {player1.points}
                  </div>
                  <p className="text-xs text-blue-200">PLAYER ONE</p>
                </div>
              </div>

              {/* VS Badge */}
              <div className="text-center">
                <div className="relative">
                  <div className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 rounded-full p-4 mx-auto w-fit">
                    <span className="text-2xl font-black text-white">VS</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 rounded-full animate-pulse opacity-50"></div>
                </div>
              </div>

              {/* Player 2 */}
              <div className={`text-center space-y-3 ${player2.isCurrentUser ? 'ring-2 ring-orange-400 rounded-lg p-4 bg-orange-500/10' : ''}`}>
                <div className="relative">
                  <Avatar className="h-16 w-16 mx-auto border-4 border-red-400">
                    <AvatarImage src={player2.avatar || ""} />
                    <AvatarFallback className="bg-red-500 text-white text-xl font-bold">
                      {player2.name[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {player2.isCurrentUser && (
                    <div className="absolute -top-2 -right-2 bg-orange-500 rounded-full p-1">
                      <Zap className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-red-300">
                    {player2.name}
                  </h3>
                  <div className="flex items-center justify-center gap-1 text-2xl font-bold text-yellow-400">
                    <Trophy className="h-5 w-5" />
                    {player2.points}
                  </div>
                  <p className="text-xs text-red-200">PLAYER TWO</p>
                </div>
              </div>
            </div>
          </div>

          {/* Battle Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-300">Battle Progress</span>
              <span className="text-orange-400 font-bold">{currentDay}/{challenge.challenge_length} Days</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(currentDay / challenge.challenge_length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Today's Challenge */}
          {isActive && (
            <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg p-4 border border-purple-400">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-5 w-5 text-purple-400" />
                <span className="font-bold text-purple-300">Today's Mission</span>
              </div>
              <p className="text-sm text-gray-300">
                Complete your daily CHICHI tasks to earn points and dominate the leaderboard!
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
