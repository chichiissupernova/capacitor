
import { toast } from "@/hooks/use-toast";
import { TaskService } from "../TaskService";
import { NetworkDetector } from "./NetworkDetector";
import { OperationStorage } from "./OperationStorage";
import { SyncEngine } from "./SyncEngine";
import { PendingOperation } from "./SyncTypes";

/**
 * Processes sync operations and handles retries
 */
export class SyncProcessor {
  private static processingInProgress = false;
  private static maxRetryAttempts = 3;
  private static retryCount: Record<string, number> = {};
  
  /**
   * Retries failed operations when online
   */
  public static async retryFailedOperations(userId: string): Promise<void> {
    // Prevent concurrent processing
    if (this.processingInProgress) {
      console.log('Operation processing already in progress, skipping');
      return;
    }
    
    // Check if we're online
    if (await NetworkDetector.detectOfflineStatus()) {
      console.log('Still offline, skipping retry');
      return;
    }
    
    try {
      this.processingInProgress = true;
      
      // Get pending operations from localStorage
      const pendingOps = OperationStorage.getPendingOperations(userId);
      
      if (pendingOps.length === 0) {
        console.log('No pending operations to process');
        return;
      }
      
      console.log(`Processing ${pendingOps.length} pending operations`);
      
      // Group operations by type for more efficient processing
      const taskCompletions: PendingOperation[] = [];
      const dailyTasks: PendingOperation[] = [];
      const otherOps: PendingOperation[] = [];
      
      pendingOps.forEach(op => {
        if (op.table === 'task_completions') {
          taskCompletions.push(op);
        } else if (op.table === 'daily_tasks') {
          dailyTasks.push(op);
        } else {
          otherOps.push(op);
        }
      });
      
      const succeededIds: string[] = [];
      const failedIds: string[] = [];
      
      // Process task completions in batch where possible
      if (taskCompletions.length > 0) {
        const results = await this.processTaskCompletions(userId, taskCompletions);
        succeededIds.push(...results.succeeded);
        failedIds.push(...results.failed);
      }
      
      // Process daily tasks (potentially in batch)
      if (dailyTasks.length > 0) {
        const results = await this.processDailyTasks(userId, dailyTasks);
        succeededIds.push(...results.succeeded);
        failedIds.push(...results.failed);
      }
      
      // Process other operations individually
      for (const op of otherOps) {
        try {
          const success = await this.processSingleOperation(userId, op);
          if (success) {
            succeededIds.push(op.id);
          } else {
            failedIds.push(op.id);
          }
        } catch (error) {
          console.error('Failed to process operation:', op, error);
          failedIds.push(op.id);
        }
      }
      
      // Remove successful operations
      if (succeededIds.length > 0) {
        OperationStorage.removePendingOperations(userId, succeededIds);
      }
      
      // Increment retry count for failed operations
      for (const id of failedIds) {
        this.retryCount[id] = (this.retryCount[id] || 0) + 1;
        
        // Remove operations that have exceeded max retries
        if (this.retryCount[id] >= this.maxRetryAttempts) {
          console.warn(`Operation ${id} failed ${this.maxRetryAttempts} times, removing from queue`);
          OperationStorage.removePendingOperations(userId, [id]);
        }
      }
      
      // Show notification if there were successful operations
      if (succeededIds.length > 0) {
        toast({
          title: "Sync Complete",
          description: `${succeededIds.length} changes have been saved.`,
        });
      }
      
      // Log failures
      if (failedIds.length > 0) {
        console.warn(`${failedIds.length} operations failed to sync and will be retried later`);
      }
      
    } catch (error) {
      console.error('Error processing pending operations:', error);
    } finally {
      this.processingInProgress = false;
    }
  }

  /**
   * Process task completions in batch where possible
   */
  private static async processTaskCompletions(
    userId: string, 
    operations: PendingOperation[]
  ): Promise<{ succeeded: string[], failed: string[] }> {
    const succeeded: string[] = [];
    const failed: string[] = [];
    
    // Process each operation
    for (const op of operations) {
      try {
        const data = op.data;
        const success = await TaskService.logTaskCompletion(
          userId,
          data.taskId,
          data.taskName,
          data.points
        );
        
        if (success) {
          succeeded.push(op.id);
        } else {
          failed.push(op.id);
        }
      } catch (error) {
        console.error('Error processing task completion:', error);
        failed.push(op.id);
      }
    }
    
    return { succeeded, failed };
  }
  
  /**
   * Process daily tasks potentially in batch
   */
  private static async processDailyTasks(
    userId: string, 
    operations: PendingOperation[]
  ): Promise<{ succeeded: string[], failed: string[] }> {
    const succeeded: string[] = [];
    const failed: string[] = [];
    
    // For now process each operation - could be optimized further
    for (const op of operations) {
      try {
        const data = op.data;
        
        if (data.tasks) {
          const success = await TaskService.saveDailyTasks(userId, data.tasks);
          
          if (success) {
            succeeded.push(op.id);
          } else {
            failed.push(op.id);
          }
        } else {
          console.warn('Invalid daily task data format:', data);
          // Mark as succeeded to remove from queue
          succeeded.push(op.id);
        }
      } catch (error) {
        console.error('Error processing daily tasks:', error);
        failed.push(op.id);
      }
    }
    
    return { succeeded, failed };
  }

  /**
   * Process a single operation
   */
  private static async processSingleOperation(userId: string, op: PendingOperation): Promise<boolean> {
    // Determine operation type from the data
    if (op.data.taskId && op.data.taskName) {
      // It's a task completion
      return TaskService.logTaskCompletion(
        userId,
        op.data.taskId,
        op.data.taskName,
        op.data.points
      );
    } else if (op.data.tasks) {
      // It's a tasks update
      return TaskService.saveDailyTasks(userId, op.data.tasks);
    }
    
    console.warn('Unknown operation format:', op);
    return false;
  }

  /**
   * Sets up periodic sync attempts
   */
  public static initializePeriodicSync(userId: string): () => void {
    // Start the sync engine
    const syncEngine = SyncEngine.getInstance();
    syncEngine.startSync(60000); // Try every minute
    
    // Also set up periodic sync via the retry mechanism
    const intervalId = setInterval(() => {
      if (userId && !NetworkDetector.isOffline()) {
        this.retryFailedOperations(userId);
      }
    }, 60000); // Try every minute
    
    return () => {
      syncEngine.stopSync();
      clearInterval(intervalId);
    };
  }
  
  /**
   * Reset retry counters
   */
  public static resetRetryCounters(): void {
    this.retryCount = {};
  }
  
  /**
   * Set maximum retry attempts
   */
  public static setMaxRetryAttempts(attempts: number): void {
    this.maxRetryAttempts = Math.max(1, attempts);
  }
}
