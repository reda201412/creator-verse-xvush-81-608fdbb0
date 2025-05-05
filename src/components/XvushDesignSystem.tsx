
import React, { useEffect, useState } from 'react';
import { useNeuroAesthetic } from '@/hooks/use-neuro-aesthetic';
import { useUserBehavior } from '@/hooks/use-user-behavior';
import { useNeuroML } from '@/hooks/use-neuro-ml';
import { prefersReducedMotion } from '@/lib/utils';
import MicroRewardsEnhanced from './effects/MicroRewardsEnhanced';
import { useToast } from '@/components/ui/use-toast';

interface XvushDesignSystemProps {
  children: React.ReactNode;
  className?: string;
  enableAutoML?: boolean;
}

const XvushDesignSystem: React.FC<XvushDesignSystemProps> = ({
  children,
  className,
  enableAutoML = true
}) => {
  const { config, triggerMicroReward, circadian } = useNeuroAesthetic({
    enableCircadian: true
  });
  const { trackInteraction } = useUserBehavior();
  const { modelState, runAnalysis, applyLatestPrediction } = useNeuroML();
  const { toast } = useToast();
  const [hasShownWelcome, setHasShownWelcome] = useState(false);
  
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
      document.documentElement.removeAttribute('data-time-of-day');
    };
  }, [
    config.cognitiveProfile, 
    config.focusModeEnabled, 
    circadian.timeOfDay,
    circadian.circadianPhase,
    trackInteraction
  ]);
  
  // Welcome experience
  useEffect(() => {
    if (!hasShownWelcome) {
      // Trigger welcome micro-reward after a short delay
      const timer = setTimeout(() => {
        triggerMicroReward('wellbeing', { welcome: true });
        setHasShownWelcome(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [hasShownWelcome, triggerMicroReward]);
  
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
  
  // Auto-apply ML recommendations if enabled and model is trained
  useEffect(() => {
    if (enableAutoML && 
        modelState.initialized && 
        modelState.autoApply && 
        modelState.predictions.length > 0) {
      
      const currentProfile = config.cognitiveProfile;
      const recommendedProfile = modelState.predictions[0].cognitiveProfile;
      
      // Only apply if recommendation is different and confidence is high enough
      if (currentProfile !== recommendedProfile && 
          modelState.predictions[0].confidence > 0.7) {
          
        applyLatestPrediction();
        
        toast({
          title: "Profil cognitif actualisé",
          description: `L'interface a été adaptée à votre profil ${recommendedProfile}.`,
        });
      }
    }
  }, [
    enableAutoML, 
    modelState.initialized, 
    modelState.autoApply, 
    modelState.predictions, 
    config.cognitiveProfile, 
    applyLatestPrediction,
    toast
  ]);
  
  // Run ML analysis periodically if we have enough data
  useEffect(() => {
    if (enableAutoML && !modelState.initialized) {
      // Check every hour if we have enough data for ML analysis
      const checkInterval = setInterval(() => {
        const hasEnoughInteractions = localStorage.getItem('xvush_user_behavior');
        if (hasEnoughInteractions) {
          const behaviorData = JSON.parse(hasEnoughInteractions);
          if (behaviorData.interactionCount > 30) {
            runAnalysis();
            clearInterval(checkInterval);
          }
        }
      }, 60 * 60 * 1000); // Check every hour
      
      return () => clearInterval(checkInterval);
    }
  }, [enableAutoML, modelState.initialized, runAnalysis]);
  
  return (
    <div className={className}>
      {/* Enhanced micro-rewards system */}
      <MicroRewardsEnhanced 
        enable={config.microRewardsEnabled}
        rewardIntensity={config.microRewardsIntensity}
        adaptToContext={config.environmentalAdaptation}
        reducedMotion={prefersReducedMotion()}
      />
      
      {/* Main content */}
      {children}
    </div>
  );
};

export default XvushDesignSystem;
