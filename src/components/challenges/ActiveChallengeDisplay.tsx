import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Users, Calendar, Clock, Target } from 'lucide-react';
import { DailyChallengeCard } from './DailyChallengeCard';
import { ChallengeLeaderboard } from './ChallengeLeaderboard';
import { CreateChallengeDialog } from './CreateChallengeDialog';
import { Challenge } from '@/hooks/useChallenges';
import { useAuth } from '@/contexts/auth';

interface ActiveChallengeDisplayProps {
  activeChallenge: Challenge | null;
  onCreateChallenge: (username: string) => void;
  onCancelChallenge: () => void;
  onRematch: () => void;
  isCanceling: boolean;
  isLoading: boolean;
}

export const ActiveChallengeDisplay: React.FC<ActiveChallengeDisplayProps> = ({
  activeChallenge,
  onCreateChallenge,
  onCancelChallenge,
  onRematch,
  isCanceling,
  isLoading
}) => {
  const { user } = useAuth();

  // Mock data for demonstration - replace with real data
  const mockCurrentChallenge = {
    id: '1',
    duration: 5,
    currentDay: 3,
    todayPoints: 50,
    totalPoints: 180,
    myRank: 1,
    opponents: [
      { id: '1', name: 'You', avatar: user?.avatarUrl, points: 180, rank: 1 },
      { id: '2', name: 'Sarah M.', avatar: '', points: 165, rank: 2 },
    ]
  };

  const mockLeaderboardUsers = [
    { id: '1', name: 'You', avatar: user?.avatarUrl, points: 180, rank: 1, isMe: true, todayPoints: 50 },
    { id: '2', name: 'Sarah M.', avatar: '', points: 165, rank: 2, todayPoints: 35 },
  ];

  // Check if challenge expires in 24 hours (mock logic)
  const challengeExpiresIn = activeChallenge?.status === 'pending' ? '18 hours' : null;

  if (!activeChallenge) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Trophy className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Active Challenges</h3>
          <p className="text-gray-600 mb-6">
            Ready to test your content creation consistency? Challenge a fellow creator!
          </p>
          <CreateChallengeDialog 
            onCreateChallenge={onCreateChallenge}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    );
  }

  if (activeChallenge.status === 'active') {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <DailyChallengeCard challenge={mockCurrentChallenge} />
        <ChallengeLeaderboard 
          users={mockLeaderboardUsers}
          challengeDay={3}
          totalDays={5}
        />
      </div>
    );
  }

  if (activeChallenge.status === 'pending') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-chichi-orange" />
            Challenge Pending
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              Waiting for your opponent to accept the challenge...
            </p>
            {challengeExpiresIn && (
              <Badge variant="outline" className="text-orange-600 border-orange-300">
                Expires in {challengeExpiresIn}
              </Badge>
            )}
            <Button 
              variant="outline" 
              size="sm"
              onClick={onCancelChallenge}
              disabled={isCanceling || isLoading}
            >
              {isCanceling ? 'Canceling...' : 'Cancel Challenge'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (activeChallenge.status === 'completed') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-chichi-orange" />
            Challenge Complete!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="text-6xl">🏆</div>
            <div>
              <h3 className="text-xl font-bold text-chichi-orange mb-2">Winner!</h3>
              <p className="text-gray-600 mb-4">
                You earned 245 points vs your opponent's 198 points
              </p>
              <Badge className="bg-chichi-orange text-white mb-4">
                Challenge Winner
              </Badge>
            </div>
            <div className="flex gap-2 justify-center">
              <Button onClick={onRematch}>
                <Users className="h-4 w-4 mr-2" />
                Rematch
              </Button>
              <CreateChallengeDialog 
                onCreateChallenge={onCreateChallenge}
                isLoading={isLoading}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
};
