
import React from 'react';
import { cn } from '@/lib/utils';

interface CreatorBadgeProps {
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  className?: string;
}

const CreatorBadge = ({ tier, className }: CreatorBadgeProps) => {
  const tierConfig = {
    bronze: {
      color: 'bg-gradient-to-r from-amber-700 to-amber-500',
      text: 'Bronze',
      textColor: 'text-white',
    },
    silver: {
      color: 'bg-gradient-to-r from-gray-400 to-gray-300',
      text: 'Silver',
      textColor: 'text-gray-800',
    },
    gold: {
      color: 'bg-gradient-to-r from-yellow-500 to-amber-300',
      text: 'Gold',
      textColor: 'text-gray-800',
    },
    platinum: {
      color: 'bg-gradient-to-r from-gray-300 to-gray-100',
      text: 'Platinum',
      textColor: 'text-gray-800',
    },
    diamond: {
      color: 'bg-gradient-to-r from-blue-400 to-purple-500',
      text: 'Diamond',
      textColor: 'text-white',
    },
  };

  const { color, text, textColor } = tierConfig[tier];

  return (
    <span 
      className={cn(
        'px-2 py-0.5 text-xs font-semibold rounded-full',
        color,
        textColor,
        className
      )}
    >
      {text}
    </span>
  );
};

export default CreatorBadge;
