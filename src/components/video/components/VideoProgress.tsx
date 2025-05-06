
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

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
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    onSeek(seekTime);
  };

  return (
    <div className="flex items-center gap-2 mb-2">
      <span className="text-white text-xs">{formatTime(currentTime)}</span>
      <div className="relative flex-1">
        {/* Buffered progress */}
        <Progress 
          value={(buffered / (duration || 1)) * 100} 
          className="h-1 bg-white/20" 
        />
        
        {/* Playback progress (on top of buffered) */}
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          style={{ WebkitAppearance: 'none', appearance: 'none' }}
        />
        <Progress 
          value={(currentTime / (duration || 1)) * 100} 
          className="h-1 bg-transparent absolute inset-0" 
        />
      </div>
      <span className="text-white text-xs">{formatTime(duration)}</span>
    </div>
  );
};

export default VideoProgress;
