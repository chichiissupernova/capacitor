
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Users, Calendar } from 'lucide-react';
import { Challenge } from '@/hooks/useChallenges';

interface ChallengeJoinContentProps {
  challenge: Challenge;
  debugInfo?: string;
}

export function ChallengeJoinContent({ challenge, debugInfo }: ChallengeJoinContentProps) {
  const challengerName = challenge?.challenger_profile?.username || challenge?.challenger_profile?.name || 'Someone';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Trophy className="h-16 w-16 mx-auto text-chichi-orange mb-4" />
          <CardTitle className="text-2xl">Challenge Invite!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Challenger Info */}
          <div className="text-center space-y-3">
            <Avatar className="h-20 w-20 mx-auto">
              <AvatarImage src={challenge.challenger_profile?.avatar_url || ""} />
              <AvatarFallback>
                {challengerName[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{challengerName}</h3>
              <p className="text-gray-600">invited you to a</p>
              <p className="text-xl font-bold text-chichi-orange">
                {challenge.challenge_length}-Day Content Sprint!
              </p>
            </div>
          </div>

          {/* Challenge Details */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-600" />
              <span className="text-sm">{challenge.challenge_length} days of content creation</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-gray-600" />
              <span className="text-sm">Most points wins</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-600" />
              <span className="text-sm">Complete daily tasks to earn points</span>
            </div>
          </div>

          {debugInfo && (
            <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                Debug: {debugInfo}
              </p>
            </div>
          )}

          <p className="text-xs text-gray-500 text-center">
            Challenge starts immediately when you accept!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
