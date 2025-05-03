
import { useState, useEffect, useRef } from 'react';

type NeuroAestheticConfig = {
  goldenRatioVisible: boolean;
  adaptiveMood: 'energetic' | 'calm' | 'creative' | 'focused';
  autoAdaptMood: boolean;
  moodIntensity: number; // 0-100
  microRewardsEnabled: boolean;
  microRewardsIntensity: number; // 0-100
  fluidityIntensity: number; // 0-100
  fluiditySpeed: number; // 0-100
  focusModeEnabled: boolean;
  ambientSoundsEnabled: boolean;
  ambientVolume: number; // 0-100
};

interface UseNeuroAestheticOptions {
  moodIntensity?: number;
  microRewardsIntensity?: number;
  fluidityIntensity?: number;
  fluiditySpeed?: number;
}

export const useNeuroAesthetic = (options?: UseNeuroAestheticOptions) => {
  const [config, setConfig] = useState<NeuroAestheticConfig>({
    goldenRatioVisible: false,
    adaptiveMood: 'creative',
    autoAdaptMood: true,
    moodIntensity: options?.moodIntensity ?? 50,
    microRewardsEnabled: true,
    microRewardsIntensity: options?.microRewardsIntensity ?? 50,
    fluidityIntensity: options?.fluidityIntensity ?? 50,
    fluiditySpeed: options?.fluiditySpeed ?? 50,
    focusModeEnabled: false,
    ambientSoundsEnabled: false,
    ambientVolume: 30,
  });
  
  const userInteractionCount = useRef(0);
  const lastMoodChange = useRef(Date.now());
  
  // Toggle focus mode
  const toggleFocusMode = () => {
    setConfig(prev => ({
      ...prev,
      focusModeEnabled: !prev.focusModeEnabled
    }));
    
    // When enabling focus mode, also enable ambient sounds if they aren't already
    if (!config.focusModeEnabled && !config.ambientSoundsEnabled) {
      setConfig(prev => ({
        ...prev,
        ambientSoundsEnabled: true
      }));
    }
  };
  
  // Toggle ambient sounds
  const toggleAmbientSounds = () => {
    setConfig(prev => ({
      ...prev,
      ambientSoundsEnabled: !prev.ambientSoundsEnabled
    }));
  };
  
  // Update any config option
  const updateConfig = (updates: Partial<NeuroAestheticConfig>) => {
    setConfig(prev => ({
      ...prev,
      ...updates
    }));
  };
  
  // Trigger a microreward
  const triggerMicroReward = (type: 'like' | 'view' | 'comment' | 'subscribe') => {
    // We'll implement this in a separate component
    console.log(`Micro reward triggered: ${type}`);
    userInteractionCount.current += 1;
    
    // Maybe change mood after certain number of interactions
    if (config.autoAdaptMood && userInteractionCount.current % 10 === 0) {
      const now = Date.now();
      // Only change mood if at least 2 minutes have passed since last change
      if (now - lastMoodChange.current > 120000) {
        const moods: Array<NeuroAestheticConfig['adaptiveMood']> = ['energetic', 'calm', 'creative', 'focused'];
        const currentIndex = moods.indexOf(config.adaptiveMood);
        const nextIndex = (currentIndex + 1) % moods.length;
        
        setConfig(prev => ({
          ...prev,
          adaptiveMood: moods[nextIndex]
        }));
        
        lastMoodChange.current = now;
      }
    }
  };
  
  // Apply time-of-day adaptive mood if enabled
  useEffect(() => {
    if (!config.autoAdaptMood) return;
    
    const setMoodByTimeOfDay = () => {
      const hour = new Date().getHours();
      
      if (hour >= 5 && hour < 10) {
        // Morning: Energetic
        setConfig(prev => ({ ...prev, adaptiveMood: 'energetic' }));
      } else if (hour >= 10 && hour < 15) {
        // Midday: Focused
        setConfig(prev => ({ ...prev, adaptiveMood: 'focused' }));
      } else if (hour >= 15 && hour < 20) {
        // Evening: Creative
        setConfig(prev => ({ ...prev, adaptiveMood: 'creative' }));
      } else {
        // Night: Calm
        setConfig(prev => ({ ...prev, adaptiveMood: 'calm' }));
      }
    };
    
    // Set initial mood based on time
    setMoodByTimeOfDay();
    
    // Update mood every hour
    const intervalId = setInterval(setMoodByTimeOfDay, 3600000);
    
    return () => clearInterval(intervalId);
  }, [config.autoAdaptMood]);
  
  return {
    config,
    updateConfig,
    triggerMicroReward,
    toggleFocusMode,
    toggleAmbientSounds,
  };
};
