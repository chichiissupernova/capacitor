import { supabase } from '@/integrations/supabase/client';
import { Challenge } from '../types';

export const challengeManagement = {
  async fetchChallenges(userId: string): Promise<Challenge[]> {
    console.log('Fetching challenges for user:', userId);
    
    const { data, error } = await supabase
      .from('challenges')
      .select(`
        *,
        challenger_profile:user_profiles!challenger_id(name, username, avatar_url),
        opponent_profile:user_profiles!opponent_id(name, username, avatar_url)
      `)
      .or(`challenger_id.eq.${userId},opponent_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching challenges:', error);
      throw error;
    }

    console.log('Fetched challenges:', data);
    return (data || []) as Challenge[];
  },

  async createChallenge(
    challengerId: string, 
    challengeLength: number, 
    inviteMethod: 'link' | 'username', 
    username?: string
  ): Promise<Challenge | null> {
    console.log('=== CHALLENGE CREATION DEBUG START ===');
    console.log('Creating challenge:', { challengerId, challengeLength, inviteMethod, username });
    
    try {
      // Generate invite token using the database function
      console.log('Step 1: Generating invite token...');
      const { data: tokenData, error: tokenError } = await supabase.rpc('generate_invite_token');
      
      if (tokenError) {
        console.error('❌ Step 1 FAILED: Token generation error:', tokenError);
        throw new Error('Failed to generate invite token');
      }
      
      const inviteToken = tokenData;
      console.log('✅ Step 1 SUCCESS: Generated token:', inviteToken);

      // Set invite expiration to 24 hours from now
      const inviteExpiresAt = new Date();
      inviteExpiresAt.setHours(inviteExpiresAt.getHours() + 24);
      console.log('Step 2: Setting expiration to:', inviteExpiresAt.toISOString());

      // Validate username if provided
      if (inviteMethod === 'username' && username) {
        console.log('Step 3: Validating username:', username);
        const { data: userExists, error: userError } = await supabase
          .from('user_profiles')
          .select('id, username')
          .eq('username', username.toLowerCase())
          .neq('id', challengerId)
          .maybeSingle();

        if (userError) {
          console.error('❌ Step 3 FAILED: Username validation error:', userError);
          throw new Error('Failed to validate username');
        }

        if (!userExists) {
          console.log('❌ Step 3 FAILED: Username not found');
          throw new Error('Username not found');
        }
        
        console.log('✅ Step 3 SUCCESS: Username validated:', userExists);
      }

      // Create the challenge with explicit token
      console.log('Step 4: Creating challenge in database...');
      const challengeData = {
        challenger_id: challengerId,
        challenge_length: challengeLength,
        start_date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
        end_date: new Date(Date.now() + (challengeLength - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        invite_token: inviteToken,
        invite_expires_at: inviteExpiresAt.toISOString(),
        invited_username: inviteMethod === 'username' ? username : null,
        status: 'pending' as const
      };

      console.log('Challenge data to insert:', challengeData);

      const { data, error } = await supabase
        .from('challenges')
        .insert(challengeData)
        .select(`
          *,
          challenger_profile:user_profiles!challenger_id(name, username, avatar_url)
        `)
        .single();

      if (error) {
        console.error('❌ Step 4 FAILED: Challenge creation error:', error);
        throw error;
      }

      console.log('✅ Step 4 SUCCESS: Challenge created:', data);
      
      // Verify the token was saved correctly
      console.log('Step 5: Verifying token was saved...');
      const { data: verifyData, error: verifyError } = await supabase
        .from('challenges')
        .select('id, invite_token')
        .eq('id', data.id)
        .single();

      if (verifyError || !verifyData) {
        console.error('❌ Step 5 FAILED: Token verification failed:', verifyError);
      } else {
        console.log('✅ Step 5 SUCCESS: Token verified in DB:', verifyData.invite_token);
      }

      console.log('=== CHALLENGE CREATION DEBUG END ===');
      return data as Challenge;
    } catch (error) {
      console.error('💥 CRITICAL ERROR in createChallenge:', error);
      console.log('=== CHALLENGE CREATION DEBUG END ===');
      throw error;
    }
  },

  async generateInviteToken(): Promise<string> {
    console.log('Generating new invite token...');
    
    const { data, error } = await supabase.rpc('generate_invite_token');
    
    if (error) {
      console.error('Error generating invite token:', error);
      throw error;
    }
    
    console.log('Generated invite token:', data);
    return data;
  },

  async cancelChallenge(challengeId: string, userId: string): Promise<boolean> {
    console.log('Canceling challenge:', challengeId, 'for user:', userId);
    
    const { error } = await supabase
      .from('challenges')
      .update({ 
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', challengeId)
      .eq('challenger_id', userId)
      .eq('status', 'pending');

    if (error) {
      console.error('Error canceling challenge:', error);
      return false;
    }

    console.log('Challenge canceled successfully');
    return true;
  },

  async updateChallengePoints(challenge: Challenge): Promise<void> {
    console.log('Updating challenge points for:', challenge.id);
    
    // Calculate points for both challenger and opponent
    const challengerPoints = await this.calculateUserPoints(challenge.challenger_id, challenge.start_date, challenge.end_date);
    const opponentPoints = challenge.opponent_id ? 
      await this.calculateUserPoints(challenge.opponent_id, challenge.start_date, challenge.end_date) : 0;

    const { error } = await supabase
      .from('challenges')
      .update({
        challenger_points: challengerPoints,
        opponent_points: opponentPoints,
        updated_at: new Date().toISOString()
      })
      .eq('id', challenge.id);

    if (error) {
      console.error('Error updating challenge points:', error);
      throw error;
    }

    console.log('Challenge points updated successfully');
  },

  async calculateUserPoints(userId: string, startDate: string, endDate: string): Promise<number> {
    const { data, error } = await supabase.rpc('calculate_challenge_points', {
      user_uuid: userId,
      start_date_param: startDate,
      end_date_param: endDate
    });

    if (error) {
      console.error('Error calculating user points:', error);
      return 0;
    }

    return data || 0;
  }
};
