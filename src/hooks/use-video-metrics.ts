
import { useCallback } from 'react';
import { triggerHapticFeedback } from '@/lib/utils';

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
  | 'like'; // Added 'like' as a valid event type

type VideoMetricData = {
  [key: string]: any;
};

export const useVideoMetrics = (videoId: string) => {
  // Track a video-related event
  const trackEvent = useCallback((eventType: VideoEventType, data?: VideoMetricData) => {
    // In a real application, you would send this to an analytics service
    console.info(`Video metric: ${eventType} for video ${videoId}`, data || {});
    
    // Trigger haptic feedback for certain events on mobile devices
    if (['like', 'play', 'seek'].includes(eventType) && 'vibrate' in navigator) {
      triggerHapticFeedback('light');
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
