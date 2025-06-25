
import React from 'react';
import { useAuth } from '@/contexts/auth';
import { useFollowingFeed } from '@/hooks/useFollowingFeed';
import { formatActivityTime } from '@/utils/timeFormatting';
import { FollowingFeedHeader } from '@/components/following-feed/FollowingFeedHeader';
import { FeedActivityCard } from '@/components/following-feed/FeedActivityCard';
import { FollowedCreatorsList } from '@/components/following-feed/FollowedCreatorsList';
import { UserStatsCard } from '@/components/following-feed/UserStatsCard';
import { EmptyFeedState } from '@/components/following-feed/EmptyFeedState';
import { LoadingState } from '@/components/following-feed/LoadingState';

export default function FollowingFeed() {
  const { user } = useAuth();
  const { feedActivities, followedCreators, isLoading } = useFollowingFeed(user?.id);

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <FollowingFeedHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {feedActivities.length === 0 ? (
            <EmptyFeedState hasFollowedCreators={followedCreators.length > 0} />
          ) : (
            feedActivities.map((activity) => (
              <FeedActivityCard 
                key={activity.id} 
                activity={activity} 
                onFormatTime={formatActivityTime}
              />
            ))
          )}
        </div>

        <div className="space-y-6">
          <FollowedCreatorsList creators={followedCreators} />
          <UserStatsCard followingCount={followedCreators.length} />
        </div>
      </div>
    </div>
  );
}
