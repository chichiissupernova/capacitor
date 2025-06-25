/**
 * Error logger for beta testing
 * Captures console logs and errors for debugging
 */

// Store a circular buffer of recent logs
const MAX_LOGS = 100;
const recentLogs: { level: string; message: string; timestamp: string; deviceInfo?: string }[] = [];

// Expose the logs to the window object for the feedback component
(window as any).__chichiRecentLogs = recentLogs;

// Get device and browser information
function getDeviceInfo() {
  try {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isMobile = width <= 768;
    const isPortrait = height > width;
    
    return {
      userAgent: navigator.userAgent,
      viewport: `${width}x${height}`,
      deviceType: isMobile ? 'mobile' : 'desktop',
      orientation: isPortrait ? 'portrait' : 'landscape',
      platform: navigator.platform,
      connection: (navigator as any).connection ? 
        {
          type: (navigator as any).connection.effectiveType,
          downlink: (navigator as any).connection.downlink,
          rtt: (navigator as any).connection.rtt
        } : 'unknown'
    };
  } catch (e) {
    return 'Error getting device info';
  }
}

// Add a log entry
function addLog(level: string, ...args: any[]) {
  try {
    const message = args.map(arg => {
      if (typeof arg === 'string') return arg;
      if (arg instanceof Error) return `${arg.name}: ${arg.message}\n${arg.stack || ''}`;
      return JSON.stringify(arg);
    }).join(' ');

    recentLogs.push({ 
      level, 
      message, 
      timestamp: new Date().toISOString(),
      deviceInfo: level === 'error' || level === 'uncaught' ? JSON.stringify(getDeviceInfo()) : undefined
    });
    
    // Keep only the most recent logs
    if (recentLogs.length > MAX_LOGS) {
      recentLogs.shift();
    }
  } catch (e) {
    // Failsafe - don't break the app if logging fails
    console.error('Error in logger:', e);
  }
}

// Save original console methods
const originalConsole = {
  log: console.log,
  error: console.error,
  warn: console.warn,
  info: console.info
};

// Override console methods to capture logs
export function initializeErrorLogger() {
  console.log = function(...args) {
    addLog('log', ...args);
    originalConsole.log.apply(console, args);
  };
  
  console.error = function(...args) {
    addLog('error', ...args);
    originalConsole.error.apply(console, args);
  };
  
  console.warn = function(...args) {
    addLog('warn', ...args);
    originalConsole.warn.apply(console, args);
  };
  
  console.info = function(...args) {
    addLog('info', ...args);
    originalConsole.info.apply(console, args);
  };
  
  // Capture unhandled exceptions
  window.addEventListener('error', (event) => {
    addLog('uncaught', event.message, event.filename, event.lineno, event.colno, event.error);
  });
  
  // Capture unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    addLog('uncaught promise', event.reason);
  });
}

// Report logs to Supabase
export async function reportLogs(userId: string, context?: string) {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    const userAgent = navigator.userAgent;
    const url = window.location.href;
    const timestamp = new Date().toISOString();
    const deviceInfo = getDeviceInfo();
    
    // Get most recent logs (up to 20)
    const recentErrorLogs = recentLogs
      .filter(log => log.level === 'error' || log.level === 'uncaught' || log.level === 'uncaught promise')
      .slice(-20);
      
    // Insert into the feedback table for now
    // In the future, we might want a dedicated error_logs table
    await supabase.from('feedback').insert({
      user_id: userId,
      content: `Automatic error report: ${context || 'general error'}`,
      feedback_type: 'error_report',
      created_at: timestamp,
      browser_info: {
        userAgent,
        url,
        timestamp,
        deviceInfo,
        recentErrorLogs
      }
    });
    
    return true;
  } catch (err) {
    console.error('Failed to report logs to Supabase:', err);
    return false;
  }
}
