
import { useState, useEffect, useRef } from 'react';

export interface VideoMetrics {
  startTime: number;
  playCount: number;
  pauseCount: number;
  seekCount: number;
  bufferingEvents: number;
  bufferingDuration: number;
  playbackDuration: number;
  completionRate: number;
  averagePlaybackSpeed: number;
  qualityChanges: number;
  playbackErrors: {
    count: number;
    timestamps: number[];
    messages: string[];
  };
}

export interface PlaybackEvent {
  type: 'play' | 'pause' | 'seek' | 'buffer_start' | 'buffer_end' | 'error' | 
        'quality_change' | 'speed_change' | 'fullscreen' | 'mute' | 'volume_change' | 
        'skip' | 'ended';
  timestamp: number;
  data?: any;
}

/**
 * Custom hook for tracking and collecting video playback metrics
 */
export function useVideoMetrics(videoId: string) {
  const [metrics, setMetrics] = useState<VideoMetrics>({
    startTime: Date.now(),
    playCount: 0,
    pauseCount: 0,
    seekCount: 0,
    bufferingEvents: 0,
    bufferingDuration: 0,
    playbackDuration: 0,
    completionRate: 0,
    averagePlaybackSpeed: 1,
    qualityChanges: 0,
    playbackErrors: {
      count: 0,
      timestamps: [],
      messages: []
    }
  });
  
  const [events, setEvents] = useState<PlaybackEvent[]>([]);
  const bufferingStartTime = useRef<number | null>(null);
  const playbackStartTime = useRef<number | null>(null);
  const speedSamples = useRef<number[]>([1]);

  // Track a new playback event
  const trackEvent = (
    type: PlaybackEvent['type'], 
    data?: any
  ) => {
    const timestamp = Date.now();
    const newEvent: PlaybackEvent = { type, timestamp, data };
    
    setEvents(prev => [...prev, newEvent]);
    
    // Update specific metrics based on event type
    switch (type) {
      case 'play':
        setMetrics(prev => ({ 
          ...prev, 
          playCount: prev.playCount + 1 
        }));
        playbackStartTime.current = timestamp;
        break;
        
      case 'pause':
        setMetrics(prev => ({ 
          ...prev, 
          pauseCount: prev.pauseCount + 1 
        }));
        if (playbackStartTime.current) {
          const playDuration = (timestamp - playbackStartTime.current) / 1000; // in seconds
          setMetrics(prev => ({ 
            ...prev, 
            playbackDuration: prev.playbackDuration + playDuration 
          }));
          playbackStartTime.current = null;
        }
        break;
        
      case 'seek':
        setMetrics(prev => ({ 
          ...prev, 
          seekCount: prev.seekCount + 1 
        }));
        break;
        
      case 'buffer_start':
        bufferingStartTime.current = timestamp;
        setMetrics(prev => ({ 
          ...prev, 
          bufferingEvents: prev.bufferingEvents + 1 
        }));
        break;
        
      case 'buffer_end':
        if (bufferingStartTime.current) {
          const bufferDuration = (timestamp - bufferingStartTime.current) / 1000; // in seconds
          setMetrics(prev => ({ 
            ...prev, 
            bufferingDuration: prev.bufferingDuration + bufferDuration 
          }));
          bufferingStartTime.current = null;
        }
        break;
        
      case 'error':
        setMetrics(prev => ({ 
          ...prev, 
          playbackErrors: {
            count: prev.playbackErrors.count + 1,
            timestamps: [...prev.playbackErrors.timestamps, timestamp],
            messages: [...prev.playbackErrors.messages, data?.message || 'Unknown error']
          }
        }));
        break;
        
      case 'quality_change':
        setMetrics(prev => ({ 
          ...prev, 
          qualityChanges: prev.qualityChanges + 1 
        }));
        break;
        
      case 'speed_change':
        if (data && typeof data.speed === 'number') {
          speedSamples.current.push(data.speed);
          // Calculate average playback speed
          const average = speedSamples.current.reduce((a, b) => a + b, 0) / speedSamples.current.length;
          setMetrics(prev => ({ 
            ...prev, 
            averagePlaybackSpeed: average 
          }));
        }
        break;
        
      // Handle new event types we're adding
      case 'mute':
      case 'volume_change':
      case 'skip':
      case 'ended':
      case 'fullscreen':
        // Just track these events without specific metric updates
        break;
    }
  };
  
  // Update completion rate based on current time and duration
  const updateProgress = (currentTime: number, duration: number) => {
    if (duration > 0) {
      const completionRate = (currentTime / duration) * 100;
      setMetrics(prev => ({ 
        ...prev, 
        completionRate: Math.min(Math.max(completionRate, prev.completionRate), 100) 
      }));
    }
  };
  
  // Send metrics to analytics service (to be implemented)
  const sendMetrics = async () => {
    try {
      // This would be an API call to your analytics service
      console.log('Sending video metrics:', { videoId, ...metrics, events });
      
      // Example API call:
      // await fetch('/api/video-metrics', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ videoId, metrics, events }),
      // });
      
      return true;
    } catch (error) {
      console.error('Failed to send video metrics:', error);
      return false;
    }
  };
  
  // Clean up on unmount - send final metrics
  useEffect(() => {
    return () => {
      // Calculate final playback duration if still playing
      if (playbackStartTime.current) {
        const finalDuration = (Date.now() - playbackStartTime.current) / 1000;
        setMetrics(prev => ({
          ...prev,
          playbackDuration: prev.playbackDuration + finalDuration
        }));
      }
      
      // Send final metrics
      sendMetrics();
    };
  }, [videoId]);
  
  return {
    metrics,
    trackEvent,
    updateProgress,
    sendMetrics
  };
}
