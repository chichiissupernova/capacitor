
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

/**
 * Utility for detecting network connectivity and handling offline state
 */
export class NetworkDetector {
  private static offlineMode = false;
  private static offlineDetectionInterval: number | null = null;
  private static lastOnlineTime: number = Date.now();
  private static listeners: Array<(isOffline: boolean) => void> = [];

  /**
   * Returns current offline status
   */
  public static isOffline(): boolean {
    return this.offlineMode;
  }

  /**
   * Sets the offline mode
   */
  public static setOfflineMode(isOffline: boolean): void {
    if (this.offlineMode !== isOffline) {
      this.offlineMode = isOffline;
      this.notifyListeners();
      
      if (isOffline) {
        this.notifyOfflineState();
      } else {
        this.lastOnlineTime = Date.now();
      }
    }
  }

  /**
   * Add a listener for offline state changes
   */
  public static addOfflineListener(callback: (isOffline: boolean) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  /**
   * Notify all listeners of offline state change
   */
  private static notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.offlineMode);
      } catch (error) {
        console.error('Error in network listener:', error);
      }
    });
  }

  /**
   * Detects if the application is currently offline
   */
  public static async detectOfflineStatus(): Promise<boolean> {
    try {
      // Check browser's navigator.onLine first (fast but not always accurate)
      if (!navigator.onLine) {
        this.setOfflineMode(true);
        return true;
      }
      
      // Check if we can reach Supabase (more reliable)
      const { error } = await supabase.from('task_completions').select('count', { count: 'exact', head: true });
      const isOffline = !!error;
      
      this.setOfflineMode(isOffline);
      return isOffline;
    } catch (error) {
      console.log('Network error, switching to offline mode');
      this.setOfflineMode(true);
      return true;
    }
  }

  /**
   * Start periodic network detection
   */
  public static startPeriodicDetection(intervalMs: number = 30000): () => void {
    if (this.offlineDetectionInterval !== null) {
      this.stopPeriodicDetection();
    }
    
    this.offlineDetectionInterval = window.setInterval(() => {
      this.detectOfflineStatus();
    }, intervalMs);
    
    // Also listen for online/offline events from the browser
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
    
    return () => this.stopPeriodicDetection();
  }

  /**
   * Stop periodic network detection
   */
  private static stopPeriodicDetection(): void {
    if (this.offlineDetectionInterval !== null) {
      clearInterval(this.offlineDetectionInterval);
      this.offlineDetectionInterval = null;
      
      window.removeEventListener('online', this.handleOnline);
      window.removeEventListener('offline', this.handleOffline);
    }
  }

  /**
   * Handle online event
   */
  private static handleOnline = (): void => {
    console.log('Browser reports online status');
    this.detectOfflineStatus();
  };

  /**
   * Handle offline event
   */
  private static handleOffline = (): void => {
    console.log('Browser reports offline status');
    this.setOfflineMode(true);
  };

  /**
   * Notifies user about offline state
   */
  public static notifyOfflineState(): void {
    toast({
      title: "You're offline",
      description: "Changes will be saved when you reconnect",
      variant: "destructive",
    });
  }

  /**
   * Get time since last online in milliseconds
   */
  public static getTimeSinceLastOnline(): number {
    return Date.now() - this.lastOnlineTime;
  }
}
