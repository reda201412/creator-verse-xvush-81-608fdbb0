
import { useCallback } from 'react';

export type HapticIntensity = 'light' | 'medium' | 'strong';

export const useHapticFeedback = () => {
  // Fonction pour déclencher un retour haptique en fonction de l'intensité
  const triggerHaptic = useCallback((intensity: HapticIntensity = 'light') => {
    if (!('vibrate' in navigator)) return;
    
    switch (intensity) {
      case 'light':
        navigator.vibrate(10);
        break;
      case 'medium':
        navigator.vibrate(20);
        break;
      case 'strong':
        navigator.vibrate([30, 10, 30]);
        break;
    }
  }, []);

  // Fonction pour déclencher un retour haptique sur un événement de clic
  const withHapticFeedback = useCallback((callback?: Function, intensity: HapticIntensity = 'light') => {
    return (event: React.MouseEvent | React.TouchEvent) => {
      triggerHaptic(intensity);
      if (callback) callback(event);
    };
  }, [triggerHaptic]);

  return {
    triggerHaptic,
    withHapticFeedback
  };
};

export default useHapticFeedback;
