
import { Task } from "@/types/task";
import { TaskService } from "../TaskService";
import { NetworkDetector } from "./NetworkDetector";
import { TaskQueueManager } from "./TaskQueueManager";

/**
 * Handles debounced task saving to prevent excessive API calls
 */
export class TaskSyncDebouncer {
  private static syncDebounceTimeout: number | null = null;
  
  /**
   * Debounced task save to prevent excessive API calls
   */
  static debouncedSaveTasks(userId: string, tasks: Task[], debounceMs: number = 1000): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.syncDebounceTimeout !== null) {
        clearTimeout(this.syncDebounceTimeout);
      }
      
      this.syncDebounceTimeout = window.setTimeout(async () => {
        this.syncDebounceTimeout = null;
        
        try {
          if (NetworkDetector.isOffline()) {
            TaskQueueManager.queueTasksForLater(userId, tasks);
            resolve(true);
            return;
          }
          
          const success = await TaskService.saveDailyTasks(userId, tasks);
          resolve(success);
        } catch (error) {
          console.error('Error in debouncedSaveTasks:', error);
          TaskQueueManager.queueTasksForLater(userId, tasks);
          resolve(false);
        }
      }, debounceMs);
    });
  }

  /**
   * Clear any pending debounced operations
   */
  static clearPendingDebounce(): void {
    if (this.syncDebounceTimeout !== null) {
      clearTimeout(this.syncDebounceTimeout);
      this.syncDebounceTimeout = null;
    }
  }
}
