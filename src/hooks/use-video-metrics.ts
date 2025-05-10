
import { useCallback } from 'react';
import { triggerHapticFeedback } from '@/lib/utils';
import { incrementVideoViews, trackVideoWatchTime, toggleVideoLike } from '@/services/videoService';

// Define allowed event types
type VideoEventType = 
  | 'play' 
  | 'pause' 
  | 'ended' 
  | 'seek' 
  | 'buffer_start' 
  | 'buffer_end' 
  | 'error' 
  | 'mute'
  | 'volume_change'
  | 'fullscreen'
  | 'quality_change'
  | 'speed_change'
  | 'skip'
  | 'like';

type VideoMetricData = {
  [key: string]: any;
};

export const useVideoMetrics = (videoId: string) => {
  // Track start time to calculate watch duration
  let startTime: number | null = null;
  
  // Track a video-related event
  const trackEvent = useCallback(async (eventType: VideoEventType, data?: VideoMetricData) => {
    // Log the event for debugging
    console.info(`Video metric: ${eventType} for video ${videoId}`, data || {});
    
    try {
      // Process specific events
      switch (eventType) {
        case 'play':
          // Record start time for watch duration calculation
          startTime = Date.now();
          // Increment views count when video starts playing
          await incrementVideoViews(videoId);
          break;
          
        case 'pause':
        case 'ended':
          // Calculate watch duration when video is paused or ends
          if (startTime) {
            const duration = (Date.now() - startTime) / 1000; // Convert to seconds
            await trackVideoWatchTime(videoId, duration);
            startTime = null;
          }
          break;
          
        case 'like':
          // Toggle like state
          const isLiked = data?.isLiked === true;
          await toggleVideoLike(videoId, isLiked);
          break;
      }
      
      // Trigger haptic feedback for certain events on mobile devices
      if (['like', 'play', 'seek'].includes(eventType) && 'vibrate' in navigator) {
        triggerHapticFeedback('light');
      }
    } catch (error) {
      console.error(`Error tracking video event ${eventType}:`, error);
    }
  }, [videoId]);

  // Track video progress
  const updateProgress = useCallback((currentTime: number, duration: number) => {
    // Only report at certain thresholds (e.g., 25%, 50%, 75%, 100%)
    const progress = (currentTime / duration) * 100;
    
    if (progress >= 25 && progress < 26) {
      trackEvent('seek', { progress: 25 });
    } else if (progress >= 50 && progress < 51) {
      trackEvent('seek', { progress: 50 });
    } else if (progress >= 75 && progress < 76) {
      trackEvent('seek', { progress: 75 });
    } else if (progress >= 99 && progress <= 100) {
      trackEvent('seek', { progress: 100 });
    }
  }, [trackEvent]);

  return {
    trackEvent,
    updateProgress
  };
};
