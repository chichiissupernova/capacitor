
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/auth';
import { Task } from '@/types/task';
import { format } from 'date-fns';
import { TaskService } from '@/services/TaskService';
import { SyncService } from '@/services/SyncService';
import { toast } from '@/hooks/use-toast';

// Updated task definitions - 5 tasks total with new bonus task and reduced points
export const initialTasks: Task[] = [
  { id: 'post', label: 'Posted to My Page', points: 10, completed: false },
  { id: 'comments', label: 'Replied to Comments', points: 3, completed: false },
  { id: 'creators', label: 'Engaged with Creators', points: 3, completed: false },
  { id: 'story', label: 'Posted to My Story', points: 3, completed: false },
  { id: 'multiplatform', label: 'Posted to Multiple Platforms', points: 3, completed: false },
];

// Generate a unique key for today based on user ID
export const getTodayKey = (userId?: string) => 
  `chichi_daily_tasks_${userId || 'guest'}_${format(new Date(), 'yyyy-MM-dd')}`;

export const useTaskState = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuth();
  const firstLoadComplete = useRef<boolean>(false);
  const saveTasksDebounceTimeout = useRef<number | null>(null);
  
  // Initialize the sync service
  useEffect(() => {
    SyncService.initialize();
  }, []);
  
  // Load tasks from localStorage and Supabase
  const loadTasks = async (): Promise<Task[]> => {
    setIsLoading(true);
    try {
      if (!user) {
        return initialTasks;
      }
      
      const todayKey = getTodayKey(user.id);
      const savedTasks = localStorage.getItem(todayKey);
      
      if (savedTasks) {
        try {
          const parsedTasks = JSON.parse(savedTasks);
          
          // If we have a network connection, sync with server
          if (!SyncService.isOffline()) {
            try {
              console.log('Syncing tasks with server');
              const syncedTasks = await SyncService.syncTasks(user.id, parsedTasks);
              
              // Only update localStorage if the tasks changed
              if (JSON.stringify(syncedTasks) !== savedTasks) {
                localStorage.setItem(todayKey, JSON.stringify(syncedTasks));
              }
              
              return syncedTasks;
            } catch (error) {
              console.error('Error syncing tasks:', error);
              return parsedTasks;
            }
          }
          
          return parsedTasks;
        } catch (error) {
          console.error('Error parsing tasks:', error);
          return initialTasks;
        }
      } else {
        // Try to load from Supabase
        try {
          console.log('Loading tasks from Supabase');
          const loadedTasks = await TaskService.loadDailyTasks(user.id, initialTasks);
          
          // Also save to localStorage for faster access
          localStorage.setItem(todayKey, JSON.stringify(loadedTasks));
          
          return loadedTasks;
        } catch (error) {
          console.error("Error loading tasks from Supabase:", error);
          return initialTasks;
        }
      }
    } finally {
      setIsLoading(false);
      firstLoadComplete.current = true;
    }
  };
  
  // Load tasks on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      const loadedTasks = await loadTasks();
      setTasks(loadedTasks);
    };
    
    fetchTasks();
  }, [user?.id]);
  
  // Debounced save tasks function
  const debouncedSaveTasks = (newTasks: Task[]) => {
    if (!user?.id || !firstLoadComplete.current) return;
    
    // Update localStorage immediately for responsive UI
    const todayKey = getTodayKey(user.id);
    localStorage.setItem(todayKey, JSON.stringify(newTasks));
    
    // Clear any existing timeout
    if (saveTasksDebounceTimeout.current !== null) {
      clearTimeout(saveTasksDebounceTimeout.current);
    }
    
    // Set a new timeout
    saveTasksDebounceTimeout.current = window.setTimeout(async () => {
      saveTasksDebounceTimeout.current = null;
      
      try {
        if (!SyncService.isOffline()) {
          await TaskService.saveDailyTasks(user.id, newTasks);
        } else {
          // Queue for when back online
          SyncService.queueOperationIfOffline(user.id, {
            type: 'saveTasks',
            data: { tasks: newTasks }
          });
        }
      } catch (error) {
        console.error("Error saving tasks:", error);
        
        // Queue for retry later
        SyncService.queueOperationIfOffline(user.id, {
          type: 'saveTasks',
          data: { tasks: newTasks }
        });
        
        toast({
          title: "Warning",
          description: "We had trouble saving your progress, but it will be saved when you're back online.",
          variant: "destructive"
        });
      }
    }, 1000); // 1 second debounce
  };
  
  // Wrapped setTasks function that triggers save
  const setTasksAndSave = (newTasks: Task[] | ((currentTasks: Task[]) => Task[])) => {
    setTasks(currentTasks => {
      // Handle both function and direct value updates
      const updatedTasks = typeof newTasks === 'function' 
        ? newTasks(currentTasks) 
        : newTasks;
      
      // Only save if tasks have actually changed
      if (JSON.stringify(updatedTasks) !== JSON.stringify(currentTasks)) {
        debouncedSaveTasks(updatedTasks);
      }
      
      return updatedTasks;
    });
  };
  
  return {
    tasks,
    setTasks: setTasksAndSave,
    isLoading
  };
};
