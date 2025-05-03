
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type Mood = 'energetic' | 'calm' | 'creative' | 'focused';

interface AdaptiveMoodLightingProps {
  currentMood: Mood;
  intensity?: number; // 0-100
  autoAdapt?: boolean;
  className?: string;
}

const AdaptiveMoodLighting: React.FC<AdaptiveMoodLightingProps> = ({
  currentMood,
  intensity = 50,
  autoAdapt = true,
  className
}) => {
  const [mood, setMood] = useState<Mood>(currentMood);
  
  // Update when props change
  useEffect(() => {
    setMood(currentMood);
  }, [currentMood]);

  // Map intensity to actual opacity and blur values
  const opacityValue = Math.min(0.5, intensity / 200);
  const blurValue = Math.max(40, intensity * 0.8);
  const sizeValue = Math.max(150, 100 + intensity * 1.5);
  
  // Configure mood colors
  const moodColors = {
    energetic: {
      primary: 'rgba(255, 124, 67, VAR_OPACITY)',
      secondary: 'rgba(255, 186, 71, VAR_OPACITY)',
      accent: 'rgba(255, 149, 0, VAR_OPACITY)',
    },
    calm: {
      primary: 'rgba(67, 182, 212, VAR_OPACITY)',
      secondary: 'rgba(107, 196, 255, VAR_OPACITY)',
      accent: 'rgba(142, 209, 252, VAR_OPACITY)',
    },
    creative: {
      primary: 'rgba(174, 122, 250, VAR_OPACITY)',
      secondary: 'rgba(238, 109, 220, VAR_OPACITY)',
      accent: 'rgba(218, 143, 255, VAR_OPACITY)',
    },
    focused: {
      primary: 'rgba(76, 110, 219, VAR_OPACITY)',
      secondary: 'rgba(90, 97, 195, VAR_OPACITY)',
      accent: 'rgba(43, 108, 176, VAR_OPACITY)',
    },
  };
  
  const colors = moodColors[mood];
  
  // Replace variable opacity in colors
  const colorWithOpacity = (color: string) => {
    return color.replace('VAR_OPACITY', opacityValue.toString());
  };

  return (
    <div className={cn("fixed inset-0 pointer-events-none overflow-hidden", className)} data-mood={mood}>
      <motion.div 
        className="absolute -inset-1/4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        {/* Primary gradient orb */}
        <motion.div
          className="absolute rounded-full blur-3xl"
          style={{
            background: colorWithOpacity(colors.primary),
            width: `${sizeValue}vh`,
            height: `${sizeValue}vh`,
            filter: `blur(${blurValue}px)`,
            top: '15%',
            left: '15%',
          }}
          animate={{
            x: [0, 20, -20, 0],
            y: [0, -20, 20, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        
        {/* Secondary gradient orb */}
        <motion.div
          className="absolute rounded-full blur-3xl"
          style={{
            background: colorWithOpacity(colors.secondary),
            width: `${sizeValue * 0.8}vh`,
            height: `${sizeValue * 0.8}vh`,
            filter: `blur(${blurValue * 1.2}px)`,
            bottom: '20%',
            right: '25%',
          }}
          animate={{
            x: [0, -30, 30, 0],
            y: [0, 30, -30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        
        {/* Accent gradient orb */}
        <motion.div
          className="absolute rounded-full blur-3xl"
          style={{
            background: colorWithOpacity(colors.accent),
            width: `${sizeValue * 0.6}vh`,
            height: `${sizeValue * 0.6}vh`,
            filter: `blur(${blurValue * 0.8}px)`,
            top: '60%',
            left: '60%',
          }}
          animate={{
            x: [0, 40, -40, 0],
            y: [0, -40, 40, 0],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </motion.div>
    </div>
  );
};

export default AdaptiveMoodLighting;
