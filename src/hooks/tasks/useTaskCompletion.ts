
import { useState } from 'react';
import { useAuth } from '@/contexts/auth';
import { Task } from '@/types/task';
import { PointsDebugger } from '@/utils/pointsDebugger';
import { useTaskValidation } from './validation/useTaskValidation';
import { useTaskCompletionHandler } from './completion/useTaskCompletionHandler';
import { useStreakManagement } from './streak/useStreakManagement';
import { useTaskFeedback } from './feedback/useTaskFeedback';

export const useTaskCompletion = (
  tasks: Task[],
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { user, updateUserPoints, updateUserData } = useAuth();
  
  const { validateTaskCompletion, markTaskAsCompleted, unmarkTaskAsCompleted } = useTaskValidation();
  const { handleTaskSaving } = useTaskCompletionHandler();
  const { handleStreakUpdate } = useStreakManagement();
  const { createTaskActivity, showCompletionToast, showErrorToast, showDuplicateToast } = useTaskFeedback();
  
  const handleCompleteTask = async (taskId: string, showReward?: (points: number) => void) => {
    // Validate task completion
    const validation = validateTaskCompletion(taskId, tasks, user?.id, isSubmitting);
    if (!validation.canComplete || !validation.task) {
      return;
    }

    const task = validation.task;

    try {
      setIsSubmitting(true);
      
      // Mark as completed locally first to prevent double clicks
      markTaskAsCompleted(taskId);

      // Update task state immediately for UI responsiveness
      setTasks(prevTasks =>
        prevTasks.map(t =>
          t.id === taskId ? { ...t, completed: true } : t
        )
      );

      // Save task to database
      const saveResult = await handleTaskSaving(user!.id, taskId, task);

      // Only proceed if points were actually awarded (not a duplicate)
      if (saveResult.pointsAwarded > 0) {
        // Show reward animation first if provided (before other state updates)
        if (showReward) {
          showReward(saveResult.pointsAwarded);
        }

        // Delay the points event to prevent simultaneous state updates
        setTimeout(() => {
          const event = new CustomEvent('task-completed', {
            detail: { points: saveResult.pointsAwarded }
          });
          window.dispatchEvent(event);
        }, 300);
        
        // Update user points in auth context with delay to prevent conflicts
        setTimeout(async () => {
          await updateUserPoints(saveResult.pointsAwarded);
        }, 400);
        
        // Handle streak updates for main post task with further delay
        if (taskId === 'post' && updateUserData) {
          setTimeout(async () => {
            try {
              const streakResult = await handleStreakUpdate(taskId, user!, saveResult.pointsAwarded, updateUserData);
              
              if (streakResult && streakResult.user) {
                await updateUserData({
                  currentStreak: streakResult.user.currentStreak,
                  longestStreak: streakResult.user.longestStreak,
                  lastActivityDate: streakResult.user.lastActivityDate
                });
              }
            } catch (streakError) {
              console.error('Error updating streak:', streakError);
            }
          }, 600);
        }
        
        // Create feed activity with delay
        setTimeout(async () => {
          await createTaskActivity(user!.id, task.label, taskId, saveResult.pointsAwarded);
        }, 500);

        // Show toast notification with delay
        setTimeout(() => {
          showCompletionToast(taskId, saveResult.pointsAwarded);
        }, 200);
      } else {
        showDuplicateToast();
      }
    } catch (error) {
      console.error('Error completing task:', error);
      
      // Revert optimistic updates
      setTasks(prevTasks =>
        prevTasks.map(t => (t.id === taskId ? { ...t, completed: false } : t))
      );
      
      unmarkTaskAsCompleted(taskId);
      
      showErrorToast(error instanceof Error ? error : new Error("Could not complete task. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleCompleteTask,
  };
};
