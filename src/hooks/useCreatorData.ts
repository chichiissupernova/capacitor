import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';

interface CreatorProfile {
  id: string;
  name: string | null;
  username: string | null;
  avatar_url: string | null;
  points: number | null;
  current_streak: number | null;
  longest_streak: number | null;
  level: number | null;
  joined_at: string | null;
  follower_count: number;
  following_count: number;
  niche_preferences: string[] | null;
}

export function useCreatorData() {
  const { user } = useAuth();
  const [creators, setCreators] = useState<CreatorProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCreators = async () => {
    try {
      // First, get users who have explicitly opted OUT of Creator Connect
      const { data: optedOutUsers, error: privacyError } = await supabase
        .from('user_privacy_settings')
        .select('user_id')
        .eq('share_progress_on_creator_connect', false);

      if (privacyError) {
        console.error('Error fetching privacy settings:', privacyError);
        return;
      }

      const optedOutUserIds = optedOutUsers?.map(u => u.user_id) || [];

      // Fetch all user profiles except those who have opted out
      let profilesQuery = supabase
        .from('user_profiles')
        .select(`
          id,
          name,
          username,
          avatar_url,
          points,
          current_streak,
          longest_streak,
          level,
          joined_at,
          niche_preferences
        `);

      // Only add the NOT IN clause if there are actually opted-out users
      if (optedOutUserIds.length > 0) {
        profilesQuery = profilesQuery.not('id', 'in', `(${optedOutUserIds.map(id => `'${id}'`).join(',')})`);
      }

      const { data: profiles, error: profilesError } = await profilesQuery
        .order('points', { ascending: false });

      if (profilesError) {
        console.error('Error fetching user profiles:', profilesError);
        return;
      }

      // Get follower counts for all users
      const { data: followerCounts, error: followerError } = await supabase
        .from('user_follows')
        .select('following_id')
        .then(result => {
          if (result.error) return { data: null, error: result.error };
          
          const counts: { [key: string]: number } = {};
          result.data?.forEach(follow => {
            counts[follow.following_id] = (counts[follow.following_id] || 0) + 1;
          });
          
          return { data: counts, error: null };
        });

      // Get following counts for all users
      const { data: followingCounts, error: followingError } = await supabase
        .from('user_follows')
        .select('follower_id')
        .then(result => {
          if (result.error) return { data: null, error: result.error };
          
          const counts: { [key: string]: number } = {};
          result.data?.forEach(follow => {
            counts[follow.follower_id] = (counts[follow.follower_id] || 0) + 1;
          });
          
          return { data: counts, error: null };
        });

      if (followerError || followingError) {
        console.error('Error fetching follow counts:', followerError || followingError);
        return;
      }

      // Combine profile data with follow counts
      const creatorsWithCounts: CreatorProfile[] = profiles?.map(profile => ({
        ...profile,
        follower_count: followerCounts?.[profile.id] || 0,
        following_count: followingCounts?.[profile.id] || 0
      })) || [];

      // Filter out current user and users without names/usernames
      const filteredData = creatorsWithCounts.filter(creator => 
        creator.id !== user?.id && (creator.name || creator.username)
      );
      
      setCreators(filteredData);
    } catch (error) {
      console.error('Error fetching creators:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCreators();
  }, [user?.id]);

  return { creators, setCreators, isLoading, refetch: fetchCreators };
}
