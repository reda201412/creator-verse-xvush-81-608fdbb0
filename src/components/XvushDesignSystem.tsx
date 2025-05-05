
import React, { useEffect } from 'react';
import { useNeuroAesthetic } from '@/hooks/use-neuro-aesthetic';
import { useUserBehavior } from '@/hooks/use-user-behavior';
import { prefersReducedMotion } from '@/lib/utils';

interface XvushDesignSystemProps {
  children: React.ReactNode;
  className?: string;
}

const XvushDesignSystem: React.FC<XvushDesignSystemProps> = ({
  children,
  className
}) => {
  const { config, triggerMicroReward, circadian } = useNeuroAesthetic({
    enableCircadian: true
  });
  const { trackInteraction } = useUserBehavior();
  
  // Apply design system to the document
  useEffect(() => {
    // Add design system CSS variables and classes
    document.documentElement.classList.add('xvush-design-system');
    
    // Add cognitive profile class if available
    if (config.cognitiveProfile) {
      document.documentElement.classList.add(`cognitive-${config.cognitiveProfile}`);
    }
    
    // Add time of day data attribute for circadian adjustments
    document.documentElement.setAttribute('data-time-of-day', circadian.timeOfDay);
    
    // Add mobile class if needed
    if (window.innerWidth < 768) {
      document.documentElement.classList.add('xvush-mobile');
    }
    
    // Add reduced motion if user prefers
    if (prefersReducedMotion()) {
      document.documentElement.classList.add('xvush-reduced-motion');
    }
    
    // Add focus mode if enabled
    if (config.focusModeEnabled) {
      document.documentElement.classList.add('focus-mode');
    } else {
      document.documentElement.classList.remove('focus-mode');
    }
    
    // Track system init
    trackInteraction('analyze', { 
      system: 'xvush-design-system', 
      timeOfDay: circadian.timeOfDay,
      circadianPhase: circadian.circadianPhase
    });
    
    // Trigger welcome micro-reward after a short delay
    const timer = setTimeout(() => {
      triggerMicroReward('wellbeing', { welcome: true });
    }, 2000);
    
    // Clean up when unmounted
    return () => {
      document.documentElement.classList.remove(
        'xvush-design-system',
        'focus-mode',
        'xvush-mobile',
        'xvush-reduced-motion',
        'cognitive-visual',
        'cognitive-analytical',
        'cognitive-balanced',
        'cognitive-immersive'
      );
      document.removeAttribute('data-time-of-day');
      clearTimeout(timer);
    };
  }, [
    config.cognitiveProfile, 
    config.focusModeEnabled, 
    circadian.timeOfDay,
    circadian.circadianPhase,
    triggerMicroReward,
    trackInteraction
  ]);
  
  // Update focus mode class when it changes
  useEffect(() => {
    if (config.focusModeEnabled) {
      document.documentElement.classList.add('focus-mode');
    } else {
      document.documentElement.classList.remove('focus-mode');
    }
  }, [config.focusModeEnabled]);
  
  // Update cognitive profile class when it changes
  useEffect(() => {
    document.documentElement.classList.remove(
      'cognitive-visual',
      'cognitive-analytical',
      'cognitive-balanced', 
      'cognitive-immersive'
    );
    
    if (config.cognitiveProfile) {
      document.documentElement.classList.add(`cognitive-${config.cognitiveProfile}`);
    }
  }, [config.cognitiveProfile]);
  
  // Update time of day attribute when it changes
  useEffect(() => {
    document.documentElement.setAttribute('data-time-of-day', circadian.timeOfDay);
  }, [circadian.timeOfDay]);
  
  return (
    <div className={className}>
      {/* Main content */}
      {children}
    </div>
  );
};

export default XvushDesignSystem;
