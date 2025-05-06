
import React from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  SkipForward, 
  SkipBack, 
  Maximize, 
  Minimize,
  Settings,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useMobile } from '@/hooks/useMobile';

interface QualityOption {
  label: string;
  value: string;
}

interface VideoControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  isFullscreen: boolean;
  isMobile: boolean;
  currentTime: number;
  duration: number;
  quality: string;
  qualityOptions: QualityOption[];
  onPlayPause: () => void;
  onMuteToggle: () => void;
  onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSkipBackward: () => void;
  onSkipForward: () => void;
  onFullscreenToggle: () => void;
  onQualityChange: (quality: string) => void;
  onLike?: () => void;
  isLiked?: boolean;
}

const VideoControls: React.FC<VideoControlsProps> = ({
  isPlaying,
  isMuted,
  volume,
  isFullscreen,
  isMobile,
  quality,
  qualityOptions,
  onPlayPause,
  onMuteToggle,
  onVolumeChange,
  onSkipBackward,
  onSkipForward,
  onFullscreenToggle,
  onQualityChange,
  onLike,
  isLiked = false
}) => {
  const { isTouch } = useMobile();
  
  // Use larger buttons on touch devices
  const buttonSize = isTouch ? "h-10 w-10" : "h-8 w-8";
  const iconSize = isTouch ? 22 : 18;
  
  return (
    <div className={cn(
      "flex items-center justify-between",
      isTouch && "py-2" // Add more padding on touch devices
    )}>
      <div className="flex items-center gap-2">
        {/* Play/Pause button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn("text-white hover:bg-white/10", buttonSize)}
          onClick={onPlayPause}
        >
          {isPlaying ? <Pause size={iconSize} /> : <Play size={iconSize} />}
        </Button>
        
        {/* Skip backward/forward buttons (only on non-mobile or larger screens) */}
        {(!isMobile || !isTouch) && (
          <>
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn("text-white hover:bg-white/10", buttonSize)}
              onClick={onSkipBackward}
            >
              <SkipBack size={iconSize} />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn("text-white hover:bg-white/10", buttonSize)}
              onClick={onSkipForward}
            >
              <SkipForward size={iconSize} />
            </Button>
          </>
        )}
        
        {/* Volume control (only on non-touch devices) */}
        {!isTouch && (
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn("text-white hover:bg-white/10", buttonSize)}
              onClick={onMuteToggle}
            >
              {isMuted || volume === 0 ? <VolumeX size={iconSize} /> : <Volume2 size={iconSize} />}
            </Button>
            
            <div className="relative w-20 md:w-24">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={onVolumeChange}
                className="w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer"
                style={{
                  WebkitAppearance: 'none',
                  background: `linear-gradient(to right, white ${volume * 100}%, rgba(255, 255, 255, 0.2) ${volume * 100}%)`
                }}
              />
            </div>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        {/* Like button (mobile only) */}
        {isTouch && onLike && (
          <Button 
            variant="ghost" 
            size="icon"
            className={cn(
              "text-white hover:bg-white/10", 
              buttonSize,
              isLiked && "text-red-500"
            )}
            onClick={onLike}
          >
            <Heart size={iconSize} fill={isLiked ? "currentColor" : "none"} />
          </Button>
        )}
      
        {/* Mobile-friendly mute toggle (touch devices only) */}
        {isTouch && (
          <Button 
            variant="ghost" 
            size="icon"
            className={cn("text-white hover:bg-white/10", buttonSize)}
            onClick={onMuteToggle}
          >
            {isMuted ? <VolumeX size={iconSize} /> : <Volume2 size={iconSize} />}
          </Button>
        )}
        
        {/* Quality selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className={cn("text-white hover:bg-white/10", buttonSize)}
            >
              <Settings size={iconSize} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-black/80 backdrop-blur-md border-white/10">
            {qualityOptions.map((option) => (
              <DropdownMenuItem 
                key={option.value}
                className={cn(
                  "text-white", 
                  isTouch && "text-base py-3", // Larger text and padding for touch
                  quality === option.value && "bg-primary/20"
                )}
                onClick={() => onQualityChange(option.value)}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Fullscreen button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn("text-white hover:bg-white/10", buttonSize)}
          onClick={onFullscreenToggle}
        >
          {isFullscreen ? <Minimize size={iconSize} /> : <Maximize size={iconSize} />}
        </Button>
      </div>
    </div>
  );
};

export default VideoControls;
