
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { UserProfileHeader } from './UserProfileHeader';
import { UserProfileStats } from './UserProfileStats';
import { UserProfileSocialLinks } from './UserProfileSocialLinks';
import { UserProfileActions } from './UserProfileActions';

interface UserProfile {
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
  social_links: Record<string, { handle: string; url: string; }>;
}

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  isFollowing: boolean;
  isProcessing: boolean;
  onFollow: (userId: string) => void;
  onUnfollow: (userId: string) => void;
  onMessage: (userId: string, userName: string) => void;
}

export function UserProfileModal({
  isOpen,
  onClose,
  userId,
  isFollowing,
  isProcessing,
  onFollow,
  onUnfollow,
  onMessage
}: UserProfileModalProps) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && userId) {
      fetchUserProfile();
    }
  }, [isOpen, userId]);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      // Fetch user profile data
      const { data: profileData, error: profileError } = await supabase
        .from('public_user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        return;
      }

      // Fetch social links separately
      const { data: socialLinksData, error: socialError } = await supabase
        .from('user_social_links')
        .select('platform, handle, url')
        .eq('user_id', userId);

      if (socialError) {
        console.error('Error fetching social links:', socialError);
      }

      // Convert social links array to object format
      let socialLinks: Record<string, { handle: string; url: string; }> = {};
      if (socialLinksData) {
        socialLinksData.forEach(link => {
          socialLinks[link.platform] = {
            handle: link.handle,
            url: link.url || ''
          };
        });
      }

      setUserProfile({
        id: profileData.id,
        name: profileData.name,
        username: profileData.username,
        avatar_url: profileData.avatar_url,
        points: profileData.points,
        current_streak: profileData.current_streak,
        longest_streak: profileData.longest_streak,
        level: profileData.level,
        joined_at: profileData.joined_at,
        follower_count: profileData.follower_count || 0,
        following_count: profileData.following_count || 0,
        social_links: socialLinks
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowClick = () => {
    if (isFollowing) {
      onUnfollow(userId);
    } else {
      onFollow(userId);
    }
  };

  const handleMessageClick = () => {
    if (userProfile) {
      const displayName = userProfile.name || userProfile.username || 'Unknown Creator';
      onMessage(userId, displayName);
    }
  };

  if (!userProfile && !loading) {
    return null;
  }

  const displayName = userProfile?.name || userProfile?.username || 'Unknown Creator';
  const joinedDate = userProfile?.joined_at ? new Date(userProfile.joined_at).toLocaleDateString() : 'Unknown';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Creator Profile</DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-chichi-purple"></div>
          </div>
        ) : userProfile && (
          <div className="space-y-6">
            <UserProfileHeader
              displayName={displayName}
              username={userProfile.username}
              avatarUrl={userProfile.avatar_url}
              level={userProfile.level}
            />

            <UserProfileStats
              points={userProfile.points}
              currentStreak={userProfile.current_streak}
              followerCount={userProfile.follower_count}
              followingCount={userProfile.following_count}
              joinedDate={joinedDate}
            />

            <UserProfileSocialLinks socialLinks={userProfile.social_links} />

            <UserProfileActions
              isFollowing={isFollowing}
              isProcessing={isProcessing}
              onFollow={handleFollowClick}
              onMessage={handleMessageClick}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
