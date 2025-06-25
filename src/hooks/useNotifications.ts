import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
import type { Notification, GroupedNotifications } from '@/types/notifications';
import { toast } from '@/hooks/use-toast';

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Transform the data to match our Notification type
      const typedNotifications: Notification[] = (data || []).map(item => ({
        ...item,
        data: item.data as Record<string, any>,
        type: item.type as Notification['type']
      }));

      setNotifications(typedNotifications);
      setUnreadCount(typedNotifications.filter(n => !n.read_at).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast({
        title: "Error",
        description: "Failed to load notifications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId 
            ? { ...n, read_at: new Date().toISOString() }
            : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .is('read_at', null);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(n => ({ ...n, read_at: n.read_at || new Date().toISOString() }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleConnectionRequest = async (requestId: string, action: 'accepted' | 'ignored') => {
    try {
      const { error } = await supabase
        .from('connection_requests')
        .update({ status: action })
        .eq('id', requestId);

      if (error) throw error;

      // If accepted, create the actual follow relationship
      if (action === 'accepted') {
        // Get the connection request details to create follow relationship
        const { data: requestData, error: requestError } = await supabase
          .from('connection_requests')
          .select('requester_id, requested_id')
          .eq('id', requestId)
          .single();

        if (!requestError && requestData) {
          // Create bidirectional follow relationship
          await supabase
            .from('user_follows')
            .insert([
              { follower_id: requestData.requester_id, following_id: requestData.requested_id },
              { follower_id: requestData.requested_id, following_id: requestData.requester_id }
            ]);
        }
      }

      // Mark the notification as read
      const notification = notifications.find(n => 
        n.type === 'connection_request' && n.data.request_id === requestId
      );
      if (notification) {
        await markAsRead(notification.id);
      }

      toast({
        title: action === 'accepted' ? "Connection Accepted" : "Request Ignored",
        description: action === 'accepted' 
          ? "You are now connected!" 
          : "Connection request ignored",
      });
    } catch (error) {
      console.error('Error handling connection request:', error);
      toast({
        title: "Error",
        description: "Failed to handle connection request",
        variant: "destructive",
      });
    }
  };

  const groupNotifications = (notifications: Notification[]): GroupedNotifications => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    return notifications.reduce((groups, notification) => {
      const notificationDate = new Date(notification.created_at);
      const notificationDay = new Date(notificationDate.getFullYear(), notificationDate.getMonth(), notificationDate.getDate());

      if (notificationDay.getTime() === today.getTime()) {
        groups.today.push(notification);
      } else if (notificationDay.getTime() === yesterday.getTime()) {
        groups.yesterday.push(notification);
      } else {
        groups.older.push(notification);
      }

      return groups;
    }, { today: [], yesterday: [], older: [] } as GroupedNotifications);
  };

  useEffect(() => {
    fetchNotifications();

    // Set up real-time subscription
    if (user) {
      const channel = supabase
        .channel('notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            const newNotification: Notification = {
              ...payload.new as any,
              data: payload.new.data as Record<string, any>,
              type: payload.new.type as Notification['type']
            };
            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(prev => prev + 1);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  return {
    notifications,
    groupedNotifications: groupNotifications(notifications),
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    handleConnectionRequest,
    refetch: fetchNotifications
  };
}
