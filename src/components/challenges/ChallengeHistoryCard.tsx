
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Calendar, Users, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface ChallengeHistoryCardProps {
  challenge: {
    id: string;
    duration: number;
    completedAt: string;
    myPoints: number;
    opponentPoints: number;
    winner: 'me' | 'opponent' | 'tie';
    opponent: {
      name: string;
      avatar?: string;
    };
  };
  onShare?: (challengeId: string) => void;
  onRematch?: (challengeId: string) => void;
}

export const ChallengeHistoryCard: React.FC<ChallengeHistoryCardProps> = ({
  challenge,
  onShare,
  onRematch
}) => {
  const getWinnerBadge = () => {
    if (challenge.winner === 'me') {
      return <Badge className="bg-green-500 text-white">🏆 Winner</Badge>;
    } else if (challenge.winner === 'tie') {
      return <Badge variant="secondary">🤝 Tie</Badge>;
    } else {
      return <Badge variant="outline">💪 Great Effort</Badge>;
    }
  };

  const getWinnerMessage = () => {
    if (challenge.winner === 'me') {
      return "Victory! You crushed this challenge!";
    } else if (challenge.winner === 'tie') {
      return "Perfectly matched! What a close battle!";
    } else {
      return "Good fight! Ready for a rematch?";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Trophy className="h-4 w-4 text-chichi-orange" />
            {challenge.duration}-Day Challenge
          </CardTitle>
          {getWinnerBadge()}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="h-3 w-3" />
          Completed {format(new Date(challenge.completedAt), 'MMM d, yyyy')}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Score */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="text-center">
            <p className="text-xs text-gray-600">You</p>
            <p className="text-xl font-bold text-chichi-orange">{challenge.myPoints}</p>
          </div>
          
          <div className="text-center text-gray-400 font-bold text-lg">VS</div>
          
          <div className="text-center">
            <div className="flex items-center gap-1 justify-center mb-1">
              <Avatar className="h-4 w-4">
                <AvatarImage src={challenge.opponent.avatar} />
                <AvatarFallback className="text-xs">
                  {challenge.opponent.name[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <p className="text-xs text-gray-600">{challenge.opponent.name}</p>
            </div>
            <p className="text-xl font-bold text-chichi-purple">{challenge.opponentPoints}</p>
          </div>
        </div>

        {/* Winner Message */}
        <p className="text-sm text-center text-gray-600 italic">
          {getWinnerMessage()}
        </p>

        {/* Actions */}
        <div className="flex gap-2">
          {challenge.winner === 'me' && onShare && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onShare(challenge.id)}
              className="flex-1"
            >
              <Share2 className="h-3 w-3 mr-1" />
              Share Win
            </Button>
          )}
          
          {onRematch && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRematch(challenge.id)}
              className="flex-1"
            >
              <Users className="h-3 w-3 mr-1" />
              Rematch
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
