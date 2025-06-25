import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { SyncService } from '../SyncService';
import { TaskService } from '../TaskService';
import { StreakService } from '../StreakService';
import { NetworkDetector } from './NetworkDetector';
import { LocalStorageManager } from './LocalStorageManager';
import { ConflictResolver } from './ConflictResolver';
import { useAuth } from '@/contexts/auth';

export const useSyncHooks = () => {
  const { user, updateUserData } = useAuth();
  const syncInProgress = useRef(false);
  
  // Initialize sync service
  useEffect(() => {
    SyncService.initialize();
  }, []);
  
  // Sync on user and network status changes
  useEffect(() => {
    if (!user?.id) return;
    
    const syncData = async () => {
      if (syncInProgress.current) {
        console.warn("Sync already in progress, skipping.");
        return;
      }
      
      syncInProgress.current = true;
      console.log("=== SYNC START ===");
      
      try {
        if (NetworkDetector.isOffline()) {
          console.log("Offline, skipping sync.");
          return;
        }
        
        // 1. Sync Tasks
        console.log("Syncing tasks...");
        const localTasks = LocalStorageManager.getTasks(user.id);
        if (localTasks) {
          const syncedTasks = await SyncService.syncTasks(user.id, localTasks);
          LocalStorageManager.setTasks(user.id, syncedTasks);
          console.log("Tasks synced.");
        }
        
        // 2. Sync Streak
        console.log("Syncing streak...");
        const localStreak = LocalStorageManager.getStreak(user.id);
        if (localStreak) {
          const syncedStreak = await SyncService.syncStreak(user, localStreak);
          if (syncedStreak && updateUserData) {
            updateUserData(syncedStreak);
            LocalStorageManager.setStreak(user.id, syncedStreak);
            console.log("Streak synced.");
          }
        }
        
        // 3. Retry Failed Operations
        console.log("Retrying failed operations...");
        await SyncService.retryFailedOperations(user.id);
        console.log("Failed operations retried.");
        
        console.log("=== SYNC COMPLETE ===");
      } catch (error) {
        console.error("Sync failed:", error);
      } finally {
        syncInProgress.current = false;
      }
    };
    
    syncData();
    
    // Set up periodic sync attempts
    const cleanup = SyncService.initializePeriodicSync(user.id);
    return cleanup;
  }, [user?.id, updateUserData]);
  
  // Listen for changes in network status
  useEffect(() => {
    if (!user?.id) return;
    
    const unsubscribe = NetworkDetector.addOfflineListener((offline) => {
      if (!offline) {
        SyncService.retryFailedOperations(user.id);
      }
    });
    
    return unsubscribe;
  }, [user?.id]);
};
