import { useState, useEffect } from 'react';
import { Task } from '@/types/task';
import { useAuth } from '@/contexts/auth';
import { StreakService } from '@/services/StreakService';

export const useStreak = (tasks: Task[]) => {
  const [canRecoverStreak, setCanRecoverStreak] = useState<boolean>(false);
  const { user, updateUserData } = useAuth();
  
  // Check streak status on mount
  useEffect(() => {
    const checkStreakStatus = async () => {
      if (!user) return;
      
      try {
        const { canRecover } = await StreakService.updateStreak(user);
        setCanRecoverStreak(canRecover);
      } catch (error) {
        console.error("Error checking streak status:", error);
      }
    };
    
    if (user) {
      checkStreakStatus();
    }
  }, [user]);
  
  // Update streak when tasks are completed
  useEffect(() => {
    if (!user?.id || !updateUserData) return;
    
    // Update streak only once per day and only when at least one task was completed
    const hasCompletedTasks = tasks.some(t => t.completed);
    
    if (hasCompletedTasks) {
      // Update streak using the server-side streak service
      StreakService.updateStreak(user).then(result => {
        if (result.user !== user && updateUserData) {
          // Update user data if the streak changed
          updateUserData(result.user);
        }
        
        // Update the recovery status
        setCanRecoverStreak(result.canRecover);
      });
    }
  }, [tasks, user, updateUserData]);
  
  return { canRecoverStreak };
};
