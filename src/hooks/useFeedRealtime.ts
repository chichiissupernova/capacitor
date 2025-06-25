import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';

interface UseFeedRealtimeProps {
  onActivitiesChange: () => void;
  onReactionsChange: () => void;
}

export function useFeedRealtime({ onActivitiesChange, onReactionsChange }: UseFeedRealtimeProps) {
  const { user } = useAuth();

  useEffect(() => {
    // Set up real-time subscription for activities with optimized filtering
    const activitiesChannel = supabase
      .channel('creator_feed_activities')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'creator_feed_activities',
          filter: 'is_public=eq.true' // Only listen to public activities
        },
        () => {
          onActivitiesChange();
        }
      )
      .subscribe();

    // Set up real-time subscription for reactions
    const reactionsChannel = supabase
      .channel('feed_reactions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'feed_reactions'
        },
        () => {
          onReactionsChange();
        }
      )
      .subscribe();

    // Set up real-time subscription for wins
    const winsChannel = supabase
      .channel('wins_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'wins',
          filter: 'share_to_community=eq.true' // Only listen to community-shared wins
        },
        () => {
          // Trigger activities refresh since wins affect the combined feed
          onActivitiesChange();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(activitiesChannel);
      supabase.removeChannel(reactionsChannel);
      supabase.removeChannel(winsChannel);
    };
  }, [user, onActivitiesChange, onReactionsChange]);
}
