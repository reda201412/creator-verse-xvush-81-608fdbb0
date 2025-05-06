import React, { useEffect, useState } from 'react';
import { useMediaQuery, useIsMobileDevice } from '@/hooks/use-media-query';
import EnhancedVideoPlayer from './EnhancedVideoPlayer';
import VideoQualityIndicator from './components/VideoQualityIndicator';
import VideoLoadingView from './components/VideoLoadingView';
import { cn } from '@/lib/utils';
import { MediaCacheService } from '@/services/media-cache.service';
import { useNeuroAesthetic } from '@/hooks/use-neuro-aesthetic';
import { useMicroRewards } from '@/hooks/use-microrewards';

// Define different video quality levels
interface VideoResolution {
  src: string;
  quality: string;
  width: number;
}

interface AdaptiveVideoContainerProps {
  videoId: string;
  sources?: VideoResolution[];
  defaultSource: string;
  thumbnailUrl?: string;
  title?: string;
  autoPlay?: boolean;
  loop?: boolean;
  preload?: 'auto' | 'metadata' | 'none';
  className?: string;
  onEnded?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onError?: (error: any) => void;
  onProgressUpdate?: (progress: number) => void;
}

const AdaptiveVideoContainer: React.FC<AdaptiveVideoContainerProps> = ({
  videoId,
  sources,
  defaultSource,
  thumbnailUrl,
  title,
  autoPlay = false,
  loop = false,
  preload = 'metadata',
  className,
  onEnded,
  onPlay,
  onPause,
  onError,
  onProgressUpdate
}) => {
  const [activeSource, setActiveSource] = useState<string>(defaultSource);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [playbackQuality, setPlaybackQuality] = useState<string>('auto');
  const [networkInfo, setNetworkInfo] = useState<{
    type: string;
    downlink: number;
  }>({
    type: 'unknown',
    downlink: 0
  });
  
  const isMobile = useIsMobileDevice();
  const isHighResScreen = useMediaQuery('(min-resolution: 2dppx)');
  const { triggerMicroReward } = useNeuroAesthetic();
  const { triggerMilestoneReward } = useMicroRewards();
  
  // Monitor network conditions
  useEffect(() => {
    const updateNetworkInfo = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        setNetworkInfo({
          type: connection.effectiveType || 'unknown',
          downlink: connection.downlink || 0
        });
      }
    };

    updateNetworkInfo();

    // Add event listener for network changes if supported
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      connection.addEventListener('change', updateNetworkInfo);
      
      return () => {
        connection.removeEventListener('change', updateNetworkInfo);
      };
    }
  }, []);

  // Select appropriate video source based on device capabilities and network
  useEffect(() => {
    if (!sources || sources.length === 0) return;
    
    // Default to highest quality on WiFi/high-speed connections, lower on mobile data
    let idealSource: VideoResolution | undefined;
    
    if (networkInfo.type === '4g' && networkInfo.downlink > 5) {
      // High-speed connection, select higher quality
      idealSource = isHighResScreen 
        ? sources.find(s => s.quality === '1080p') 
        : sources.find(s => s.quality === '720p');
    } else if (networkInfo.type === '4g' || networkInfo.type === '3g') {
      // Medium connection, balance quality and performance
      idealSource = isMobile 
        ? sources.find(s => s.quality === '480p') 
        : sources.find(s => s.quality === '720p');
    } else {
      // Low-speed connection, prioritize performance
      idealSource = sources.find(s => s.quality === '360p') || 
                   sources.find(s => s.quality === '480p');
    }
    
    // Fallback to the default source if no ideal source is found
    if (idealSource) {
      setActiveSource(idealSource.src);
      setPlaybackQuality(idealSource.quality);
    }
  }, [sources, networkInfo, isMobile, isHighResScreen]);

  // Pre-cache the next video if we're in a playlist scenario
  useEffect(() => {
    // This would be implemented to work with your specific content structure
    const cacheNextVideo = async () => {
      // Example implementation - replace with your own logic
      // const nextVideoUrl = getNextVideoInPlaylist(videoId);
      // if (nextVideoUrl) {
      //   await MediaCacheService.cacheVideo(nextVideoUrl);
      // }
    };
    
    cacheNextVideo();
  }, [videoId]);

  // Handle time updates for analytics tracking
  const handleTimeUpdate = (currentTime: number, duration: number) => {
    // Calculate progress percentage
    const progress = (currentTime / duration) * 100;
    
    // Dispatch progress for analytics or other tracking
    onProgressUpdate?.(progress);
    
    // Trigger micro-rewards at key points (25%, 50%, 75%, 100%)
    if (Math.floor(progress) === 25 || 
        Math.floor(progress) === 50 || 
        Math.floor(progress) === 75 || 
        Math.floor(progress) === 98) {
      triggerMilestoneReward(Math.floor(progress));
    }
  };

  return (
    <div className={cn("relative", className)}>
      <EnhancedVideoPlayer
        src={activeSource}
        thumbnailUrl={thumbnailUrl}
        title={title}
        autoPlay={autoPlay}
        loop={loop}
        onTimeUpdate={handleTimeUpdate}
        onEnded={onEnded}
        onPlay={() => {
          onPlay?.();
          // Clear buffering state when playback starts
          setIsBuffering(false);
        }}
        onPause={onPause}
        onError={(error) => {
          console.error('Video playback error:', error);
          onError?.(error);
          
          // If there's an error with high quality, try to fallback to a lower quality
          if (sources && sources.length > 1) {
            const currentIndex = sources.findIndex(s => s.src === activeSource);
            if (currentIndex > 0) { // If not already at the lowest quality
              const lowerQuality = sources[currentIndex - 1];
              setActiveSource(lowerQuality.src);
              setPlaybackQuality(lowerQuality.quality);
              console.log(`Falling back to ${lowerQuality.quality} due to playback error`);
            }
          }
        }}
      />
      
      {/* Quality indicator - only show briefly when quality changes */}
      <VideoQualityIndicator 
        quality={playbackQuality} 
        show={playbackQuality !== 'auto'} 
      />
      
      {/* Buffering indicator */}
      {isBuffering && <VideoLoadingView />}
    </div>
  );
};

export default AdaptiveVideoContainer;
