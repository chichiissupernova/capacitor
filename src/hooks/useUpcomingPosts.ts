
import { useState, useEffect, useRef, useCallback } from 'react';
import { format, addDays, startOfDay, isAfter, isSameDay } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Post {
  id: string;
  title: string;
  description?: string;
  date: Date;
  platform: string;
  contentType: string;
  completed: boolean;
}

export function useUpcomingPosts(userId: string | undefined, daysAhead: number = 14) {
  const [upcomingPosts, setUpcomingPosts] = useState<Post[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState<boolean>(true);
  const lastUserIdRef = useRef<string | undefined>();
  const fetchTimeoutRef = useRef<number | null>(null);
  const refreshTimeoutRef = useRef<number | null>(null);
  
  // Memoized fetch function to prevent recreation on every render
  const fetchUpcomingPosts = useCallback(async () => {
    if (!userId) {
      setUpcomingPosts([]);
      setIsLoadingPosts(false);
      return;
    }
    
    // Prevent multiple simultaneous requests for the same user
    if (lastUserIdRef.current === userId && fetchTimeoutRef.current !== null) {
      console.log('Fetch already in progress, skipping');
      return;
    }
    
    lastUserIdRef.current = userId;
    setIsLoadingPosts(true);
    
    try {
      const today = startOfDay(new Date());
      const todayStr = format(today, 'yyyy-MM-dd');
      const endDate = addDays(today, daysAhead);
      const endDateStr = format(endDate, 'yyyy-MM-dd');
      
      console.log(`Fetching calendar tasks for user ${userId} from ${todayStr} to ${endDateStr}`);
      
      const { data, error } = await supabase
        .from('calendar_tasks')
        .select('*')
        .eq('user_id', userId)
        .gte('date', todayStr)
        .lte('date', endDateStr)
        .eq('completed', false)
        .order('date', { ascending: true });
        
      if (error) {
        console.error('Error fetching upcoming posts:', error);
        toast({
          variant: "destructive",
          title: "Error fetching posts",
          description: error.message
        });
        return;
      }
      
      if (data && data.length > 0) {
        console.log('Fetched upcoming posts:', data);
        
        const formattedPosts = data.map(task => ({
          id: task.id,
          title: task.title,
          description: task.description,
          date: new Date(task.date),
          platform: task.platform,
          contentType: task.content_type,
          completed: task.completed
        }));
        
        setUpcomingPosts(formattedPosts);
      } else {
        console.log('No upcoming posts found');
        setUpcomingPosts([]);
      }
    } catch (error) {
      console.error('Error in fetchUpcomingPosts:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load upcoming posts"
      });
    } finally {
      setIsLoadingPosts(false);
      fetchTimeoutRef.current = null;
    }
  }, [userId, daysAhead]);
  
  // Enhanced debounced refresh function - consolidates multiple calls
  const refreshPosts = useCallback(async () => {
    // Clear any existing refresh timeout
    if (refreshTimeoutRef.current !== null) {
      clearTimeout(refreshTimeoutRef.current);
    }
    
    // Clear any existing fetch timeout
    if (fetchTimeoutRef.current !== null) {
      clearTimeout(fetchTimeoutRef.current);
    }
    
    // Set a single consolidated refresh timeout
    refreshTimeoutRef.current = window.setTimeout(() => {
      fetchUpcomingPosts();
      refreshTimeoutRef.current = null;
    }, 500); // Increased debounce time for better stability
  }, [fetchUpcomingPosts]);
  
  // Initial fetch when userId changes
  useEffect(() => {
    if (userId !== lastUserIdRef.current) {
      fetchUpcomingPosts();
    }
  }, [userId, fetchUpcomingPosts]);
  
  // Handle post completion without optimistic updates (handled in UI component)
  const handleCompletePost = useCallback(async (id: string) => {
    if (!userId) return;
    
    try {
      const { error } = await supabase
        .from('calendar_tasks')
        .update({ completed: true })
        .eq('id', id);
        
      if (error) {
        console.error('Error completing post:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to mark post as complete"
        });
        return;
      }
      
      // Emit event for points animation with delay to prevent conflicts
      setTimeout(() => {
        const event = new CustomEvent('task-completed', {
          detail: { points: 10 } // Standard post completion points
        });
        window.dispatchEvent(event);
      }, 300);
      
      toast({
        title: "Success",
        description: "Post marked as complete"
      });
      
      // Refresh after a longer delay to allow all state updates to settle
      setTimeout(() => {
        refreshPosts();
      }, 800);
      
    } catch (error) {
      console.error('Error in handleCompletePost:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update post status"
      });
    }
  }, [userId, refreshPosts]);
  
  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (fetchTimeoutRef.current !== null) {
        clearTimeout(fetchTimeoutRef.current);
      }
      if (refreshTimeoutRef.current !== null) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);
  
  return { upcomingPosts, isLoadingPosts, handleCompletePost, refreshPosts };
}
