
import { TaskService } from '@/services/TaskService';
import { PointsDebugger } from '@/utils/pointsDebugger';
import { Task } from '@/types/task';

export const useTaskCompletionHandler = () => {
  const handleTaskSaving = async (
    userId: string,
    taskId: string,
    task: Task
  ): Promise<{ success: boolean; pointsAwarded: number; error?: string }> => {
    console.log("=== TASK SAVING START ===");
    
    PointsDebugger.logPointsUpdateFlow('SAVING_TO_DB', {
      taskId,
      points: task.points,
      userId
    });

    console.log(`STEP 1: Attempting to save task to database`);
    const saveResult = await TaskService.saveDailyTaskWithCheck(userId, taskId, task.points);
    
    PointsDebugger.logPointsUpdateFlow('DB_SAVE_RESULT', saveResult);
    console.log(`STEP 1 RESULT:`, saveResult);

    if (!saveResult.success) {
      console.error("STEP 1 FAILED:", saveResult.error);
      throw new Error(saveResult.error || "Failed to save task");
    }

    return saveResult;
  };

  return {
    handleTaskSaving
  };
};
