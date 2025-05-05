
import { useCallback, useState, useEffect } from 'react';
import { useCircadianRhythm } from './use-circadian-rhythm';

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
  | 'wellbeing'
  | 'insight'
  | 'goal'
  | 'challenge'
  | 'creative';

// Default configuration values
const defaultConfig = {
  adaptiveMood: 'calm' as 'energetic' | 'calm' | 'creative' | 'focused',
  moodIntensity: 50,
  microRewardsEnabled: true,
  microRewardsIntensity: 50,
  focusModeEnabled: false,
  ambientSoundsEnabled: false,
  ambientVolume: 30,
  goldenRatioVisible: false,
  autoAdapt: true,
  cognitiveProfile: 'balanced' as 'visual' | 'analytical' | 'balanced' | 'immersive',
  contrastLevel: 'standard' as 'low' | 'standard' | 'high',
  animationSpeed: 'standard' as 'reduced' | 'standard' | 'enhanced',
  environmentalAdaptation: true,
  colorSensitivity: 'standard' as 'reduced' | 'standard' | 'enhanced'
};

// Interface for configuration
export interface NeuroAestheticConfig {
  adaptiveMood?: 'energetic' | 'calm' | 'creative' | 'focused';
  moodIntensity?: number;
  microRewardsEnabled?: boolean;
  microRewardsIntensity?: number;
  focusModeEnabled?: boolean;
  ambientSoundsEnabled?: boolean;
  ambientVolume?: number;
  goldenRatioVisible?: boolean;
  autoAdapt?: boolean;
  cognitiveProfile?: 'visual' | 'analytical' | 'balanced' | 'immersive';
  contrastLevel?: 'low' | 'standard' | 'high';
  animationSpeed?: 'reduced' | 'standard' | 'enhanced';
  environmentalAdaptation?: boolean;
  colorSensitivity?: 'reduced' | 'standard' | 'enhanced';
}

// Add initial configuration option
interface UseNeuroAestheticOptions {
  moodIntensity?: number;
  microRewardsIntensity?: number;
  initialConfig?: Partial<NeuroAestheticConfig>;
  enableCircadian?: boolean;
}

export function useNeuroAesthetic(options: UseNeuroAestheticOptions = {}) {
  const enableCircadian = options.enableCircadian ?? true;
  
  // Initialize with default config and any provided options
  const initialConfig = {
    ...defaultConfig,
    moodIntensity: options.moodIntensity || defaultConfig.moodIntensity,
    microRewardsIntensity: options.microRewardsIntensity || defaultConfig.microRewardsIntensity,
    ...options.initialConfig
  };

  const [config, setConfig] = useState<NeuroAestheticConfig>(initialConfig);
  
  // Get circadian rhythm suggestions
  const circadian = useCircadianRhythm({
    defaultSettings: {
      enableAdaptation: config.autoAdapt ?? true
    }
  });
  
  // Apply circadian adaptations if enabled
  useEffect(() => {
    if (!enableCircadian || !config.autoAdapt) return;
    
    const suggestions = circadian.getSuggestedSettings();
    
    // Only update if in auto adapt mode
    if (config.autoAdapt) {
      setConfig(prev => {
        // Don't update if user has manually set these recently
        const updatedConfig: Partial<NeuroAestheticConfig> = {};
        
        updatedConfig.adaptiveMood = suggestions.suggestedMood;
        
        // Adjust intensity based on time of day
        if (suggestions.timeOfDay === 'night') {
          updatedConfig.moodIntensity = Math.min(prev.moodIntensity || 50, 40);
          updatedConfig.microRewardsIntensity = Math.min(prev.microRewardsIntensity || 50, 30);
        } else if (suggestions.timeOfDay === 'morning') {
          updatedConfig.moodIntensity = Math.max(prev.moodIntensity || 50, 60);
        }
        
        // Adjust animation and contrast based on circadian phase
        if (suggestions.circadianPhase === 'resting') {
          updatedConfig.contrastLevel = 'low';
          updatedConfig.animationSpeed = 'reduced';
        } else if (suggestions.circadianPhase === 'focused') {
          updatedConfig.contrastLevel = 'high';
        }
        
        return {
          ...prev,
          ...updatedConfig
        };
      });
    }
  }, [circadian, config.autoAdapt, enableCircadian]);

  const triggerMicroReward = useCallback((type: MicroRewardType, metadata?: any) => {
    if (!config.microRewardsEnabled) return;
    
    const eventName = `xvush:${type}`;
    document.dispatchEvent(new Event(eventName));
    
    // Also trigger generic micro-reward event with additional details
    const customEvent = new CustomEvent('xvush:micro-reward', {
      detail: { 
        type,
        intensity: config.microRewardsIntensity,
        timestamp: new Date(),
        metadata
      }
    });
    document.dispatchEvent(customEvent);
    
    // Optionally trigger haptic feedback if available
    if ('vibrate' in navigator) {
      try {
        // Very gentle vibration
        navigator.vibrate(10);
      } catch (e) {
        // Some browsers throw if vibration is not supported
      }
    }
  }, [config.microRewardsEnabled, config.microRewardsIntensity]);

  const updateConfig = useCallback((newConfig: Partial<NeuroAestheticConfig>) => {
    setConfig(prevConfig => ({
      ...prevConfig,
      ...newConfig
    }));
  }, []);
  
  // Get CSS variables for the current configuration
  const getCssVariables = useCallback(() => {
    const variables: Record<string, string> = {};
    
    // Set mood colors
    if (config.adaptiveMood === 'energetic') {
      variables['--mood-primary'] = 'hsl(15, 95%, 65%)';
      variables['--mood-secondary'] = 'hsl(42, 95%, 65%)';
      variables['--mood-accent'] = 'hsl(28, 95%, 65%)';
    } else if (config.adaptiveMood === 'calm') {
      variables['--mood-primary'] = 'hsl(195, 70%, 60%)';
      variables['--mood-secondary'] = 'hsl(215, 70%, 65%)';
      variables['--mood-accent'] = 'hsl(185, 70%, 60%)';
    } else if (config.adaptiveMood === 'creative') {
      variables['--mood-primary'] = 'hsl(265, 80%, 65%)';
      variables['--mood-secondary'] = 'hsl(325, 80%, 65%)';
      variables['--mood-accent'] = 'hsl(285, 80%, 65%)';
    } else if (config.adaptiveMood === 'focused') {
      variables['--mood-primary'] = 'hsl(220, 70%, 55%)';
      variables['--mood-secondary'] = 'hsl(240, 70%, 60%)';
      variables['--mood-accent'] = 'hsl(200, 70%, 55%)';
    }
    
    // Set intensity
    variables['--mood-intensity'] = `${config.moodIntensity}%`;
    variables['--micro-rewards-intensity'] = `${config.microRewardsIntensity}%`;
    
    // Set contrast
    if (config.contrastLevel === 'low') {
      variables['--contrast-multiplier'] = '0.8';
    } else if (config.contrastLevel === 'high') {
      variables['--contrast-multiplier'] = '1.2';
    } else {
      variables['--contrast-multiplier'] = '1';
    }
    
    // Set animation speed
    if (config.animationSpeed === 'reduced') {
      variables['--animation-multiplier'] = '1.5';  // slower
    } else if (config.animationSpeed === 'enhanced') {
      variables['--animation-multiplier'] = '0.7';  // faster
    } else {
      variables['--animation-multiplier'] = '1';    // standard
    }
    
    return variables;
  }, [config]);
  
  // Apply CSS variables to document root
  useEffect(() => {
    const variables = getCssVariables();
    const root = document.documentElement;
    
    Object.entries(variables).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    
    // Add class for cognitive profile
    if (config.cognitiveProfile) {
      root.classList.remove('cognitive-visual', 'cognitive-analytical', 'cognitive-balanced', 'cognitive-immersive');
      root.classList.add(`cognitive-${config.cognitiveProfile}`);
    }
    
    // Cleanup
    return () => {
      Object.keys(variables).forEach(key => {
        root.style.removeProperty(key);
      });
      root.classList.remove('cognitive-visual', 'cognitive-analytical', 'cognitive-balanced', 'cognitive-immersive');
    };
  }, [getCssVariables, config.cognitiveProfile]);

  return { 
    config, 
    updateConfig, 
    triggerMicroReward,
    getCssVariables,
    circadian
  };
}
