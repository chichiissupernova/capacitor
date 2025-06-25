
/**
 * Type definitions for the sync system
 */

// Possible sync states
export type SyncStatus = 'online' | 'offline' | 'syncing';

// Pending operation structure
export interface PendingOperation {
  id: string;
  table: string;
  operation: 'insert' | 'update' | 'delete';
  data: any;
  timestamp: number;
}

// Structure for task sync results
export interface TaskSyncResult {
  succeeded: string[];
  failed: string[];
}

// Types of sync operations
export type SyncOperationType = 'completeTask' | 'saveTasks' | 'resetTasks';

// Queue item for sync operations
export interface SyncQueueItem {
  resolve: (result: any) => void;
  operation: () => Promise<void>;
}
