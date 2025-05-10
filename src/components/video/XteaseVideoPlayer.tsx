
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useVideoGestures } from './hooks/useVideoGestures';
import { useControlsVisibility } from './hooks/useControlsVisibility';
import VideoControls from './components/VideoControls';
import VideoProgress from './components/VideoProgress';
import VideoLoadingView from './components/VideoLoadingView';
import VideoErrorView from './components/VideoErrorView';
import { useVideoMetrics } from '@/hooks/use-video-metrics';
import { useMobile } from '@/hooks/useMobile';
import { toast } from 'sonner';

export interface XteaseVideoPlayerProps {
  src: string;
  thumbnailUrl?: string;
  title?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  className?: string;
  onClose?: () => void;
}

const XteaseVideoPlayer: React.FC<XteaseVideoPlayerProps> = ({
  src,
  thumbnailUrl,
  title,
  autoPlay = false,
  loop = false,
  muted = false,
  className,
  onClose
}) => {
  // State variables
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
  const [isLiked, setIsLiked] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const { isMobile, isTouch } = useMobile();
  const { showControls, setupControlsTimer } = useControlsVisibility(true);
  
  // Extract video ID from src if it's numeric
  const videoId = src?.match(/\/(\d+)$/)?.pop() || src || 'unknown';
  const { trackEvent, updateProgress } = useVideoMetrics(videoId);

  // Validate video URL on mount
  useEffect(() => {
    const validateVideoURL = () => {
      if (!src) {
        console.error('XteaseVideoPlayer: No source provided');
        setHasError(true);
        setErrorMessage('Aucune source vidéo fournie');
        return false;
      }
      
      // Basic URL validation
      try {
        // Check if it's a relative URL (starts with /) or an absolute URL
        if (!src.startsWith('/') && !src.startsWith('http')) {
          console.warn('XteaseVideoPlayer: Invalid URL format', src);
          return false;
        }
        
        // For absolute URLs, validate further
        if (src.startsWith('http')) {
          new URL(src);
        }
        
        return true;
      } catch (e) {
        console.error('XteaseVideoPlayer: Invalid URL', e);
        setHasError(true);
        setErrorMessage('URL de vidéo invalide');
        return false;
      }
    };
    
    validateVideoURL();
  }, [src]);

  // Setup controls auto-hide
  useEffect(() => {
    return setupControlsTimer(containerRef.current);
  }, [setupControlsTimer]);

  // Handle playback toggle
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      trackEvent('pause');
    } else {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            trackEvent('play');
          })
          .catch(error => {
            console.error('Play error:', error);
            
            // Handle specific error types
            if (error.name === 'NotSupportedError') {
              setErrorMessage('Format vidéo non supporté par votre navigateur');
            } else if (error.name === 'NotAllowedError') {
              setErrorMessage('Lecture automatique bloquée par votre navigateur');
            } else {
              setErrorMessage('Erreur de lecture vidéo. Veuillez réessayer.');
            }
            
            setHasError(true);
            trackEvent('error', { message: error.message || 'Play error' });
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
    trackEvent('mute', { isMuted: newMutedState });
  };

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = parseFloat(e.target.value);
    video.volume = newVolume;
    setVolume(newVolume);
    
    if (newVolume === 0 && !isMuted) {
      video.muted = true;
      setIsMuted(true);
    } else if (newVolume > 0 && isMuted) {
      video.muted = false;
      setIsMuted(false);
    }
    
    trackEvent('volume_change', { volume: newVolume });
  };

  // Handle seek
  const handleSeek = (seekTime: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = seekTime;
    setCurrentTime(seekTime);
    trackEvent('seek', { position: seekTime });
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
      trackEvent('fullscreen', { isFullscreen: true });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
      trackEvent('fullscreen', { isFullscreen: false });
    }
  };

  // Skip forward/backward
  const skipForward = () => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = Math.min(video.currentTime + 10, video.duration);
      setCurrentTime(video.currentTime);
      trackEvent('skip', { direction: 'forward', seconds: 10 });
    }
  };

  const skipBackward = () => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = Math.max(video.currentTime - 10, 0);
      setCurrentTime(video.currentTime);
      trackEvent('skip', { direction: 'backward', seconds: 10 });
    }
  };
  
  // Handle like
  const handleLike = () => {
    setIsLiked(!isLiked);
    trackEvent('like', { isLiked: !isLiked });
    
    // Add haptic feedback if available
    if (navigator.vibrate && isTouch) {
      navigator.vibrate(50);
    }
  };

  // Setup mobile gestures for seeking
  useVideoGestures({
    containerRef,
    isMobile: isTouch,
    onSeekForward: skipForward,
    onSeekBackward: skipBackward
  });

  // Handle time update and other events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      setDuration(video.duration);
      
      if (video.buffered.length > 0) {
        setBuffered(video.buffered.end(video.buffered.length - 1));
      }
      
      updateProgress(video.currentTime, video.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      trackEvent('ended');
    };

    const handleLoadStart = () => {
      setIsLoading(true);
      trackEvent('buffer_start');
      console.info('Video load started:', src);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      setHasError(false); // Reset error state on successful load
      trackEvent('buffer_end');
      console.info('Video can play now:', src);
      
      // Auto-play when can play
      if (autoPlay && video.paused) {
        video.play().catch(e => console.warn("Auto-play failed:", e));
        setIsPlaying(true);
      }
    };

    const handleError = (event: Event) => {
      const error = (video as any).error;
      console.error('Video error:', error, 'for source:', src);
      
      let errorMsg = 'Une erreur est survenue lors du chargement de la vidéo.';
      
      // Map error codes to more specific messages
      if (error) {
        switch (error.code) {
          case 1: // MEDIA_ERR_ABORTED
            errorMsg = 'Le chargement de la vidéo a été interrompu.';
            break;
          case 2: // MEDIA_ERR_NETWORK
            errorMsg = 'Une erreur réseau a empêché le chargement de la vidéo.';
            break;
          case 3: // MEDIA_ERR_DECODE
            errorMsg = 'Erreur de décodage vidéo.';
            break;
          case 4: // MEDIA_ERR_SRC_NOT_SUPPORTED
            errorMsg = 'Format vidéo non supporté ou vidéo non disponible.';
            break;
        }
      }
      
      setHasError(true);
      setIsLoading(false);
      setErrorMessage(errorMsg);
      trackEvent('error', { message: errorMsg, code: error?.code });
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    
    // Additional event listeners for better error handling
    video.addEventListener('stalled', () => {
      console.warn('Video stalled:', src);
      setIsLoading(true);
    });
    
    video.addEventListener('waiting', () => {
      console.info('Video waiting for data:', src);
      setIsLoading(true);
    });

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.removeEventListener('stalled', () => {});
      video.removeEventListener('waiting', () => {});
    };
  }, [src, trackEvent, updateProgress, autoPlay]);

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isDocumentFullscreen = 
        document.fullscreenElement || 
        (document as any).webkitFullscreenElement || 
        (document as any).msFullscreenElement;
      
      setIsFullscreen(!!isDocumentFullscreen);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Format time (seconds to MM:SS)
  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return '00:00';
    
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Retry playing the video
  const handleRetry = () => {
    const video = videoRef.current;
    if (video) {
      setHasError(false);
      setIsLoading(true);
      setRetryCount(prev => prev + 1);
      
      // Try to load the video again
      video.load();
      
      // Reset the source to force a reload
      const currentSrc = video.src;
      video.src = '';
      setTimeout(() => {
        video.src = currentSrc;
        
        // Try to play after a short delay
        setTimeout(() => {
          video.play()
            .then(() => {
              setIsPlaying(true);
              setIsLoading(false);
              console.info('Video retry successful');
            })
            .catch((e) => {
              console.error('Video retry failed:', e);
              // If we've tried too many times, show a more permanent error
              if (retryCount >= 2) {
                toast.error('Échec du chargement de la vidéo après plusieurs tentatives');
                if (onClose) onClose();
              }
            });
        }, 1000);
      }, 500);
    }
  };
  
  // Auto go fullscreen on mobile when modal opens
  useEffect(() => {
    if (isMobile && autoPlay && containerRef.current) {
      // Short delay to ensure DOM is ready
      const timer = setTimeout(() => {
        if (containerRef.current) {
          if (containerRef.current.requestFullscreen) {
            containerRef.current.requestFullscreen();
          } else if ((containerRef.current as any).webkitRequestFullscreen) {
            (containerRef.current as any).webkitRequestFullscreen();
          }
          setIsFullscreen(true);
        }
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isMobile, autoPlay]);

  // Handle double-tap for like (on mobile)
  const handleDoubleTap = () => {
    if (isTouch) {
      handleLike();
    }
  };

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative overflow-hidden bg-black touch-none",
        isFullscreen ? "fixed inset-0 z-50" : "xtease-video-container",
        className
      )}
      style={{ overscrollBehavior: 'contain' }}
    >
      <div className={cn("relative w-full h-full", isFullscreen ? "" : "aspect-[9/16]")}>
        {/* Video element */}
        <video
          ref={videoRef}
          src={src}
          poster={thumbnailUrl}
          className={cn(
            "w-full h-full object-contain xtease-video",
            isFullscreen && "xtease-fullscreen"
          )}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          playsInline
          onClick={() => togglePlay()}
          onDoubleClick={handleDoubleTap}
          onContextMenu={(e) => e.preventDefault()} // Prevent right-click menu
          controlsList="nodownload"
        />

        {/* Loading indicator */}
        {isLoading && <VideoLoadingView />}

        {/* Error message */}
        {hasError && (
          <VideoErrorView 
            message={errorMessage} 
            onRetry={handleRetry}
          />
        )}

        {/* Video controls - shown based on showControls state */}
        <div 
          className={cn(
            "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300",
            showControls ? "opacity-100" : "opacity-0 pointer-events-none",
            "group-hover:opacity-100",
            isTouch ? "pb-safe" : "" // Add safe area padding on touch devices
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
            qualityOptions={[
              { label: 'Auto', value: 'auto' },
              { label: '1080p', value: '1080' },
              { label: '720p', value: '720' },
              { label: '480p', value: '480' },
              { label: '360p', value: '360' },
            ]}
            onPlayPause={togglePlay}
            onMuteToggle={toggleMute}
            onVolumeChange={handleVolumeChange}
            onSkipBackward={skipBackward}
            onSkipForward={skipForward}
            onFullscreenToggle={toggleFullscreen}
            onQualityChange={setQuality}
            onLike={handleLike}
            isLiked={isLiked}
          />
        </div>
      </div>
    </div>
  );
};

export default XteaseVideoPlayer;
