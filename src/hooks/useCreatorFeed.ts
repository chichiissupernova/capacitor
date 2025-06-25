
import { useFeedActivities } from './useFeedActivities';
import { useFeedReactions } from './useFeedReactions';
import { useFeedRealtime } from './useFeedRealtime';
import { useEffect } from 'react';

export function useCreatorFeed() {
  const {
    activities,
    isLoading,
    fetchActivities,
    createActivity
  } = useFeedActivities();

  const {
    reactions,
    userReactions,
    fetchReactions,
    addReaction,
    removeReaction
  } = useFeedReactions();

  // Load data on mount
  useEffect(() => {
    console.log('useCreatorFeed: Loading activities and reactions...');
    fetchActivities();
    fetchReactions();
  }, [fetchActivities, fetchReactions]);

  // Set up real-time subscriptions
  useFeedRealtime({
    onActivitiesChange: fetchActivities,
    onReactionsChange: fetchReactions
  });

  const refetch = () => {
    fetchActivities();
    fetchReactions();
  };

  return {
    activities,
    reactions,
    userReactions,
    isLoading,
    addReaction,
    removeReaction,
    createActivity,
    refetch
  };
}
