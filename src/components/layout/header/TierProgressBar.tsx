
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface TierProgressBarProps {
  currentPoints: number;
  nextTierPoints: number;
  currentTier: string;
  nextTier: string;
}

const TierProgressBar = ({
  currentPoints,
  nextTierPoints,
  currentTier,
  nextTier
}: TierProgressBarProps) => {
  const progressPercentage = Math.min(Math.round((currentPoints / nextTierPoints) * 100), 100);

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-muted-foreground mb-1">
        <div>Niveau {currentTier}</div>
        <div>{currentPoints}/{nextTierPoints} points</div>
        <div>Niveau {nextTier}</div>
      </div>
      
      <Progress value={progressPercentage} className="h-2" />
      
      <div className="text-xs text-center mt-1 text-muted-foreground">
        {100 - progressPercentage}% restants pour passer au niveau suivant
      </div>
    </div>
  );
};

export default TierProgressBar;
