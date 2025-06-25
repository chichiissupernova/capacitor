
import { supabase } from '@/integrations/supabase/client';
import { Challenge } from '../types';

export const challengeValidation = {
  async validateChallengeToken(token: string): Promise<Challenge | null> {
    console.log('=== TOKEN VALIDATION DEBUG START ===');
    console.log('API: Validating challenge token:', token);
    
    try {
      // First expire old challenges
      console.log('Step 1: Expiring old challenges...');
      const { error: expireError } = await supabase.rpc('expire_old_challenges');
      if (expireError) {
        console.warn('⚠️ Warning: Failed to expire old challenges:', expireError);
      } else {
        console.log('✅ Step 1 SUCCESS: Old challenges expired');
      }

      // Debug: Let's first check if ANY challenge exists with this token (regardless of status)
      console.log('Step 2a: Checking if token exists at all...');
      const { data: debugData, error: debugError } = await supabase
        .from('challenges')
        .select('id, status, opponent_id, invite_expires_at, challenger_id, invite_token')
        .eq('invite_token', token);

      if (debugError) {
        console.error('❌ Step 2a FAILED: Error checking token existence:', debugError);
      } else {
        console.log('🔍 Step 2a DEBUG: All challenges with this token:', debugData);
        
        if (!debugData || debugData.length === 0) {
          console.log('❌ PROBLEM IDENTIFIED: No challenge found with this token at all');
          console.log('This suggests the token was never saved to the database during challenge creation');
        } else {
          debugData.forEach((challenge, index) => {
            console.log(`🔍 Challenge ${index + 1}:`, {
              id: challenge.id,
              status: challenge.status,
              opponent_id: challenge.opponent_id,
              challenger_id: challenge.challenger_id,
              invite_expires_at: challenge.invite_expires_at,
              is_expired: new Date(challenge.invite_expires_at) <= new Date(),
              invite_token: challenge.invite_token
            });
          });
        }
      }

      // Clear cache for this specific query
      console.log('Step 2b: Clearing Supabase cache for challenges table...');
      await supabase.auth.refreshSession(); // Force token refresh
      
      // Now fetch the challenge with proper criteria
      console.log('Step 2c: Fetching challenge with criteria...');
      const { data, error } = await supabase
        .from('challenges')
        .select(`
          *,
          challenger_profile:user_profiles!challenger_id(name, username, avatar_url)
        `)
        .eq('invite_token', token)
        .eq('status', 'pending')
        .is('opponent_id', null)
        .gt('invite_expires_at', new Date().toISOString())
        .maybeSingle();

      if (error) {
        console.error('❌ Step 2c FAILED: Error validating token:', error);
        throw error;
      }

      if (!data) {
        console.log('❌ Step 2c FAILED: No valid challenge found for token');
        console.log('Possible reasons:');
        console.log('- Token does not exist');
        console.log('- Challenge status is not "pending"');
        console.log('- Challenge already has an opponent');
        console.log('- Invite has expired');
        
        console.log('=== TOKEN VALIDATION DEBUG END ===');
        return null;
      }

      console.log('✅ Step 2c SUCCESS: Valid challenge found:', {
        id: data.id,
        status: data.status,
        challenger_id: data.challenger_id,
        opponent_id: data.opponent_id,
        invite_expires_at: data.invite_expires_at,
        challenger_name: data.challenger_profile?.name || data.challenger_profile?.username
      });
      console.log('=== TOKEN VALIDATION DEBUG END ===');
      return data as Challenge;
    } catch (error) {
      console.error('💥 CRITICAL ERROR in validateChallengeToken:', error);
      console.log('=== TOKEN VALIDATION DEBUG END ===');
      throw error;
    }
  },

  async validateUsernameExists(username: string, userId: string): Promise<boolean> {
    const { data: userExists, error: userError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('username', username.toLowerCase())
      .neq('id', userId) // Can't challenge yourself
      .maybeSingle();

    if (userError) throw userError;
    return !!userExists;
  }
};
