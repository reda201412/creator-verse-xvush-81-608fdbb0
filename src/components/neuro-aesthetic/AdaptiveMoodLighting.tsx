
import React, { useEffect, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface AdaptiveMoodLightingProps {
  currentMood?: 'calm' | 'energetic' | 'mysterious' | 'passionate' | 'creative' | 'focused';
  intensity?: number; // 0-100
  autoAdapt?: boolean;
  className?: string;
}

const AdaptiveMoodLighting: React.FC<AdaptiveMoodLightingProps> = ({
  currentMood = 'creative',
  intensity = 50,
  autoAdapt = true,
  className
}) => {
  const isMobile = useIsMobile();
  const [activeMood, setActiveMood] = useState(currentMood);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    if (!autoAdapt) {
      setActiveMood(currentMood);
      return;
    }
    
    // Update time every minute for time-based lighting
    const intervalId = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      
      // Adapt mood based on time of day
      const hour = now.getHours();
      if (hour >= 5 && hour < 10) {
        setActiveMood('energetic'); // Morning energy
      } else if (hour >= 10 && hour < 15) {
        setActiveMood('creative'); // Productive daytime
      } else if (hour >= 15 && hour < 19) {
        setActiveMood('passionate'); // Afternoon passion
      } else if (hour >= 19 && hour < 22) {
        setActiveMood('mysterious'); // Evening mystery
      } else {
        setActiveMood('calm'); // Night calmness
      }
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, [autoAdapt, currentMood]);
  
  // Generate CSS variables for the mood lighting
  const getMoodStyles = () => {
    const baseIntensity = intensity / 100;
    const mobileReducedIntensity = isMobile ? baseIntensity * 0.7 : baseIntensity;
    
    switch (activeMood) {
      case 'calm':
        return {
          '--primary-glow': `0 0 ${80 * mobileReducedIntensity}px rgba(100, 149, 237, ${0.6 * mobileReducedIntensity})`,
          '--secondary-glow': `0 0 ${120 * mobileReducedIntensity}px rgba(173, 216, 230, ${0.5 * mobileReducedIntensity})`,
          '--ambient-color': 'rgba(240, 248, 255, 0.1)',
          '--gradient': 'linear-gradient(135deg, rgba(176, 224, 230, 0.3), rgba(100, 149, 237, 0.2))'
        };
      case 'energetic':
        return {
          '--primary-glow': `0 0 ${80 * mobileReducedIntensity}px rgba(255, 165, 0, ${0.6 * mobileReducedIntensity})`,
          '--secondary-glow': `0 0 ${120 * mobileReducedIntensity}px rgba(255, 215, 0, ${0.5 * mobileReducedIntensity})`,
          '--ambient-color': 'rgba(255, 248, 220, 0.1)',
          '--gradient': 'linear-gradient(135deg, rgba(255, 165, 0, 0.3), rgba(255, 215, 0, 0.2))'
        };
      case 'mysterious':
        return {
          '--primary-glow': `0 0 ${80 * mobileReducedIntensity}px rgba(138, 43, 226, ${0.6 * mobileReducedIntensity})`,
          '--secondary-glow': `0 0 ${120 * mobileReducedIntensity}px rgba(75, 0, 130, ${0.5 * mobileReducedIntensity})`,
          '--ambient-color': 'rgba(230, 230, 250, 0.1)',
          '--gradient': 'linear-gradient(135deg, rgba(138, 43, 226, 0.3), rgba(75, 0, 130, 0.2))'
        };
      case 'passionate':
        return {
          '--primary-glow': `0 0 ${80 * mobileReducedIntensity}px rgba(220, 20, 60, ${0.6 * mobileReducedIntensity})`,
          '--secondary-glow': `0 0 ${120 * mobileReducedIntensity}px rgba(255, 105, 180, ${0.5 * mobileReducedIntensity})`,
          '--ambient-color': 'rgba(255, 240, 245, 0.1)',
          '--gradient': 'linear-gradient(135deg, rgba(220, 20, 60, 0.3), rgba(255, 105, 180, 0.2))'
        };
      case 'creative':
        return {
          '--primary-glow': `0 0 ${80 * mobileReducedIntensity}px rgba(147, 112, 219, ${0.6 * mobileReducedIntensity})`,
          '--secondary-glow': `0 0 ${120 * mobileReducedIntensity}px rgba(72, 209, 204, ${0.5 * mobileReducedIntensity})`,
          '--ambient-color': 'rgba(245, 255, 250, 0.1)',
          '--gradient': 'linear-gradient(135deg, rgba(147, 112, 219, 0.3), rgba(72, 209, 204, 0.2))'
        };
      case 'focused':
        return {
          '--primary-glow': `0 0 ${80 * mobileReducedIntensity}px rgba(0, 128, 128, ${0.6 * mobileReducedIntensity})`,
          '--secondary-glow': `0 0 ${120 * mobileReducedIntensity}px rgba(0, 191, 255, ${0.5 * mobileReducedIntensity})`,
          '--ambient-color': 'rgba(240, 255, 255, 0.1)',
          '--gradient': 'linear-gradient(135deg, rgba(0, 128, 128, 0.3), rgba(0, 191, 255, 0.2))'
        };
      default:
        return {
          '--primary-glow': `0 0 ${80 * mobileReducedIntensity}px rgba(147, 112, 219, ${0.6 * mobileReducedIntensity})`,
          '--secondary-glow': `0 0 ${120 * mobileReducedIntensity}px rgba(72, 209, 204, ${0.5 * mobileReducedIntensity})`,
          '--ambient-color': 'rgba(245, 255, 250, 0.1)',
          '--gradient': 'linear-gradient(135deg, rgba(147, 112, 219, 0.3), rgba(72, 209, 204, 0.2))'
        };
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-0 pointer-events-none ${className || ''}`}
      style={getMoodStyles() as React.CSSProperties}
    >
      <div 
        className="absolute inset-0" 
        style={{ 
          background: 'var(--gradient)',
          opacity: intensity / 200,
          transition: 'all 2s ease-out'
        }} 
      />
      <div 
        className="absolute top-0 left-0 w-1/3 h-1/2 rounded-full opacity-30 blur-3xl"
        style={{ 
          boxShadow: 'var(--primary-glow)', 
          transform: 'translate(-15%, -15%)',
          transition: 'all 3s ease-in-out'
        }} 
      />
      <div 
        className="absolute bottom-0 right-0 w-1/3 h-1/2 rounded-full opacity-30 blur-3xl"
        style={{ 
          boxShadow: 'var(--secondary-glow)', 
          transform: 'translate(15%, 15%)',
          transition: 'all 3s ease-in-out'
        }} 
      />
    </div>
  );
};

export default AdaptiveMoodLighting;
