
import { useCallback } from 'react';

type HapticFeedbackPattern = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

const useHapticFeedback = () => {
  // Check if the device supports vibration
  const supportsVibration = typeof navigator !== 'undefined' && 'vibrate' in navigator;

  // Define vibration patterns for different feedback types
  const patterns: Record<HapticFeedbackPattern, number[]> = {
    light: [10],
    medium: [15],
    heavy: [30],
    success: [10, 50, 30],
    warning: [30, 50, 30],
    error: [50, 100, 50],
  };

  // Function to trigger haptic feedback
  const triggerHaptic = useCallback((pattern: HapticFeedbackPattern = 'light') => {
    if (supportsVibration) {
      navigator.vibrate(patterns[pattern]);
    }
  }, [supportsVibration]);

  // Wrap callback functions with haptic feedback
  const withHapticFeedback = useCallback(
    <T extends (...args: any[]) => any>(
      callback: T,
      pattern: HapticFeedbackPattern = 'light'
    ) => {
      return ((...args: Parameters<T>) => {
        triggerHaptic(pattern);
        return callback(...args);
      }) as T;
    },
    [triggerHaptic]
  );

  return {
    triggerHaptic,
    withHapticFeedback,
    supportsVibration,
  };
};

export default useHapticFeedback;
