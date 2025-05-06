
import React, { useEffect } from 'react';
import { useNeuroAesthetic } from '@/hooks/use-neuro-aesthetic';
import { prefersReducedMotion } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

// Déclaration des hooks factices pour éviter les erreurs
// Ces hooks seraient normalement importés
const useUserBehavior = () => ({
  trackInteraction: (type: string, details: any) => console.log(type, details),
});

const useNeuroML = () => ({
  modelState: {
    initialized: false,
    autoApply: false,
    predictions: []
  },
  runAnalysis: () => {},
  applyLatestPrediction: () => {}
});

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
  const [hasShownWelcome, setHasShownWelcome] = React.useState(false);
  
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
    
    // Ajouter des écouteurs d'événements pour les retours haptiques
    const addHapticFeedbackToInteractiveElements = () => {
      const interactiveElements = document.querySelectorAll('button, a, [role="button"]');
      
      interactiveElements.forEach(element => {
        element.addEventListener('click', () => {
          if ('vibrate' in navigator) {
            navigator.vibrate(10); // Légère vibration
          }
        });
      });
    };
    
    // Appliquer les retours haptiques après un court délai pour laisser le DOM se construire
    setTimeout(addHapticFeedbackToInteractiveElements, 1000);
    
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
      // Trigger welcome haptic feedback after a short delay
      const timer = setTimeout(() => {
        if ('vibrate' in navigator) {
          navigator.vibrate([20, 50, 20]); // Séquence de bienvenue subtile
        }
        setHasShownWelcome(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [hasShownWelcome]);
  
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
      const recommendedProfile = modelState.predictions[0]?.cognitiveProfile;
      
      // Only apply if recommendation is different and confidence is high enough
      if (recommendedProfile && 
          currentProfile !== recommendedProfile && 
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
        try {
          const hasEnoughInteractions = localStorage.getItem('xvush_user_behavior');
          if (hasEnoughInteractions) {
            const behaviorData = JSON.parse(hasEnoughInteractions);
            if (behaviorData.interactionCount > 30) {
              runAnalysis();
              clearInterval(checkInterval);
            }
          }
        } catch (error) {
          console.error("Error checking user behavior data", error);
        }
      }, 60 * 60 * 1000); // Check every hour
      
      return () => clearInterval(checkInterval);
    }
    return undefined;
  }, [enableAutoML, modelState.initialized, runAnalysis]);
  
  return (
    <div className={className}>
      {/* Main content */}
      {children}
    </div>
  );
};

export default XvushDesignSystem;
