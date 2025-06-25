
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { FeedActivity } from '@/types/feed';

export function useFeedActivities() {
  const { toast } = useToast();
  const [activities, setActivities] = useState<FeedActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchActivities = useCallback(async () => {
    try {
      console.log('Fetching feed activities...');
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('creator_feed_with_profiles')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching activities:', error);
        throw error;
      }

      console.log('Raw activities data from creator_feed_with_profiles:', data);
      console.log('Fetched activities count:', data?.length || 0);

      // Type assertion to ensure compatibility
      const typedData = (data || []).map(item => ({
        ...item,
        activity_type: item.activity_type as FeedActivity['activity_type'],
        data: item.data as Record<string, any>
      })) as FeedActivity[];

      console.log('Processed activities:', typedData);
      setActivities(typedData);
    } catch (error) {
      console.error('Error fetching feed activities:', error);
      toast({
        title: "Error",
        description: "Failed to load creator feed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const createActivity = useCallback(async (
    activityType: FeedActivity['activity_type'],
    title: string,
    description?: string,
    data?: Record<string, any>
  ) => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('No authenticated user for creating activity');
      return;
    }

    try {
      console.log('Creating new activity:', { activityType, title, description, data });
      const { data: newActivity, error } = await supabase
        .from('creator_feed_activities')
        .insert({
          user_id: user.id,
          activity_type: activityType,
          title,
          description,
          data: data || {},
          is_public: true
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating activity:', error);
        throw error;
      }

      console.log('Activity created successfully:', newActivity);
      fetchActivities(); // Refresh feed
    } catch (error) {
      console.error('Error creating activity:', error);
    }
  }, [fetchActivities]);

  // Load activities on mount
  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return {
    activities,
    isLoading,
    fetchActivities,
    createActivity
  };
}
