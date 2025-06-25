
import { useState, useCallback } from 'react';
import { Challenge } from './types';

interface ChallengeState {
  challenges: Challenge[];
  activeChallenge: Challenge | null;
  pastChallenges: Challenge[];
  isLoading: boolean;
  error: string | null;
}

export const useChallengeState = () => {
  const [state, setState] = useState<ChallengeState>({
    challenges: [],
    activeChallenge: null,
    pastChallenges: [],
    isLoading: false,
    error: null,
  });

  const setIsLoading = useCallback((isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const updateChallenges = useCallback((challenges: Challenge[]) => {
    console.log('Updating challenges with data:', challenges);
    
    // First priority: find active challenges (status = 'active')
    const activeChallenge = challenges.find(c => c.status === 'active');
    
    // Second priority: if no active, find pending challenges where user is challenger
    const pendingChallenge = !activeChallenge ? 
      challenges.find(c => c.status === 'pending') : null;
    
    // Use active challenge first, then pending as fallback
    const currentActiveChallenge = activeChallenge || pendingChallenge;
    
    // Past challenges are completed, expired, or old pending ones that aren't the current active
    const pastChallenges = challenges.filter(c => 
      c.status === 'completed' || 
      c.status === 'expired' ||
      (c.status === 'pending' && c !== currentActiveChallenge)
    );

    console.log('Active challenge determined:', currentActiveChallenge);
    console.log('Past challenges:', pastChallenges);

    setState(prev => ({
      ...prev,
      challenges,
      activeChallenge: currentActiveChallenge,
      pastChallenges,
    }));
  }, []);

  const clearActiveChallenge = useCallback(() => {
    console.log('Clearing active challenge');
    setState(prev => ({ 
      ...prev, 
      activeChallenge: null 
    }));
  }, []);

  const removeChallengeById = useCallback((challengeId: string) => {
    console.log('Removing challenge by ID:', challengeId);
    setState(prev => {
      const updatedChallenges = prev.challenges.filter(c => c.id !== challengeId);
      
      // Recalculate active challenge after removal
      const activeChallenge = updatedChallenges.find(c => c.status === 'active') || 
                             updatedChallenges.find(c => c.status === 'pending');
      
      const pastChallenges = updatedChallenges.filter(c => 
        c.status === 'completed' || 
        c.status === 'expired' ||
        (c.status === 'pending' && c !== activeChallenge)
      );

      return {
        ...prev,
        challenges: updatedChallenges,
        activeChallenge,
        pastChallenges,
      };
    });
  }, []);

  return {
    ...state,
    setIsLoading,
    setError,
    updateChallenges,
    clearActiveChallenge,
    removeChallengeById,
  };
};
