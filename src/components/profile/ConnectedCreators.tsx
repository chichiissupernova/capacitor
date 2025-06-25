
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreatorGrid } from '@/components/creator-connect/CreatorGrid';
import { useCreatorData } from '@/hooks/useCreatorData';
import { useFollowActions } from '@/hooks/useFollowActions';
import { Users } from 'lucide-react';

export function ConnectedCreators() {
  const { creators, setCreators, isLoading } = useCreatorData();
  const { followingStatus, pendingRequests, followingActions, handleFollow, handleUnfollow } = useFollowActions(creators, setCreators);

  // Filter to only show connected creators
  const connectedCreators = creators.filter(creator => followingStatus[creator.id]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2 md:pb-3">
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Users className="h-4 w-4 md:h-5 md:w-5" />
            Connected Creators
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 md:p-6">
          <div className="text-center py-4 md:py-8">
            <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-chichi-orange mx-auto"></div>
            <p className="mt-2 md:mt-4 text-gray-600 text-sm">Loading connected creators...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2 md:pb-3">
        <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
          <Users className="h-4 w-4 md:h-5 md:w-5" />
          Connected Creators ({connectedCreators.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 md:p-6">
        {connectedCreators.length === 0 ? (
          <div className="text-center py-4 md:py-8">
            <div className="text-2xl md:text-4xl mb-2 md:mb-4">🤝</div>
            <p className="text-gray-600 mb-1 md:mb-2 text-sm">No connections yet</p>
            <p className="text-xs md:text-sm text-gray-500">
              Visit Creator Connect to discover and connect with other creators!
            </p>
          </div>
        ) : (
          <CreatorGrid
            creators={connectedCreators}
            followingStatus={followingStatus}
            pendingRequests={pendingRequests}
            followingActions={followingActions}
            onFollow={handleFollow}
            onUnfollow={handleUnfollow}
          />
        )}
      </CardContent>
    </Card>
  );
}
