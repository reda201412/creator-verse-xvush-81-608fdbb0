
import { useNeuroAesthetic } from '@/hooks/use-neuro-aesthetic';

// Create a type-safe wrapper for the useNeuroAesthetic hook's triggerMicroReward function
export function useMicroRewards() {
  const { triggerMicroReward } = useNeuroAesthetic();
  
  // Type-safe reward trigger functions
  const triggerMediaReward = (details?: any) => {
    triggerMicroReward('action', { type: 'media_interaction', ...details });
  };
  
  const triggerNavigationReward = (details?: any) => {
    triggerMicroReward('navigate', { ...details });
  };
  
  const triggerGestureReward = (details?: any) => {
    triggerMicroReward('action', { type: 'gesture_performed', ...details });
  };
  
  const triggerMilestoneReward = (progress: number) => {
    triggerMicroReward('action', { 
      type: 'video_progress', 
      progress 
    });
  };
  
  return {
    triggerMediaReward,
    triggerNavigationReward,
    triggerGestureReward,
    triggerMilestoneReward
  };
}
