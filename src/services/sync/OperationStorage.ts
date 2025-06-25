
import { PendingOperation } from "./SyncTypes";
import { SyncStorage } from "./SyncStorage";

/**
 * Manages storage of pending operations
 */
export class OperationStorage {
  private static readonly USER_KEY = "pending_ops";
  private static pendingOperationsCache: Map<string, PendingOperation[]> = new Map();

  /**
   * Store pending operations for a user
   */
  public static storePendingOperations(userId: string, operations: PendingOperation[]): void {
    try {
      // Update cache
      this.pendingOperationsCache.set(userId, [...operations]);
      
      // Store in localStorage
      SyncStorage.saveUserData(userId, this.USER_KEY, operations);
    } catch (error) {
      console.error('Error storing pending operations:', error);
    }
  }

  /**
   * Retrieve pending operations for a user
   */
  public static getPendingOperations(userId: string): PendingOperation[] {
    try {
      // Check cache first
      if (this.pendingOperationsCache.has(userId)) {
        return this.pendingOperationsCache.get(userId) || [];
      }
      
      // If not in cache, load from localStorage
      const pendingOps = SyncStorage.loadUserData<PendingOperation[]>(userId, this.USER_KEY, []);
      
      // Update cache
      this.pendingOperationsCache.set(userId, pendingOps);
      
      return pendingOps;
    } catch (error) {
      console.error('Error retrieving pending operations:', error);
      return [];
    }
  }

  /**
   * Add an operation to the pending list
   */
  public static addPendingOperation(userId: string, operation: PendingOperation): boolean {
    try {
      const pendingOps = this.getPendingOperations(userId);
      
      // Add timestamp if not present
      const enhancedOperation = {
        ...operation,
        timestamp: operation.timestamp || Date.now()
      };
      
      pendingOps.push(enhancedOperation);
      this.storePendingOperations(userId, pendingOps);
      
      return true;
    } catch (error) {
      console.error('Error adding pending operation:', error);
      return false;
    }
  }

  /**
   * Clear all pending operations for a user
   */
  public static clearPendingOperations(userId: string): void {
    try {
      this.pendingOperationsCache.set(userId, []);
      SyncStorage.saveUserData(userId, this.USER_KEY, []);
    } catch (error) {
      console.error('Error clearing pending operations:', error);
    }
  }
  
  /**
   * Remove specific operations from the pending list
   */
  public static removePendingOperations(userId: string, operationIds: string[]): void {
    try {
      const pendingOps = this.getPendingOperations(userId);
      const filteredOps = pendingOps.filter(op => !operationIds.includes(op.id));
      
      if (filteredOps.length !== pendingOps.length) {
        this.storePendingOperations(userId, filteredOps);
      }
    } catch (error) {
      console.error('Error removing pending operations:', error);
    }
  }
  
  /**
   * Get count of pending operations
   */
  public static getPendingOperationCount(userId: string): number {
    try {
      return this.getPendingOperations(userId).length;
    } catch (error) {
      console.error('Error getting pending operation count:', error);
      return 0;
    }
  }
}
