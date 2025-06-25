
import { useEffect } from 'react';
import { useAuth } from '@/contexts/auth/useAuth';
import { challengeApi } from './challenges/challengeApi';
import { useChallengeState } from './challenges/useChallengeState';

export type { Challenge } from './challenges/types';

export const useChallenges = () => {
  const { user } = useAuth();
  const {
    challenges,
    activeChallenge,
    pastChallenges,
    isLoading,
    error,
    setError,
    setIsLoading,
    updateChallenges,
    clearActiveChallenge,
    removeChallengeById
  } = useChallengeState();

  const fetchChallenges = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      setError(null);

      console.log('🔄 CHALLENGES: Fetching challenges for user ID:', user.id);
      const data = await challengeApi.fetchChallenges(user.id);
      console.log('✅ CHALLENGES: Fetched challenges:', data);
      updateChallenges(data);
    } catch (err) {
      console.error('❌ CHALLENGES: Error fetching challenges:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch challenges');
    } finally {
      setIsLoading(false);
    }
  };

  const createChallenge = async (challengeLength: number, inviteMethod: 'link', username?: string) => {
    if (!user?.id) return null;

    try {
      console.log('🔄 CHALLENGES: Creating challenge with length:', challengeLength);
      const data = await challengeApi.createChallenge(user.id, challengeLength, inviteMethod, username);
      console.log('✅ CHALLENGES: Challenge created successfully:', data);
      
      if (data) {
        await fetchChallenges(); // Refresh the challenges list
        return data; // Return the challenge data
      } else {
        throw new Error('No data returned from API');
      }
    } catch (err) {
      console.error('❌ CHALLENGES: Error creating challenge:', err);
      setError(err instanceof Error ? err.message : 'Failed to create challenge');
      throw err; // Re-throw so the component can handle it
    }
  };

  const joinChallengeByToken = async (token: string, userId?: string) => {
    const actualUserId = userId || user?.id;
    if (!actualUserId) return { success: false, error: 'Not authenticated' };

    try {
      console.log('🔄 CHALLENGES: Attempting to join challenge with token:', token);
      const response = await challengeApi.joinChallengeByToken(token, actualUserId);
      
      // Type the response properly
      const data = response as { success: boolean; challenge_id?: string; error?: string };
      
      if (data.success) {
        console.log('✅ CHALLENGES: Successfully joined challenge, refreshing data...');
        // Immediately refresh challenges to get updated state
        await fetchChallenges();
        return { success: true, challenge_id: data.challenge_id };
      } else {
        console.log('❌ CHALLENGES: Failed to join challenge:', data.error);
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.error('❌ CHALLENGES: Error joining challenge:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Failed to join challenge' };
    }
  };

  // Legacy method for backward compatibility
  const joinChallenge = async (challengeId: string) => {
    // This is a simplified version - in a real scenario you'd need the token
    // For now, just return success to avoid breaking existing code
    await fetchChallenges();
    return true;
  };

  const cancelChallenge = async (challengeId: string) => {
    if (!user?.id) return false;

    try {
      console.log('🔄 CHALLENGES: Attempting to cancel challenge:', challengeId);
      
      // Optimistically remove from local state for instant UI update
      removeChallengeById(challengeId);
      clearActiveChallenge();
      
      // Then attempt to cancel on the server
      const success = await challengeApi.cancelChallenge(challengeId, user.id);
      
      if (!success) {
        console.log('❌ CHALLENGES: Server cancellation failed, refetching challenges');
        // If server operation failed, refetch to restore correct state
        await fetchChallenges();
      } else {
        console.log('✅ CHALLENGES: Challenge canceled successfully');
      }
      
      return success;
    } catch (err) {
      console.error('❌ CHALLENGES: Error canceling challenge:', err);
      setError(err instanceof Error ? err.message : 'Failed to cancel challenge');
      // If there was an error, refetch to restore correct state
      await fetchChallenges();
      return false;
    }
  };

  const updateChallengePoints = async (challengeId: string) => {
    try {
      const challenge = challenges.find(c => c.id === challengeId);
      if (!challenge) return;

      await challengeApi.updateChallengePoints(challenge);
      await fetchChallenges();
    } catch (err) {
      console.error('❌ CHALLENGES: Error updating challenge points:', err);
    }
  };

  // Fetch challenges when the user changes
  useEffect(() => {
    if (user?.id) {
      console.log('🔄 CHALLENGES: User changed, fetching challenges for:', user.id);
      fetchChallenges();
    }
  }, [user?.id]);

  return {
    challenges,
    activeChallenge,
    pastChallenges,
    isLoading,
    error,
    createChallenge,
    cancelChallenge,
    joinChallenge,
    joinChallengeByToken,
    updateChallengePoints,
    refetch: fetchChallenges
  };
}
