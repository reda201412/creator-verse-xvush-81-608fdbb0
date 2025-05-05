
import { useState, useEffect, useCallback } from 'react';

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';
export type CircadianPhase = 'awakening' | 'focused' | 'creative' | 'relaxing' | 'resting';
export type MoodSuggestion = 'energetic' | 'calm' | 'creative' | 'focused';

interface CircadianSettings {
  enableAdaptation: boolean;
  userChronotype: 'early-bird' | 'intermediate' | 'night-owl';
  overrideMode: TimeOfDay | null;
}

export function useCircadianRhythm(options: {
  defaultSettings?: Partial<CircadianSettings>;
} = {}) {
  // Default settings with user override
  const defaultSettings: CircadianSettings = {
    enableAdaptation: true,
    userChronotype: 'intermediate',
    overrideMode: null,
    ...options.defaultSettings
  };
  
  const [settings, setSettings] = useState<CircadianSettings>(defaultSettings);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  
  // Update time periodically
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    
    return () => clearInterval(timeInterval);
  }, []);
  
  // Calculate time of day based on current hour
  const getTimeOfDay = useCallback((): TimeOfDay => {
    if (settings.overrideMode) return settings.overrideMode;
    
    const hour = currentTime.getHours();
    
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 22) return 'evening';
    return 'night';
  }, [currentTime, settings.overrideMode]);
  
  // Determine optimal circadian phase based on time and chronotype
  const getCircadianPhase = useCallback((): CircadianPhase => {
    if (!settings.enableAdaptation) return 'focused';
    
    const hour = currentTime.getHours();
    const chronotype = settings.userChronotype;
    
    // Adjust timings based on chronotype
    const timeShift = chronotype === 'early-bird' ? -2 : 
                      chronotype === 'night-owl' ? 2 : 0;
    
    const adjustedHour = (hour + timeShift + 24) % 24;
    
    if (adjustedHour >= 5 && adjustedHour < 9) return 'awakening';
    if (adjustedHour >= 9 && adjustedHour < 14) return 'focused';
    if (adjustedHour >= 14 && adjustedHour < 18) return 'creative';
    if (adjustedHour >= 18 && adjustedHour < 22) return 'relaxing';
    return 'resting';
  }, [currentTime, settings.enableAdaptation, settings.userChronotype]);
  
  // Get suggested UI mood based on circadian phase
  const getSuggestedMood = useCallback((): MoodSuggestion => {
    const phase = getCircadianPhase();
    
    switch (phase) {
      case 'awakening': return 'energetic';
      case 'focused': return 'focused';
      case 'creative': return 'creative';
      case 'relaxing': return 'calm';
      case 'resting': return 'calm';
      default: return 'calm';
    }
  }, [getCircadianPhase]);
  
  // Get suggested interface settings
  const getSuggestedSettings = useCallback(() => {
    const timeOfDay = getTimeOfDay();
    const phase = getCircadianPhase();
    const mood = getSuggestedMood();
    
    // Base intensity on time of day
    let suggestedIntensity = 50;
    if (timeOfDay === 'morning') suggestedIntensity = 70;
    if (timeOfDay === 'night') suggestedIntensity = 30;
    
    // Adjust for circadian phase
    if (phase === 'resting') suggestedIntensity = Math.max(20, suggestedIntensity - 20);
    if (phase === 'awakening') suggestedIntensity = Math.min(80, suggestedIntensity + 10);
    
    return {
      timeOfDay,
      circadianPhase: phase,
      suggestedMood: mood,
      suggestedIntensity,
      suggestedContrast: timeOfDay === 'night' ? 'low' : 'normal',
      suggestedAnimationSpeed: phase === 'relaxing' || phase === 'resting' ? 'slow' : 'normal'
    };
  }, [getTimeOfDay, getCircadianPhase, getSuggestedMood]);
  
  // Update settings
  const updateSettings = useCallback((newSettings: Partial<CircadianSettings>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  }, []);
  
  return {
    currentTime,
    timeOfDay: getTimeOfDay(),
    circadianPhase: getCircadianPhase(),
    suggestedMood: getSuggestedMood(),
    settings,
    updateSettings,
    getSuggestedSettings
  };
}
