
import { FeedActivityService } from '@/services/FeedActivityService';
import { useToast } from '@/hooks/use-toast';

export const useTaskFeedback = () => {
  const { toast } = useToast();

  const createTaskActivity = async (
    userId: string,
    taskLabel: string,
    taskId: string,
    pointsAwarded: number
  ): Promise<void> => {
    console.log("STEP 2a.5: Creating feed activity for task completion");
    try {
      // Use valid activity types that match database constraints
      const activityType = taskId === 'post' ? 'task_completion' : 'task_completion';
      await FeedActivityService.createTaskActivity(
        userId, 
        taskLabel, 
        activityType,
        pointsAwarded
      );
      console.log("STEP 2a.5 SUCCESS: Feed activity created");
    } catch (feedError) {
      console.error("STEP 2a.5 WARNING: Failed to create feed activity (non-critical):", feedError);
    }
  };

  const showCompletionToast = (taskId: string, pointsAwarded: number): void => {
    console.log("STEP 2d: Showing toast notification");
    const taskTypeText = taskId === 'post' ? 'Main task' : 'Bonus task';
    const streakMessage = taskId === 'post' ? ' Your streak continues!' : '';
    toast({
      title: `+${pointsAwarded} points!`,
      description: `${taskTypeText} completed successfully!${streakMessage}`,
    });
  };

  const showErrorToast = (error: Error): void => {
    toast({
      title: "Error",
      description: error.message || "Could not complete task. Please try again.",
      variant: "destructive"
    });
  };

  const showDuplicateToast = (): void => {
    toast({
      title: "Task already completed",
      description: "You've already completed this task today!",
      variant: "destructive"
    });
  };

  return {
    createTaskActivity,
    showCompletionToast,
    showErrorToast,
    showDuplicateToast
  };
};
