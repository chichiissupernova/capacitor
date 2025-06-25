
import { Task } from "@/types/task";

/**
 * Handles merging of local and remote tasks with conflict resolution
 */
export class TaskMerger {
  /**
   * Merge local and remote tasks with proper conflict resolution
   */
  static mergeTasks(localTasks: Task[], remoteTasks: Task[]): Task[] {
    return localTasks.map(localTask => {
      const remoteTask = remoteTasks.find(rt => rt.id === localTask.id);
      
      // If task is found in remote, merge with local giving preference to 'completed' status
      if (remoteTask) {
        return { 
          ...localTask, 
          // If completed in either local or remote, consider it completed
          completed: localTask.completed || remoteTask.completed 
        };
      }
      return localTask;
    });
  }
  
  /**
   * Check if tasks have actually changed by comparing JSON representations
   */
  static hasTasksChanged(tasksA: Task[], tasksB: Task[]): boolean {
    return JSON.stringify(tasksA) !== JSON.stringify(tasksB);
  }
}
