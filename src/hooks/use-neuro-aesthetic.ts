
import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './use-local-storage';

export type CognitiveProfile = 'visual' | 'analytical' | 'balanced' | 'immersive';
export type ContrastLevel = 'low' | 'standard' | 'high';
export type AnimationSpeed = 'reduced' | 'standard' | 'enhanced';
export type AdaptiveMood = 'energetic' | 'calm' | 'creative' | 'focused';
export type MicroRewardType = 
  | 'achievement' 
  | 'discover' 
  | 'progress' 
  | 'wellbeing' 
  | 'opportunity'
  | 'navigate'
  | 'interact'
  | 'tab'
  | 'select'
  | 'action'
  | 'like'
  | 'star'
  | 'message'
  | 'comment'
  | 'award'
  | 'thumbs-up'
  | 'insight'
  | 'goal'
  | 'challenge'
  | 'click'
  | 'creative'
  | 'analyze'
  | 'interaction';

export interface NeuroAestheticConfig {
  cognitiveProfile: CognitiveProfile;
  contrastLevel: ContrastLevel;
  animationSpeed: AnimationSpeed;
  focusModeEnabled: boolean;
  autoAdapt: boolean;
  adaptiveMood: AdaptiveMood;
  moodIntensity: number;
  microRewardsEnabled: boolean;
  microRewardsIntensity: number;
  environmentalAdaptation: boolean;
  goldenRatioVisible?: boolean;
  ambientSoundsEnabled?: boolean;
  ambientVolume?: number;
}

export const defaultConfig: NeuroAestheticConfig = {
  cognitiveProfile: 'balanced',
  contrastLevel: 'standard',
  animationSpeed: 'standard',
  focusModeEnabled: false,
  autoAdapt: true,
  adaptiveMood: 'calm',
  moodIntensity: 50,
  microRewardsEnabled: true,
  microRewardsIntensity: 50,
  environmentalAdaptation: true,
  goldenRatioVisible: false,
  ambientSoundsEnabled: false,
  ambientVolume: 50,
};

interface CircadianState {
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  circadianPhase: 'early' | 'peak' | 'late';
  suggestedMood: AdaptiveMood;
}

// Déplacer cette fonction en dehors du hook pour éviter qu'elle soit recréée à chaque rendu
function getCircadianState(): CircadianState {
  const now = new Date();
  const hour = now.getHours();
  
  let timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  if (hour >= 5 && hour < 12) {
    timeOfDay = 'morning';
  } else if (hour >= 12 && hour < 17) {
    timeOfDay = 'afternoon';
  } else if (hour >= 17 && hour < 22) {
    timeOfDay = 'evening';
  } else {
    timeOfDay = 'night';
  }
  
  let circadianPhase: 'early' | 'peak' | 'late';
  if (hour >= 5 && hour < 9) {
    circadianPhase = 'early';
  } else if (hour >= 9 && hour < 18) {
    circadianPhase = 'peak';
  } else {
    circadianPhase = 'late';
  }
  
  let suggestedMood: AdaptiveMood;
  switch (timeOfDay) {
    case 'morning':
      suggestedMood = 'energetic';
      break;
    case 'afternoon':
      suggestedMood = 'focused';
      break;
    case 'evening':
      suggestedMood = 'calm';
      break;
    case 'night':
      suggestedMood = 'calm';
      break;
    default:
      suggestedMood = 'calm';
  }
  
  return {
    timeOfDay,
    circadianPhase,
    suggestedMood
  };
}

export function useNeuroAesthetic(options: { enableCircadian?: boolean } = {}) {
  const { enableCircadian = true } = options;
  const [config, setConfig] = useLocalStorage<NeuroAestheticConfig>('xvush_aesthetic_config', defaultConfig);
  const [circadian, setCircadian] = useState<CircadianState>(getCircadianState());
  
  // Update config
  const updateConfig = useCallback((newConfig: Partial<NeuroAestheticConfig>) => {
    setConfig(prevConfig => ({ ...prevConfig, ...newConfig }));
  }, [setConfig]);
  
  // Micro-rewards trigger
  const triggerMicroReward = useCallback((type: MicroRewardType, details: any = {}) => {
    if (!config.microRewardsEnabled) return;
    
    // Simulate reward effect
    console.log(`Micro-reward triggered: ${type}`, details);
    
    // Play subtle animation or sound
    // Adjust interface elements slightly
    
    // Log the reward event
    // trackEvent('micro-reward', { type, ...details });
  }, [config.microRewardsEnabled]);
  
  // Circadian rhythm
  useEffect(() => {
    if (!enableCircadian) return;
    
    const updateCircadianState = () => {
      setCircadian(getCircadianState());
    };
    
    updateCircadianState();
    
    const intervalId = setInterval(updateCircadianState, 60 * 60 * 1000); // Update every hour
    
    return () => clearInterval(intervalId);
  }, [enableCircadian]);
  
  return {
    config,
    updateConfig,
    circadian,
    triggerMicroReward
  };
}
