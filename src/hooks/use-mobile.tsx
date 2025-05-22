
import { useState, useEffect } from 'react';

export type OrientationType = 'portrait' | 'landscape';

export interface MobileDetectionResult {
  isMobile: boolean;
  isTouch: boolean;
  orientation: OrientationType;
}

export const useIsMobile = (): boolean | MobileDetectionResult => {
  const [state, setState] = useState<MobileDetectionResult>({
    isMobile: false,
    isTouch: false,
    orientation: 'portrait',
  });
  
  useEffect(() => {
    const checkDevice = () => {
      // Check for mobile based on screen width (common breakpoint)
      const mobile = window.innerWidth < 768;
      
      // Check for touch capability
      const touch = 'ontouchstart' in window || 
                   navigator.maxTouchPoints > 0 || 
                   (navigator as any).msMaxTouchPoints > 0;
      
      // Determine orientation
      const orientation: OrientationType = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
      
      setState({
        isMobile: mobile,
        isTouch: touch,
        orientation: orientation
      });
    };
    
    // Initial check
    checkDevice();
    
    // Add event listeners
    window.addEventListener('resize', checkDevice);
    window.addEventListener('orientationchange', checkDevice);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('orientationchange', checkDevice);
    };
  }, []);
  
  // For backward compatibility - return just the isMobile boolean if accessed directly
  // This ensures existing code that uses useIsMobile() as a boolean still works
  const isMobileProxy = new Proxy(state, {
    get(target, prop) {
      if (prop === 'valueOf' || prop === 'toString' || prop === Symbol.toPrimitive) {
        return () => target.isMobile;
      }
      return (target as any)[prop];
    }
  });
  
  return isMobileProxy as any;
};

export default useIsMobile;
