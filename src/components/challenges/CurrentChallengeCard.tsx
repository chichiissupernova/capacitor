
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Calendar, Users, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useChallenges } from '@/hooks/useChallenges';
import { useAuth } from '@/contexts/auth/useAuth';
import { useToast } from '@/hooks/use-toast';
import { ChallengeInviteButton } from './ChallengeInviteButton';
import type { Challenge } from '@/hooks/useChallenges';

interface CurrentChallengeCardProps {
  challenge: Challenge;
}

export const CurrentChallengeCard: React.FC<CurrentChallengeCardProps> = ({ challenge }) => {
  const { user } = useAuth();
  const { cancelChallenge } = useChallenges();
  const { toast } = useToast();

  const isChallenger = challenge.challenger_id === user?.id;
  const isPending = challenge.status === 'pending';
  const isActive = challenge.status === 'active';
  
  const opponent = challenge.opponent_profile;
  const challenger = challenge.challenger_profile;
  
  const handleCancelChallenge = async () => {
    if (!isChallenger || !isPending) {
      toast({
        title: "Cannot Cancel",
        description: "Only pending challenges created by you can be canceled.",
        variant: "destructive",
      });
      return;
    }

    const success = await cancelChallenge(challenge.id);
    if (success) {
      toast({
        title: "Challenge Canceled",
        description: "Your challenge has been canceled successfully.",
      });
    } else {
      toast({
        title: "Cancel Failed",
        description: "Failed to cancel challenge. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = () => {
    if (isPending) {
      return <Badge variant="secondary">Waiting for opponent</Badge>;
    }
    if (isActive) {
      return <Badge variant="default" className="bg-green-500">Active</Badge>;
    }
    return <Badge variant="outline">{challenge.status}</Badge>;
  };

  const daysRemaining = () => {
    if (!isActive) return null;
    const endDate = new Date(challenge.end_date);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="h-6 w-6 text-chichi-orange" />
            <div>
              <CardTitle className="text-lg">
                {challenge.challenge_length}-Day Creator Showdown
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                {getStatusBadge()}
                {isActive && (
                  <span className="text-sm text-gray-600 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {daysRemaining()} days left
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Challenge Participants */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          {/* Challenger */}
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={challenger?.avatar_url || ""} />
              <AvatarFallback>
                {challenger?.name?.[0] || challenger?.username?.[0] || 'C'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">
                {challenger?.name || challenger?.username || 'Challenger'}
                {isChallenger && ' (You)'}
              </p>
              <p className="text-sm text-gray-600">
                {isActive ? `${challenge.challenger_points} points` : 'Challenger'}
              </p>
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-chichi-orange">VS</div>
          </div>

          {/* Opponent */}
          <div className="flex items-center gap-3">
            {opponent ? (
              <>
                <div className="text-right">
                  <p className="font-medium">
                    {opponent.name || opponent.username || 'Opponent'}
                    {!isChallenger && ' (You)'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {isActive ? `${challenge.opponent_points} points` : 'Opponent'}
                  </p>
                </div>
                <Avatar className="h-12 w-12">
                  <AvatarImage src={opponent.avatar_url || ""} />
                  <AvatarFallback>
                    {opponent.name?.[0] || opponent.username?.[0] || 'O'}
                  </AvatarFallback>
                </Avatar>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="font-medium text-gray-400">Waiting...</p>
                  <p className="text-sm text-gray-400">No opponent yet</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <Users className="h-6 w-6 text-gray-400" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Challenge Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span>Started: {new Date(challenge.start_date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span>Ends: {new Date(challenge.end_date).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          {isPending && isChallenger && challenge.invite_token && (
            <ChallengeInviteButton 
              inviteToken={challenge.invite_token}
              challengeId={challenge.id}
            />
          )}
          
          {isPending && isChallenger && (
            <Button 
              onClick={handleCancelChallenge}
              variant="outline"
              className="text-red-600 hover:text-red-700"
            >
              Cancel Challenge
            </Button>
          )}
        </div>

        {isPending && !opponent && (
          <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg">
            <p className="text-sm text-orange-800">
              {isChallenger 
                ? "Share your invite link to get someone to join your challenge!"
                : "Waiting for the challenger to share the invite link..."
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
