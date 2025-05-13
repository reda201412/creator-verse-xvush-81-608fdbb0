
import React, { useEffect, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useSettings } from '@/contexts/SettingsContext';

export interface AdaptiveMoodLightingProps {
  currentMood: 'energetic' | 'calm' | 'creative' | 'focused';
  intensity?: number;
  autoAdapt?: boolean;
  className?: string;
}

export const AdaptiveMoodLighting: React.FC<AdaptiveMoodLightingProps> = ({
  currentMood,
  intensity = 50,
  autoAdapt = false,
  className
}) => {
  const { theme } = useTheme();
  const { motionReduced } = useSettings();
  const [colorScheme, setColorScheme] = useState<string>('');
  
  useEffect(() => {
    // Skip effects if motion is reduced for accessibility
    if (motionReduced) return;
    
    // Determine color scheme based on mood and theme
    let colors = '';
    switch (currentMood) {
      case 'energetic':
        colors = theme === 'dark' ? '255,100,50' : '255,120,60';
        break;
      case 'calm':
        colors = theme === 'dark' ? '100,150,255' : '140,180,255';
        break;
      case 'creative':
        colors = theme === 'dark' ? '180,100,255' : '200,130,255';
        break;
      case 'focused':
        colors = theme === 'dark' ? '50,200,170' : '70,220,190';
        break;
    }
    
    setColorScheme(colors);
    
    // Clean up any DOM manipulations when unmounting
    return () => {
      // Cleanup code if needed
    };
  }, [currentMood, theme, motionReduced, intensity]);
  
  if (motionReduced || !colorScheme) {
    return null;
  }
  
  const opacityValue = Math.max(5, Math.min(20, intensity * 0.2)) / 100;
  
  return (
    <div
      className={`fixed inset-0 pointer-events-none z-[-1] ${className}`}
      style={{
        background: `radial-gradient(circle at 50% 50%, rgba(${colorScheme},${opacityValue}) 0%, rgba(0,0,0,0) 70%)`,
        opacity: intensity / 100,
        transition: 'all 2s ease-in-out'
      }}
    />
  );
};
