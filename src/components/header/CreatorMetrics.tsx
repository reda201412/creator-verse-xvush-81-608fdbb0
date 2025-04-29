
import React from 'react';
import { Badge, Star, StarHalf } from 'lucide-react';

interface CreatorMetricsProps {
  metrics: {
    followers: number;
    following?: number;
    superfans?: number;
    retentionRate?: number;
    watchMinutes?: number;
  };
}

const CreatorMetrics = ({ metrics }: CreatorMetricsProps) => {
  // Format large numbers with K or M suffix
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
      <div className="flex items-center">
        <Badge size={14} className="mr-1.5 text-xvush-pink" />
        <span className="font-semibold">{formatNumber(metrics.followers)}</span>{' '}
        <span className="text-muted-foreground ml-1">abonnés</span>
      </div>
      
      {metrics.following !== undefined && (
        <div>
          <span className="font-semibold">{formatNumber(metrics.following)}</span>{' '}
          <span className="text-muted-foreground">abonnements</span>
        </div>
      )}
      
      {metrics.superfans !== undefined && (
        <div className="flex items-center">
          <Star size={14} className="mr-1.5 text-xvush-gold" />
          <span className="font-semibold">{formatNumber(metrics.superfans)}</span>{' '}
          <span className="text-muted-foreground ml-1">super-fans</span>
        </div>
      )}
      
      {metrics.retentionRate !== undefined && (
        <div className="flex items-center">
          <StarHalf size={14} className="mr-1.5 text-blue-400" />
          <span className="font-semibold">{metrics.retentionRate}%</span>{' '}
          <span className="text-muted-foreground ml-1">fidélisation</span>
        </div>
      )}
      
      {metrics.watchMinutes !== undefined && (
        <div>
          <span className="font-semibold">{formatNumber(metrics.watchMinutes)}</span>{' '}
          <span className="text-muted-foreground">min regardées</span>
        </div>
      )}
    </div>
  );
};

export default CreatorMetrics;
