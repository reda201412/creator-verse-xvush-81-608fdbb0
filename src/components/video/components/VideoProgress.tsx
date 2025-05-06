
import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useMobile } from '@/hooks/useMobile';

interface VideoProgressProps {
  currentTime: number;
  duration: number;
  buffered: number;
  onSeek: (time: number) => void;
  formatTime: (time: number) => string;
}

const VideoProgress: React.FC<VideoProgressProps> = ({
  currentTime,
  duration,
  buffered,
  onSeek,
  formatTime
}) => {
  const progressRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const { isTouch } = useMobile();
  
  // Calculate progress percentages
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferProgress = duration > 0 ? (buffered / duration) * 100 : 0;
  
  // Handle click on progress bar
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const seekTime = clickPosition * duration;
    
    onSeek(seekTime);
  };
  
  // Handle touch on progress bar
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!progressRef.current || !isDragging) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const touchPosition = Math.max(0, Math.min(1, (touch.clientX - rect.left) / rect.width));
    
    setHoverTime(touchPosition * duration);
    
    // Prevent default to avoid scrolling
    e.preventDefault();
  };
  
  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!progressRef.current || !isDragging || hoverTime === null) return;
    
    onSeek(hoverTime);
    setIsDragging(false);
    setHoverTime(null);
  };
  
  // Handle mouse hover for preview (desktop only)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || isTouch) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const hoverPosition = (e.clientX - rect.left) / rect.width;
    
    setHoverTime(hoverPosition * duration);
  };
  
  const handleMouseLeave = () => {
    setHoverTime(null);
  };
  
  return (
    <div className="w-full mb-3">
      <div className="flex items-center justify-between text-xs text-white mb-1">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
      
      <div 
        ref={progressRef}
        className={cn(
          "relative w-full h-1.5 bg-white/20 rounded-full cursor-pointer group",
          isTouch && "h-3", // Taller progress bar on touch devices
          isDragging && "h-4" // Even taller when dragging
        )}
        onClick={handleProgressClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchStart={() => setIsDragging(true)}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Buffered progress */}
        <div 
          className="absolute top-0 left-0 h-full bg-white/30 rounded-full" 
          style={{ width: `${bufferProgress}%` }}
        />
        
        {/* Current progress */}
        <div 
          className="absolute top-0 left-0 h-full bg-primary rounded-full" 
          style={{ width: `${progress}%` }}
        />
        
        {/* Thumb indicator */}
        <div 
          className={cn(
            "absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-primary transform -translate-x-1/2 transition-opacity",
            (isDragging || isTouch) ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}
          style={{ left: `${progress}%` }}
        />
        
        {/* Time preview on hover (desktop only) */}
        {hoverTime !== null && !isTouch && (
          <div 
            className="absolute bottom-full mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded transform -translate-x-1/2"
            style={{ left: `${(hoverTime / duration) * 100}%` }}
          >
            {formatTime(hoverTime)}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoProgress;
