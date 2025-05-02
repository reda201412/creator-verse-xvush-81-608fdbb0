
import { useState, useEffect } from 'react';

interface NeuroAestheticConfig {
  goldenRatioVisible?: boolean;
  adaptiveMood?: 'calm' | 'energetic' | 'mysterious' | 'passionate' | 'creative' | 'focused';
  moodIntensity?: number;
  autoAdaptMood?: boolean;
  microRewardsEnabled?: boolean;
  microRewardsIntensity?: number;
  focusModeEnabled?: boolean;
  ambientSoundsEnabled?: boolean;
  ambientVolume?: number;
  fluidityIntensity?: number;
  fluiditySpeed?: number;
  activeTransitions?: 'fade' | 'slide' | 'zoom' | 'flip' | 'parallax';
  paralaxDepth?: number;
  creatorSignatureStyle?: 'minimal' | 'artistic' | 'elegant' | 'bold' | 'playful';
  creatorSignatureSize?: 'sm' | 'md' | 'lg';
}

export function useNeuroAesthetic(initialConfig?: Partial<NeuroAestheticConfig>) {
  // Default configuration for neuro-aesthetic features
  const defaultConfig: NeuroAestheticConfig = {
    goldenRatioVisible: false,
    adaptiveMood: 'creative',
    moodIntensity: 50,
    autoAdaptMood: true,
    microRewardsEnabled: true,
    microRewardsIntensity: 50,
    focusModeEnabled: false,
    ambientSoundsEnabled: false,
    ambientVolume: 30,
    fluidityIntensity: 60,
    fluiditySpeed: 50,
    activeTransitions: 'zoom',
    paralaxDepth: 50,
    creatorSignatureStyle: 'elegant',
    creatorSignatureSize: 'md',
  };

  // Merge default and initial configs
  const [config, setConfig] = useState<NeuroAestheticConfig>({
    ...defaultConfig,
    ...initialConfig
  });
  
  // Detect user preferences
  useEffect(() => {
    const detectPreferences = () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      if (prefersReducedMotion) {
        setConfig(prev => ({
          ...prev,
          microRewardsEnabled: false,
          ambientSoundsEnabled: false,
          fluiditySpeed: 20,
          activeTransitions: 'fade',
          fluidityIntensity: 20
        }));
      }
      
      const prefersLightMode = window.matchMedia('(prefers-color-scheme: light)').matches;
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      if (prefersDarkMode) {
        setConfig(prev => ({
          ...prev,
          adaptiveMood: 'mysterious',
          moodIntensity: 60
        }));
      }
    };
    
    detectPreferences();
  }, []);
  
  const updateConfig = (newConfig: Partial<NeuroAestheticConfig>) => {
    setConfig(prev => ({
      ...prev,
      ...newConfig
    }));
  };
  
  const toggleGoldenRatio = () => {
    setConfig(prev => ({
      ...prev,
      goldenRatioVisible: !prev.goldenRatioVisible
    }));
  };
  
  const toggleFocusMode = () => {
    setConfig(prev => ({
      ...prev,
      focusModeEnabled: !prev.focusModeEnabled
    }));
  };
  
  const toggleAmbientSounds = () => {
    setConfig(prev => ({
      ...prev,
      ambientSoundsEnabled: !prev.ambientSoundsEnabled
    }));
  };
  
  const setMood = (mood: NeuroAestheticConfig['adaptiveMood']) => {
    setConfig(prev => ({
      ...prev,
      adaptiveMood: mood
    }));
  };
  
  // Get transition props for a specific element
  const getTransitionProps = (customConfig?: Partial<NeuroAestheticConfig>) => {
    const mergedConfig = { ...config, ...customConfig };
    
    return {
      type: mergedConfig.activeTransitions,
      duration: 0.5,
      isActive: true
    };
  };
  
  // Get parallax layer props
  const getParallaxProps = (customConfig?: Partial<NeuroAestheticConfig>) => {
    const mergedConfig = { ...config, ...customConfig };
    
    return {
      sensitivity: mergedConfig.paralaxDepth ? mergedConfig.paralaxDepth / 100 : 0.5,
      mouseParallax: true,
      scrollParallax: true
    };
  };
  
  // Get fluidity container props
  const getFluidityProps = (customConfig?: Partial<NeuroAestheticConfig>) => {
    const mergedConfig = { ...config, ...customConfig };
    
    return {
      intensity: mergedConfig.fluidityIntensity || 60,
      speed: mergedConfig.fluiditySpeed || 50,
      interactive: true,
      animated: true
    };
  };
  
  return {
    config,
    updateConfig,
    toggleGoldenRatio,
    toggleFocusMode,
    toggleAmbientSounds,
    setMood,
    getTransitionProps,
    getParallaxProps,
    getFluidityProps
  };
}
