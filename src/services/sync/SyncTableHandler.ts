
/**
 * Handles database operations with type safety
 */

import { supabase } from '@/integrations/supabase/client';

// Define the known table names as a type to satisfy TypeScript
export type KnownTable = "daily_tasks" | "task_completions" | "activity_logs" | "user_profiles" | 
  "feedback" | "post_progress" | "Chichi" | "activity logs" | "dailty tasks" | 
  "task completions" | "user profiles";

export class SyncTableHandler {
  /**
   * Insert data into a table
   */
  public async insertData(table: string, data: any): Promise<any> {
    const { error } = await this.typeSafeFrom(table).insert(data);
    return error;
  }
  
  /**
   * Update data in a table
   */
  public async updateData(table: string, data: any): Promise<any> {
    const { error } = await this.typeSafeFrom(table)
      .update(data)
      .eq('id', data.id);
    return error;
  }
  
  /**
   * Delete data from a table
   */
  public async deleteData(table: string, data: any): Promise<any> {
    const { error } = await this.typeSafeFrom(table)
      .delete()
      .eq('id', data.id);
    return error;
  }
  
  /**
   * Upsert daily tasks
   */
  public async upsertDailyTasks(taskData: any[]): Promise<any> {
    const { error } = await this.typeSafeFrom('daily_tasks')
      .upsert(taskData, { 
        onConflict: 'user_id,task_id,task_date',
        ignoreDuplicates: false // Update if there's a conflict
      });
    
    return error;
  }
  
  /**
   * Type-safe wrapper for supabase.from()
   */
  private typeSafeFrom(table: string) {
    // Type assertion tells TypeScript to trust that we're using a valid table name
    return supabase.from(table as KnownTable);
  }
}
