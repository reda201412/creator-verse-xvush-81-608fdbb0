
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Heart, Star, Sparkles, Smile, ThumbsUp } from 'lucide-react';

interface MicroReward {
  id: string;
  type: 'heart' | 'star' | 'sparkle' | 'smile' | 'thumbsup';
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

interface MicroRewardsProps {
  triggerPoints?: string[];
  rewardIntensity?: number; // 0-100
  enable?: boolean;
  onReward?: (type: string, count: number) => void;
}

const MicroRewards: React.FC<MicroRewardsProps> = ({
  triggerPoints = ['like', 'view', 'scroll'],
  rewardIntensity = 50,
  enable = true,
  onReward
}) => {
  const [rewards, setRewards] = useState<MicroReward[]>([]);
  const [rewardCount, setRewardCount] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { toast } = useToast();

  // Icons for different reward types
  const iconMap = {
    heart: Heart,
    star: Star,
    sparkle: Sparkles,
    smile: Smile,
    thumbsup: ThumbsUp
  };
  
  const createReward = (x: number, y: number, type?: 'heart' | 'star' | 'sparkle' | 'smile' | 'thumbsup') => {
    if (!enable) return;
    
    // If no specific type, pick random
    const rewardType = type || ['heart', 'star', 'sparkle', 'smile', 'thumbsup'][
      Math.floor(Math.random() * 5)
    ] as 'heart' | 'star' | 'sparkle' | 'smile' | 'thumbsup';
    
    // Calculate number of particles based on intensity
    const particleCount = Math.max(1, Math.floor(rewardIntensity / 20));
    
    // Create multiple particles
    const newRewards: MicroReward[] = [];
    for (let i = 0; i < particleCount; i++) {
      newRewards.push({
        id: `${rewardType}-${Date.now()}-${i}`,
        type: rewardType,
        // Add some random offset to x and y for spread
        x: x + (Math.random() * 40 - 20),
        y: y + (Math.random() * 40 - 20),
        // Random scale and rotation
        scale: 0.5 + Math.random() * 0.5,
        rotation: Math.random() * 360
      });
    }
    
    setRewards(prev => [...prev, ...newRewards]);
    setRewardCount(prev => prev + 1);
    
    if (onReward) {
      onReward(rewardType, particleCount);
    }
    
    // Remove rewards after animation completes
    setTimeout(() => {
      setRewards(prev => prev.filter(r => !newRewards.includes(r)));
    }, 1500);
  };
  
  // Track scroll position and trigger rewards on significant scroll
  useEffect(() => {
    if (!enable || !triggerPoints.includes('scroll')) return;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Only trigger reward if scrolled significantly (at least 300px)
      if (Math.abs(currentScrollY - lastScrollY) > 300) {
        // Create reward at a random position on screen
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight * 0.8; // Keep reward in top 80% of screen
        
        createReward(x, y);
        setLastScrollY(currentScrollY);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [enable, lastScrollY, triggerPoints]);
  
  // Track view time and trigger rewards periodically
  useEffect(() => {
    if (!enable || !triggerPoints.includes('view')) return;
    
    // Trigger a reward every 45-75 seconds of viewing
    const intervalTime = Math.floor(Math.random() * 30000) + 45000;
    const interval = setInterval(() => {
      // Create reward at a random position on screen
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight * 0.8;
      
      createReward(x, y);
      
      // Show toast for longer sessions
      if (rewardCount > 3 && Math.random() > 0.6) {
        toast({
          title: "Tu es accro !",
          description: "Continue à explorer le contenu de ce créateur.",
          duration: 2000,
        });
      }
    }, intervalTime);
    
    return () => clearInterval(interval);
  }, [enable, rewardCount, triggerPoints, toast]);
  
  // Expose a method to manually trigger rewards
  useEffect(() => {
    if (!enable) return;
    
    // Make the method available globally
    (window as any).triggerReward = (x: number, y: number, type?: 'heart' | 'star' | 'sparkle' | 'smile' | 'thumbsup') => {
      createReward(x, y, type);
    };
    
    // For like button integrations
    const handleLikeClick = (e: MouseEvent) => {
      if (triggerPoints.includes('like') && 
          (e.target as HTMLElement).closest('[data-like-button="true"]')) {
        createReward(e.clientX, e.clientY, 'heart');
      }
    };
    
    document.addEventListener('click', handleLikeClick);
    
    return () => {
      document.removeEventListener('click', handleLikeClick);
      delete (window as any).triggerReward;
    };
  }, [enable, triggerPoints]);
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {rewards.map((reward) => {
          const Icon = iconMap[reward.type];
          
          return (
            <motion.div
              key={reward.id}
              initial={{ 
                x: reward.x, 
                y: reward.y, 
                scale: reward.scale, 
                rotate: reward.rotation, 
                opacity: 0 
              }}
              animate={{ 
                y: reward.y - 100, 
                opacity: [0, 1, 0.8, 0], 
                scale: reward.scale * 1.2, 
                rotate: reward.rotation + (Math.random() > 0.5 ? 20 : -20)
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ 
                duration: 1.5, 
                ease: "easeOut" 
              }}
              className="absolute"
              style={{ 
                color: reward.type === 'heart' ? '#FF6B6B' : 
                       reward.type === 'star' ? '#FFD700' :
                       reward.type === 'sparkle' ? '#00BFFF' : 
                       reward.type === 'smile' ? '#7CFC00' : '#FF8C00',
              }}
            >
              <Icon size={24} className="drop-shadow-lg" />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default MicroRewards;
