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
}

interface UseNeuroAestheticProps {
  initialConfig?: Partial<NeuroAestheticConfig>;
  moodIntensity?: number;
  microRewardsIntensity?: number;
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
};

export const useNeuroAesthetic = ({ initialConfig, moodIntensity, microRewardsIntensity }: UseNeuroAestheticProps = {}) => {
  const [config, setConfig] = useState<NeuroAestheticConfig>({
    ...defaultInitialConfig,
    moodIntensity: moodIntensity !== undefined ? moodIntensity : defaultInitialConfig.moodIntensity,
    microRewardsIntensity: microRewardsIntensity !== undefined ? microRewardsIntensity : defaultInitialConfig.microRewardsIntensity,
    ...initialConfig,
  });

  const updateConfig = useCallback((newConfig: Partial<NeuroAestheticConfig>) => {
    setConfig(currentConfig => ({
      ...currentConfig,
      ...newConfig,
    }));
  }, []);

  const triggerMicroReward = useCallback((rewardType: 'like' | 'tab' | 'action') => {
    if (!config.microRewardsEnabled) return;

    const event = new CustomEvent('xvush:micro-reward', {
      detail: {
        type: rewardType,
        intensity: config.microRewardsIntensity,
      },
    });
    document.dispatchEvent(event);
  }, [config.microRewardsEnabled, config.microRewardsIntensity]);

  return {
    config,
    updateConfig,
    triggerMicroReward,
  };
};
