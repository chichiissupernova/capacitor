
import { useEffect } from 'react';

export function BottomNavDebugger() {
  useEffect(() => {
    const checkBottomNav = () => {
      const navElement = document.querySelector('nav[style*="position: fixed"]');
      console.log('BottomNavDebugger: Nav element found:', !!navElement);
      
      if (navElement) {
        const rect = navElement.getBoundingClientRect();
        const styles = window.getComputedStyle(navElement);
        
        console.log('BottomNavDebugger: Nav element rect:', {
          top: rect.top,
          left: rect.left,
          bottom: rect.bottom,
          right: rect.right,
          width: rect.width,
          height: rect.height
        });
        
        console.log('BottomNavDebugger: Nav element computed styles:', {
          position: styles.position,
          bottom: styles.bottom,
          left: styles.left,
          right: styles.right,
          zIndex: styles.zIndex,
          display: styles.display,
          visibility: styles.visibility,
          opacity: styles.opacity,
          backgroundColor: styles.backgroundColor
        });
        
        console.log('BottomNavDebugger: Viewport height:', window.innerHeight);
        console.log('BottomNavDebugger: Document height:', document.documentElement.scrollHeight);
      } else {
        console.log('BottomNavDebugger: No nav element with fixed positioning found');
        
        // Check if any nav elements exist at all
        const allNavs = document.querySelectorAll('nav');
        console.log('BottomNavDebugger: Total nav elements found:', allNavs.length);
        allNavs.forEach((nav, index) => {
          console.log(`BottomNavDebugger: Nav ${index}:`, nav.className, nav.style.cssText);
        });
      }
    };
    
    // Check immediately and after a short delay
    checkBottomNav();
    const timeout = setTimeout(checkBottomNav, 1000);
    
    return () => clearTimeout(timeout);
  }, []);
  
  return null;
}
