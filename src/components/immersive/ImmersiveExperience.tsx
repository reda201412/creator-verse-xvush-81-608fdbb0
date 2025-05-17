import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useNeuroAesthetic } from '@/hooks/use-neuro-aesthetic';
import { useUserBehavior } from '@/hooks/use-user-behavior';
import { prefersReducedMotion } from '@/lib/utils';

interface ImmersiveExperienceProps {
  children: React.ReactNode;
  contentType?: 'video' | 'image' | 'article' | 'gallery' | 'interactive';
  contentMood?: 'energetic' | 'calm' | 'creative' | 'focused';
  contentTags?: string[];
  contentDuration?: number; // in seconds
  contentFormat?: 'landscape' | 'portrait' | 'square';
  contentImportance?: 'low' | 'medium' | 'high';
  ambientEnabled?: boolean;
  animationsEnabled?: boolean;
  className?: string;
}

export type ContentContext = {
  type: string;
  mood: string;
  tags: string[];
  format: string;
  importance: string;
  duration?: number;
};

const ImmersiveExperience: React.FC<ImmersiveExperienceProps> = ({
  children,
  contentType = 'image',
  contentMood = 'calm',
  contentTags = [],
  contentDuration,
  contentFormat = 'landscape',
  contentImportance = 'medium',
  ambientEnabled = true,
  animationsEnabled = true,
  className,
}) => {
  const [contentContext, setContentContext] = useState<ContentContext>({
    type: contentType,
    mood: contentMood,
    tags: contentTags,
    format: contentFormat,
    importance: contentImportance,
    duration: contentDuration,
  });
  
  const [isImmersiveMode, setIsImmersiveMode] = useState(false);
  const [immersionLevel, setImmersionLevel] = useState(0);
  const [adaptedColors, setAdaptedColors] = useState<any>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  
  const { config, updateConfig, triggerMicroReward } = useNeuroAesthetic();
  const { trackContentPreference } = useUserBehavior();
  
  // Check for reduced motion preference
  useEffect(() => {
    setReducedMotion(prefersReducedMotion());
  }, []);
  
  // Track content interaction
  useEffect(() => {
    if (contentType) {
      trackContentPreference(contentType);
    }
    
    // Track content tags
    contentTags.forEach(tag => {
      trackContentPreference(tag);
    });
  }, [contentType, contentTags, trackContentPreference]);
  
  // Adaptive color scheme based on content context
  const generateAdaptiveColors = useCallback(() => {
    // Base on content mood
    let primary, secondary, accent, text, background, surface;
    
    switch (contentMood) {
      case 'energetic':
        primary = 'rgb(255, 90, 95)';
        secondary = 'rgb(255, 149, 0)';
        accent = 'rgb(255, 204, 0)';
        text = 'rgb(33, 37, 41)';
        background = 'rgb(253, 246, 240)';
        surface = 'rgb(255, 250, 245)';
        break;
      case 'calm':
        primary = 'rgb(66, 133, 244)';
        secondary = 'rgb(159, 198, 255)';
        accent = 'rgb(213, 232, 255)';
        text = 'rgb(33, 37, 41)';
        background = 'rgb(240, 245, 253)';
        surface = 'rgb(245, 249, 255)';
        break;
      case 'creative':
        primary = 'rgb(175, 82, 222)';
        secondary = 'rgb(255, 64, 129)';
        accent = 'rgb(241, 196, 255)';
        text = 'rgb(33, 37, 41)';
        background = 'rgb(247, 240, 253)';
        surface = 'rgb(250, 245, 255)';
        break;
      case 'focused':
        primary = 'rgb(15, 92, 128)';
        secondary = 'rgb(52, 120, 173)';
        accent = 'rgb(166, 206, 228)';
        text = 'rgb(33, 37, 41)';
        background = 'rgb(240, 247, 253)';
        surface = 'rgb(245, 251, 255)';
        break;
      default:
        primary = 'rgb(66, 133, 244)';
        secondary = 'rgb(159, 198, 255)';
        accent = 'rgb(213, 232, 255)';
        text = 'rgb(33, 37, 41)';
        background = 'rgb(240, 245, 253)';
        surface = 'rgb(245, 249, 255)';
    }
    
    // Adjust based on content type
    if (contentType === 'video') {
      // Videos need darker interfaces
      background = 'rgb(15, 15, 15)';
      surface = 'rgb(30, 30, 30)';
      text = 'rgb(240, 240, 240)';
    } else if (contentType === 'article') {
      // Articles need readable interfaces
      background = 'rgb(250, 250, 250)';
      surface = 'rgb(255, 255, 255)';
      text = 'rgb(33, 37, 41)';
    }
    
    // Adjust based on content tags
    const hasNatureTag = contentTags.some(tag => 
      ['nature', 'outdoor', 'landscape', 'forest', 'ocean', 'mountain'].includes(tag.toLowerCase())
    );
    
    const hasTechTag = contentTags.some(tag => 
      ['tech', 'technology', 'digital', 'futuristic', 'cyberpunk'].includes(tag.toLowerCase())
    );
    
    const hasWarmTag = contentTags.some(tag => 
      ['warm', 'summer', 'sunset', 'autumn', 'cozy'].includes(tag.toLowerCase())
    );
    
    const hasCoolTag = contentTags.some(tag => 
      ['cool', 'winter', 'night', 'blue', 'underwater'].includes(tag.toLowerCase())
    );
    
    // Adjust colors based on tags
    if (hasNatureTag) {
      primary = 'rgb(76, 175, 80)';
      secondary = 'rgb(139, 195, 74)';
      accent = 'rgb(205, 220, 57)';
    } else if (hasTechTag) {
      primary = 'rgb(33, 150, 243)';
      secondary = 'rgb(0, 188, 212)';
      accent = 'rgb(0, 255, 255)';
    }
    
    if (hasWarmTag) {
      primary = contentMood === 'energetic' ? primary : 'rgb(255, 87, 34)';
      secondary = 'rgb(255, 152, 0)';
      accent = 'rgb(255, 193, 7)';
    } else if (hasCoolTag) {
      primary = contentMood === 'calm' ? primary : 'rgb(63, 81, 181)';
      secondary = 'rgb(3, 169, 244)';
      accent = 'rgb(0, 188, 212)';
    }
    
    return {
      primary,
      secondary,
      accent,
      text,
      background,
      surface,
    };
  }, [contentMood, contentType, contentTags]);
  
  // Adapt to content context
  useEffect(() => {
    // Update context state
    setContentContext({
      type: contentType,
      mood: contentMood,
      tags: contentTags,
      format: contentFormat,
      importance: contentImportance,
      duration: contentDuration,
    });
    
    // Generate adaptive colors based on content
    const colors = generateAdaptiveColors();
    setAdaptedColors(colors);
    
    // Adaptive mood settings for neuro-aesthetic system
    if (ambientEnabled) {
      const suggestedMood = 
        contentMood === 'energetic' ? 'energetic' : 
        contentMood === 'calm' ? 'calm' : 
        contentMood === 'creative' ? 'creative' : 'focused';
      
      // Only update if the suggested mood is different from current
      if (config.adaptiveMood !== suggestedMood) {
        updateConfig({
          adaptiveMood: suggestedMood,
          // Adjust intensity based on content importance
          moodIntensity: contentImportance === 'high' ? 70 : 
                           contentImportance === 'medium' ? 50 : 30
        });
      }
    }
  }, [
    contentType, 
    contentMood, 
    contentTags, 
    contentFormat,
    contentImportance,
    contentDuration,
    ambientEnabled,
    config.adaptiveMood, 
    updateConfig, 
    generateAdaptiveColors
  ]);
  
  // Toggle immersive mode
  const toggleImmersiveMode = useCallback(() => {
    setIsImmersiveMode(prev => !prev);
    triggerMicroReward('interact');
    
    if (!isImmersiveMode) {
      // Entering immersive mode
      setImmersionLevel(100);
      // Apply additional immersive settings
      if (ambientEnabled) {
        updateConfig({
          moodIntensity: 80,
          microRewardsIntensity: 70,
          focusModeEnabled: true
        });
      }
    } else {
      // Exiting immersive mode
      setImmersionLevel(0);
      // Restore normal settings
      if (ambientEnabled) {
        updateConfig({
          moodIntensity: 50,
          microRewardsIntensity: 50,
          focusModeEnabled: false
        });
      }
    }
  }, [isImmersiveMode, ambientEnabled, updateConfig, triggerMicroReward]);
  
  // Apply adaptive styles based on context
  const getContextualStyles = () => {
    if (!adaptedColors) return {};
    
    let styles: any = {
      '--immersive-primary': adaptedColors.primary,
      '--immersive-secondary': adaptedColors.secondary,
      '--immersive-accent': adaptedColors.accent,
      '--immersive-text': adaptedColors.text,
      '--immersive-background': adaptedColors.background,
      '--immersive-surface': adaptedColors.surface,
    };
    
    if (isImmersiveMode) {
      styles = {
        ...styles,
        backgroundColor: adaptedColors.background,
        color: adaptedColors.text,
      };
    }
    
    return styles;
  };
  
  // Get contextual layout class based on content
  const getContextualLayoutClass = () => {
    let layoutClass = '';
    
    if (contentType === 'video' || contentType === 'image') {
      layoutClass += ' immersive-media-container';
      
      if (contentFormat === 'portrait') {
        layoutClass += ' immersive-portrait';
      } else if (contentFormat === 'square') {
        layoutClass += ' immersive-square';
      } else {
        layoutClass += ' immersive-landscape';
      }
    } else if (contentType === 'article') {
      layoutClass += ' immersive-article';
    } else if (contentType === 'gallery') {
      layoutClass += ' immersive-gallery';
    }
    
    if (isImmersiveMode) {
      layoutClass += ' immersive-mode';
    }
    
    return layoutClass;
  };
  
  // Create contextual animations
  const getContextualAnimations = () => {
    if (!animationsEnabled || reducedMotion) return {};
    
    let animations = {
      initial: {},
      animate: {},
      exit: {},
      transition: {}
    };
    
    if (contentType === 'video' || contentType === 'image') {
      animations = {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.95 },
        transition: { 
          type: "spring", 
          stiffness: 300, 
          damping: 30 
        }
      };
    } else if (contentType === 'article') {
      animations = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
        transition: { 
          duration: 0.4, 
          ease: "easeOut" 
        }
      };
    } else if (contentType === 'gallery') {
      animations = {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { 
          duration: 0.3,
          ease: "easeInOut" 
        }
      };
    }
    
    return animations;
  };
  
  return (
    <div 
      className={cn(
        "immersive-container relative",
        getContextualLayoutClass(),
        className
      )}
      style={getContextualStyles()}
      data-content-type={contentType}
      data-content-mood={contentMood}
      data-immersive-mode={isImmersiveMode}
    >
      {/* Immersive background gradient */}
      {isImmersiveMode && adaptedColors && (
        <div 
          className="absolute inset-0 pointer-events-none z-0 opacity-50"
          style={{
            background: `radial-gradient(circle at center, ${adaptedColors.accent}40 0%, ${adaptedColors.background}80 100%)`
          }}
        />
      )}
      
      {/* Adaptive animation container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${contentType}-${contentMood}-${isImmersiveMode}`}
          className="immersive-content relative z-10"
          {...getContextualAnimations()}
        >
          {/* Main content */}
          {children}
        </motion.div>
      </AnimatePresence>
      
      {/* Immersive mode toggle */}
      {!reducedMotion && animationsEnabled && (
        <button
          onClick={toggleImmersiveMode}
          className="immersive-toggle absolute right-4 top-4 z-20 w-8 h-8 rounded-full flex items-center justify-center bg-black/10 backdrop-blur-sm hover:bg-black/20 transition-colors"
          aria-label={isImmersiveMode ? "Exit immersive mode" : "Enter immersive mode"}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {isImmersiveMode ? (
              <>
                <path d="M8 3v3a2 2 0 0 1-2 2H3" />
                <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
                <path d="M3 16h3a2 2 0 0 1 2 2v3" />
                <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
              </>
            ) : (
              <>
                <path d="M3 8V5a2 2 0 0 1 2-2h3" />
                <path d="M16 3h3a2 2 0 0 1 2 2v3" />
                <path d="M21 16v3a2 2 0 0 1-2 2h-3" />
                <path d="M8 21H5a2 2 0 0 1-2-2v-3" />
              </>
            )}
          </svg>
        </button>
      )}
      
      {/* Contextual adaptations via CSS variables */}
      <style dangerouslySetInnerHTML={{ __html: `
        .immersive-container {
          transition: background-color 0.5s ease-in-out, color 0.5s ease-in-out;
        }
        
        .immersive-container.immersive-mode {
          padding: ${isImmersiveMode ? '2rem' : '0'};
        }
        
        .immersive-container.immersive-mode .immersive-content {
          backdrop-filter: ${isImmersiveMode ? 'blur(8px)' : 'none'};
          background-color: ${isImmersiveMode ? 'var(--immersive-surface)' : 'transparent'};
          border-radius: ${isImmersiveMode ? '1rem' : '0'};
          box-shadow: ${isImmersiveMode ? '0 10px 25px rgba(0,0,0,0.1)' : 'none'};
          padding: ${isImmersiveMode ? '1.5rem' : '0'};
        }
        
        .immersive-media-container.immersive-mode img,
        .immersive-media-container.immersive-mode video {
          border-radius: 0.75rem;
          box-shadow: 0 8px 30px rgba(0,0,0,0.12);
        }
        
        .immersive-container button,
        .immersive-container .button {
          background-color: var(--immersive-primary);
          color: white;
          border: none;
        }
        
        .immersive-container button:hover,
        .immersive-container .button:hover {
          background-color: var(--immersive-secondary);
        }
        
        .immersive-container.immersive-article {
          max-width: ${isImmersiveMode ? '65ch' : 'none'};
          margin: ${isImmersiveMode ? '0 auto' : '0'};
          line-height: 1.7;
        }
        
        .immersive-container.immersive-article h1,
        .immersive-container.immersive-article h2,
        .immersive-container.immersive-article h3 {
          color: var(--immersive-primary);
        }
        
        .immersive-container.immersive-article p {
          margin-bottom: 1.5em;
        }
        
        .immersive-container.immersive-gallery {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          grid-gap: ${isImmersiveMode ? '1.5rem' : '1rem'};
        }
        
        .immersive-container.immersive-gallery img {
          width: 100%;
          height: auto;
          object-fit: cover;
          aspect-ratio: 1;
          border-radius: ${isImmersiveMode ? '0.75rem' : '0.25rem'};
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .immersive-container.immersive-gallery img:hover {
          transform: ${isImmersiveMode ? 'translateY(-5px) scale(1.02)' : 'scale(1.01)'};
          box-shadow: ${isImmersiveMode ? '0 10px 30px rgba(0,0,0,0.15)' : '0 5px 15px rgba(0,0,0,0.1)'};
        }
      `}} />
    </div>
  );
};

export default ImmersiveExperience;
