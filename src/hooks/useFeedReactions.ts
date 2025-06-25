import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';
import { FeedReaction } from '@/types/feed';

export function useFeedReactions() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reactions, setReactions] = useState<Record<string, FeedReaction[]>>({});
  const [userReactions, setUserReactions] = useState<Record<string, Set<string>>>({});

  const fetchReactions = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('feed_reactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const groupedReactions: Record<string, FeedReaction[]> = {};
      const userReactionMap: Record<string, Set<string>> = {};

      // Type assertion for reactions
      const typedReactions = (data || []).map(reaction => ({
        ...reaction,
        reaction_type: reaction.reaction_type as FeedReaction['reaction_type']
      })) as FeedReaction[];

      typedReactions.forEach(reaction => {
        if (!groupedReactions[reaction.activity_id]) {
          groupedReactions[reaction.activity_id] = [];
        }
        groupedReactions[reaction.activity_id].push(reaction);

        if (user && reaction.user_id === user.id) {
          if (!userReactionMap[reaction.activity_id]) {
            userReactionMap[reaction.activity_id] = new Set();
          }
          userReactionMap[reaction.activity_id].add(reaction.reaction_type);
        }
      });

      setReactions(groupedReactions);
      setUserReactions(userReactionMap);
    } catch (error) {
      console.error('Error fetching reactions:', error);
    }
  }, [user]);

  const addReaction = useCallback(async (activityId: string, reactionType: 'big' | 'inspired' | 'goal') => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('feed_reactions')
        .insert({
          activity_id: activityId,
          user_id: user.id,
          reaction_type: reactionType
        });

      if (error) throw error;

      // Update local state
      setUserReactions(prev => ({
        ...prev,
        [activityId]: new Set([...(prev[activityId] || []), reactionType])
      }));

      fetchReactions(); // Refresh to get updated counts
    } catch (error) {
      console.error('Error adding reaction:', error);
      toast({
        title: "Error",
        description: "Failed to add reaction",
        variant: "destructive",
      });
    }
  }, [user, fetchReactions, toast]);

  const removeReaction = useCallback(async (activityId: string, reactionType: 'big' | 'inspired' | 'goal') => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('feed_reactions')
        .delete()
        .eq('activity_id', activityId)
        .eq('user_id', user.id)
        .eq('reaction_type', reactionType);

      if (error) throw error;

      // Update local state
      setUserReactions(prev => {
        const newSet = new Set(prev[activityId] || []);
        newSet.delete(reactionType);
        return {
          ...prev,
          [activityId]: newSet
        };
      });

      fetchReactions(); // Refresh to get updated counts
    } catch (error) {
      console.error('Error removing reaction:', error);
      toast({
        title: "Error",
        description: "Failed to remove reaction",
        variant: "destructive",
      });
    }
  }, [user, fetchReactions, toast]);

  return {
    reactions,
    userReactions,
    fetchReactions,
    addReaction,
    removeReaction
  };
}
