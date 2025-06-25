
import { Task } from "@/types/task";
import { User } from "@/contexts/auth/types";
import { NetworkDetector } from "./sync/NetworkDetector";
import { OperationStorage } from "./sync/OperationStorage";
import { SyncProcessor } from "./sync/SyncProcessor";
import { TaskSynchronizer } from "./sync/TaskSynchronizer";
import { SyncEngine } from "./sync/SyncEngine";
import { PendingOperation } from "./sync/SyncTypes";

/**
 * Service responsible for synchronizing data between local storage and Supabase
 * Handles offline capabilities and sync resolution
 */
export class SyncService {
  private static isInitialized = false;
  private static syncIntervalMs = 60000; // Default sync interval: 1 minute
  
  /**
   * Initializes the sync service
   */
  static initialize(): void {
    if (this.isInitialized) return;
    
    // Start network detection
    NetworkDetector.startPeriodicDetection(this.syncIntervalMs);
    
    // Start the sync engine
    SyncEngine.getInstance().startSync(this.syncIntervalMs);
    
    this.isInitialized = true;
    console.log('SyncService initialized');
  }

  /**
   * Returns current offline status
   */
  static isOffline(): boolean {
    return NetworkDetector.isOffline();
  }

  /**
   * Detects if the application is currently offline
   */
  static async detectOfflineStatus(): Promise<boolean> {
    return NetworkDetector.detectOfflineStatus();
  }

  /**
   * Syncs tasks between local storage and Supabase
   */
  static async syncTasks(userId: string, localTasks: Task[]): Promise<Task[]> {
    if (!this.isInitialized) this.initialize();
    return TaskSynchronizer.syncTasks(userId, localTasks);
  }

  /**
   * Syncs streak data between local storage and Supabase
   */
  static async syncStreak(user: User, localStreak: any): Promise<User | null> {
    if (!this.isInitialized) this.initialize();
    
    try {
      // Simple sync strategy - return the user as-is for now
      // In a full implementation, this would merge local and remote streak data
      return user;
    } catch (error) {
      console.error('Error syncing streak:', error);
      return user;
    }
  }

  /**
   * Retries failed operations when online
   */
  static async retryFailedOperations(userId: string): Promise<void> {
    if (!this.isInitialized) this.initialize();
    
    if (NetworkDetector.isOffline()) {
      console.log('Still offline, skipping retry');
      return;
    }
    
    return SyncProcessor.retryFailedOperations(userId);
  }

  /**
   * Queues an operation for later if offline
   */
  static queueOperationIfOffline(userId: string, operation: {
    type: string;
    data: any;
  }): boolean {
    if (!NetworkDetector.isOffline()) return false;
    
    // Create proper pending operation
    const pendingOp: PendingOperation = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      table: operation.type === 'completeTask' ? 'task_completions' : 'daily_tasks',
      operation: operation.type === 'completeTask' ? 'insert' : 'update',
      data: operation.data,
      timestamp: Date.now()
    };
    
    return OperationStorage.addPendingOperation(userId, pendingOp);
  }

  /**
   * Sets up periodic sync attempts
   */
  static initializePeriodicSync(userId: string): () => void {
    if (!this.isInitialized) this.initialize();
    
    // Set up periodic retry
    const intervalId = setInterval(() => {
      if (userId && !NetworkDetector.isOffline()) {
        this.retryFailedOperations(userId);
      }
    }, this.syncIntervalMs);
    
    // Return cleanup function
    return () => {
      clearInterval(intervalId);
    };
  }
  
  /**
   * Configure sync interval
   */
  static setSyncInterval(intervalMs: number): void {
    this.syncIntervalMs = Math.max(5000, intervalMs); // Minimum 5 seconds
    
    if (this.isInitialized) {
      // Restart with new interval
      NetworkDetector.startPeriodicDetection(this.syncIntervalMs);
      SyncEngine.getInstance().startSync(this.syncIntervalMs);
    }
  }
  
  /**
   * Get pending operation count for a user
   */
  static getPendingOperationCount(userId: string): number {
    return OperationStorage.getPendingOperationCount(userId);
  }
  
  /**
   * Add a listener for offline state changes
   */
  static addOfflineListener(callback: (isOffline: boolean) => void): () => void {
    return NetworkDetector.addOfflineListener(callback);
  }
}
