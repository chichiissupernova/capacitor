
import { Task } from "@/types/task";
import { SyncEngine } from "./SyncEngine";
import { NetworkDetector } from "./NetworkDetector";
import { OperationStorage } from "./OperationStorage";
import { PendingOperation } from "./SyncTypes";

/**
 * Manages queuing of task operations for offline scenarios
 */
export class TaskQueueManager {
  /**
   * Queue tasks for later sync when online
   */
  static queueTasksForLater(userId: string, tasks: Task[]): void {
    // Queue for later retry through the SyncEngine
    SyncEngine.getInstance().queueOperation(
      'daily_tasks',
      'update',
      { 
        userId,
        tasks,
        timestamp: new Date().toISOString()
      }
    );
  }

  /**
   * Queues an operation for later if offline
   */
  static queueOperationIfOffline(userId: string, operation: {
    type: string;
    data: any;
  }): boolean {
    if (!NetworkDetector.isOffline()) return false;
    
    NetworkDetector.notifyOfflineState();
    return OperationStorage.addPendingOperation(userId, {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      table: operation.type === 'completeTask' ? 'task_completions' : 'daily_tasks',
      operation: operation.type === 'completeTask' ? 'insert' : 'update',
      data: operation.data,
      timestamp: Date.now()
    });
  }
}
