import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/components/ui/sonner';

// Types for user behavior data
export interface UserBehaviorData {
  sessionStartTime: Date;
  lastActiveTime: Date;
  interactionCount: number;
  interactionHistory: {
    type: string;
    timestamp: Date;
    metadata?: any;
  }[];
  averageSessionDuration: number;
  previousSessions: {
    date: Date;
    duration: number;
  }[];
  preferredContentTypes: Record<string, number>;
  preferredTimeOfDay: string | null;
  attentionSpan: number;
  focusLevel: number;
}

export type InteractionType = 
  | 'click' 
  | 'scroll' 
  | 'hover' 
  | 'view' 
  | 'like'
  | 'comment'
  | 'share'
  | 'search'
  | 'navigate'
  | 'purchase'
  | 'follow'
  | 'analyze'
  | 'toggle'
  | 'select'
  | 'adjust'
  | 'creative';

interface UserBehaviorOptions {
  storageKey?: string;
  recordHistory?: boolean;
  historyLimit?: number;
  sessionTimeout?: number; // minutes
  enableToasts?: boolean;
}

/**
 * Hook for tracking and analyzing user behavior
 */
export function useUserBehavior(options: UserBehaviorOptions = {}) {
  const {
    storageKey = 'xvush_user_behavior',
    recordHistory = true,
    historyLimit = 100,
    sessionTimeout = 30, // minutes
    enableToasts = false,
  } = options;
  
  // Initialize behavior data
  const [behaviorData, setBehaviorData] = useState<UserBehaviorData>(() => {
    // Try to load from localStorage
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // Convert string dates back to Date objects
        return {
          ...parsed,
          sessionStartTime: new Date(parsed.sessionStartTime),
          lastActiveTime: new Date(parsed.lastActiveTime),
          interactionHistory: parsed.interactionHistory.map((item: any) => ({
            ...item,
            timestamp: new Date(item.timestamp)
          })),
          previousSessions: parsed.previousSessions.map((session: any) => ({
            ...session,
            date: new Date(session.date)
          }))
        };
      } catch (error) {
        console.error('Error parsing saved behavior data:', error);
      }
    }
    
    // Create new behavior data if nothing saved or error parsing
    return {
      sessionStartTime: new Date(),
      lastActiveTime: new Date(),
      interactionCount: 0,
      interactionHistory: [],
      averageSessionDuration: 0,
      previousSessions: [],
      preferredContentTypes: {},
      preferredTimeOfDay: null,
      attentionSpan: 0,
      focusLevel: 50, // default middle value
    };
  });
  
  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(behaviorData));
  }, [behaviorData, storageKey]);
  
  // Track session time and update on window focus/blur
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // User came back to the tab
        const now = new Date();
        const lastActive = new Date(behaviorData.lastActiveTime);
        const minutesAway = (now.getTime() - lastActive.getTime()) / (1000 * 60);
        
        // If away for longer than session timeout, count as new session
        if (minutesAway > sessionTimeout) {
          const sessionDuration = 
            (lastActive.getTime() - behaviorData.sessionStartTime.getTime()) / (1000 * 60);
            
          setBehaviorData(prev => {
            // Calculate new average session duration
            const totalPreviousDurations = prev.previousSessions.reduce(
              (sum, session) => sum + session.duration, 0
            );
            const totalSessions = prev.previousSessions.length + 1;
            const newAverage = (totalPreviousDurations + sessionDuration) / totalSessions;
            
            return {
              ...prev,
              sessionStartTime: now,
              lastActiveTime: now,
              previousSessions: [
                ...prev.previousSessions,
                { date: lastActive, duration: sessionDuration }
              ],
              averageSessionDuration: newAverage
            };
          });
          
          if (enableToasts) {
            toast("Welcome back!", {
              description: "New session started"
            });
          }
        } else {
          // Just update last active time
          setBehaviorData(prev => ({
            ...prev,
            lastActiveTime: now
          }));
        }
      }
    };
    
    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);
    
    // Clean up
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
    };
  }, [behaviorData.lastActiveTime, behaviorData.sessionStartTime, sessionTimeout, enableToasts]);
  
  // Track user interactions
  const trackInteraction = useCallback((
    type: InteractionType, 
    metadata?: any
  ) => {
    const timestamp = new Date();
    
    setBehaviorData(prev => {
      // Update interaction history if enabled
      const newHistory = recordHistory 
        ? [
            { type, timestamp, metadata },
            ...prev.interactionHistory
          ].slice(0, historyLimit)
        : prev.interactionHistory;
        
      return {
        ...prev,
        interactionCount: prev.interactionCount + 1,
        lastActiveTime: timestamp,
        interactionHistory: newHistory
      };
    });
  }, [recordHistory, historyLimit]);
  
  // Track content preference
  const trackContentPreference = useCallback((contentType: string) => {
    setBehaviorData(prev => {
      const currentCount = prev.preferredContentTypes[contentType] || 0;
      return {
        ...prev,
        preferredContentTypes: {
          ...prev.preferredContentTypes,
          [contentType]: currentCount + 1
        }
      };
    });
  }, []);
  
  // Set focus level
  const setFocusLevel = useCallback((level: number) => {
    setBehaviorData(prev => ({
      ...prev,
      focusLevel: Math.max(0, Math.min(100, level)) // Clamp between 0-100
    }));
  }, []);
  
  // Get preferred time of day based on activity
  const updatePreferredTimeOfDay = useCallback(() => {
    const sessions = behaviorData.previousSessions;
    if (sessions.length < 3) return; // Need enough data
    
    // Count activity by time of day
    const timeCounts = {
      morning: 0,   // 5-12
      afternoon: 0, // 12-17
      evening: 0,   // 17-22
      night: 0      // 22-5
    };
    
    sessions.forEach(session => {
      const hour = session.date.getHours();
      if (hour >= 5 && hour < 12) timeCounts.morning++;
      else if (hour >= 12 && hour < 17) timeCounts.afternoon++;
      else if (hour >= 17 && hour < 22) timeCounts.evening++;
      else timeCounts.night++;
    });
    
    // Find most active time
    let maxCount = 0;
    let preferredTime: string | null = null;
    
    Object.entries(timeCounts).forEach(([time, count]) => {
      if (count > maxCount) {
        maxCount = count;
        preferredTime = time;
      }
    });
    
    if (preferredTime !== behaviorData.preferredTimeOfDay) {
      setBehaviorData(prev => ({
        ...prev,
        preferredTimeOfDay: preferredTime
      }));
    }
  }, [behaviorData.previousSessions, behaviorData.preferredTimeOfDay]);
  
  // Calculate cognitive metrics
  const calculateCognitiveMetrics = useCallback(() => {
    if (behaviorData.interactionHistory.length < 5) return; // Need enough data
    
    // Calculate attention span based on time between interactions
    const timeGaps: number[] = [];
    for (let i = 1; i < behaviorData.interactionHistory.length; i++) {
      const current = behaviorData.interactionHistory[i].timestamp.getTime();
      const previous = behaviorData.interactionHistory[i-1].timestamp.getTime();
      const gap = (current - previous) / 1000; // in seconds
      if (gap < 300) { // ignore gaps larger than 5 minutes
        timeGaps.push(gap);
      }
    }
    
    if (timeGaps.length > 0) {
      const avgGap = timeGaps.reduce((sum, gap) => sum + gap, 0) / timeGaps.length;
      // Convert to attention score (shorter gaps = higher attention)
      const attentionSpan = Math.max(0, Math.min(100, 100 - (avgGap / 3)));
      
      setBehaviorData(prev => ({
        ...prev,
        attentionSpan
      }));
    }
  }, [behaviorData.interactionHistory]);
  
  // Update metrics when data changes
  useEffect(() => {
    updatePreferredTimeOfDay();
    calculateCognitiveMetrics();
  }, [behaviorData.interactionHistory, behaviorData.previousSessions, updatePreferredTimeOfDay, calculateCognitiveMetrics]);
  
  // Get cognitive profile summary
  const getCognitiveProfile = useCallback(() => {
    // Determine engagement level based on interaction count and frequency
    let engagementLevel: 'low' | 'medium' | 'high' = 'medium';
    if (behaviorData.interactionCount > 50 && behaviorData.attentionSpan > 70) {
      engagementLevel = 'high';
    } else if (behaviorData.interactionCount < 10 && behaviorData.attentionSpan < 30) {
      engagementLevel = 'low';
    }
    
    // Determine most engaged with content type
    let favoriteContentType: string | null = null;
    let maxCount = 0;
    Object.entries(behaviorData.preferredContentTypes).forEach(([type, count]) => {
      if (count > maxCount) {
        maxCount = count;
        favoriteContentType = type;
      }
    });
    
    return {
      engagementLevel,
      attentionSpan: behaviorData.attentionSpan,
      focusLevel: behaviorData.focusLevel,
      preferredTimeOfDay: behaviorData.preferredTimeOfDay,
      favoriteContentType,
      averageSessionDuration: behaviorData.averageSessionDuration
    };
  }, [behaviorData]);
  
  // Reset behavior data
  const resetBehaviorData = useCallback(() => {
    setBehaviorData({
      sessionStartTime: new Date(),
      lastActiveTime: new Date(),
      interactionCount: 0,
      interactionHistory: [],
      averageSessionDuration: 0,
      previousSessions: [],
      preferredContentTypes: {},
      preferredTimeOfDay: null,
      attentionSpan: 0,
      focusLevel: 50,
    });
    localStorage.removeItem(storageKey);
  }, [storageKey]);
  
  return {
    behaviorData,
    trackInteraction,
    trackContentPreference,
    setFocusLevel,
    getCognitiveProfile,
    resetBehaviorData
  };
}
