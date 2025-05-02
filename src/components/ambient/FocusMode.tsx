
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Maximize, Minimize, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FocusModeProps {
  enabled?: boolean;
  onToggle?: (isEnabled: boolean) => void;
  className?: string;
  ambientSoundsEnabled?: boolean;
  onAmbientSoundsToggle?: (isEnabled: boolean) => void;
}

const FocusMode: React.FC<FocusModeProps> = ({
  enabled = false,
  onToggle,
  className,
  ambientSoundsEnabled = false,
  onAmbientSoundsToggle
}) => {
  const [isActive, setIsActive] = useState(enabled);
  const [soundsActive, setSoundsActive] = useState(ambientSoundsEnabled);
  const [showControls, setShowControls] = useState(false);
  const [focusTimer, setFocusTimer] = useState<number | null>(null);
  
  useEffect(() => {
    setIsActive(enabled);
  }, [enabled]);
  
  useEffect(() => {
    setSoundsActive(ambientSoundsEnabled);
  }, [ambientSoundsEnabled]);
  
  // Handle focus mode toggle
  const handleToggleFocus = () => {
    const newState = !isActive;
    setIsActive(newState);
    
    if (onToggle) {
      onToggle(newState);
    }
    
    // Apply focus mode changes to document
    if (newState) {
      document.documentElement.classList.add('focus-mode');
      
      // Start a focus timer (25 minutes)
      const timerDuration = 25 * 60 * 1000;
      const timer = window.setTimeout(() => {
        // Automatically exit focus mode after timer expires
        setIsActive(false);
        if (onToggle) {
          onToggle(false);
        }
        document.documentElement.classList.remove('focus-mode');
        setFocusTimer(null);
        
        // Notify user that focus time is up
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Focus Time Complete', {
            body: 'Your 25-minute focus session has ended. Take a short break!',
            icon: '/favicon.ico'
          });
        }
      }, timerDuration);
      
      setFocusTimer(timer);
    } else {
      document.documentElement.classList.remove('focus-mode');
      
      // Clear timer if focus mode is disabled manually
      if (focusTimer !== null) {
        window.clearTimeout(focusTimer);
        setFocusTimer(null);
      }
    }
  };
  
  // Handle ambient sounds toggle
  const handleToggleSounds = () => {
    const newState = !soundsActive;
    setSoundsActive(newState);
    
    if (onAmbientSoundsToggle) {
      onAmbientSoundsToggle(newState);
    }
  };
  
  return (
    <div className={cn("fixed z-40", className)}>
      {/* Focus mode overlay (dimming) */}
      <AnimatePresence>
        {isActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black pointer-events-none"
            style={{ 
              opacity: 0.5, 
              zIndex: -1
            }}
          />
        )}
      </AnimatePresence>
      
      {/* Controls button */}
      <div 
        className="absolute bottom-4 right-4 flex flex-col items-end gap-2"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-background/80 backdrop-blur-sm border border-border rounded-lg p-2 shadow-lg"
            >
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "gap-2 transition-colors",
                    isActive ? "bg-primary text-primary-foreground" : ""
                  )}
                  onClick={handleToggleFocus}
                >
                  {isActive ? <Minimize size={14} /> : <Maximize size={14} />}
                  {isActive ? "Quitter le mode focus" : "Mode focus"}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "gap-2 transition-colors",
                    soundsActive ? "bg-primary text-primary-foreground" : ""
                  )}
                  onClick={handleToggleSounds}
                >
                  {soundsActive ? <VolumeX size={14} /> : <Volume2 size={14} />}
                  {soundsActive ? "Désactiver l'ambiance" : "Activer l'ambiance"}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <Button
          size="icon"
          className="h-10 w-10 rounded-full bg-primary text-primary-foreground shadow-lg"
          onClick={() => setShowControls(!showControls)}
        >
          {isActive ? <Minimize size={18} /> : <Maximize size={18} />}
        </Button>
      </div>
    </div>
  );
};

export default FocusMode;
