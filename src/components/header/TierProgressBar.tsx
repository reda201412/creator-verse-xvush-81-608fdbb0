
import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import ProgressBar from '../ProgressBar';

interface TierProgressBarProps {
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  progress: number;
}

const TierProgressBar = ({ tier, progress }: TierProgressBarProps) => {
  const tierProgressMap = {
    bronze: { current: 'Bronze', next: 'Silver', revShare: '60%' },
    silver: { current: 'Silver', next: 'Gold', revShare: '70%' },
    gold: { current: 'Gold', next: 'Platinum', revShare: '80%' },
    platinum: { current: 'Platinum', next: 'Diamond', revShare: '90%' },
    diamond: { current: 'Diamond', next: 'Diamond', revShare: '95%' },
  };

  const isMaxTier = tier === 'diamond';
  
  // Helper function to get next tier revenue share safely
  const getNextTierRevShare = () => {
    // Create a type guard that ensures we're working with known tier keys
    type TierKey = keyof typeof tierProgressMap;
    const nextTierName = tierProgressMap[tier].next.toLowerCase();
    
    // Check if the nextTierName is a valid key in our tierProgressMap
    if (nextTierName === 'diamond') {
      return tierProgressMap.diamond.revShare;
    } else {
      // Type assertion with safety check
      const nextTier = nextTierName as TierKey;
      return tierProgressMap[nextTier].revShare;
    }
  };

  if (isMaxTier) return null;

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-xs">
        <div className="flex items-center gap-1">
          <span>{tierProgressMap[tier].current}</span>
          <Popover>
            <PopoverTrigger className="text-muted-foreground hover:text-foreground transition-colors">
              <span className="text-xs underline underline-offset-2">{tierProgressMap[tier].revShare} de revenus</span>
            </PopoverTrigger>
            <PopoverContent className="text-xs w-52 p-3">
              En tant que créateur de niveau {tierProgressMap[tier].current}, vous conservez {tierProgressMap[tier].revShare} de vos revenus générés.
            </PopoverContent>
          </Popover>
        </div>
        <span>{tierProgressMap[tier].next}</span>
      </div>
      <ProgressBar 
        value={progress} 
        max={100} 
        color={tier === 'gold' ? 'bg-xvush-gold' : 'bg-xvush-pink'} 
        height="h-1.5" 
      />
      <div className="text-xs text-muted-foreground text-center">
        {progress}% vers le niveau {tierProgressMap[tier].next} ({getNextTierRevShare()} de revenus)
      </div>
    </div>
  );
};

export default TierProgressBar;
