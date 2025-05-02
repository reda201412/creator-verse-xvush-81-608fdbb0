
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
    // Mobile devices get significantly reduced effects for better performance
    moodIntensity: isMobile ? 30 : 50,
    microRewardsIntensity: isMobile ? 20 : 50,
    fluidityIntensity: isMobile ? 30 : 60,
    fluiditySpeed: isMobile ? 30 : 50,
  });
  
  // Apply design system to the document
  useEffect(() => {
    // Add design system CSS variables and classes
    document.documentElement.classList.add('xvush-design-system');
    
    // Add mobile-specific class if needed
    if (isMobile) {
      document.documentElement.classList.add('xvush-mobile');
    } else {
      document.documentElement.classList.remove('xvush-mobile');
    }
    
    // Clean up when unmounted
    return () => {
      document.documentElement.classList.remove('xvush-design-system');
      document.documentElement.classList.remove('focus-mode');
      document.documentElement.classList.remove('xvush-mobile');
    };
  }, [isMobile]);
  
  return (
    <div className={className}>
      {/* Golden Ratio Grid - disabled on mobile for performance */}
      {!isMobile && (
        <GoldenRatioGrid 
          visible={config.goldenRatioVisible} 
          opacity={0.05} 
        />
      )}
      
      {/* Adaptive Mood Lighting - reduced intensity on mobile */}
      <AdaptiveMoodLighting 
        currentMood={config.adaptiveMood}
        intensity={config.moodIntensity}
        autoAdapt={config.autoAdaptMood}
      />
      
      {/* Micro Rewards - reduced frequency on mobile */}
      <MicroRewards 
        enable={config.microRewardsEnabled && !isMobile}
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
      
      {/* Ambient Soundscapes - disabled by default on mobile to save bandwidth */}
      <AmbientSoundscapes
        enabled={config.ambientSoundsEnabled && !isMobile}
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
