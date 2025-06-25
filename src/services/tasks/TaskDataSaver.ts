
import { supabase } from "@/integrations/supabase/client";
import { Task } from "@/types/task";
import { format } from "date-fns";

export class TaskDataSaver {
  /**
   * Save daily tasks to Supabase (legacy method, kept for compatibility)
   */
  static async saveDailyTasks(userId: string, tasks: Task[]): Promise<boolean> {
    try {
      console.log(`Saving tasks for user ${userId}:`, tasks);
      
      const today = format(new Date(), 'yyyy-MM-dd');
      
      const dbTasks = tasks.map(task => ({
        user_id: userId,
        task_id: task.id,
        task_date: today,
        completed: task.completed,
        points: task.points
      }));
      
      const { error } = await supabase
        .from('daily_tasks')
        .upsert(dbTasks, {
          onConflict: 'user_id,task_id,task_date',
          ignoreDuplicates: false
        });
      
      if (error) {
        console.error("Error saving tasks to Supabase:", error);
        return false;
      }
      
      console.log("Tasks saved successfully");
      return true;
    } catch (error) {
      console.error("Error in saveDailyTasks:", error);
      return false;
    }
  }
}
