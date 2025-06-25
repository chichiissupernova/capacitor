
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth';
import { startOfDay, addDays, differenceInMilliseconds } from 'date-fns';
import { TaskService } from '@/services/TaskService';
import { SyncService } from '@/services/SyncService';
import { initialTasks, getTodayKey } from './useTaskState';

export const useTaskReset = (setTasks: (tasks: typeof initialTasks) => void) => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Schedule task reset at midnight - ONLY resets task completion, NOT points
  useEffect(() => {
    const scheduleNextReset = () => {
      const now = new Date();
      const tomorrow = startOfDay(addDays(now, 1));
      const timeUntilMidnight = differenceInMilliseconds(tomorrow, now);
      
      const resetTimeout = setTimeout(() => {
        // IMPORTANT: Only reset task completion status, NOT user points
        console.log("Resetting daily tasks (keeping all points accumulated)");
        
        // Reset local task state to incomplete
        const resetTasks = initialTasks.map(task => ({ ...task, completed: false }));
        setTasks(resetTasks);
        
        if (user?.id) {
          // Clear local storage for today's tasks
          localStorage.removeItem(getTodayKey(user.id));
          
          // Reset task status in Supabase (but preserve point totals)
          TaskService.saveDailyTasks(user.id, resetTasks).catch(error => {
            console.error("Error resetting tasks in Supabase:", error);
            
            // Queue for later if offline
            SyncService.queueOperationIfOffline(user.id, {
              type: 'resetTasks',
              data: { tasks: resetTasks }
            });
          });
        }
        
        toast({
          title: "New Day Started!",
          description: "Daily tasks reset. Your total points are preserved!",
        });
        
        // Schedule the next reset
        scheduleNextReset();
      }, timeUntilMidnight);
      
      return () => clearTimeout(resetTimeout);
    };
    
    return scheduleNextReset();
  }, [user?.id, setTasks, toast]);
};
