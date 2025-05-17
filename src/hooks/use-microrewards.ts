
import { useNeuroAesthetic } from '@/hooks/use-neuro-aesthetic';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';
import { useState, useCallback, useEffect } from 'react';

// Define reward intensity levels
export type RewardIntensity = 'subtle' | 'medium' | 'strong';

// Define reward categories for more structured tracking
export type RewardCategory = 
  | 'engagement'
  | 'progress'
  | 'achievement'
  | 'discovery'
  | 'social'
  | 'creation';

// Interaction types that can trigger rewards
export type InteractionType = 
  | 'click'
  | 'view'
  | 'scroll'
  | 'complete'
  | 'create'
  | 'share'
  | 'like'
  | 'media_interaction'
  | 'purchase';

// Create a type-safe wrapper for the useNeuroAesthetic hook's triggerMicroReward function
export function useMicroRewards() {
  const { triggerMicroReward } = useNeuroAesthetic();
  const { triggerHaptic } = useHapticFeedback();
  const [rewardSettings, setRewardSettings] = useState({
    intensity: 'medium' as RewardIntensity,
    hapticEnabled: true,
    visualEnabled: true,
    soundEnabled: false,
    frequency: 0.8 // 0-1 scale, how often should rewards trigger
  });
  
  // Session reward counts - for throttling excessive rewards
  const [sessionRewards, setSessionRewards] = useState<Record<string, number>>({});
  
  // Reset session rewards periodically
  useEffect(() => {
    const intervalId = setInterval(() => {
      setSessionRewards({});
    }, 60 * 1000); // Reset every minute
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Generic reward trigger with throttling
  const triggerReward = useCallback((
    category: RewardCategory,
    interaction: InteractionType,
    details?: any,
    intensity?: RewardIntensity
  ) => {
    const rewardKey = `${category}-${interaction}`;
    const currentCount = sessionRewards[rewardKey] || 0;
    
    // Apply throttling logic
    if (Math.random() > rewardSettings.frequency || currentCount > 5) {
      return; // Skip this reward due to frequency settings or throttling
    }
    
    // Update session counts
    setSessionRewards(prev => ({
      ...prev,
      [rewardKey]: currentCount + 1
    }));
    
    // Apply intensity
    const actualIntensity = intensity || rewardSettings.intensity;
    
    // Haptic feedback based on intensity
    if (rewardSettings.hapticEnabled) {
      switch (actualIntensity) {
        case 'subtle':
          triggerHaptic('light');
          break;
        case 'medium':
          triggerHaptic('medium');
          break;
        case 'strong':
          triggerHaptic('strong');
          break;
      }
    }
    
    // Track the reward via neuro-aesthetic system
    const rewardTypeMap: Record<InteractionType, any> = {
      'click': 'click',
      'view': 'discover',
      'scroll': 'navigate',
      'complete': 'achievement',
      'create': 'creative',
      'share': 'opportunity',
      'like': 'like',
      'media_interaction': 'interact',
      'purchase': 'award'
    };
    
    const rewardType = rewardTypeMap[interaction] || 'action';
    triggerMicroReward(rewardType, { 
      category,
      interaction,
      intensity: actualIntensity,
      ...details 
    });
  }, [triggerMicroReward, triggerHaptic, rewardSettings, sessionRewards]);
  
  // Type-safe reward trigger functions
  const triggerMediaReward = useCallback((details?: any) => {
    triggerReward('engagement', 'media_interaction', details);
  }, [triggerReward]);
  
  const triggerNavigationReward = useCallback((details?: any) => {
    triggerReward('engagement', 'click', { type: 'navigation', ...details });
  }, [triggerReward]);
  
  const triggerGestureReward = useCallback((details?: any) => {
    triggerReward('engagement', 'media_interaction', { type: 'gesture', ...details });
  }, [triggerReward]);
  
  const triggerMilestoneReward = useCallback((progress: number) => {
    triggerReward('progress', 'complete', { 
      progress,
      milestone: progress >= 100
    }, progress >= 100 ? 'strong' : 'medium');
  }, [triggerReward]);
  
  const triggerCreationReward = useCallback((details?: any) => {
    triggerReward('creation', 'create', details, 'strong');
  }, [triggerReward]);
  
  const updateSettings = useCallback((settings: Partial<typeof rewardSettings>) => {
    setRewardSettings(prev => ({
      ...prev,
      ...settings
    }));
  }, []);
  
  return {
    triggerMediaReward,
    triggerNavigationReward,
    triggerGestureReward,
    triggerMilestoneReward,
    triggerCreationReward,
    triggerReward,
    rewardSettings,
    updateSettings
  };
}
