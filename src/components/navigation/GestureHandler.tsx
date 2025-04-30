
import React, { useRef, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface Position {
  x: number;
  y: number;
}

interface GestureHandlerProps {
  children: React.ReactNode;
  onLongPress?: (position: Position) => void;
  onDoubleTap?: (position: Position) => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onPinch?: (scale: number) => void;
}

const GestureHandler: React.FC<GestureHandlerProps> = ({
  children,
  onLongPress,
  onDoubleTap,
  onSwipeUp,
  onSwipeDown,
  onSwipeLeft,
  onSwipeRight,
  onPinch,
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartRef = useRef<Position | null>(null);
  const touchEndRef = useRef<Position | null>(null);
  const lastTapRef = useRef<number>(0);
  const touchesRef = useRef<Touch[]>([]);
  const { toast } = useToast();

  // Long press detection
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    
    // Start long press timer
    if (onLongPress) {
      timerRef.current = setTimeout(() => {
        if (touchStartRef.current) {
          onLongPress(touchStartRef.current);
        }
      }, 700); // 700ms for long press
    }
    
    // Store touch points for pinch detection
    if (e.touches.length === 2) {
      touchesRef.current = [e.touches[0], e.touches[1]];
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // Cancel long press if moving too much
    if (timerRef.current && touchStartRef.current) {
      const touch = e.touches[0];
      const moveX = Math.abs(touch.clientX - touchStartRef.current.x);
      const moveY = Math.abs(touch.clientY - touchStartRef.current.y);
      
      if (moveX > 10 || moveY > 10) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }
    
    // Handle pinch gesture
    if (e.touches.length === 2 && onPinch && touchesRef.current.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      
      // Calculate initial and current distances
      const initialDist = getDistance(
        touchesRef.current[0].clientX, touchesRef.current[0].clientY,
        touchesRef.current[1].clientX, touchesRef.current[1].clientY
      );
      
      const currentDist = getDistance(
        touch1.clientX, touch1.clientY,
        touch2.clientX, touch2.clientY
      );
      
      // Calculate scale factor
      const scale = currentDist / initialDist;
      
      if (scale !== 1) {
        onPinch(scale);
      }
    }
  };

  const getDistance = (x1: number, y1: number, x2: number, y2: number): number => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    // Clear long press timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    // If touchstart position exists
    if (touchStartRef.current) {
      // Get last touch position
      touchEndRef.current = touchStartRef.current;
      
      if (e.changedTouches.length > 0) {
        const touch = e.changedTouches[0];
        touchEndRef.current = { x: touch.clientX, y: touch.clientY };
      }
      
      // Handle swipes
      handleSwipe();
      
      // Handle double tap
      const now = Date.now();
      const DOUBLE_TAP_DELAY = 300;
      
      if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
        if (onDoubleTap && touchEndRef.current) {
          onDoubleTap(touchEndRef.current);
          // Reset to prevent triple tap being detected as double tap
          lastTapRef.current = 0;
        }
      } else {
        // Update last tap timestamp
        lastTapRef.current = now;
      }
    }
    
    // Reset touch tracking
    touchesRef.current = [];
  };
  
  const handleSwipe = () => {
    if (!touchStartRef.current || !touchEndRef.current) return;
    
    const deltaX = touchEndRef.current.x - touchStartRef.current.x;
    const deltaY = touchEndRef.current.y - touchStartRef.current.y;
    
    // Minimum distance for swipe detection
    const MIN_DISTANCE = 50;
    
    // Check if horizontal swipe distance is greater than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > MIN_DISTANCE) {
      if (deltaX > 0 && onSwipeRight) {
        onSwipeRight();
      } else if (deltaX < 0 && onSwipeLeft) {
        onSwipeLeft();
      }
    } 
    // Check if vertical swipe distance is greater than horizontal
    else if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > MIN_DISTANCE) {
      if (deltaY > 0 && onSwipeDown) {
        onSwipeDown();
      } else if (deltaY < 0 && onSwipeUp) {
        onSwipeUp();
      }
    }
    
    // Reset after handling
    touchStartRef.current = null;
    touchEndRef.current = null;
  };

  // Mouse event handlers to mimic touch events
  const handleMouseDown = (e: React.MouseEvent) => {
    touchStartRef.current = { x: e.clientX, y: e.clientY };
    
    // Start long press timer
    if (onLongPress) {
      timerRef.current = setTimeout(() => {
        if (touchStartRef.current) {
          onLongPress(touchStartRef.current);
        }
      }, 700); // 700ms for long press
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // Cancel long press if moving too much
    if (timerRef.current && touchStartRef.current) {
      const moveX = Math.abs(e.clientX - touchStartRef.current.x);
      const moveY = Math.abs(e.clientY - touchStartRef.current.y);
      
      if (moveX > 10 || moveY > 10) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    // Clear long press timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    // Record end position
    if (touchStartRef.current) {
      touchEndRef.current = { x: e.clientX, y: e.clientY };
      
      // Handle swipes
      handleSwipe();
      
      // Handle double click
      const now = Date.now();
      const DOUBLE_CLICK_DELAY = 300;
      
      if (now - lastTapRef.current < DOUBLE_CLICK_DELAY) {
        if (onDoubleTap && touchEndRef.current) {
          onDoubleTap(touchEndRef.current);
          // Reset to prevent triple click being detected as double click
          lastTapRef.current = 0;
        }
      } else {
        // Update last tap timestamp
        lastTapRef.current = now;
      }
    }
  };

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={elementRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="touch-manipulation"
    >
      {children}
    </div>
  );
};

export default GestureHandler;
