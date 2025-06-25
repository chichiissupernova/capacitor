
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, Flame, Calendar } from 'lucide-react';

interface DailyChallengeCardProps {
  challenge: {
    id: string;
    currentDay: number;
    todayPoints: number;
    totalPoints: number;
    myRank: number;
    opponents: Array<{
      id: string;
      name: string;
      avatar?: string;
      points: number;
      rank: number;
    }>;
  };
}

export const DailyChallengeCard: React.FC<DailyChallengeCardProps> = ({
  challenge
}) => {
  const progressPercentage = (challenge.currentDay / 5) * 100;
  const opponent = challenge.opponents.find(opp => opp.name !== 'You');
  const isWinning = challenge.myRank === 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-chichi-orange" />
            5-Day Challenge
          </div>
          <Badge variant={isWinning ? "default" : "outline"}>
            {isWinning ? "🥇 Leading" : `#${challenge.myRank}`}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Day {challenge.currentDay} of 5
            </span>
            <span className="text-sm text-gray-500">
              {5 - challenge.currentDay} days left
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Today's Performance */}
        <div className="bg-gradient-to-r from-orange-50 to-purple-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Today's Points</p>
              <p className="text-2xl font-bold text-chichi-orange flex items-center gap-1">
                <Flame className="h-5 w-5" />
                {challenge.todayPoints}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Points</p>
              <p className="text-2xl font-bold text-chichi-purple">
                {challenge.totalPoints}
              </p>
            </div>
          </div>
        </div>

        {/* Opponent Comparison */}
        {opponent && (
          <div className="border rounded-lg p-4">
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Target className="h-4 w-4" />
              vs {opponent.name}
            </h4>
            <div className="flex items-center justify-between">
              <div className="text-center">
                <p className="text-xs text-gray-600">You</p>
                <p className="text-lg font-bold text-chichi-orange">{challenge.totalPoints}</p>
              </div>
              <div className="text-gray-400 font-bold">VS</div>
              <div className="text-center">
                <p className="text-xs text-gray-600">{opponent.name}</p>
                <p className="text-lg font-bold text-chichi-purple">{opponent.points}</p>
              </div>
            </div>
            <div className="mt-3 text-center">
              {challenge.totalPoints > opponent.points ? (
                <Badge className="bg-green-500 text-white">
                  Leading by {challenge.totalPoints - opponent.points} points
                </Badge>
              ) : challenge.totalPoints < opponent.points ? (
                <Badge variant="outline" className="text-orange-600 border-orange-300">
                  Behind by {opponent.points - challenge.totalPoints} points
                </Badge>
              ) : (
                <Badge variant="secondary">Tied!</Badge>
              )}
            </div>
          </div>
        )}

        {/* Motivational Message */}
        <div className="text-center">
          <p className="text-sm text-gray-600 italic">
            {isWinning 
              ? "Keep it up! You're in the lead! 🔥" 
              : "Time to step up your game! You've got this! 💪"
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
