
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/auth/useAuth';
import { useChallengeJoin } from '@/hooks/challenges/useChallengeJoin';
import { ChallengeJoinLoader } from '@/components/challenges/ChallengeJoinLoader';
import { UnauthenticatedView } from '@/components/challenges/UnauthenticatedView';
import { ChallengeJoinContent } from '@/components/challenges/ChallengeJoinContent';
import { JoinSuccessModal } from '@/components/challenges/JoinSuccessModal';

export function ChallengeJoinFlow() {
  const { user } = useAuth();
  const {
    challenge,
    isLoading,
    isJoining,
    showSuccessModal,
    joinedChallengeName,
    challengeDays,
    debugInfo,
    handleTokenValidation,
    handlePostLoginJoin
  } = useChallengeJoin();

  useEffect(() => {
    handleTokenValidation();
  }, [user]);

  useEffect(() => {
    handlePostLoginJoin();
  }, [user]);

  if (!user) {
    return <UnauthenticatedView />;
  }

  if (isLoading || isJoining) {
    return <ChallengeJoinLoader isJoining={isJoining} debugInfo={debugInfo} />;
  }

  return (
    <>
      {challenge && <ChallengeJoinContent challenge={challenge} debugInfo={debugInfo} />}
      
      <JoinSuccessModal 
        isOpen={showSuccessModal}
        challengerName={joinedChallengeName}
        challengeDays={challengeDays}
      />
    </>
  );
}
