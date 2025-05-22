import { useState, useEffect } from 'react';
import { useMobile as useEnhancedMobile } from './useMobile';

// Re-export the enhanced version for backward compatibility
export const useIsMobile = () => {
  // Use the enhanced version but only return isMobile for backward compatibility
  const { isMobile, isTouch } = useEnhancedMobile();
  
  return {
    isMobile,
    isTouch // Include isTouch for components that expect it
  };
};

// This keeps the original useIsMobile function for even older code
export const useIsMobileOriginal = (): boolean => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener for resize
    window.addEventListener('resize', checkMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return isMobile;
};
