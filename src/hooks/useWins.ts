
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth/useAuth';
import { toast } from '@/hooks/use-toast';

export interface Win {
  id: string;
  title: string;
  date: string;
  platform: string;
  description?: string;
  tags: string[];
  screenshot_url?: string;
  share_to_community: boolean;
  created_at: string;
}

export interface CommunityWin {
  id: string;
  title: string;
  date: string;
  platform: string;
  description?: string;
  tags: string[];
  screenshot_url?: string;
  created_at: string;
  user_name: string;
  username: string;
  avatar_url?: string;
  big_reactions: number;
  inspired_reactions: number;
  goal_reactions: number;
}

export interface WinFormData {
  title: string;
  date: string;
  platform: string;
  description?: string;
  tags: string[];
  screenshot?: File;
  share_to_community: boolean;
}

export const PLATFORMS = ['Instagram', 'TikTok', 'YouTube', 'Other'] as const;
export const WIN_TAGS = [
  '#ViralMoment',
  '#ConsistencyPayoff', 
  '#BrandDM',
  '#BackOnTrack',
  '#EngagementSpike'
] as const;

export function useWins() {
  const { user } = useAuth();
  const [wins, setWins] = useState<Win[]>([]);
  const [communityWins, setCommunityWins] = useState<CommunityWin[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalWinsThisWeek, setTotalWinsThisWeek] = useState(0);

  const fetchUserWins = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('wins')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setWins(data || []);
    } catch (error) {
      console.error('Error fetching user wins:', error);
      toast({
        title: "Error",
        description: "Failed to load your wins",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWeeklyWinsCount = async () => {
    if (!user?.id) return;
    
    try {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const { count, error } = await supabase
        .from('wins')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', weekAgo.toISOString());

      if (error) throw error;
      setTotalWinsThisWeek(count || 0);
    } catch (error) {
      console.error('Error fetching weekly wins count:', error);
    }
  };

  const fetchCommunityWins = async () => {
    try {
      const { data, error } = await supabase
        .from('community_wins_with_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCommunityWins(data || []);
    } catch (error) {
      console.error('Error fetching community wins:', error);
    }
  };

  const createWin = async (winData: WinFormData): Promise<boolean> => {
    if (!user?.id) return false;
    
    try {
      let screenshot_url = null;
      
      // Handle screenshot upload if provided
      if (winData.screenshot) {
        const fileExt = winData.screenshot.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('win-screenshots')
          .upload(fileName, winData.screenshot);
          
        if (uploadError) throw uploadError;
        
        const { data: urlData } = supabase.storage
          .from('win-screenshots')
          .getPublicUrl(fileName);
          
        screenshot_url = urlData.publicUrl;
      }

      const { error } = await supabase
        .from('wins')
        .insert({
          user_id: user.id,
          title: winData.title,
          date: winData.date,
          platform: winData.platform,
          description: winData.description,
          tags: winData.tags,
          screenshot_url,
          share_to_community: winData.share_to_community,
        });

      if (error) throw error;
      
      await fetchUserWins();
      await fetchWeeklyWinsCount();
      
      const successMessages = [
        "Win logged! You're building momentum 🚀",
        "Another win in the books! Keep going 💪",
        "That's what we like to see! Win recorded 🔥",
        `You've logged ${totalWinsThisWeek + 1} wins this week — CHI approved 🔥`
      ];
      
      const randomMessage = successMessages[Math.floor(Math.random() * successMessages.length)];
      
      toast({
        title: "Win Logged!",
        description: randomMessage,
      });
      
      return true;
    } catch (error) {
      console.error('Error creating win:', error);
      toast({
        title: "Error",
        description: "Failed to log your win. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const addReaction = async (winId: string, reactionType: 'big' | 'inspired' | 'goal') => {
    if (!user?.id) return;
    
    try {
      const { error } = await supabase
        .from('win_reactions')
        .upsert({
          win_id: winId,
          user_id: user.id,
          reaction_type: reactionType,
        });

      if (error) throw error;
      await fetchCommunityWins();
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  useEffect(() => {
    fetchUserWins();
    fetchWeeklyWinsCount();
  }, [user?.id]);

  return {
    wins,
    communityWins,
    isLoading,
    totalWinsThisWeek,
    createWin,
    addReaction,
    fetchCommunityWins,
    refetchWins: fetchUserWins,
  };
}
