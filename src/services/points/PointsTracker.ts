
/**
 * Global tracking mechanism for preventing duplicate point awards
 */
export class PointsTracker {
  private static readonly POINTS_THROTTLE_MS = 3000; // Increased to 3 seconds
  private static recentPointUpdates = new Map<string, {
    timestamp: number, 
    pendingPoints: number, 
    processing: boolean
  }>();

  static {
    // Enhanced global tracking mechanism with better safeguards
    if (typeof window !== 'undefined') {
      if (!window.hasOwnProperty('pointsTracker')) {
        (window as any).pointsTracker = {
          lastAwardTimestamp: 0,
          totalAwarded: 0,
          dailyAwards: new Map<string, number>(), // Track daily awards per task
          processedTasks: new Set<string>(), // Track completed tasks today
          resetIfNeeded: () => {
            const now = new Date();
            const lastDate = new Date((window as any).pointsTracker.lastAwardTimestamp);
            if (now.getDate() !== lastDate.getDate() || now.getMonth() !== lastDate.getMonth()) {
              console.log("Resetting points tracker for new day");
              (window as any).pointsTracker.lastAwardTimestamp = 0;
              (window as any).pointsTracker.totalAwarded = 0;
              (window as any).pointsTracker.dailyAwards.clear();
              (window as any).pointsTracker.processedTasks.clear();
            }
          }
        };
      }
    }
  }

  /**
   * Check if points update should be throttled
   */
  static shouldThrottleUpdate(userId: string, pointsToAdd: number): {
    shouldThrottle: boolean;
    sessionKey: string;
    pointsToProcess: number;
  } {
    const sessionKey = `${userId}_points_session`;
    const now = Date.now();
    
    // Enhanced tracking and prevention
    if (typeof window !== 'undefined') {
      (window as any).pointsTracker.resetIfNeeded();
      
      const pointsTracker = (window as any).pointsTracker;
      
      // More aggressive throttling - prevent any award within 1 second
      if (now - pointsTracker.lastAwardTimestamp < 1000) {
        console.warn("BLOCKED: Points update too frequent, blocking this update");
        return { shouldThrottle: true, sessionKey, pointsToProcess: 0 };
      }
      
      // Prevent excessive point awards in short time
      if (pointsTracker.totalAwarded > 50 && now - pointsTracker.lastAwardTimestamp < 5000) {
        console.warn("BLOCKED: Excessive point awards detected, blocking this update");
        return { shouldThrottle: true, sessionKey, pointsToProcess: 0 };
      }
      
      // Update tracker
      pointsTracker.lastAwardTimestamp = now;
      pointsTracker.totalAwarded += pointsToAdd;
      console.log("Updated points tracker:", pointsTracker);
    }

    // Check for existing update session with stricter rules
    const existingSession = this.recentPointUpdates.get(sessionKey);
    
    if (existingSession) {
      if (existingSession.processing) {
        console.log(`THROTTLED: Points update already in progress for user ${userId}`);
        return { shouldThrottle: true, sessionKey, pointsToProcess: pointsToAdd };
      } else if (now - existingSession.timestamp < this.POINTS_THROTTLE_MS) {
        console.log(`THROTTLED: Points update throttled for user ${userId} (${this.POINTS_THROTTLE_MS}ms cooldown)`);
        return { shouldThrottle: true, sessionKey, pointsToProcess: pointsToAdd };
      }
    }

    const pointsToProcess = pointsToAdd; // No accumulation to prevent double awards

    return { shouldThrottle: false, sessionKey, pointsToProcess };
  }

  /**
   * Mark session as processing
   */
  static markAsProcessing(sessionKey: string): void {
    const now = Date.now();
    this.recentPointUpdates.set(sessionKey, {
      timestamp: now,
      pendingPoints: 0,
      processing: true
    });
  }

  /**
   * Clear processing flag with delay
   */
  static clearProcessingFlag(sessionKey: string): void {
    setTimeout(() => {
      this.recentPointUpdates.delete(sessionKey);
      console.log("Cleared processing flag for session:", sessionKey);
    }, this.POINTS_THROTTLE_MS);
  }

  /**
   * Reset all tracking mechanisms (for testing/debugging)
   */
  static resetTracking(): void {
    this.recentPointUpdates.clear();
    if (typeof window !== 'undefined' && (window as any).pointsTracker) {
      (window as any).pointsTracker.lastAwardTimestamp = 0;
      (window as any).pointsTracker.totalAwarded = 0;
      (window as any).pointsTracker.dailyAwards.clear();
      (window as any).pointsTracker.processedTasks.clear();
    }
  }
}
