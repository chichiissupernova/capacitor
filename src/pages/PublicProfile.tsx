
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
import { PublicProfileHeader } from '@/components/creator-connect/PublicProfileHeader';
import { PublicProfileConnections } from '@/components/creator-connect/PublicProfileConnections';
import { PublicProfileWins } from '@/components/creator-connect/PublicProfileWins';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageSquare, UserPlus, UserCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MessageDialog } from '@/components/creator-connect/MessageDialog';

interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  website?: string;
  instagram_handle?: string;
  tiktok_handle?: string;
  twitter_handle?: string;
  pinterest_handle?: string;
  youtube_handle?: string;
  points: number;
  level: number;
  current_streak: number;
  longest_streak: number;
  created_at: string;
  niche_preferences?: string[];
}

const PublicProfile = () => {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'none' | 'pending' | 'accepted'>('none');
  const [showMessageDialog, setShowMessageDialog] = useState(false);

  useEffect(() => {
    if (username) {
      fetchProfile();
      if (currentUser) {
        checkConnectionStatus();
      }
    }
  }, [username, currentUser]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('username', username)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error",
          description: "Could not load user profile",
          variant: "destructive"
        });
        return;
      }

      if (data) {
        setProfile({
          ...data,
          niche_preferences: data.niche_preferences || []
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Could not load user profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const checkConnectionStatus = async () => {
    if (!currentUser || !profile) return;

    try {
      const { data, error } = await supabase
        .from('connection_requests')
        .select('status')
        .or(`and(requester_id.eq.${currentUser.id},requested_id.eq.${profile.id}),and(requester_id.eq.${profile.id},requested_id.eq.${currentUser.id})`)
        .single();

      if (data) {
        const status = data.status as 'none' | 'pending' | 'accepted';
        setConnectionStatus(status);
        setIsConnected(status === 'accepted');
      }
    } catch (error) {
      console.error('Error checking connection status:', error);
    }
  };

  const handleConnect = async () => {
    if (!currentUser || !profile) return;

    try {
      const { error } = await supabase
        .from('connection_requests')
        .insert({
          requester_id: currentUser.id,
          requested_id: profile.id,
          status: 'pending'
        });

      if (error) {
        console.error('Error sending connection request:', error);
        toast({
          title: "Error",
          description: "Could not send connection request",
          variant: "destructive"
        });
        return;
      }

      // Create notification for the connection request
      await supabase
        .from('notifications')
        .insert({
          user_id: profile.id,
          type: 'connection_request',
          title: 'New Connection Request',
          message: `${currentUser.name || 'Someone'} wants to connect with you on CHICHI.`
        });

      setConnectionStatus('pending');
      toast({
        title: "Connection request sent!",
        description: `We've sent a connection request to ${profile.name}`,
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Could not send connection request",
        variant: "destructive"
      });
    }
  };

  const renderConnectionButton = () => {
    if (!currentUser || currentUser.id === profile?.id) return null;

    switch (connectionStatus) {
      case 'accepted':
        return (
          <Button className="flex-1" variant="outline">
            <UserCheck className="mr-2 h-4 w-4" />
            Connected
          </Button>
        );
      case 'pending':
        return (
          <Button className="flex-1" variant="outline" disabled>
            <UserPlus className="mr-2 h-4 w-4" />
            Request Sent
          </Button>
        );
      default:
        return (
          <Button onClick={handleConnect} className="flex-1">
            <UserPlus className="mr-2 h-4 w-4" />
            Connect
          </Button>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-chichi-purple"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <h1 className="text-2xl font-bold mb-4">User not found</h1>
            <p className="text-gray-600 mb-4">
              The user @{username} doesn't exist or has been deactivated.
            </p>
            <Button onClick={() => window.history.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Convert UserProfile to the expected format for PublicProfileHeader
  const publicProfileData = {
    id: profile.id,
    name: profile.name,
    username: profile.username,
    avatar_url: profile.avatar_url || null,
    points: profile.points,
    level: profile.level,
    niche_preferences: profile.niche_preferences || null
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        {/* Back button */}
        <Button 
          variant="ghost" 
          onClick={() => window.history.back()}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {/* Profile Header */}
        <PublicProfileHeader 
          profile={publicProfileData}
          isOwnProfile={currentUser?.id === profile.id}
          isFollowing={isConnected}
          isProcessing={false}
          user={currentUser}
          onFollow={handleConnect}
          onMessage={() => setShowMessageDialog(true)}
        />

        {/* Action buttons */}
        {currentUser && currentUser.id !== profile.id && (
          <div className="flex gap-3 mb-8">
            {renderConnectionButton()}
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setShowMessageDialog(true)}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Message
            </Button>
          </div>
        )}

        {/* Content sections */}
        <div className="grid gap-8">
          <PublicProfileWins recentWins={[]} />
          <PublicProfileConnections connectedCreators={[]} />
        </div>

        {/* Message Dialog */}
        <MessageDialog
          isOpen={showMessageDialog}
          onClose={() => setShowMessageDialog(false)}
          recipientId={profile.id}
          recipientName={profile.name}
        />
      </div>
    </div>
  );
};

export default PublicProfile;
