
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Users, Calendar } from 'lucide-react';
import { useChallenges } from '@/hooks/useChallenges';
import { useAuth } from '@/contexts/auth/useAuth';
import { challengeApi } from '@/hooks/challenges/challengeApi';
import { useToast } from '@/hooks/use-toast';
import { Challenge } from '@/hooks/useChallenges';

export default function ChallengeInvite() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { activeChallenge } = useChallenges();
  const { toast } = useToast();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get invite token from URL params
  const inviteToken = searchParams.get('token');

  useEffect(() => {
    const fetchChallengeByToken = async () => {
      if (!inviteToken) {
        console.log('No invite token in URL');
        toast({
          title: "Invalid Link",
          description: "This challenge link is missing the invite token.",
          variant: "destructive",
        });
        navigate('/challenges');
        return;
      }

      try {
        console.log('Fetching challenge for token:', inviteToken);
        const challengeData = await challengeApi.validateChallengeToken(inviteToken);
        
        if (!challengeData) {
          console.log('No valid challenge found for token');
          toast({
            title: "Challenge Not Available",
            description: "This challenge link is invalid, has expired, or has already been joined.",
            variant: "destructive",
          });
          navigate('/challenges');
          return;
        }

        console.log('Valid challenge found:', challengeData);
        setChallenge(challengeData);
      } catch (err) {
        console.error('Error fetching challenge:', err);
        toast({
          title: "Challenge Not Found",
          description: "This challenge link is invalid or has expired.",
          variant: "destructive",
        });
        navigate('/challenges');
      } finally {
        setIsLoading(false);
      }
    };

    fetchChallengeByToken();
  }, [inviteToken, navigate, toast]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Trophy className="h-12 w-12 mx-auto text-chichi-orange mb-4" />
            <h2 className="text-xl font-bold mb-2">Join CHICHI First</h2>
            <p className="text-gray-600 mb-4">
              You need to create an account to accept this challenge invite.
            </p>
            <Button onClick={() => navigate('/login')} className="w-full">
              Sign Up / Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chichi-orange mx-auto mb-4"></div>
          <p>Loading challenge...</p>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold mb-2">Challenge Not Found</h2>
            <p className="text-gray-600 mb-4">
              This challenge link is invalid or has expired.
            </p>
            <Button onClick={() => navigate('/challenges')} variant="outline">
              Go to Challenge Hub
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if user is trying to view their own challenge - redirect to join flow
  if (challenge.challenger_id === user.id) {
    navigate(`/challenge/join?token=${inviteToken}`, { replace: true });
    return null;
  }

  // Check if user already has an active challenge
  if (activeChallenge) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Users className="h-12 w-12 mx-auto text-orange-500 mb-4" />
            <h2 className="text-xl font-bold mb-2">Already in a Challenge</h2>
            <p className="text-gray-600 mb-4">
              You're already participating in an active challenge. Complete it before joining a new one!
            </p>
            <Button onClick={() => navigate('/challenges')} className="w-full">
              View Current Challenge
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const challengerName = challenge.challenger_profile?.username || challenge.challenger_profile?.name || 'Someone';

  // Redirect to the join flow
  const handleAcceptChallenge = () => {
    navigate(`/challenge/join?token=${inviteToken}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Trophy className="h-16 w-16 mx-auto text-chichi-orange mb-4" />
          <CardTitle className="text-2xl">Creator Showdown Invite!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-3">
            <Avatar className="h-20 w-20 mx-auto">
              <AvatarImage src={challenge.challenger_profile?.avatar_url || ""} />
              <AvatarFallback>
                {challengerName[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{challengerName}</h3>
              <p className="text-gray-600">has invited you to a</p>
              <p className="text-xl font-bold text-chichi-orange">
                {challenge.challenge_length}-Day Creator Showdown!
              </p>
            </div>
          </div>

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

          <div className="space-y-3">
            <Button onClick={handleAcceptChallenge} className="w-full bg-chichi-orange hover:bg-chichi-orange/90">
              Accept Challenge
            </Button>
            <Button onClick={() => navigate('/challenges')} variant="outline" className="w-full">
              Maybe Later
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
