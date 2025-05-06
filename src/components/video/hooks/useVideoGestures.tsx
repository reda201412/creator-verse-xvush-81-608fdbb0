
import { useRef, useEffect } from 'react';
import { useMicroRewards } from '@/hooks/use-microrewards';

interface TouchStart {
  x: number;
  y: number;
  time: number;
}

interface UseVideoGesturesProps {
  containerRef: React.RefObject<HTMLDivElement>;
  isMobile: boolean;
  onSeekForward: () => void;
  onSeekBackward: () => void;
}

export const useVideoGestures = ({
  containerRef,
  isMobile,
  onSeekForward,
  onSeekBackward
}: UseVideoGesturesProps) => {
  const touchStartRef = useRef<TouchStart | null>(null);
  const { triggerGestureReward } = useMicroRewards();
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isMobile) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now()
      };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current) return;
      
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      const deltaTime = Date.now() - touchStartRef.current.time;
      
      // If it's a quick horizontal swipe (less than 300ms and more horizontal than vertical)
      if (deltaTime < 300 && Math.abs(deltaX) > 30 && Math.abs(deltaX) > Math.abs(deltaY)) {
        // Right swipe - seek forward
        if (deltaX > 0) {
          onSeekForward();
          triggerGestureReward();
        } 
        // Left swipe - seek backward
        else {
          onSeekBackward();
          triggerGestureReward();
        }
      }
      
      touchStartRef.current = null;
    };

    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile, containerRef, onSeekForward, onSeekBackward, triggerGestureReward]);
};
