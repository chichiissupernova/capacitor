import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

// Define the step types
export type PostStep = 'idea' | 'recording' | 'editing' | 'caption' | 'post';

export interface ContentProgressState {
  idea: boolean;
  recording: boolean;
  editing: boolean;
  caption: boolean;
  post: boolean;
}

export const useContentProgress = () => {
  const [progressState, setProgressState] = useState<ContentProgressState>({
    idea: false,
    recording: false,
    editing: false,
    caption: false,
    post: false
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [celebrationVisible, setCelebrationVisible] = useState<boolean>(false);
  const [allCompletedBefore, setAllCompletedBefore] = useState<boolean>(false);
  const [hasAwardedPointsToday, setHasAwardedPointsToday] = useState<boolean>(false);
  const pointsAwardedRef = useRef<boolean>(false);
  const { user, updateUserPoints } = useAuth();
  const { toast } = useToast();
  
  // Auto-hide celebration after a few seconds
  useEffect(() => {
    let timeoutId: number | undefined;
    
    if (celebrationVisible) {
      timeoutId = window.setTimeout(() => {
        setCelebrationVisible(false);
      }, 3000);
    }
    
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [celebrationVisible]);
  
  // Calculate progress percentage (completed steps out of 5)
  const getCompletedStepsCount = () => 
    Object.values(progressState).filter(Boolean).length;
  
  const progressPercentage = (getCompletedStepsCount() / 5) * 100;
  
  // Load progress from Supabase on component mount
  useEffect(() => {
    const fetchProgress = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      try {
        const today = format(new Date(), 'yyyy-MM-dd');
        
        // Try to get existing progress for today
        const { data, error } = await supabase
          .from('post_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('date', today)
          .single();
        
        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" which is fine
          console.error('Error fetching progress:', error);
          toast({
            title: "Error",
            description: "Could not load your progress",
            variant: "destructive"
          });
          return;
        }
        
        // If we have data, set the state
        if (data) {
          const newProgressState = {
            idea: data.idea_complete,
            recording: data.recording_complete,
            editing: data.editing_complete,
            caption: data.caption_complete,
            post: data.post_complete
          };
          
          setProgressState(newProgressState);
          
          // Track if all steps were already completed when component mounted
          const allComplete = Object.values(newProgressState).every(Boolean);
          setAllCompletedBefore(allComplete);
          
          // If all were already completed, mark that we've awarded points today
          if (allComplete) {
            setHasAwardedPointsToday(true);
            pointsAwardedRef.current = true;
          }
        } else {
          // Create a new progress entry for today
          const { error: insertError } = await supabase
            .from('post_progress')
            .insert({
              user_id: user.id,
              date: today
            });
            
          if (insertError) {
            console.error('Error creating progress:', insertError);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProgress();
  }, [user?.id, toast]);
  
  // Play sound when a step is completed
  const playCompletionSound = () => {
    try {
      const audio = new Audio('/sound/complete-chime.mp3');
      audio.volume = 0.3; // Lower volume
      audio.play().catch(error => {
        console.log('Sound autoplay prevented by browser:', error);
      });
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };
  
  // Handle step click with improved reward logic
  const handleStepClick = async (stepId: PostStep) => {
    if (!user?.id || isSaving) return;
    
    // Toggle the step state
    const newState = {
      ...progressState,
      [stepId]: !progressState[stepId]
    };
    
    // Get current completion status before update
    const wasAllComplete = Object.values(progressState).every(Boolean);
    const willBeAllComplete = Object.values(newState).every(Boolean);
    
    // Optimistic UI update
    setProgressState(newState);
    setIsSaving(true);
    
    // If completing (not uncompleting), play sound
    if (!progressState[stepId]) {
      playCompletionSound();
    }
    
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      
      // Update in Supabase
      const { error } = await supabase
        .from('post_progress')
        .update({
          [`${stepId}_complete`]: newState[stepId],
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('date', today);
        
      if (error) {
        throw error;
      }
      
      // Strict conditions for awarding points:
      // 1. We're transitioning from not-all-complete to all-complete
      // 2. We haven't already awarded points (both ref and state)
      // 3. All steps weren't already completed when the component mounted
      if (
        willBeAllComplete && 
        !wasAllComplete && 
        !pointsAwardedRef.current && 
        !hasAwardedPointsToday && 
        !allCompletedBefore
      ) {
        // Mark that we've awarded points to prevent multiple awards
        setHasAwardedPointsToday(true);
        pointsAwardedRef.current = true;
        
        // Award points for completing all steps in the content creation process
        if (updateUserPoints) {
          await updateUserPoints(15);
          
          // Create feed activity for content workflow completion
          try {
            const { FeedActivityService } = await import('@/services/FeedActivityService');
            await FeedActivityService.createContentProgressActivity(user.id, 15);
            console.log('Content progress feed activity created successfully');
          } catch (feedError) {
            console.error('Failed to create feed activity for content progress:', feedError);
          }
          
          const { dismiss } = toast({
            title: "+15 Points!",
            description: "You've earned points for completing your content creation process!",
          });
          
          // Auto-dismiss the toast after 5 seconds
          setTimeout(() => {
            dismiss();
          }, 5000);
        }
        
        setCelebrationVisible(true);
      }
    } catch (error) {
      console.error('Error updating progress:', error);
      
      // Revert optimistic update on error
      setProgressState(progressState);
      
      toast({
        title: "Error",
        description: "Could not save your progress",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    progressState,
    isLoading,
    isSaving,
    celebrationVisible,
    setCelebrationVisible,
    getCompletedStepsCount,
    progressPercentage,
    handleStepClick,
  };
};
