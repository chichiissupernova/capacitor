
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type UserProfile = Database['public']['Tables']['user_profiles']['Row'];

export class UserService {
  static async getProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data || null;
    } catch (error) {
      console.error('Unexpected error fetching user profile:', error);
      return null;
    }
  }

  static async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      // Ensure the user exists before updating
      const existingProfile = await this.getProfile(userId);
      if (!existingProfile) {
        console.log('Creating new profile for user:', userId);
        // If no profile exists, create one with the updates
        const { data, error } = await supabase
          .from('user_profiles')
          .insert({
            id: userId,
            email: updates.email || '',
            name: updates.name || 'User',
            points: 0,
            level: 1,
            level_points: 0,
            max_level_points: 100,
            current_streak: 0,
            longest_streak: 0,
            tasks_completed: 0,
            total_tasks: 0,
            weekly_activity: 0,
            unlocked_achievements: [],
            niche_preferences: [],
            social_links: {},
            ...updates
          })
          .select('*')
          .maybeSingle();
          
        if (error) {
          console.error('Error creating user profile:', error);
          return null;
        }
        
        return data;
      }

      // Update existing profile
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select('*')
        .maybeSingle();

      if (error) {
        console.error('Error updating user profile:', error);
        return null;
      }

      return data || null;
    } catch (error) {
      console.error('Unexpected error updating user profile:', error);
      return null;
    }
  }

  static async logActivity(userId: string, action: string, details: Record<string, any> = {}): Promise<void> {
    try {
      const { error } = await supabase
        .from('activity_logs')
        .insert({
          user_id: userId,
          action,
          details
        });

      if (error) {
        console.error('Error logging activity:', error);
      }
    } catch (error) {
      console.error('Unexpected error logging activity:', error);
    }
  }

  static async ensureProfileExists(userId: string, email: string, name?: string): Promise<UserProfile | null> {
    try {
      // First try to get existing profile
      let profile = await this.getProfile(userId);
      
      if (!profile) {
        // Create profile if it doesn't exist
        console.log('Creating profile for new user:', userId);
        profile = await this.updateProfile(userId, {
          id: userId,
          email,
          name: name || email.split('@')[0],
          points: 0,
          level: 1,
          level_points: 0,
          max_level_points: 100,
          current_streak: 0,
          longest_streak: 0,
          tasks_completed: 0,
          total_tasks: 0,
          weekly_activity: 0,
          unlocked_achievements: [],
          niche_preferences: [],
          social_links: {}
        });
      }
      
      return profile;
    } catch (error) {
      console.error('Error ensuring profile exists:', error);
      return null;
    }
  }
}
