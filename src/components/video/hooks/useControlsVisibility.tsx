
import { useState, useRef, useEffect } from 'react';

export const useControlsVisibility = (initialVisibility = true) => {
  const [showControls, setShowControls] = useState(initialVisibility);
  const controlsTimerRef = useRef<number | null>(null);
  
  useEffect(() => {
    const hideControls = () => {
      setShowControls(false);
    };

    const resetControlsTimer = () => {
      if (controlsTimerRef.current) {
        window.clearTimeout(controlsTimerRef.current);
      }
      
      setShowControls(true);
      controlsTimerRef.current = window.setTimeout(hideControls, 3000);
    };

    return () => {
      if (controlsTimerRef.current) {
        window.clearTimeout(controlsTimerRef.current);
      }
    };
  }, []);
  
  const setupControlsTimer = (container: HTMLDivElement | null) => {
    if (!container) return;
    
    const hideControls = () => {
      setShowControls(false);
    };

    const resetControlsTimer = () => {
      if (controlsTimerRef.current) {
        window.clearTimeout(controlsTimerRef.current);
      }
      
      setShowControls(true);
      controlsTimerRef.current = window.setTimeout(hideControls, 3000);
    };
    
    container.addEventListener('mousemove', resetControlsTimer);
    container.addEventListener('touchstart', resetControlsTimer);
    
    // Initial timer
    resetControlsTimer();
    
    return () => {
      container.removeEventListener('mousemove', resetControlsTimer);
      container.removeEventListener('touchstart', resetControlsTimer);
      
      if (controlsTimerRef.current) {
        window.clearTimeout(controlsTimerRef.current);
      }
    };
  };
  
  return { showControls, setShowControls, setupControlsTimer };
};
