
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FeedActivity {
  id: string;
  user_id: string;
  user_name: string;
  user_username: string;
  user_avatar: string;
  activity_type: 'task_completion' | 'streak_milestone' | 'level_up' | 'achievement';
  activity_data: any;
  created_at: string;
}

interface FollowedCreator {
  id: string;
  name: string;
  username: string;
  avatar_url: string;
  current_streak: number;
  points: number;
  level: number;
}

export function useFollowingFeed(userId: string | undefined) {
  const { toast } = useToast();
  const [feedActivities, setFeedActivities] = useState<FeedActivity[]>([]);
  const [followedCreators, setFollowedCreators] = useState<FollowedCreator[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFollowedCreators = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('user_follows')
        .select(`
          following_id,
          user_profiles!user_follows_following_id_fkey (
            id,
            name,
            username,
            avatar_url,
            current_streak,
            points,
            level
          )
        `)
        .eq('follower_id', userId);

      if (error) {
        console.error('Error fetching followed creators:', error);
        return;
      }

      const creators = data?.map((follow: any) => follow.user_profiles).filter(Boolean) || [];
      setFollowedCreators(creators);
    } catch (error) {
      console.error('Error fetching followed creators:', error);
    }
  };

  const fetchFollowingFeed = async () => {
    if (!userId) return;

    try {
      const { data: following, error: followingError } = await supabase
        .from('user_follows')
        .select('following_id')
        .eq('follower_id', userId);

      if (followingError) {
        console.error('Error fetching following list:', followingError);
        return;
      }

      const followingIds = following?.map(f => f.following_id) || [];

      if (followingIds.length === 0) {
        setIsLoading(false);
        return;
      }

      const { data: activities, error: activitiesError } = await supabase
        .from('task_completions')
        .select(`
          id,
          user_id,
          task_name,
          points_earned,
          completed_at,
          user_profiles!task_completions_user_id_fkey (
            name,
            username,
            avatar_url
          )
        `)
        .in('user_id', followingIds)
        .order('completed_at', { ascending: false })
        .limit(20);

      if (activitiesError) {
        console.error('Error fetching activities:', activitiesError);
        return;
      }

      const feedData: FeedActivity[] = activities?.map((activity: any) => ({
        id: activity.id,
        user_id: activity.user_id,
        user_name: activity.user_profiles?.name || 'Anonymous',
        user_username: activity.user_profiles?.username || '',
        user_avatar: activity.user_profiles?.avatar_url || '',
        activity_type: 'task_completion',
        activity_data: {
          task_name: activity.task_name,
          points_earned: activity.points_earned
        },
        created_at: activity.completed_at
      })) || [];

      setFeedActivities(feedData);
    } catch (error) {
      console.error('Error fetching following feed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchFollowingFeed();
      fetchFollowedCreators();
    }
  }, [userId]);

  return {
    feedActivities,
    followedCreators,
    isLoading
  };
}
