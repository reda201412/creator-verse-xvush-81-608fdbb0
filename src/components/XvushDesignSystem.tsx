
import React, { useEffect } from 'react';
import { useNeuroAesthetic } from '@/hooks/use-neuro-aesthetic';
import GoldenRatioGrid from '@/components/neuro-aesthetic/GoldenRatioGrid';
import AdaptiveMoodLighting from '@/components/neuro-aesthetic/AdaptiveMoodLighting';
import MicroRewards from '@/components/effects/MicroRewards';
import FocusMode from '@/components/ambient/FocusMode';
import AmbientSoundscapes from '@/components/ambient/AmbientSoundscapes';
import { useIsMobile } from '@/hooks/use-mobile';

interface XvushDesignSystemProps {
  children: React.ReactNode;
  className?: string;
}

const XvushDesignSystem: React.FC<XvushDesignSystemProps> = ({
  children,
  className
}) => {
  const isMobile = useIsMobile();
  const { 
    config, 
    updateConfig, 
    toggleFocusMode,
    toggleAmbientSounds
  } = useNeuroAesthetic({
    // Mobile devices get slightly reduced effects
    moodIntensity: isMobile ? 40 : 50,
    microRewardsIntensity: isMobile ? 40 : 50,
    fluidityIntensity: isMobile ? 50 : 60,
    fluiditySpeed: isMobile ? 40 : 50,
  });
  
  // Apply design system to the document
  useEffect(() => {
    // Add design system CSS variables and classes
    document.documentElement.classList.add('xvush-design-system');
    
    // Clean up when unmounted
    return () => {
      document.documentElement.classList.remove('xvush-design-system');
      document.documentElement.classList.remove('focus-mode');
    };
  }, []);
  
  return (
    <div className={className}>
      {/* Golden Ratio Grid */}
      <GoldenRatioGrid 
        visible={config.goldenRatioVisible} 
        opacity={0.05} 
      />
      
      {/* Adaptive Mood Lighting */}
      <AdaptiveMoodLighting 
        currentMood={config.adaptiveMood}
        intensity={config.moodIntensity}
        autoAdapt={config.autoAdaptMood}
      />
      
      {/* Micro Rewards */}
      <MicroRewards 
        enable={config.microRewardsEnabled}
        rewardIntensity={config.microRewardsIntensity}
        triggerPoints={['like', 'view', 'scroll']}
      />
      
      {/* Focus Mode */}
      <FocusMode 
        enabled={config.focusModeEnabled}
        onToggle={toggleFocusMode}
        ambientSoundsEnabled={config.ambientSoundsEnabled}
        onAmbientSoundsToggle={toggleAmbientSounds}
      />
      
      {/* Ambient Soundscapes */}
      <AmbientSoundscapes
        enabled={config.ambientSoundsEnabled}
        volume={config.ambientVolume}
        onVolumeChange={(volume) => updateConfig({ ambientVolume: volume })}
        autoAdapt={config.autoAdaptMood}
      />
      
      {/* Main content */}
      {children}
    </div>
  );
};

export default XvushDesignSystem;
