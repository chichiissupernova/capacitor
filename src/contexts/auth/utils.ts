
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { User } from './types';

export const mapSupabaseUserToUser = (supabaseUser: SupabaseUser, profile: any): User => {
  console.log('mapSupabaseUserToUser: Mapping user with profile:', {
    profilePoints: profile?.points,
    profileStreak: profile?.current_streak,
    profileLevel: profile?.level
  });

  const mappedUser: User = {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    name: profile?.name || supabaseUser.user_metadata?.name || 'User',
    username: profile?.username || '',
    avatarUrl: profile?.avatar_url || '',
    // Use database values with safe fallbacks
    points: typeof profile?.points === 'number' ? profile.points : 0,
    level: typeof profile?.level === 'number' ? Math.max(1, profile.level) : 1,
    levelPoints: typeof profile?.level_points === 'number' ? profile.level_points : 0,
    maxLevelPoints: typeof profile?.max_level_points === 'number' ? Math.max(100, profile.max_level_points) : 100,
    currentStreak: typeof profile?.current_streak === 'number' ? profile.current_streak : 0,
    longestStreak: typeof profile?.longest_streak === 'number' ? profile.longest_streak : 0,
    lastActivityDate: profile?.last_activity_date ? new Date(profile.last_activity_date) : undefined,
    tasksCompleted: typeof profile?.tasks_completed === 'number' ? profile.tasks_completed : 0,
    totalTasks: typeof profile?.total_tasks === 'number' ? profile.total_tasks : 0,
    weeklyActivity: typeof profile?.weekly_activity === 'number' ? profile.weekly_activity : 0,
    joinedAt: profile?.joined_at ? new Date(profile.joined_at) : new Date(),
    unlockedAchievements: Array.isArray(profile?.unlocked_achievements) ? profile.unlocked_achievements : [],
    nichePreferences: Array.isArray(profile?.niche_preferences) ? profile.niche_preferences : [],
    instagramHandle: profile?.instagram_handle || undefined,
    tiktokHandle: profile?.tiktok_handle || undefined,
    twitterHandle: profile?.twitter_handle || undefined,
    pinterestHandle: profile?.pinterest_handle || undefined,
    youtubeHandle: profile?.youtube_handle || undefined,
  };

  console.log('mapSupabaseUserToUser: Final mapped user:', {
    id: mappedUser.id,
    email: mappedUser.email,
    points: mappedUser.points,
    currentStreak: mappedUser.currentStreak,
    level: mappedUser.level,
    levelPoints: mappedUser.levelPoints
  });

  return mappedUser;
};

export const fetchUserProfile = async (userId: string) => {
  console.log('fetchUserProfile: Fetching profile for user:', userId);
  
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('fetchUserProfile: Error fetching profile:', error);
      return null;
    }

    if (!data) {
      console.warn('fetchUserProfile: No profile data found');
      return null;
    }

    console.log('fetchUserProfile: Successfully fetched profile:', {
      id: data.id,
      points: data.points,
      currentStreak: data.current_streak,
      level: data.level
    });

    return data;
  } catch (error) {
    console.error('fetchUserProfile: Exception fetching profile:', error);
    return null;
  }
};

export const updateUserProfile = async (userId: string, updates: Partial<any>) => {
  console.log('updateUserProfile: Updating profile for user:', userId, 'with:', updates);
  
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .maybeSingle();

    if (error) {
      console.error('updateUserProfile: Error updating profile:', error);
      throw error;
    }

    console.log('updateUserProfile: Successfully updated profile');
    return data;
  } catch (error) {
    console.error('updateUserProfile: Exception updating profile:', error);
    throw error;
  }
};

export const createInitialUserProfile = async (user: SupabaseUser) => {
  console.log('createInitialUserProfile: Creating profile for user:', user.id);
  
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert({
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
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
      })
      .select()
      .maybeSingle();

    if (error) {
      // Profile might already exist, try to fetch it
      if (error.code === '23505') {
        console.log('createInitialUserProfile: Profile already exists, fetching existing');
        return await fetchUserProfile(user.id);
      }
      console.error('createInitialUserProfile: Error creating user profile:', error);
      throw error;
    }

    console.log('createInitialUserProfile: Successfully created profile');
    return data;
  } catch (error) {
    console.error('createInitialUserProfile: Exception creating profile:', error);
    throw error;
  }
};
