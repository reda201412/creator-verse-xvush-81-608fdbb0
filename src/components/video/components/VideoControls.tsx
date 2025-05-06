
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
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

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
  onQualityChange
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {/* Play/Pause button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white hover:bg-white/10 h-8 w-8"
          onClick={onPlayPause}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </Button>
        
        {/* Skip backward/forward buttons (only on non-mobile) */}
        {!isMobile && (
          <>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/10 h-8 w-8"
              onClick={onSkipBackward}
            >
              <SkipBack size={18} />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/10 h-8 w-8"
              onClick={onSkipForward}
            >
              <SkipForward size={18} />
            </Button>
          </>
        )}
        
        {/* Volume control (only on non-mobile) */}
        {!isMobile && (
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/10 h-8 w-8"
              onClick={onMuteToggle}
            >
              {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </Button>
            
            <div className="relative w-20">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={onVolumeChange}
                className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer"
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
        {/* Quality selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="text-white hover:bg-white/10 h-8 w-8"
            >
              <Settings size={18} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {qualityOptions.map((option) => (
              <DropdownMenuItem 
                key={option.value}
                className={cn(quality === option.value && "bg-primary/20")}
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
          className="text-white hover:bg-white/10 h-8 w-8"
          onClick={onFullscreenToggle}
        >
          {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
        </Button>
      </div>
    </div>
  );
};

export default VideoControls;
