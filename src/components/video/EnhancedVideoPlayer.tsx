
import React, { useEffect, useRef, useState } from 'react';
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
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNeuroAesthetic } from '@/hooks/use-neuro-aesthetic';

export interface VideoPlayerProps {
  src: string;
  thumbnailUrl?: string;
  title?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  className?: string;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onEnded?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onVolumeChange?: (volume: number, muted: boolean) => void;
  onFullscreenChange?: (isFullscreen: boolean) => void;
  onError?: (error: any) => void;
}

const EnhancedVideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  thumbnailUrl,
  title,
  autoPlay = false,
  loop = false,
  muted = false,
  className,
  onTimeUpdate,
  onEnded,
  onPlay,
  onPause,
  onVolumeChange,
  onFullscreenChange,
  onError
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(muted);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [quality, setQuality] = useState('auto');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const controlsTimerRef = useRef<number | null>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const { triggerMicroReward } = useNeuroAesthetic();

  // Quality settings
  const qualityOptions = [
    { label: 'Auto', value: 'auto' },
    { label: '1080p', value: '1080' },
    { label: '720p', value: '720' },
    { label: '480p', value: '480' },
    { label: '360p', value: '360' },
  ];

  // Handle playback toggle
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      onPause?.();
    } else {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            triggerMicroReward('media');
            onPlay?.();
          })
          .catch(error => {
            console.error('Play error:', error);
            setHasError(true);
            setErrorMessage('Video playback failed. Please try again.');
            onError?.(error);
          });
      }
    }
    setIsPlaying(!isPlaying);
  };

  // Handle volume toggle
  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    const newMutedState = !isMuted;
    video.muted = newMutedState;
    setIsMuted(newMutedState);
    onVolumeChange?.(volume, newMutedState);
  };

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = parseFloat(e.target.value);
    video.volume = newVolume;
    setVolume(newVolume);
    
    // If volume is set to 0, mute the video
    if (newVolume === 0 && !isMuted) {
      video.muted = true;
      setIsMuted(true);
    } 
    // If volume is increased from 0 and the video is muted, unmute it
    else if (newVolume > 0 && isMuted) {
      video.muted = false;
      setIsMuted(false);
    }
    
    onVolumeChange?.(newVolume, video.muted);
  };

  // Handle seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const seekTime = parseFloat(e.target.value);
    video.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if ((container as any).webkitRequestFullscreen) {
        (container as any).webkitRequestFullscreen();
      } else if ((container as any).msRequestFullscreen) {
        (container as any).msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    }
  };

  // Handle quality change
  const changeQuality = (qualityValue: string) => {
    setQuality(qualityValue);
    // In a real implementation, you would need to switch video sources or 
    // set the appropriate representation in an adaptive streaming player
    console.log(`Quality changed to ${qualityValue}`);
  };

  // Handle time update
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      setDuration(video.duration);
      
      // Calculate buffered time
      if (video.buffered.length > 0) {
        setBuffered(video.buffered.end(video.buffered.length - 1));
      }
      
      onTimeUpdate?.(video.currentTime, video.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onEnded?.();
    };

    const handleLoadStart = () => {
      setIsLoading(true);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    const handleError = (error: any) => {
      setHasError(true);
      setIsLoading(false);
      setErrorMessage('An error occurred while loading the video.');
      onError?.(error);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, [onTimeUpdate, onEnded, onError]);

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isDocumentFullscreen = 
        document.fullscreenElement || 
        (document as any).webkitFullscreenElement || 
        (document as any).msFullscreenElement;
      
      setIsFullscreen(!!isDocumentFullscreen);
      onFullscreenChange?.(!!isDocumentFullscreen);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, [onFullscreenChange]);

  // Auto-hide controls
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

    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('mousemove', resetControlsTimer);
    container.addEventListener('touchstart', resetControlsTimer);

    // Initial timer
    resetControlsTimer();

    return () => {
      if (controlsTimerRef.current) {
        window.clearTimeout(controlsTimerRef.current);
      }
      
      container.removeEventListener('mousemove', resetControlsTimer);
      container.removeEventListener('touchstart', resetControlsTimer);
    };
  }, []);

  // Mobile swipe gestures for seeking
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
        const video = videoRef.current;
        if (!video) return;
        
        // Right swipe - seek forward
        if (deltaX > 0) {
          video.currentTime = Math.min(video.currentTime + 10, video.duration);
          triggerMicroReward('gesture');
        } 
        // Left swipe - seek backward
        else {
          video.currentTime = Math.max(video.currentTime - 10, 0);
          triggerMicroReward('gesture');
        }
        
        setCurrentTime(video.currentTime);
      }
      
      touchStartRef.current = null;
    };

    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile, triggerMicroReward]);

  // Format time (seconds to MM:SS)
  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return '00:00';
    
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      ref={containerRef} 
      className={cn(
        "relative w-full aspect-video bg-black rounded-lg overflow-hidden group",
        isFullscreen && "fixed inset-0 z-50 rounded-none",
        className
      )}
      onClick={(e) => {
        // Only toggle play when clicking on the video itself, not on controls
        if (e.target === containerRef.current || (e.target as HTMLElement).tagName === 'VIDEO') {
          togglePlay();
        }
      }}
    >
      {/* Video element */}
      <video
        ref={videoRef}
        src={src}
        poster={thumbnailUrl}
        className="w-full h-full object-contain"
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline
      />

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
      )}

      {/* Error message */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white text-center p-4">
          <div className="text-lg font-semibold mb-2">Oups, une erreur est survenue</div>
          <p className="text-sm text-gray-300 mb-4">{errorMessage}</p>
          <Button 
            variant="outline" 
            onClick={() => {
              setHasError(false);
              const video = videoRef.current;
              if (video) {
                video.load();
              }
            }}
          >
            Réessayer
          </Button>
        </div>
      )}

      {/* Video controls - shown based on showControls state */}
      <div 
        className={cn(
          "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300",
          showControls ? "opacity-100" : "opacity-0 pointer-events-none",
          "group-hover:opacity-100"
        )}
      >
        {/* Title */}
        {title && (
          <div className="text-white font-medium mb-2 line-clamp-1">{title}</div>
        )}
        
        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-white text-xs">{formatTime(currentTime)}</span>
          <div className="relative flex-1">
            {/* Buffered progress */}
            <Progress 
              value={(buffered / (duration || 1)) * 100} 
              className="h-1 bg-white/20"
              indicatorClassName="bg-white/40" 
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
              indicatorClassName="bg-primary" 
            />
          </div>
          <span className="text-white text-xs">{formatTime(duration)}</span>
        </div>
        
        {/* Control buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Play/Pause button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/10 h-8 w-8"
              onClick={togglePlay}
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
                  onClick={() => {
                    const video = videoRef.current;
                    if (video) {
                      video.currentTime = Math.max(video.currentTime - 10, 0);
                      setCurrentTime(video.currentTime);
                    }
                  }}
                >
                  <SkipBack size={18} />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white hover:bg-white/10 h-8 w-8"
                  onClick={() => {
                    const video = videoRef.current;
                    if (video) {
                      video.currentTime = Math.min(video.currentTime + 10, video.duration);
                      setCurrentTime(video.currentTime);
                    }
                  }}
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
                  onClick={toggleMute}
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
                    onChange={handleVolumeChange}
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
                    onClick={() => changeQuality(option.value)}
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
              onClick={toggleFullscreen}
            >
              {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedVideoPlayer;
