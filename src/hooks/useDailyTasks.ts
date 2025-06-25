
import { useTaskState } from './tasks/useTaskState';
import { useTaskCompletion } from './tasks/useTaskCompletion';
import { useConnectivity } from './tasks/useConnectivity';
import { useTaskReset } from './tasks/useTaskReset';
import { useStreak } from './tasks/useStreak';

export const useDailyTasks = () => {
  // Get task state and data loading functionality
  const { tasks, setTasks, isLoading } = useTaskState();
  
  // Get offline/online status
  const { isOffline } = useConnectivity();
  
  // Set up task completion functionality
  const { isSubmitting, handleCompleteTask } = useTaskCompletion(tasks, setTasks);
  
  // Set up task reset at midnight
  useTaskReset(setTasks);
  
  // Set up streak functionality
  const { canRecoverStreak } = useStreak(tasks);
  
  return {
    tasks,
    isLoading,
    isSubmitting,
    isOffline,
    canRecoverStreak,
    handleCompleteTask
  };
};
