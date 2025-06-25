
import { useState } from 'react';
import { Task } from '@/types/task';

export const useTaskValidation = () => {
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());

  const validateTaskCompletion = (
    taskId: string,
    tasks: Task[],
    userId?: string,
    isSubmitting?: boolean
  ): { canComplete: boolean; task?: Task; reason?: string } => {
    console.log("=== TASK VALIDATION START ===");
    
    if (!userId || isSubmitting) {
      console.log("BLOCKED: Cannot complete task - Not logged in or already submitting");
      return { canComplete: false, reason: "Not logged in or already submitting" };
    }

    // Prevent duplicate completion of the same task
    if (completedTasks.has(taskId)) {
      console.log("BLOCKED: Task already completed:", taskId);
      return { canComplete: false, reason: "Task already completed in this session" };
    }

    // Find the task
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.completed) {
      console.log('BLOCKED: Task not found or already completed:', taskId);
      return { canComplete: false, reason: "Task not found or already completed" };
    }

    console.log("VALIDATION PASSED: Task can be completed");
    return { canComplete: true, task };
  };

  const markTaskAsCompleted = (taskId: string) => {
    setCompletedTasks(prev => new Set(prev).add(taskId));
  };

  const unmarkTaskAsCompleted = (taskId: string) => {
    setCompletedTasks(prev => {
      const newSet = new Set(prev);
      newSet.delete(taskId);
      return newSet;
    });
  };

  return {
    validateTaskCompletion,
    markTaskAsCompleted,
    unmarkTaskAsCompleted
  };
};
