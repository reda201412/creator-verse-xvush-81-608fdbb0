
import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Star, Heart, MessageSquare, Award, ThumbsUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MicroRewardPosition {
  id: number;
  type: string;
  x: number;
  y: number;
}

interface MicroRewardsProps {
  enable?: boolean;
  rewardIntensity?: number; // 0-100
  triggerPoints?: string[];
  className?: string;
}

const MicroRewards: React.FC<MicroRewardsProps> = ({
  enable = true,
  rewardIntensity = 50,
  triggerPoints = ['like', 'comment', 'view', 'scroll'],
  className
}) => {
  const [rewards, setRewards] = useState<MicroRewardPosition[]>([]);
  
  // Calculate frequency based on intensity
  const frequency = Math.max(3, 10 - Math.floor(rewardIntensity / 20)); // 3 to 10 seconds between rewards
  
  // Generate a random reward
  const generateReward = () => {
    const id = Date.now();
    const x = Math.random() * 100; // Random position as percentage of viewport width
    const y = Math.random() * 100; // Random position as percentage of viewport height
    const types = ['like', 'star', 'message', 'award', 'thumbs-up'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    setRewards(current => [...current, { id, type, x, y }]);
    
    // Remove reward after animation (3 seconds)
    setTimeout(() => {
      setRewards(current => current.filter(reward => reward.id !== id));
    }, 3000);
  };
  
  // Setup listeners for trigger points
  useEffect(() => {
    if (!enable) return;
    
    const handleClick = () => {
      if (triggerPoints.includes('click')) {
        generateReward();
      }
    };
    
    const handleScroll = () => {
      if (triggerPoints.includes('scroll')) {
        // Limit scroll triggers to avoid overwhelming the UI
        if (Math.random() > 0.9) {
          generateReward();
        }
      }
    };
    
    // Set up periodic rewards for 'view' trigger point
    let viewInterval: number | null = null;
    if (triggerPoints.includes('view')) {
      viewInterval = window.setInterval(() => {
        if (document.visibilityState === 'visible' && Math.random() > 0.5) {
          generateReward();
        }
      }, frequency * 1000);
    }
    
    // Add event listeners
    document.addEventListener('click', handleClick);
    window.addEventListener('scroll', handleScroll);
    
    // Set up custom event listeners for more specific triggers
    const handleLike = () => {
      if (triggerPoints.includes('like')) {
        generateReward();
      }
    };
    
    const handleComment = () => {
      if (triggerPoints.includes('comment')) {
        generateReward();
      }
    };
    
    document.addEventListener('xvush:like', handleLike);
    document.addEventListener('xvush:comment', handleComment);
    
    // Cleanup
    return () => {
      document.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('xvush:like', handleLike);
      document.removeEventListener('xvush:comment', handleComment);
      if (viewInterval) clearInterval(viewInterval);
    };
  }, [enable, frequency, triggerPoints]);

  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="text-rose-500" fill="currentColor" />;
      case 'star':
        return <Star className="text-amber-500" fill="currentColor" />;
      case 'message':
        return <MessageSquare className="text-blue-500" />;
      case 'award':
        return <Award className="text-purple-500" fill="currentColor" />;
      case 'thumbs-up':
        return <ThumbsUp className="text-green-500" />;
      default:
        return <Heart className="text-rose-500" fill="currentColor" />;
    }
  };

  if (!enable) return null;

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
              stiffness: 300,
              damping: 20,
            }}
          >
            <motion.div
              animate={{ y: [-20, -60], opacity: [1, 0] }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="text-2xl"
            >
              {getRewardIcon(reward.type)}
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default MicroRewards;
