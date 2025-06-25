
import { TaskCompletionHandler } from "./tasks/TaskCompletionHandler";
import { TaskDataLoader } from "./tasks/TaskDataLoader";
import { TaskDataSaver } from "./tasks/TaskDataSaver";
import { Task } from "@/types/task";

export class TaskService {
  /**
   * Check if a task was already completed today
   */
  static async checkTaskCompletedToday(userId: string, taskId: string): Promise<boolean> {
    return TaskCompletionHandler.checkTaskCompletedToday(userId, taskId);
  }

  /**
   * Save daily task with duplicate prevention
   */
  static async saveDailyTaskWithCheck(
    userId: string, 
    taskId: string, 
    points: number
  ): Promise<{ success: boolean; pointsAwarded: number; error?: string }> {
    return TaskCompletionHandler.saveDailyTaskWithCheck(userId, taskId, points);
  }

  /**
   * Load today's daily tasks from Supabase
   */
  static async loadDailyTasks(userId: string, defaultTasks: Task[]): Promise<Task[]> {
    return TaskDataLoader.loadDailyTasks(userId, defaultTasks);
  }
  
  /**
   * Save daily tasks to Supabase (legacy method, kept for compatibility)
   */
  static async saveDailyTasks(userId: string, tasks: Task[]): Promise<boolean> {
    return TaskDataSaver.saveDailyTasks(userId, tasks);
  }
  
  /**
   * Log task completion with duplicate prevention
   */
  static async logTaskCompletionWithCheck(
    userId: string,
    taskId: string,
    taskName: string,
    points: number
  ): Promise<{ success: boolean; pointsAwarded: number }> {
    return TaskCompletionHandler.logTaskCompletionWithCheck(userId, taskId, taskName, points);
  }

  /**
   * Legacy method kept for compatibility
   */
  static async logTaskCompletion(
    userId: string,
    taskId: string,
    taskName: string,
    points: number
  ): Promise<boolean> {
    return TaskCompletionHandler.logTaskCompletion(userId, taskId, taskName, points);
  }
}
