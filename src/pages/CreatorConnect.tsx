
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SearchHeader } from '@/components/creator-connect/SearchHeader';
import { CreatorFeed } from '@/components/creator-connect/CreatorFeed';
import { FeedHeader } from '@/components/creator-connect/FeedHeader';
import { CreatorGrid } from '@/components/creator-connect/CreatorGrid';
import { EmptyState } from '@/components/creator-connect/EmptyState';
import { useCreatorData } from '@/hooks/useCreatorData';
import { useFollowActions } from '@/hooks/useFollowActions';

export default function CreatorConnect() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNiche, setSelectedNiche] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('feed');

  const { creators, setCreators, isLoading } = useCreatorData();
  const {
    followingStatus,
    pendingRequests,
    followingActions,
    handleFollow,
    handleUnfollow
  } = useFollowActions(creators, setCreators);

  // Filter creators based on search and niche
  const filteredCreators = creators.filter(creator => {
    const matchesSearch = !searchQuery || 
      creator.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creator.username?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesNiche = selectedNiche === 'all' || 
      (creator.niche_preferences && creator.niche_preferences.includes(selectedNiche));
    
    return matchesSearch && matchesNiche;
  });

  return (
    <div className="max-w-6xl mx-auto p-3 md:p-6">
      <SearchHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedNiche={selectedNiche}
        onNicheChange={setSelectedNiche}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="feed">#winwall</TabsTrigger>
          <TabsTrigger value="discover">Discover</TabsTrigger>
        </TabsList>
        
        <TabsContent value="feed" className="mt-6">
          <FeedHeader />
          <CreatorFeed />
        </TabsContent>
        
        <TabsContent value="discover" className="mt-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Discover Creators</h2>
            <p className="text-gray-600 text-sm">
              Connect with creators who are building their content journey on CHICHI.
            </p>
          </div>
          
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-lg p-4 animate-pulse">
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="h-8 bg-gray-200 rounded"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredCreators.length > 0 ? (
            <CreatorGrid
              creators={filteredCreators}
              followingStatus={followingStatus}
              pendingRequests={pendingRequests}
              followingActions={followingActions}
              onFollow={handleFollow}
              onUnfollow={handleUnfollow}
            />
          ) : (
            <EmptyState searchQuery={searchQuery} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
