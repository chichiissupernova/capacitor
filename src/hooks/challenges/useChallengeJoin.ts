
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useChallenges } from '@/hooks/useChallenges';
import { useAuth } from '@/contexts/auth/useAuth';
import { challengeApi } from '@/hooks/challenges/challengeApi';
import { useToast } from '@/hooks/use-toast';
import { Challenge } from '@/hooks/useChallenges';

export function useChallengeJoin() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { joinChallengeByToken, activeChallenge, refetch } = useChallenges();
  const { toast } = useToast();
  
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [joinedChallengeName, setJoinedChallengeName] = useState('');
  const [challengeDays, setChallengeDays] = useState(5);
  const [debugInfo, setDebugInfo] = useState<string>('');

  const inviteToken = searchParams.get('token');

  const validateAndJoinChallenge = async () => {
    if (!inviteToken || !user) return;

    try {
      setIsLoading(true);
      setDebugInfo('🔍 Starting challenge validation...');
      console.log('🔍 CHALLENGE JOIN: Fetching challenge for join with token:', inviteToken);
      console.log('🔍 CHALLENGE JOIN: Current user ID:', user.id);

      const challengeData = await challengeApi.validateChallengeToken(inviteToken);
      
      if (!challengeData) {
        console.log('❌ CHALLENGE JOIN: No valid challenge found for token');
        setDebugInfo('❌ Challenge validation failed - not found or expired');
        toast({
          title: "Challenge Not Available",
          description: "This challenge link is invalid, has expired, or has already been joined by someone else.",
          variant: "destructive",
        });
        navigate('/challenges');
        return;
      }

      console.log('✅ CHALLENGE JOIN: Valid challenge found:', {
        id: challengeData.id,
        status: challengeData.status,
        challenger_id: challengeData.challenger_id,
        opponent_id: challengeData.opponent_id,
        current_user: user.id
      });
      setChallenge(challengeData);
      setDebugInfo(`✅ Challenge found: ${challengeData.id}, Status: ${challengeData.status}`);

      if (challengeData.challenger_id === user.id) {
        setDebugInfo('⚠️ User is the challenger - cannot join own challenge');
        toast({
          title: "Cannot Join Own Challenge",
          description: "You cannot join a challenge that you created. Share this link with someone else!",
          variant: "destructive",
        });
        navigate('/challenges');
        return;
      }

      if (activeChallenge) {
        setDebugInfo('⚠️ User already has active challenge');
        toast({
          title: "Active Challenge",
          description: "You already have an active challenge. Complete it before joining a new one!",
          variant: "destructive",
        });
        navigate('/challenges');
        return;
      }

      setDebugInfo('🚀 Proceeding to join challenge...');
      await joinChallengeFlow(inviteToken, challengeData);

    } catch (err) {
      console.error('💥 CHALLENGE JOIN: Error fetching challenge:', err);
      setDebugInfo(`💥 Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      toast({
        title: "Error",
        description: "Failed to load challenge details.",
        variant: "destructive",
      });
      navigate('/challenges');
    } finally {
      setIsLoading(false);
    }
  };

  const joinChallengeFlow = async (token: string, challengeData: Challenge) => {
    if (!user) return;

    setIsJoining(true);
    setDebugInfo('🔄 Attempting to join challenge...');
    
    try {
      console.log('🔄 CHALLENGE JOIN: Attempting to join challenge with token:', token);
      console.log('🔄 CHALLENGE JOIN: User ID:', user.id);
      
      const result = await joinChallengeByToken(token, user.id);
      console.log('🔄 CHALLENGE JOIN: Join challenge result:', result);
      
      if (result.success) {
        setDebugInfo('🎉 Challenge joined successfully!');
        const challengeName = challengeData?.challenger_profile?.name || challengeData?.challenger_profile?.username || 'Challenge';
        setJoinedChallengeName(challengeName);
        setChallengeDays(challengeData?.challenge_length || 5);
        
        console.log('🎉 CHALLENGE JOIN: Success! Showing modal and refreshing data...');
        
        // Show success modal immediately
        setShowSuccessModal(true);
        
        // Refresh challenges to get updated state
        await refetch();
        
        // Redirect after showing success
        setTimeout(() => {
          console.log('🔄 CHALLENGE JOIN: Redirecting to challenges page...');
          setShowSuccessModal(false);
          navigate('/challenges');
        }, 3000);
      } else {
        console.log('❌ CHALLENGE JOIN: Join failed with error:', result.error);
        setDebugInfo(`❌ Join failed: ${result.error}`);
        
        let errorMessage = result.error || "Failed to join the challenge.";
        let errorTitle = "Join Failed";
        
        if (result.error?.includes('already joined')) {
          errorTitle = "Challenge Full";
          errorMessage = "Someone else has already joined this challenge. Try creating your own!";
        } else if (result.error?.includes('own challenge')) {
          errorTitle = "Cannot Join Own Challenge";
          errorMessage = "You cannot join a challenge you created. Share the link with someone else!";
        } else if (result.error?.includes('already have an active challenge')) {
          errorTitle = "Active Challenge";
          errorMessage = "Complete your current challenge before joining a new one.";
        } else if (result.error?.includes('expired')) {
          errorTitle = "Challenge Expired";
          errorMessage = "This challenge invitation has expired. Ask for a new invite link.";
        }
        
        toast({
          title: errorTitle,
          description: errorMessage,
          variant: "destructive",
        });
        navigate('/challenges');
      }
    } catch (error) {
      console.error('💥 CHALLENGE JOIN: Error joining challenge:', error);
      setDebugInfo(`💥 Exception: ${error instanceof Error ? error.message : 'Unknown error'}`);
      toast({
        title: "Error",
        description: "An unexpected error occurred while joining the challenge.",
        variant: "destructive",
      });
      navigate('/challenges');
    } finally {
      setIsJoining(false);
    }
  };

  const handleTokenValidation = () => {
    if (!inviteToken) {
      console.log('❌ CHALLENGE JOIN: No invite token provided');
      setDebugInfo('❌ No invite token in URL');
      toast({
        title: "Invalid Link",
        description: "This challenge link is missing the invite token.",
        variant: "destructive",
      });
      navigate('/challenges');
      return;
    }

    if (!user) {
      console.log('ℹ️ CHALLENGE JOIN: User not logged in, storing token and redirecting to login');
      localStorage.setItem('pendingInviteToken', inviteToken);
      navigate('/login');
      return;
    }

    validateAndJoinChallenge();
  };

  const handlePostLoginJoin = () => {
    const pendingToken = localStorage.getItem('pendingInviteToken');
    if (user && pendingToken && !challenge) {
      console.log('🔄 CHALLENGE JOIN: Found pending token after login:', pendingToken);
      localStorage.removeItem('pendingInviteToken');
      navigate(`/challenge/join?token=${pendingToken}`, { replace: true });
    }
  };

  // Return the necessary state and functions
  return {
    inviteToken,
    challenge,
    isLoading,
    isJoining,
    showSuccessModal,
    joinedChallengeName,
    challengeDays,
    debugInfo,
    handleTokenValidation,
    handlePostLoginJoin
  };
}
