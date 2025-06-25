
/**
 * Main export file for the sync system
 * Provides a unified interface for all sync operations
 */

// Export concrete implementations
export { SyncEngine } from './SyncEngine';

// Re-export for backward compatibility
export { SyncEngine as SyncManager } from './SyncEngine';

// Export types properly
export type { SyncStatus, PendingOperation } from './SyncTypes';

// Simple hook placeholder
export const useSyncStatus = () => {
  return {
    isOnline: true,
    isSyncing: false,
    pendingOperations: 0
  };
};
