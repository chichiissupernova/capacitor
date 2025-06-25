
import { useState, useEffect } from 'react';
import { SyncService } from '@/services/SyncService';
import { useAuth } from '@/contexts/auth';
import { NetworkDetector } from '@/services/sync/NetworkDetector';

export const useConnectivity = () => {
  const [isOffline, setIsOffline] = useState<boolean>(NetworkDetector.isOffline());
  const { user } = useAuth();
  
  // Check network status and set up listeners
  useEffect(() => {
    // Initialize sync service
    SyncService.initialize();
    
    const checkNetworkStatus = async () => {
      const offline = await SyncService.detectOfflineStatus();
      setIsOffline(offline);
    };
    
    // Initial check
    checkNetworkStatus();
    
    // Set up offline listener
    const unsubscribe = NetworkDetector.addOfflineListener((offline) => {
      setIsOffline(offline);
      
      if (!offline && user?.id) {
        SyncService.retryFailedOperations(user.id);
      }
    });
    
    return unsubscribe;
  }, [user?.id]);

  // Set up periodic sync attempts
  useEffect(() => {
    if (!user?.id) return;
    
    const cleanup = SyncService.initializePeriodicSync(user.id);
    return cleanup;
  }, [user?.id]);
  
  return { isOffline };
};
