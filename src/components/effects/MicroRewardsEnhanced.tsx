
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Star, Heart, MessageSquare, Award, ThumbsUp, Lightbulb, Target, Trophy, Zap, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserBehavior } from '@/hooks/use-user-behavior';
import { useNeuroAesthetic, MicroRewardType } from '@/hooks/use-neuro-aesthetic';

interface RewardItem {
  id: number;
  type: MicroRewardType;
  x: number;
  y: number;
  variant: 'small' | 'medium' | 'large';
  intensity: number;
  metadata?: any;
}

interface MicroRewardsEnhancedProps {
  enable?: boolean;
  rewardIntensity?: number;
  className?: string;
  adaptToContext?: boolean;
  reducedMotion?: boolean;
}

const MicroRewardsEnhanced: React.FC<MicroRewardsEnhancedProps> = ({
  enable = true,
  rewardIntensity = 50,
  className,
  adaptToContext = true,
  reducedMotion = false
}) => {
  const [rewards, setRewards] = useState<RewardItem[]>([]);
  const [streakCount, setStreakCount] = useState(0);
  const streakTimeout = useRef<number | null>(null);
  const interactionMap = useRef<Map<string, number>>(new Map());
  
  const { trackInteraction } = useUserBehavior();
  const { config } = useNeuroAesthetic();
  
  // Make interaction tracking behavior more adaptive
  const adaptiveThreshold = useCallback(() => {
    // Base threshold scaled by intensity setting
    const base = Math.max(2, 10 - Math.floor(rewardIntensity / 20));
    
    // Adjust for time of day if we have circadian data
    const hour = new Date().getHours();
    let timeMultiplier = 1;
    
    // At night, make rewards less frequent
    if (hour >= 22 || hour < 6) {
      timeMultiplier = 1.5;
    }
    // In mornings, slightly more frequent
    else if (hour >= 6 && hour < 10) {
      timeMultiplier = 0.8;
    }
    
    return Math.round(base * timeMultiplier);
  }, [rewardIntensity]);
  
  // Generate a reward at specific coordinates or random if not provided
  const generateReward = useCallback((
    type: MicroRewardType = 'like',
    metadata?: any,
    x?: number,
    y?: number,
    intensity?: number
  ) => {
    if (!enable) return;
    
    const id = Date.now() + Math.random();
    // Random position if not specified
    const posX = x !== undefined ? x : Math.random() * 100;
    const posY = y !== undefined ? y : Math.random() * 100;
    
    // Adjust variant based on streak and type
    let variant: 'small' | 'medium' | 'large' = 'small';
    if (streakCount > 5 || type === 'goal' || type === 'challenge') {
      variant = 'large';
    } else if (streakCount > 2 || type === 'insight' || type === 'opportunity') {
      variant = 'medium';
    }
    
    // Use provided intensity or default
    const actualIntensity = intensity !== undefined ? 
      intensity : Math.min(100, rewardIntensity + (streakCount * 5));
    
    setRewards(current => [...current, { 
      id, 
      type, 
      x: posX, 
      y: posY, 
      variant,
      intensity: actualIntensity,
      metadata
    }]);
    
    // Remove reward after animation
    const duration = variant === 'large' ? 4000 : variant === 'medium' ? 3000 : 2000;
    
    setTimeout(() => {
      setRewards(current => current.filter(reward => reward.id !== id));
    }, duration);
    
    // Update streak and track interaction
    updateStreak();
    trackInteraction(type, metadata);
  }, [enable, rewardIntensity, streakCount, trackInteraction]);
  
  // Update the interaction streak
  const updateStreak = useCallback(() => {
    setStreakCount(prev => prev + 1);
    
    // Reset the streak timer
    if (streakTimeout.current) {
      clearTimeout(streakTimeout.current);
    }
    
    // If no interaction for 6 seconds, reset streak
    streakTimeout.current = window.setTimeout(() => {
      setStreakCount(0);
      streakTimeout.current = null;
    }, 6000) as unknown as number;
    
    // Give bonus rewards on streak milestones
    if (streakCount > 0 && streakCount % 5 === 0) {
      // Create a burst of rewards for milestone
      for (let i = 0; i < Math.min(3, 1 + Math.floor(streakCount / 10)); i++) {
        setTimeout(() => {
          const types: MicroRewardType[] = ['star', 'award', 'trophy'];
          generateReward(
            types[Math.floor(Math.random() * types.length)], 
            { streak: streakCount },
            20 + Math.random() * 60,
            20 + Math.random() * 60
          );
        }, i * 200);
      }
    }
  }, [streakCount, generateReward]);
  
  // Track user behavior to determine when to show rewards
  const shouldTriggerReward = useCallback((type: string): boolean => {
    const now = Date.now();
    const lastTrigger = interactionMap.current.get(type) || 0;
    const threshold = adaptiveThreshold() * 1000; // Convert to milliseconds
    
    // Check if enough time has passed since last trigger
    if (now - lastTrigger < threshold) {
      return false;
    }
    
    // Update last trigger time
    interactionMap.current.set(type, now);
    return true;
  }, [adaptiveThreshold]);
  
  // Map of reward types to their icons
  const getRewardIcon = useCallback((type: MicroRewardType, variant: 'small' | 'medium' | 'large') => {
    // Size based on variant
    const size = variant === 'large' ? 28 : variant === 'medium' ? 22 : 18;
    
    switch (type) {
      case 'like':
        return <Heart className="text-rose-500" fill="currentColor" size={size} />;
      case 'star':
        return <Star className="text-amber-500" fill="currentColor" size={size} />;
      case 'message':
      case 'comment':
        return <MessageSquare className="text-blue-500" size={size} />;
      case 'award':
        return <Award className="text-purple-500" fill="currentColor" size={size} />;
      case 'thumbs-up':
        return <ThumbsUp className="text-green-500" size={size} />;
      case 'insight':
        return <Lightbulb className="text-yellow-500" fill="currentColor" size={size} />;
      case 'goal':
        return <Target className="text-red-500" fill="currentColor" size={size} />;
      case 'challenge':
        return <Trophy className="text-amber-600" fill="currentColor" size={size} />;
      case 'wellbeing':
        return <Heart className="text-green-500" fill="currentColor" size={size} />;
      case 'creative':
        return <Sparkles className="text-indigo-400" size={size} />;
      case 'analyze':
        return <Zap className="text-blue-400" fill="currentColor" size={size} />;
      default:
        return <Heart className="text-rose-500" fill="currentColor" size={size} />;
    }
  }, []);
  
  // Listen for custom micro-reward events
  useEffect(() => {
    if (!enable) return;
    
    const handleCustomReward = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (!customEvent.detail) return;
      
      const { type, x, y, intensity } = customEvent.detail;
      
      if (shouldTriggerReward(type)) {
        generateReward(type, customEvent.detail, x, y, intensity);
      }
    };
    
    // Listen for click events to position rewards at click position
    const handleClick = (event: MouseEvent) => {
      if (!shouldTriggerReward('click')) return;
      
      // Convert click position to percentage of viewport
      const x = (event.clientX / window.innerWidth) * 100;
      const y = (event.clientY / window.innerHeight) * 100;
      
      generateReward('click', { natural: true }, x, y);
    };
    
    // Setup periodic ambient rewards
    let ambientInterval: number | null = null;
    if (adaptToContext) {
      ambientInterval = window.setInterval(() => {
        if (
          document.visibilityState === 'visible' && 
          Math.random() > 0.7 && 
          shouldTriggerReward('ambient')
        ) {
          generateReward(
            Math.random() > 0.5 ? 'creative' : 'insight', 
            { ambient: true }
          );
        }
      }, adaptiveThreshold() * 1000) as unknown as number;
    }
    
    // Register event listeners
    document.addEventListener('xvush:micro-reward', handleCustomReward);
    document.addEventListener('click', handleClick);
    
    // Clean up event listeners
    return () => {
      document.removeEventListener('xvush:micro-reward', handleCustomReward);
      document.removeEventListener('click', handleClick);
      
      if (ambientInterval) {
        clearInterval(ambientInterval);
      }
      
      if (streakTimeout.current) {
        clearTimeout(streakTimeout.current);
      }
    };
  }, [enable, generateReward, shouldTriggerReward, adaptToContext, adaptiveThreshold]);

  // Don't render if disabled or reduced motion preference with no rewards
  if (!enable || (reducedMotion && rewards.length === 0)) return null;

  return (
    <div className={cn("fixed inset-0 pointer-events-none z-50 overflow-hidden", className)}>
      <AnimatePresence>
        {rewards.map((reward) => (
          <motion.div
            key={reward.id}
            className="absolute"
            style={{
              left: `${reward.x}%`,
              top: `${reward.y}%`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              type: reducedMotion ? "tween" : "spring",
              stiffness: 350,
              damping: 15,
            }}
          >
            <motion.div
              animate={{ 
                y: [
                  0, 
                  -40 - (reward.intensity / 2), 
                ],
                x: reward.variant === 'large' ? [0, -10, 10, -5, 0] : undefined,
                opacity: [1, 0],
                scale: [
                  1, 
                  streakCount > 3 || reward.variant !== 'small' ? 1.3 : 1.1,
                  0.8
                ]
              }}
              transition={{ 
                duration: reward.variant === 'large' ? 3 : 
                          reward.variant === 'medium' ? 2 : 1.5, 
                ease: "easeOut" 
              }}
            >
              {getRewardIcon(reward.type, reward.variant)}
              
              {/* Show text for larger variants or special types */}
              {(reward.variant !== 'small' || reward.type === 'goal' || reward.type === 'challenge') && (
                <motion.div 
                  className="text-xs font-bold text-center mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {reward.type === 'goal' ? 'Objectif atteint!' : 
                   reward.type === 'challenge' ? 'Défi relevé!' :
                   reward.type === 'insight' ? 'Insight!' : ''}
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
      
      {/* Streak indicator */}
      {streakCount > 2 && (
        <motion.div
          className="fixed bottom-4 right-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ type: reducedMotion ? "tween" : "spring" }}
        >
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-bold">Streak {streakCount}x</span>
        </motion.div>
      )}
    </div>
  );
};

export default MicroRewardsEnhanced;
