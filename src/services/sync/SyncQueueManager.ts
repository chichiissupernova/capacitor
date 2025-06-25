
import { SyncQueueItem } from "./SyncTypes";

/**
 * Manages the queue of sync operations with improved concurrency control
 */
export class SyncQueueManager {
  private static syncInProgress = false;
  private static syncQueue: Array<SyncQueueItem> = [];
  private static processingTimeout: number | null = null;
  private static maxConcurrentOperations = 1;
  private static activeOperations = 0;

  /**
   * Checks if a sync operation is in progress
   */
  public static isSyncInProgress(): boolean {
    return this.syncInProgress || this.activeOperations > 0;
  }

  /**
   * Sets the sync in progress flag
   */
  public static setSyncInProgress(inProgress: boolean): void {
    this.syncInProgress = inProgress;
    
    if (!inProgress && this.syncQueue.length > 0) {
      this.scheduleQueueProcessing();
    }
  }

  /**
   * Adds an operation to the sync queue
   */
  public static addToQueue(queueItem: SyncQueueItem): void {
    this.syncQueue.push(queueItem);
    this.scheduleQueueProcessing();
  }
  
  /**
   * Schedule queue processing with debounce to prevent excessive processing
   */
  private static scheduleQueueProcessing(): void {
    if (this.syncInProgress) return;
    
    if (this.processingTimeout !== null) {
      clearTimeout(this.processingTimeout);
    }
    
    this.processingTimeout = window.setTimeout(() => {
      this.processingTimeout = null;
      this.processQueue();
    }, 50); // Short delay to batch operations
  }

  /**
   * Process items in the queue up to the concurrency limit
   */
  private static processQueue(): void {
    if (this.syncInProgress) return;
    
    while (this.syncQueue.length > 0 && this.activeOperations < this.maxConcurrentOperations) {
      this.processNextInQueue();
    }
  }

  /**
   * Processes the next item in the queue
   */
  public static processNextInQueue(): void {
    if (this.syncQueue.length > 0) {
      const nextSync = this.syncQueue.shift();
      if (nextSync) {
        this.activeOperations++;
        
        Promise.resolve(nextSync.operation())
          .then(result => {
            try {
              nextSync.resolve(result);
            } catch (error) {
              console.error('Error resolving sync operation:', error);
            }
          })
          .catch(error => {
            console.error('Error in sync operation:', error);
            try {
              nextSync.resolve(undefined); // Resolve with undefined to avoid hanging promises
            } catch (e) {
              console.error('Error resolving failed sync operation:', e);
            }
          })
          .finally(() => {
            this.activeOperations--;
            if (this.syncQueue.length > 0 && !this.syncInProgress) {
              this.scheduleQueueProcessing();
            }
          });
      }
    }
  }

  /**
   * Clears the sync queue
   */
  public static clearQueue(): void {
    // Resolve all pending operations to prevent hanging promises
    this.syncQueue.forEach(item => {
      try {
        item.resolve(undefined);
      } catch (e) {
        console.error('Error resolving cleared sync operation:', e);
      }
    });
    
    this.syncQueue = [];
    
    if (this.processingTimeout !== null) {
      clearTimeout(this.processingTimeout);
      this.processingTimeout = null;
    }
  }
  
  /**
   * Set maximum number of concurrent operations
   */
  public static setMaxConcurrentOperations(max: number): void {
    this.maxConcurrentOperations = Math.max(1, max);
  }
  
  /**
   * Get current queue length
   */
  public static getQueueLength(): number {
    return this.syncQueue.length;
  }
}
