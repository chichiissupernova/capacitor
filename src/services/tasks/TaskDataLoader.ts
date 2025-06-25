
import { supabase } from "@/integrations/supabase/client";
import { Task } from "@/types/task";
import { format } from "date-fns";

export class TaskDataLoader {
  /**
   * Load today's daily tasks from Supabase
   */
  static async loadDailyTasks(userId: string, defaultTasks: Task[]): Promise<Task[]> {
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      
      console.log(`Loading tasks for user ${userId} on date ${today}`);
      
      const { data, error } = await supabase
        .from('daily_tasks')
        .select('*')
        .eq('user_id', userId)
        .eq('task_date', today);
      
      if (error) {
        console.error("Error loading tasks:", error);
        return defaultTasks;
      }
      
      if (!data || data.length === 0) {
        return defaultTasks;
      }
      
      console.log("Supabase returned tasks:", data);
      
      const tasks = data.map(dbTask => ({
        id: dbTask.task_id,
        completed: dbTask.completed,
        points: dbTask.points,
        label: defaultTasks.find(dt => dt.id === dbTask.task_id)?.label || dbTask.task_id
      }));
      
      console.log("Transformed tasks:", tasks);
      
      return tasks;
    } catch (error) {
      console.error("Error in loadDailyTasks:", error);
      return defaultTasks;
    }
  }
}
