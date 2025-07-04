import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-media-query';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useVideoGestures } from './hooks/useVideoGestures';
import { useControlsVisibility } from './hooks/useControlsVisibility';
import VideoControls from './components/VideoControls';
import VideoProgress from './components/VideoProgress';
import VideoLoadingView from './components/VideoLoadingView';
import VideoErrorView from './components/VideoErrorView';
import { useVideoMetrics } from '@/hooks/use-video-metrics';
import { useMobile } from '@/hooks/useMobile';

export interface XteaseVideoPlayerProps {
  src: string;
  thumbnailUrl?: string;
  title?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  className?: string;
  onClose?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onError?: (error?: Error) => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
}

const XteaseVideoPlayer: React.FC<XteaseVideoPlayerProps> = ({
  src,
  thumbnailUrl,
  title,
  autoPlay = false,
  loop = false,
  muted = false,
  className,
  onClose,
  onPlay,
  onPause,
  onEnded,
  onError,
  onTimeUpdate
}) => {
  // Débogage: Log l'URL de la vidéo
  console.log("XteaseVideoPlayer - URL de la vidéo:", src);
  
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
  const { isMobile, isTouch } = useMobile();
  const { showControls, setupControlsTimer } = useControlsVisibility(true);
  const { trackEvent, updateProgress } = useVideoMetrics(src);
  
  // Vérifier la validité de l'URL vidéo
  useEffect(() => {
    if (!src) {
      console.error("URL vidéo invalide ou manquante:", src);
      setHasError(true);
      setErrorMessage("L'URL de la vidéo est invalide ou manquante.");
      return;
    }
    
    // Tester l'accessibilité de la vidéo
    fetch(src, { method: 'HEAD' })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
      })
      .catch(err => {
        console.error("Erreur lors de la vérification de l'URL vidéo:", err);
        setHasError(true);
        setErrorMessage(`La vidéo n'est pas accessible. ${err.message}`);
        if (onError) onError(err);
      });
  }, [src, onError]);

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
  }, [setupControlsTimer]);

  // Handle playback toggle
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      trackEvent('pause');
      if (onPause) onPause();
    } else {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            trackEvent('play');
            if (onPlay) onPlay();
          })
          .catch(error => {
            console.error('Play error:', error);
            setHasError(true);
            setErrorMessage(`Erreur de lecture: ${error.message || 'Erreur inconnue'}`);
            trackEvent('error', { message: 'Playback failed' });
            if (onError) onError(error);
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
      
      if (onTimeUpdate) {
        onTimeUpdate(video.currentTime, video.duration);
      }
      
      updateProgress(video.currentTime, video.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      trackEvent('ended');
      if (onEnded) onEnded();
    };

    const handleLoadStart = () => {
      setIsLoading(true);
      trackEvent('buffer_start');
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      setHasError(false); // Réinitialiser l'état d'erreur si la vidéo peut être lue
      trackEvent('buffer_end');
      
      // Auto-play when can play
      if (autoPlay && video.paused) {
        video.play().catch(e => {
          console.error("Auto-play failed:", e);
          if (onError) onError(e);
        });
        setIsPlaying(true);
      }
    };

    const handleError = (event: any) => {
      const error = event.target.error;
      console.error("Erreur de lecture vidéo:", error);
      setHasError(true);
      setIsLoading(false);
      
      let errorMsg = "Une erreur s'est produite lors du chargement de la vidéo.";
      if (error) {
        switch (error.code) {
          case 1:
            errorMsg = "Le chargement de la vidéo a été interrompu.";
            break;
          case 2:
            errorMsg = "La connexion réseau a échoué.";
            break;
          case 3:
            errorMsg = "Le décodage de la vidéo a échoué.";
            break;
          case 4:
            errorMsg = "La vidéo n'est pas disponible ou non prise en charge.";
            break;
          default:
            errorMsg = `Erreur de lecture: ${error.message || 'Erreur inconnue'}`;
        }
      }
      
      setErrorMessage(errorMsg);
      trackEvent('error', { message: errorMsg });
      if (onError) onError(error);
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
  }, [trackEvent, updateProgress, autoPlay, onTimeUpdate, onEnded, onError]);

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
        "relative overflow-hidden bg-black group touch-manipulation",
        isFullscreen ? "fixed inset-0 z-50" : "xtease-video-container",
        className
      )}
    >
      <div className={cn("relative w-full h-full", isFullscreen ? "" : "aspect-[9/16]")}>
        {/* Video element */}
        {!hasError && (
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
            muted={muted || isMuted}
            playsInline
            onClick={() => togglePlay()}
            onDoubleClick={() => {}} // Géré séparément
          />
        )}

        {/* Loading indicator */}
        {isLoading && !hasError && <VideoLoadingView />}

        {/* Error message */}
        {hasError && (
          <VideoErrorView 
            message={errorMessage} 
            onRetry={() => {
              setHasError(false);
              setIsLoading(true);
              const video = videoRef.current;
              if (video) {
                video.load();
                video.play().catch(e => {
                  console.error("Retry failed:", e);
                  setHasError(true);
                  setErrorMessage(`La lecture a échoué: ${e.message || 'Erreur inconnue'}`);
                });
              }
            }}
          />
        )}

        {/* Video controls - shown based on showControls state */}
        {!hasError && (
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
              qualityOptions={qualityOptions}
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
        )}
      </div>
    </div>
  );
};

export default XteaseVideoPlayer;
