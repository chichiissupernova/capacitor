
import { supabase } from '@/integrations/supabase/client';
import { challengeValidation } from './challengeValidation';

export const challengeJoin = {
  async joinChallengeByToken(token: string, userId: string) {
    console.log('=== CHALLENGE JOIN DEBUG START ===');
    console.log('API: Attempting to join challenge with token:', token, 'for user:', userId);
    
    try {
      // Force a refresh of the auth session to avoid caching issues
      await supabase.auth.refreshSession();
      
      // First, let's manually validate the challenge exists and is joinable
      console.log('Step 1: Validating challenge token...');
      const validationResult = await challengeValidation.validateChallengeToken(token);
      
      if (!validationResult) {
        console.log('❌ Step 1 FAILED: Token validation failed - challenge not found or expired');
        return { success: false, error: 'Challenge not found, expired, or already joined' };
      }

      console.log('✅ Step 1 SUCCESS: Valid challenge found:', {
        id: validationResult.id,
        status: validationResult.status,
        challenger_id: validationResult.challenger_id,
        opponent_id: validationResult.opponent_id,
        invite_expires_at: validationResult.invite_expires_at
      });

      // Check if user is trying to join their own challenge
      if (validationResult.challenger_id === userId) {
        console.log('❌ Step 2 FAILED: User trying to join own challenge');
        return { success: false, error: 'Cannot join your own challenge' };
      }
      console.log('✅ Step 2 SUCCESS: User is not the challenger');

      // Check if challenge already has an opponent
      if (validationResult.opponent_id) {
        console.log('❌ Step 3 FAILED: Challenge already has opponent:', validationResult.opponent_id);
        return { success: false, error: 'Challenge already has an opponent' };
      }
      console.log('✅ Step 3 SUCCESS: Challenge has no opponent yet');

      // Check if challenge is still pending
      if (validationResult.status !== 'pending') {
        console.log('❌ Step 4 FAILED: Challenge status is not pending:', validationResult.status);
        return { success: false, error: 'Challenge is no longer available' };
      }
      console.log('✅ Step 4 SUCCESS: Challenge status is pending');

      // Try RPC function first
      console.log('Step 5: Attempting RPC join...');
      const { data: rpcData, error: rpcError } = await supabase.rpc('join_challenge_by_token', {
        token,
        joiner_id: userId
      });

      if (rpcError) {
        console.log('⚠️ Step 5 RPC FAILED:', rpcError.message);
        console.log('Falling back to manual join...');
        
        // If RPC fails, try manual update as fallback
        return await this.manualJoinChallenge(validationResult.id, userId);
      }

      console.log('✅ Step 5 RPC SUCCESS:', rpcData);
      console.log('=== CHALLENGE JOIN DEBUG END ===');
      return rpcData;
    } catch (error) {
      console.error('💥 CRITICAL ERROR in joinChallengeByToken:', error);
      console.log('=== CHALLENGE JOIN DEBUG END ===');
      throw error;
    }
  },

  async manualJoinChallenge(challengeId: string, userId: string) {
    console.log('=== MANUAL JOIN DEBUG START ===');
    console.log('API: Attempting manual join for challenge:', challengeId, 'user:', userId);
    
    try {
      // First, let's check the current state of the challenge
      console.log('Step 1: Checking current challenge state...');
      const { data: currentChallenge, error: fetchError } = await supabase
        .from('challenges')
        .select('*')
        .eq('id', challengeId)
        .single();

      if (fetchError) {
        console.error('❌ Step 1 FAILED: Error fetching challenge:', fetchError);
        return { success: false, error: 'Failed to fetch challenge details' };
      }

      console.log('✅ Step 1 SUCCESS: Current challenge state:', {
        id: currentChallenge.id,
        status: currentChallenge.status,
        opponent_id: currentChallenge.opponent_id,
        challenger_id: currentChallenge.challenger_id
      });

      // Double-check conditions before manual update
      if (currentChallenge.status !== 'pending') {
        console.log('❌ Step 2 FAILED: Challenge status is not pending:', currentChallenge.status);
        return { success: false, error: 'Challenge is no longer pending' };
      }

      if (currentChallenge.opponent_id) {
        console.log('❌ Step 3 FAILED: Challenge already has opponent:', currentChallenge.opponent_id);
        return { success: false, error: 'Challenge already has an opponent' };
      }

      console.log('✅ Steps 2-3 SUCCESS: Challenge is still available for joining');

      // Update the challenge to add the opponent
      console.log('Step 4: Updating challenge with opponent...');
      const { data, error } = await supabase
        .from('challenges')
        .update({
          opponent_id: userId,
          status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', challengeId)
        .eq('status', 'pending') // Only update if still pending
        .is('opponent_id', null) // Only update if no opponent yet
        .select()
        .single();

      if (error) {
        console.error('❌ Step 4 FAILED: Manual join update failed:', error);
        return { success: false, error: 'Failed to join challenge - database error' };
      }

      if (!data) {
        console.log('❌ Step 4 FAILED: No data returned - challenge may have been taken by someone else');
        return { success: false, error: 'Challenge no longer available - may have been taken by another user' };
      }

      console.log('✅ Step 4 SUCCESS: Manual join successful:', {
        id: data.id,
        status: data.status,
        opponent_id: data.opponent_id
      });
      console.log('=== MANUAL JOIN DEBUG END ===');
      return { success: true, challenge_id: challengeId };
    } catch (error) {
      console.error('💥 CRITICAL ERROR in manual join:', error);
      console.log('=== MANUAL JOIN DEBUG END ===');
      return { success: false, error: 'Failed to join challenge - unexpected error' };
    }
  }
};
