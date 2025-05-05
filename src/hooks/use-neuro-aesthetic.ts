
import { useCallback } from 'react';

type MicroRewardType = 'action' | 'opportunity' | 'navigate' | 'interaction';

export function useNeuroAesthetic() {
  const triggerMicroReward = useCallback((type: MicroRewardType) => {
    const eventName = `xvush:${type}`;
    document.dispatchEvent(new Event(eventName));
  }, []);

  return { triggerMicroReward };
}
