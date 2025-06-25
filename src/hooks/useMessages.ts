import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
import { toast } from '@/hooks/use-toast';

export const useMessages = () => {
  const [isSending, setIsSending] = useState(false);
  const { user } = useAuth();

  const sendMessage = async (recipientId: string, message: string) => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to send messages",
        variant: "destructive",
      });
      return false;
    }

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
          title: "Error sending message",
          description: "Please try again later",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Message sent!",
        description: "Your message has been delivered",
      });
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error sending message",
        description: "Please try again later",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSending(false);
    }
  };

  return {
    sendMessage,
    isSending
  };
};
