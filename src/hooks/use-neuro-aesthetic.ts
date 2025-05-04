
import { useState, useCallback } from 'react';

interface NeuroAestheticConfig {
  focusModeEnabled: boolean;
  ambientSoundsEnabled: boolean;
  ambientVolume: number;
  adaptiveMood: 'energetic' | 'calm' | 'creative' | 'focused';
  moodIntensity: number;
  microRewardsEnabled: boolean;
  microRewardsIntensity: number;
  goldenRatioVisible: boolean;
  autoAdaptMood?: boolean;
  fluidityIntensity?: number;
  fluiditySpeed?: number;
}

export type RewardType = 'like' | 'tab' | 'action' | 'opportunity' | 'click' | 'navigate' | 'analyze' | 'select' | 'wellbeing';

interface UseNeuroAestheticProps {
  initialConfig?: Partial<NeuroAestheticConfig>;
  moodIntensity?: number;
  microRewardsIntensity?: number;
  fluidityIntensity?: number;
  fluiditySpeed?: number;
}

const defaultInitialConfig: NeuroAestheticConfig = {
  focusModeEnabled: false,
  ambientSoundsEnabled: false,
  ambientVolume: 50,
  adaptiveMood: 'calm',
  moodIntensity: 50,
  microRewardsEnabled: true,
  microRewardsIntensity: 50,
  goldenRatioVisible: false,
  autoAdaptMood: false,
  fluidityIntensity: 50,
  fluiditySpeed: 50,
};

export const useNeuroAesthetic = ({ initialConfig, moodIntensity, microRewardsIntensity, fluidityIntensity, fluiditySpeed }: UseNeuroAestheticProps = {}) => {
  const [config, setConfig] = useState<NeuroAestheticConfig>({
    ...defaultInitialConfig,
    moodIntensity: moodIntensity !== undefined ? moodIntensity : defaultInitialConfig.moodIntensity,
    microRewardsIntensity: microRewardsIntensity !== undefined ? microRewardsIntensity : defaultInitialConfig.microRewardsIntensity,
    fluidityIntensity: fluidityIntensity !== undefined ? fluidityIntensity : defaultInitialConfig.fluidityIntensity,
    fluiditySpeed: fluiditySpeed !== undefined ? fluiditySpeed : defaultInitialConfig.fluiditySpeed,
    ...initialConfig,
  });

  const updateConfig = useCallback((newConfig: Partial<NeuroAestheticConfig>) => {
    setConfig(currentConfig => ({
      ...currentConfig,
      ...newConfig,
    }));
  }, []);

  const triggerMicroReward = useCallback((rewardType: RewardType) => {
    if (!config.microRewardsEnabled) return;

    const event = new CustomEvent('xvush:micro-reward', {
      detail: {
        type: rewardType,
        intensity: config.microRewardsIntensity,
      },
    });
    document.dispatchEvent(event);
  }, [config.microRewardsEnabled, config.microRewardsIntensity]);

  const toggleFocusMode = useCallback(() => {
    updateConfig({ focusModeEnabled: !config.focusModeEnabled });
  }, [config.focusModeEnabled, updateConfig]);

  const toggleAmbientSounds = useCallback(() => {
    updateConfig({ ambientSoundsEnabled: !config.ambientSoundsEnabled });
  }, [config.ambientSoundsEnabled, updateConfig]);

  return {
    config,
    updateConfig,
    triggerMicroReward,
    toggleFocusMode,
    toggleAmbientSounds
  };
};
