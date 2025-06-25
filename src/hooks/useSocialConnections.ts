import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SocialConnection } from '@/types/supabase-custom-types';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth';

export function useSocialConnections() {
  const [connections, setConnections] = useState<SocialConnection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  
  const fetchConnections = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Use any type to bypass TypeScript checking for the custom table
      const response = await (supabase as any)
        .from('social_connections')
        .select('*')
        .eq('user_id', user.id);
        
      if (response.error) throw response.error;
      
      // Safely cast the response data to our custom type
      setConnections(response.data || []);
    } catch (error) {
      console.error('Error fetching social connections:', error);
      toast({
        title: 'Error',
        description: 'Could not load your connected accounts',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const connectAccount = async (platform: string, mockData = true) => {
    if (!user) return;
    
    try {
      if (mockData) {
        // Mock data for demonstration purposes
        const mockConnection = {
          user_id: user.id,
          platform,
          username: `user_${Math.floor(Math.random() * 1000)}@${platform}`,
          access_token: 'mock_token_' + Math.random().toString(36).substring(7),
        };
        
        // Use any type to bypass TypeScript checking
        const response = await (supabase as any)
          .from('social_connections')
          .upsert([mockConnection]);
          
        if (response.error) throw response.error;
        
        toast({
          title: 'Success',
          description: `Connected to ${platform} successfully!`,
        });
        
        // Refresh the connections
        fetchConnections();
      } else {
        // In a real app, this would redirect to the OAuth flow
        toast({
          title: 'Not Implemented',
          description: 'Real OAuth flow not implemented in this demo',
        });
      }
    } catch (error) {
      console.error('Error connecting account:', error);
      toast({
        title: 'Error',
        description: `Failed to connect ${platform} account`,
        variant: 'destructive',
      });
    }
  };
  
  const disconnectAccount = async (connectionId: string) => {
    try {
      // Use any type to bypass TypeScript checking
      const response = await (supabase as any)
        .from('social_connections')
        .delete()
        .eq('id', connectionId);
        
      if (response.error) throw response.error;
      
      toast({
        title: 'Account Disconnected',
        description: 'Social media account has been disconnected',
      });
      
      // Refresh the connections
      fetchConnections();
    } catch (error) {
      console.error('Error disconnecting account:', error);
      toast({
        title: 'Error',
        description: 'Failed to disconnect account',
        variant: 'destructive',
      });
    }
  };
  
  useEffect(() => {
    fetchConnections();
  }, [user]);
  
  return {
    connections,
    isLoading,
    connectAccount,
    disconnectAccount,
    refreshConnections: fetchConnections,
  };
}
