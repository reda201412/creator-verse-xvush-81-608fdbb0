
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useNeuroAesthetic } from '@/hooks/use-neuro-aesthetic';
import { useMicroRewards } from '@/hooks/use-microrewards';

// Import reusable components
import VideoControls from './components/VideoControls';
import VideoProgress from './components/VideoProgress';
import VideoErrorView from './components/VideoErrorView';
import VideoLoadingView from './components/VideoLoadingView';
import { useVideoGestures } from './hooks/useVideoGestures';
import { useControlsVisibility } from './hooks/useControlsVisibility';

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
  const [quality, setQuality] = useState('auto');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { triggerMicroReward } = useNeuroAesthetic();
  const { triggerMediaReward } = useMicroRewards();
  const { showControls, setupControlsTimer } = useControlsVisibility(true);

  // Quality settings
  const qualityOptions = [
    { label: 'Auto', value: 'auto' },
    { label: '1080p', value: '1080' },
    { label: '720p', value: '720' },
    { label: '480p', value: '480' },
    { label: '360p', value: '360' },
  ];

  // Setup controls auto-hide
  useEffect(() => {
    return setupControlsTimer(containerRef.current);
  }, []);

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
            triggerMediaReward();
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
  const handleSeek = (seekTime: number) => {
    const video = videoRef.current;
    if (!video) return;

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

  // Skip forward
  const skipForward = () => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = Math.min(video.currentTime + 10, video.duration);
      setCurrentTime(video.currentTime);
    }
  };

  // Skip backward
  const skipBackward = () => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = Math.max(video.currentTime - 10, 0);
      setCurrentTime(video.currentTime);
    }
  };

  // Setup mobile gestures for seeking
  useVideoGestures({
    containerRef,
    isMobile,
    onSeekForward: skipForward,
    onSeekBackward: skipBackward
  });

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
      {isLoading && <VideoLoadingView />}

      {/* Error message */}
      {hasError && (
        <VideoErrorView 
          message={errorMessage} 
          onRetry={() => {
            setHasError(false);
            const video = videoRef.current;
            if (video) {
              video.load();
            }
          }}
        />
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
        <VideoProgress 
          currentTime={currentTime}
          duration={duration}
          buffered={buffered}
          onSeek={handleSeek}
          formatTime={formatTime}
        />
        
        {/* Control buttons */}
        <VideoControls
          isPlaying={isPlaying}
          isMuted={isMuted}
          volume={volume}
          isFullscreen={isFullscreen}
          isMobile={isMobile}
          currentTime={currentTime}
          duration={duration}
          quality={quality}
          qualityOptions={qualityOptions}
          onPlayPause={togglePlay}
          onMuteToggle={toggleMute}
          onVolumeChange={handleVolumeChange}
          onSkipBackward={skipBackward}
          onSkipForward={skipForward}
          onFullscreenToggle={toggleFullscreen}
          onQualityChange={changeQuality}
        />
      </div>
    </div>
  );
};

export default EnhancedVideoPlayer;
