
import { Task } from "@/types/task";
import { TaskService } from "../TaskService";
import { NetworkDetector } from "./NetworkDetector";
import { SyncQueueManager } from "./SyncQueueManager";
import { SyncEngine } from "./SyncEngine";
import { TaskMerger } from "./TaskMerger";
import { TaskQueueManager } from "./TaskQueueManager";
import { TaskSyncDebouncer } from "./TaskSyncDebouncer";

/**
 * Handles synchronization of tasks between local storage and backend
 */
export class TaskSynchronizer {
  private static syncInProgress = false;
  
  /**
   * Syncs tasks between local storage and Supabase
   */
  public static async syncTasks(userId: string, localTasks: Task[]): Promise<Task[]> {
    // If sync is already in progress, queue this operation
    if (this.syncInProgress || SyncQueueManager.isSyncInProgress()) {
      return new Promise((resolve) => {
        console.log('Task sync already in progress, queueing operation');
        SyncQueueManager.addToQueue({
          resolve,
          operation: async () => {
            const result = await this.performSync(userId, localTasks);
            resolve(result);
          }
        });
      });
    }

    return this.performSync(userId, localTasks);
  }

  /**
   * Performs the actual synchronization with debouncing
   */
  private static async performSync(userId: string, localTasks: Task[]): Promise<Task[]> {
    if (this.syncInProgress) {
      console.log('Sync already in progress, skipping duplicate request');
      return localTasks;
    }
    
    this.syncInProgress = true;
    SyncQueueManager.setSyncInProgress(true);
    
    try {
      console.log('Starting task sync for user:', userId);
      
      // Check if we're offline
      if (NetworkDetector.isOffline()) {
        console.log('Device is offline, using local tasks only');
        return localTasks;
      }

      try {
        // Get remote tasks
        const remoteTasks = await TaskService.loadDailyTasks(userId, localTasks);
        
        // Merge local and remote tasks, with remote taking precedence
        const mergedTasks = TaskMerger.mergeTasks(localTasks, remoteTasks);
        
        // Only save back if there are actual differences
        if (TaskMerger.hasTasksChanged(mergedTasks, localTasks)) {
          console.log('Tasks changed during sync, saving merged state');
          
          // Save the merged state back to Supabase
          const success = await TaskService.saveDailyTasks(userId, mergedTasks);
          
          if (!success) {
            console.error('Error saving tasks to Supabase');
            TaskQueueManager.queueTasksForLater(userId, mergedTasks);
          }
        } else {
          console.log('No task changes during sync');
        }
        
        return mergedTasks;
      } catch (error) {
        console.error('Sync error:', error);
        return localTasks;
      }
    } finally {
      this.syncInProgress = false;
      SyncQueueManager.setSyncInProgress(false);
      
      // Process next item in the queue if any
      SyncQueueManager.processNextInQueue();
    }
  }
  
  /**
   * Queues an operation for later if offline
   */
  public static queueOperationIfOffline(userId: string, operation: {
    type: string;
    data: any;
  }): boolean {
    return TaskQueueManager.queueOperationIfOffline(userId, operation);
  }
  
  /**
   * Debounced task save to prevent excessive API calls
   */
  public static debouncedSaveTasks(userId: string, tasks: Task[], debounceMs: number = 1000): Promise<boolean> {
    return TaskSyncDebouncer.debouncedSaveTasks(userId, tasks, debounceMs);
  }
}
