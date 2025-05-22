
import React from 'react';
import { cn } from '@/lib/utils';
import ProgressBar from '@/components/ui/ProgressBar';

interface TierProgressBarProps {
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  progress: number; // 0-100
  className?: string;
}

const TierProgressBar: React.FC<TierProgressBarProps> = ({
  tier,
  progress,
  className
}) => {
  const getNextTier = () => {
    switch (tier) {
      case 'bronze': return 'silver';
      case 'silver': return 'gold';
      case 'gold': return 'platinum';
      case 'platinum': return 'diamond';
      case 'diamond': return 'diamond';
    }
  };
  
  const getTierColor = () => {
    switch (tier) {
      case 'bronze': return 'bg-gradient-to-r from-amber-700 to-amber-500';
      case 'silver': return 'bg-gradient-to-r from-gray-400 to-gray-300';
      case 'gold': return 'bg-gradient-to-r from-yellow-500 to-amber-300';
      case 'platinum': return 'bg-gradient-to-r from-gray-300 to-white';
      case 'diamond': return 'bg-gradient-to-r from-blue-400 to-purple-500';
    }
  };
  
  const getNextTierColor = () => {
    const nextTier = getNextTier();
    switch (nextTier) {
      case 'silver': return 'bg-gradient-to-r from-gray-400 to-gray-300';
      case 'gold': return 'bg-gradient-to-r from-yellow-500 to-amber-300';
      case 'platinum': return 'bg-gradient-to-r from-gray-300 to-white';
      case 'diamond': return 'bg-gradient-to-r from-blue-400 to-purple-500';
      default: return 'bg-gradient-to-r from-blue-400 to-purple-500';
    }
  };

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex justify-between items-center">
        <span className="text-xs capitalize font-medium">{tier}</span>
        <span className="text-xs capitalize text-muted-foreground">{getNextTier()}</span>
      </div>
      
      <ProgressBar 
        value={progress} 
        max={100} 
        color={getTierColor()}
        height="h-1.5"
        showPercentage={false}
      />
      
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">{progress}%</span>
        <span className="text-xs text-muted-foreground">
          {tier !== 'diamond' ? 'Prochain niveau' : 'Niveau maximum atteint'}
        </span>
      </div>
    </div>
  );
};

export default TierProgressBar;
