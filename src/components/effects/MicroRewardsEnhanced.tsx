
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MicroRewardProps {
  type: 'like' | 'navigate' | 'unlock' | 'achievement' | 'purchase';
  position?: { x: number; y: number };
  className?: string;
}

export const MicroReward = ({ type, position, className }: MicroRewardProps) => {
  const getRewardContent = () => {
    switch (type) {
      case 'like':
        return {
          icon: '❤️',
          text: '+1',
          className: 'bg-red-500/20 text-red-500'
        };
      case 'navigate':
        return {
          icon: '✨',
          text: 'Nice!',
          className: 'bg-blue-500/20 text-blue-500'
        };
      case 'unlock':
        return {
          icon: '🔓',
          text: 'Unlocked!',
          className: 'bg-green-500/20 text-green-500'
        };
      case 'achievement':
        return {
          icon: '🏆',
          text: 'Achievement!',
          className: 'bg-yellow-500/20 text-yellow-500'
        };
      case 'purchase':
        return {
          icon: '💎',
          text: 'Thank you!',
          className: 'bg-purple-500/20 text-purple-500'
        };
      default:
        return {
          icon: '✨',
          text: 'Great!',
          className: 'bg-gray-500/20 text-gray-500'
        };
    }
  };

  const reward = getRewardContent();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: 0 }}
      animate={{ opacity: 1, scale: 1, y: -20 }}
      exit={{ opacity: 0, scale: 0.5, y: -40 }}
      className={cn(
        'fixed pointer-events-none px-3 py-1.5 rounded-full flex items-center gap-1.5 z-50 shadow-lg',
        reward.className,
        className
      )}
      style={{
        left: position?.x || '50%',
        top: position?.y || '50%',
        transform: 'translate(-50%, -50%)'
      }}
    >
      <span className="text-lg">{reward.icon}</span>
      <span className="font-medium text-sm">{reward.text}</span>
    </motion.div>
  );
};

export const MicroRewardsConfig = () => {
  const [intensity, setIntensity] = useState('medium');
  const [frequency, setFrequency] = useState('medium');
  const [previewActive, setPreviewActive] = useState(false);
  
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-medium mb-3">Micro-Rewards Configuration</h3>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Reward Intensity</label>
          <select 
            value={intensity}
            onChange={(e) => setIntensity(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1 block">Reward Frequency</label>
          <select 
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => setPreviewActive(true)}
        >
          Preview Reward
        </button>
      </div>
      
      <AnimatePresence>
        {previewActive && (
          <MicroReward 
            type="like" 
            position={{ x: window.innerWidth / 2, y: window.innerHeight / 2 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Renamed to avoid conflicts with imported hook
export const useLocalNeuroAesthetic = () => {
  const [rewards, setRewards] = useState<{
    id: string;
    type: MicroRewardProps['type'];
    position?: { x: number; y: number };
  }[]>([]);

  const triggerMicroReward = (type: MicroRewardProps['type'], position?: { x: number; y: number }) => {
    const id = `reward-${Date.now()}-${Math.random()}`;
    setRewards(prev => [...prev, { id, type, position }]);
    
    // Remove the reward after animation completes
    setTimeout(() => {
      setRewards(prev => prev.filter(reward => reward.id !== id));
    }, 1500);
  };

  const MicroRewardsRenderer = () => (
    <AnimatePresence>
      {rewards.map(reward => (
        <MicroReward
          key={reward.id}
          type={reward.type}
          position={reward.position}
        />
      ))}
    </AnimatePresence>
  );

  return {
    triggerMicroReward,
    MicroRewardsRenderer
  };
};

export default MicroReward;
