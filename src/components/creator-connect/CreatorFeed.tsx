
import React from 'react';
import { useWins } from '@/hooks/useWins';
import { useCreatorFeed } from '@/hooks/useCreatorFeed';
import { CommunityWinCard } from './CommunityWinCard';
import { FeedActivityCard } from './FeedActivityCard';

export function CreatorFeed() {
  const { communityWins, isLoading: winsLoading, fetchCommunityWins, addReaction } = useWins();
  const { 
    activities, 
    reactions, 
    userReactions, 
    isLoading: activitiesLoading, 
    addReaction: addActivityReaction, 
    removeReaction: removeActivityReaction 
  } = useCreatorFeed();

  // Load data on mount
  React.useEffect(() => {
    console.log('CreatorFeed: Loading community wins...');
    fetchCommunityWins();
  }, [fetchCommunityWins]);

  const isLoading = winsLoading || activitiesLoading;

  console.log('CreatorFeed render:', {
    winsLoading,
    activitiesLoading,
    communityWinsCount: communityWins.length,
    activitiesCount: activities.length
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-lg p-4 animate-pulse">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Combine and sort all activities by creation date
  const allItems = [
    ...communityWins.map(win => ({ 
      type: 'win' as const, 
      data: win, 
      created_at: win.created_at 
    })),
    ...activities.map(activity => ({ 
      type: 'activity' as const, 
      data: activity, 
      created_at: activity.created_at 
    }))
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  console.log('CreatorFeed: Combined items count:', allItems.length);

  if (allItems.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">🏆</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Activity Yet</h3>
        <p className="text-sm text-gray-600 max-w-md mx-auto">
          As creators on CHICHI complete tasks, log wins, and make progress, 
          they'll appear here. Be the first to share your journey!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {allItems.map((item, index) => {
        if (item.type === 'win') {
          return (
            <CommunityWinCard
              key={`win-${item.data.id}`}
              win={item.data}
              onReaction={addReaction}
            />
          );
        } else {
          return (
            <FeedActivityCard
              key={`activity-${item.data.id}`}
              activity={item.data}
              reactions={reactions[item.data.id] || []}
              userReactions={userReactions[item.data.id] || new Set()}
              onReaction={addActivityReaction}
              onRemoveReaction={removeActivityReaction}
            />
          );
        }
      })}
    </div>
  );
}
