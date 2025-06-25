import { useEffect, useRef } from 'react';

const isDevelopment = import.meta.env.DEV;

export const usePerformanceMonitor = (componentName: string) => {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(Date.now());
  const renderTimes = useRef<number[]>([]);

  useEffect(() => {
    if (!isDevelopment) return; // Only run in development
    
    renderCount.current += 1;
    const now = Date.now();
    const timeSinceLastRender = now - lastRenderTime.current;
    
    renderTimes.current.push(timeSinceLastRender);
    
    // Keep only last 10 render times
    if (renderTimes.current.length > 10) {
      renderTimes.current.shift();
    }
    
    const avgRenderTime = renderTimes.current.reduce((a, b) => a + b, 0) / renderTimes.current.length;
    
    // Only log performance issues, not every render
    if (renderCount.current > 20 && avgRenderTime < 50) {
      console.warn(`🐌 ${componentName}: Frequent re-renders detected (${renderCount.current} renders, avg ${Math.round(avgRenderTime)}ms between renders)`);
    }
    
    if (timeSinceLastRender < 10 && renderCount.current > 5) {
      console.warn(`🔥 ${componentName}: Very fast re-renders detected (${timeSinceLastRender}ms since last render)`);
    }
    
    lastRenderTime.current = now;
  });

  return {
    renderCount: renderCount.current,
    avgRenderTime: renderTimes.current.length > 0 
      ? renderTimes.current.reduce((a, b) => a + b, 0) / renderTimes.current.length 
      : 0
  };
};
