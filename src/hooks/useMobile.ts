
import { useState, useEffect } from 'react';

export const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Function to check if viewport is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Check on initial load
    checkMobile();
    
    // Add event listener for resize
    window.addEventListener('resize', checkMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return { isMobile };
};

export default useMobile;
