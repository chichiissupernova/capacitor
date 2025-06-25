import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
import { toast } from '@/hooks/use-toast';

interface Conversation {
  other_user_id: string;
  other_user_name: string;
  other_user_username: string;
  other_user_avatar_url: string | null;
  last_message: string;
  last_message_date: string;
  unread_count: number;
}

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  message: string;
  created_at: string;
  read_at: string | null;
}

export const useOptimizedMessages = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const { user } = useAuth();

  const fetchConversations = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase.rpc('get_user_conversations', {
        user_uuid: user.id
      });

      if (error) {
        console.error('Error fetching conversations:', error);
        toast({
          title: "Error",
          description: "Failed to load conversations",
          variant: "destructive",
        });
        return;
      }

      setConversations(data || []);
    } catch (error) {
      console.error('Unexpected error fetching conversations:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (otherUserId: string) => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('user_messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        toast({
          title: "Error",
          description: "Failed to load messages",
          variant: "destructive",
        });
        return;
      }

      setMessages(data || []);

      // Mark messages as read
      await supabase
        .from('user_messages')
        .update({ read_at: new Date().toISOString() })
        .eq('sender_id', otherUserId)
        .eq('recipient_id', user.id)
        .is('read_at', null);

      // Refresh conversations to update unread counts
      fetchConversations();
    } catch (error) {
      console.error('Unexpected error fetching messages:', error);
    }
  };

  const sendMessage = async (recipientId: string, message: string) => {
    if (!user?.id || !message.trim()) return false;

    setIsSending(true);
    try {
      const { error } = await supabase
        .from('user_messages')
        .insert({
          sender_id: user.id,
          recipient_id: recipientId,
          message: message.trim()
        });

      if (error) {
        console.error('Error sending message:', error);
        toast({
          title: "Error",
          description: "Failed to send message",
          variant: "destructive",
        });
        return false;
      }

      fetchMessages(recipientId);
      return true;
    } catch (error) {
      console.error('Unexpected error sending message:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSending(false);
    }
  };

  return {
    conversations,
    messages,
    isLoading,
    isSending,
    fetchConversations,
    fetchMessages,
    sendMessage
  };
};
