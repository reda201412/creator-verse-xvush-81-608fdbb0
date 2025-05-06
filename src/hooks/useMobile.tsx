
import { useState, useEffect } from 'react';

export interface MobileState {
  isMobile: boolean;
  isTouch: boolean;
  orientation: 'portrait' | 'landscape';
}

/**
 * Enhanced mobile detection hook that provides information about
 * the current mobile state including device type, touch capability, and orientation
 */
export function useMobile(): MobileState {
  const [state, setState] = useState<MobileState>({
    isMobile: false,
    isTouch: false,
    orientation: 'portrait'
  });
  
  useEffect(() => {
    // Function to check mobile state
    const updateMobileState = () => {
      // Check if mobile based on screen width
      const mobile = window.innerWidth < 768;
      
      // Check if touch device
      const touch = 'ontouchstart' in window || 
                   navigator.maxTouchPoints > 0 ||
                   (navigator as any).msMaxTouchPoints > 0;
      
      // Check orientation
      const orient = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
      
      setState({
        isMobile: mobile,
        isTouch: touch,
        orientation: orient as 'portrait' | 'landscape'
      });
    };
    
    // Initial check
    updateMobileState();
    
    // Add event listeners
    window.addEventListener('resize', updateMobileState);
    window.addEventListener('orientationchange', updateMobileState);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', updateMobileState);
      window.removeEventListener('orientationchange', updateMobileState);
    };
  }, []);
  
  return state;
}

// For backward compatibility
export const useIsMobile = (): boolean => {
  const { isMobile } = useMobile();
  return isMobile;
};

export default useMobile;
