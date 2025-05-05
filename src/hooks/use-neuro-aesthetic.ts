
import { useCallback, useState } from 'react';

// Expanded MicroRewardType to include all the types being used in the codebase
export type MicroRewardType = 
  | 'action' 
  | 'opportunity' 
  | 'navigate' 
  | 'interaction'
  | 'like'
  | 'click'
  | 'tab'
  | 'select'
  | 'analyze'
  | 'wellbeing';

// Default configuration values
const defaultConfig = {
  adaptiveMood: 'calm' as 'energetic' | 'calm' | 'creative' | 'focused',
  moodIntensity: 50,
  microRewardsEnabled: true,
  microRewardsIntensity: 50,
  focusModeEnabled: false,
  ambientSoundsEnabled: false,
  ambientVolume: 30,
  goldenRatioVisible: false
};

// Interface for configuration
interface NeuroAestheticConfig {
  adaptiveMood?: 'energetic' | 'calm' | 'creative' | 'focused';
  moodIntensity?: number;
  microRewardsEnabled?: boolean;
  microRewardsIntensity?: number;
  focusModeEnabled?: boolean;
  ambientSoundsEnabled?: boolean;
  ambientVolume?: number;
  goldenRatioVisible?: boolean;
}

// Add initial configuration option
interface UseNeuroAestheticOptions {
  moodIntensity?: number;
  microRewardsIntensity?: number;
  initialConfig?: Partial<NeuroAestheticConfig>;
}

export function useNeuroAesthetic(options: UseNeuroAestheticOptions = {}) {
  // Initialize with default config and any provided options
  const initialConfig = {
    ...defaultConfig,
    moodIntensity: options.moodIntensity || defaultConfig.moodIntensity,
    microRewardsIntensity: options.microRewardsIntensity || defaultConfig.microRewardsIntensity,
    ...options.initialConfig
  };

  const [config, setConfig] = useState<NeuroAestheticConfig>(initialConfig);

  const triggerMicroReward = useCallback((type: MicroRewardType) => {
    const eventName = `xvush:${type}`;
    document.dispatchEvent(new Event(eventName));
    
    // Also trigger generic micro-reward event
    const customEvent = new CustomEvent('xvush:micro-reward', {
      detail: { type }
    });
    document.dispatchEvent(customEvent);
  }, []);

  const updateConfig = useCallback((newConfig: Partial<NeuroAestheticConfig>) => {
    setConfig(prevConfig => ({
      ...prevConfig,
      ...newConfig
    }));
  }, []);

  return { 
    config, 
    updateConfig, 
    triggerMicroReward 
  };
}
