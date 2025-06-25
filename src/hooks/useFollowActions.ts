import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';
import { NotificationService } from '@/services/NotificationService';

interface FollowingStatus {
  [key: string]: boolean;
}

interface PendingRequestStatus {
  [key: string]: boolean;
}

interface CreatorProfile {
  id: string;
  follower_count: number;
}

export function useFollowActions(creators: CreatorProfile[], setCreators: React.Dispatch<React.SetStateAction<CreatorProfile[]>>) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [followingStatus, setFollowingStatus] = useState<FollowingStatus>({});
  const [pendingRequests, setPendingRequests] = useState<PendingRequestStatus>({});
  const [followingActions, setFollowingActions] = useState<Set<string>>(new Set());

  const fetchFollowingStatus = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('user_follows')
        .select('following_id')
        .eq('follower_id', user.id);

      if (error) {
        console.error('Error fetching following status:', error);
        return;
      }

      const followingMap: FollowingStatus = {};
      data?.forEach(follow => {
        followingMap[follow.following_id] = true;
      });
      setFollowingStatus(followingMap);
    } catch (error) {
      console.error('Error fetching following status:', error);
    }
  };

  const fetchPendingRequests = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('connection_requests')
        .select('requested_id')
        .eq('requester_id', user.id)
        .eq('status', 'pending');

      if (error) {
        console.error('Error fetching pending requests:', error);
        return;
      }

      const pendingMap: PendingRequestStatus = {};
      data?.forEach(request => {
        pendingMap[request.requested_id] = true;
      });
      setPendingRequests(pendingMap);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
    }
  };

  const handleFollow = async (creatorId: string) => {
    if (!user?.id || followingActions.has(creatorId)) return;

    setFollowingActions(prev => new Set(prev).add(creatorId));
    
    try {
      // Create a connection request instead of direct follow
      await NotificationService.createConnectionRequest(user.id, creatorId);

      // Update pending requests status
      setPendingRequests(prev => ({ ...prev, [creatorId]: true }));

      toast({
        title: "Connection Request Sent",
        description: "Your connection request has been sent!",
      });
    } catch (error) {
      console.error('Error sending connection request:', error);
      toast({
        title: "Error",
        description: "Failed to send connection request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setFollowingActions(prev => {
        const newSet = new Set(prev);
        newSet.delete(creatorId);
        return newSet;
      });
    }
  };

  const handleUnfollow = async (creatorId: string) => {
    if (!user?.id || followingActions.has(creatorId)) return;

    setFollowingActions(prev => new Set(prev).add(creatorId));
    
    try {
      const { error } = await supabase
        .from('user_follows')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', creatorId);

      if (error) {
        console.error('Error disconnecting from creator:', error);
        toast({
          title: "Error",
          description: "Failed to disconnect from creator. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setFollowingStatus(prev => ({ ...prev, [creatorId]: false }));
      
      // Update follower count locally
      setCreators(prev => prev.map(creator => 
        creator.id === creatorId 
          ? { ...creator, follower_count: Math.max(0, creator.follower_count - 1) }
          : creator
      ));

      toast({
        title: "Success",
        description: "You have disconnected from this creator.",
      });
    } catch (error) {
      console.error('Error disconnecting from creator:', error);
      toast({
        title: "Error",
        description: "Failed to disconnect from creator. Please try again.",
        variant: "destructive",
      });
    } finally {
      setFollowingActions(prev => {
        const newSet = new Set(prev);
        newSet.delete(creatorId);
        return newSet;
      });
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchFollowingStatus();
      fetchPendingRequests();
    }
  }, [user?.id]);

  return {
    followingStatus,
    pendingRequests,
    followingActions,
    handleFollow,
    handleUnfollow
  };
}
