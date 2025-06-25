
import React from 'react';
import { CreatorCard } from './CreatorCard';

interface CreatorGridProps {
  creators: Array<{
    id: string;
    name: string | null;
    username: string | null;
    avatar_url: string | null;
    points: number | null;
    current_streak: number | null;
    level: number | null;
    follower_count: number;
    niche_preferences: string[] | null;
  }>;
  followingStatus: { [key: string]: boolean };
  pendingRequests: { [key: string]: boolean };
  followingActions: Set<string>;
  onFollow: (creatorId: string) => void;
  onUnfollow: (creatorId: string) => void;
}

export function CreatorGrid({ 
  creators, 
  followingStatus, 
  pendingRequests,
  followingActions, 
  onFollow, 
  onUnfollow 
}: CreatorGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {creators.map((creator) => (
        <CreatorCard
          key={creator.id}
          creator={creator}
          isFollowing={followingStatus[creator.id] || false}
          isPending={pendingRequests[creator.id] || false}
          isProcessing={followingActions.has(creator.id)}
          onFollow={onFollow}
          onUnfollow={onUnfollow}
        />
      ))}
    </div>
  );
}
