
/**
 * Handles the processing of sync operations
 */

import { PendingOperation } from './SyncTypes';
import { SyncTableHandler } from './SyncTableHandler';

export class SyncOperationsProcessor {
  /**
   * Process all pending operations
   */
  public async processOperations(
    operations: PendingOperation[],
    tableHandler: SyncTableHandler
  ): Promise<{ succeeded: string[], failed: string[] }> {
    const succeededOps: string[] = [];
    const failedOps: string[] = [];
    
    // Group operations by table for more efficient processing
    const tableOperations: Record<string, PendingOperation[]> = {};
    operations.forEach(op => {
      if (!tableOperations[op.table]) {
        tableOperations[op.table] = [];
      }
      tableOperations[op.table].push(op);
    });
    
    // Process operations by table
    for (const [table, ops] of Object.entries(tableOperations)) {
      try {
        // Special handling for daily_tasks table
        if (table === 'daily_tasks') {
          await this.processDailyTasks(ops, tableHandler, succeededOps, failedOps);
          continue;
        }
        
        // Process other tables
        await this.processStandardOperations(ops, tableHandler, succeededOps, failedOps);
      } catch (e) {
        console.error(`Exception during sync for table ${table}:`, e);
        // Mark all operations for this table as failed
        ops.forEach(op => failedOps.push(op.id));
      }
    }
    
    return { succeeded: succeededOps, failed: failedOps };
  }
  
  /**
   * Process standard operations (insert, update, delete)
   */
  private async processStandardOperations(
    operations: PendingOperation[],
    tableHandler: SyncTableHandler,
    succeededOps: string[],
    failedOps: string[]
  ): Promise<void> {
    for (const op of operations) {
      let error = null;
      
      try {
        // Perform the operation
        switch (op.operation) {
          case 'insert':
            error = await tableHandler.insertData(op.table, op.data);
            break;
            
          case 'update':
            error = await tableHandler.updateData(op.table, op.data);
            break;
            
          case 'delete':
            error = await tableHandler.deleteData(op.table, op.data);
            break;
        }
        
        if (error) {
          console.error(`Sync error for operation ${op.id}:`, error);
          failedOps.push(op.id);
        } else {
          succeededOps.push(op.id);
        }
      } catch (e) {
        console.error(`Error processing operation ${op.id}:`, e);
        failedOps.push(op.id);
      }
    }
  }
  
  /**
   * Special handling for daily tasks using upsert operation
   */
  private async processDailyTasks(
    operations: PendingOperation[],
    tableHandler: SyncTableHandler,
    succeededOps: string[],
    failedOps: string[]
  ): Promise<void> {
    try {
      // Extract all task data
      const taskData = operations.flatMap(op => {
        // Skip delete operations
        if (op.operation === 'delete') return [];
        
        // Handle arrays of data
        if (Array.isArray(op.data)) {
          return op.data;
        }
        
        // Handle single object
        return [op.data];
      });
      
      if (taskData.length === 0) {
        // All operations were completed successfully (no data to process)
        operations.forEach(op => succeededOps.push(op.id));
        return;
      }
      
      // Use the table handler to upsert tasks
      const error = await tableHandler.upsertDailyTasks(taskData);
      
      if (error) {
        console.error("Error upserting daily tasks:", error);
        operations.forEach(op => failedOps.push(op.id));
      } else {
        // All operations were completed successfully
        operations.forEach(op => succeededOps.push(op.id));
      }
    } catch (e) {
      console.error("Unexpected error during daily tasks processing:", e);
      operations.forEach(op => failedOps.push(op.id));
    }
  }
}
