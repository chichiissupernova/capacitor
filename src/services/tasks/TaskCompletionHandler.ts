
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export class TaskCompletionHandler {
  /**
   * Check if a task was already completed today
   */
  static async checkTaskCompletedToday(userId: string, taskId: string): Promise<boolean> {
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      
      console.log(`Checking if task ${taskId} was completed today for user ${userId}`);
      
      const { data, error } = await supabase
        .from('daily_tasks')
        .select('completed')
        .eq('user_id', userId)
        .eq('task_id', taskId)
        .eq('task_date', today)
        .eq('completed', true)
        .limit(1);
      
      if (error) {
        console.error("Error checking task completion:", error);
        return false;
      }
      
      const wasCompleted = data && data.length > 0;
      console.log(`Task ${taskId} completion status:`, wasCompleted);
      
      return wasCompleted;
    } catch (error) {
      console.error("Error in checkTaskCompletedToday:", error);
      return false;
    }
  }

  /**
   * Log task completion with duplicate prevention
   */
  static async logTaskCompletionWithCheck(
    userId: string,
    taskId: string,
    taskName: string,
    points: number
  ): Promise<{ success: boolean; pointsAwarded: number }> {
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      const completedAt = new Date().toISOString();
      
      console.log(`Logging task completion: user=${userId}, task=${taskId}, points=${points}`);
      
      // Check if this exact completion already exists today
      const { data: existingCompletion } = await supabase
        .from('task_completions')
        .select('id')
        .eq('user_id', userId)
        .eq('task_id', taskId)
        .gte('completed_at', `${today}T00:00:00.000Z`)
        .lt('completed_at', `${today}T23:59:59.999Z`)
        .limit(1);
      
      if (existingCompletion && existingCompletion.length > 0) {
        console.log("Task completion already logged today");
        return { success: true, pointsAwarded: 0 };
      }
      
      // Insert the completion log
      const { error } = await supabase
        .from('task_completions')
        .insert([
          {
            user_id: userId,
            task_id: taskId,
            task_name: taskName,
            points_earned: points,
            completed_at: completedAt
          }
        ]);
      
      if (error) {
        console.error("Error logging task completion:", error);
        return { success: false, pointsAwarded: 0 };
      }
      
      console.log(`Task completion logged successfully. Points awarded: ${points}`);
      return { success: true, pointsAwarded: points };
    } catch (error) {
      console.error("Error in logTaskCompletionWithCheck:", error);
      return { success: false, pointsAwarded: 0 };
    }
  }

  /**
   * Save daily task with duplicate prevention
   */
  static async saveDailyTaskWithCheck(
    userId: string, 
    taskId: string, 
    points: number
  ): Promise<{ success: boolean; pointsAwarded: number; error?: string }> {
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      
      console.log(`Saving task completion: user=${userId}, task=${taskId}, points=${points}`);
      
      // First check if already completed to prevent duplicates
      const alreadyCompleted = await this.checkTaskCompletedToday(userId, taskId);
      if (alreadyCompleted) {
        console.log("Task already completed today, no points awarded");
        return { success: true, pointsAwarded: 0 };
      }
      
      // Insert or update the task as completed
      const { error: upsertError } = await supabase
        .from('daily_tasks')
        .upsert({
          user_id: userId,
          task_id: taskId,
          task_date: today,
          completed: true,
          points: points
        }, {
          onConflict: 'user_id,task_id,task_date',
          ignoreDuplicates: false
        });
      
      if (upsertError) {
        console.error("Error upserting task:", upsertError);
        return { success: false, pointsAwarded: 0, error: upsertError.message };
      }
      
      // Log the completion with duplicate check
      const logResult = await this.logTaskCompletionWithCheck(userId, taskId, taskId, points);
      
      console.log(`Task completion saved successfully. Points awarded: ${logResult.pointsAwarded}`);
      
      return { 
        success: true, 
        pointsAwarded: logResult.pointsAwarded 
      };
    } catch (error) {
      console.error("Error in saveDailyTaskWithCheck:", error);
      return { 
        success: false, 
        pointsAwarded: 0, 
        error: error instanceof Error ? error.message : "Unknown error" 
      };
    }
  }

  /**
   * Legacy method kept for compatibility
   */
  static async logTaskCompletion(
    userId: string,
    taskId: string,
    taskName: string,
    points: number
  ): Promise<boolean> {
    const result = await this.logTaskCompletionWithCheck(userId, taskId, taskName, points);
    return result.success;
  }
}
