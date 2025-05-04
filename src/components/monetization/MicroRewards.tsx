
import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, Heart, Gift, Star, ZapIcon, Coins } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MicroRewardData {
  id: number;
  type: 'token' | 'heart' | 'star' | 'gift' | 'spark' | 'xp';
  value?: number;
  x: number;
  y: number;
}

interface MicroRewardsProps {
  enabled?: boolean;
  intensity?: number; // 0-100
  className?: string;
}

const MicroRewards: React.FC<MicroRewardsProps> = ({
  enabled = true,
  intensity = 60,
  className
}) => {
  const [rewards, setRewards] = useState<MicroRewardData[]>([]);
  const [streakCount, setStreakCount] = useState(0);
  const [streakTimer, setStreakTimer] = useState<number | null>(null);
  
  // Calculate effects based on intensity
  const animationDuration = Math.max(1.5, 3 - (intensity / 50)); // 1.5 to 3 seconds
  const frequency = Math.max(2, 10 - Math.floor(intensity / 20)); // 2 to 10 seconds
  
  // Generate a random reward
  const generateReward = (type?: 'token' | 'heart' | 'star' | 'gift' | 'spark' | 'xp', overrideX?: number, overrideY?: number) => {
    const id = Date.now() + Math.random();
    // Use provided coordinates or generate random ones
    const x = overrideX !== undefined ? overrideX : 20 + Math.random() * 60; // 20-80% of width
    const y = overrideY !== undefined ? overrideY : 20 + Math.random() * 60; // 20-80% of height
    
    const types = ['token', 'heart', 'star', 'gift', 'spark', 'xp'];
    const rewardType = type || types[Math.floor(Math.random() * types.length)] as 'token' | 'heart' | 'star' | 'gift' | 'spark' | 'xp';
    
    // Generate a value for token rewards
    const value = rewardType === 'token' ? Math.floor(Math.random() * 5) + 1 : undefined;
    
    setRewards(current => [...current, { id, type: rewardType, value, x, y }]);
    
    // Remove reward after animation
    setTimeout(() => {
      setRewards(current => current.filter(reward => reward.id !== id));
    }, animationDuration * 1000 + 500);
    
    // Update streak
    updateStreak();
  };
  
  // Update the interaction streak
  const updateStreak = () => {
    setStreakCount(prev => prev + 1);
    
    // Reset the streak timer
    if (streakTimer) {
      clearTimeout(streakTimer);
    }
    
    // If no interaction for 10 seconds, reset streak
    const timer = window.setTimeout(() => {
      setStreakCount(0);
    }, 10000);
    
    setStreakTimer(timer as unknown as number);
    
    // Give bonus rewards on streak milestones
    if (streakCount > 0 && streakCount % 5 === 0) {
      // Create a burst of rewards for milestone
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          generateReward('star');
        }, i * 300);
      }
    }
  };
  
  // Setup event listeners
  useEffect(() => {
    if (!enabled) return;
    
    const handleCustomReward = (event: Event) => {
      const customEvent = event as CustomEvent;
      const type = customEvent.detail?.type || 'token';
      const x = customEvent.detail?.x;
      const y = customEvent.detail?.y;
      
      generateReward(type as any, x, y);
    };
    
    // Listen for custom micro-reward events
    document.addEventListener('xvush:micro-reward', handleCustomReward);
    
    // Setup periodic ambient rewards
    const intervalId = setInterval(() => {
      if (document.visibilityState === 'visible' && Math.random() > 0.7) {
        generateReward();
      }
    }, frequency * 1000);
    
    return () => {
      document.removeEventListener('xvush:micro-reward', handleCustomReward);
      clearInterval(intervalId);
      if (streakTimer) {
        clearTimeout(streakTimer);
      }
    };
  }, [enabled, frequency]);

  const getRewardIcon = (type: string, value?: number) => {
    switch (type) {
      case 'token':
        return (
          <div className="flex flex-col items-center">
            <Coins className="text-amber-500" fill="currentColor" />
            {value !== undefined && (
              <div className="text-xs font-bold text-amber-500">+{value}</div>
            )}
          </div>
        );
      case 'heart':
        return <Heart className="text-rose-500" fill="currentColor" />;
      case 'star':
        return <Star className="text-amber-400" fill="currentColor" />;
      case 'gift':
        return <Gift className="text-purple-500" fill="currentColor" />;
      case 'spark':
        return <Sparkles className="text-blue-500" />;
      case 'xp':
        return <ZapIcon className="text-green-500" fill="currentColor" />;
      default:
        return <Heart className="text-rose-500" fill="currentColor" />;
    }
  };

  if (!enabled) return null;

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
              type: "spring",
              stiffness: 350,
              damping: 15,
            }}
          >
            <motion.div
              animate={{ 
                y: [-20, -60 - (streakCount * 2)], 
                opacity: [1, 0],
                scale: [1, streakCount > 3 ? 1.3 : 1]
              }}
              transition={{ 
                duration: animationDuration, 
                ease: "easeOut" 
              }}
              className="text-2xl"
            >
              {getRewardIcon(reward.type, reward.value)}
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
      
      {/* Streak indicator */}
      {streakCount > 1 && (
        <motion.div
          className="fixed bottom-4 right-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ type: "spring" }}
        >
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-bold">Streak {streakCount}x</span>
        </motion.div>
      )}
    </div>
  );
};

export default MicroRewards;
