
/**
 * @deprecated Use the new sync modules instead
 * This file is kept for backward compatibility
 */

// Re-export everything from the new modules
export { SyncEngine as SyncManager } from './sync';
export { useSyncStatus } from './sync';
export type { SyncStatus, PendingOperation } from './sync';
