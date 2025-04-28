
import React from 'react';
import ProfileAvatar from './ProfileAvatar';
import CreatorBadge from './CreatorBadge';
import ProgressBar from './ProgressBar';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { MessageSquare, Bell, MoreHorizontal } from 'lucide-react';

interface CreatorHeaderProps {
  name: string;
  username: string;
  avatar: string;
  bio: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  metrics: {
    followers: number;
    following?: number;
    revenue?: number;
    growthRate?: number;
    nextTierProgress?: number;
    retentionRate?: number;
    superfans?: number;
    watchMinutes?: number;
  };
  isCreator?: boolean;
  isOnline?: boolean;
  className?: string;
}

const CreatorHeader = ({
  name,
  username,
  avatar,
  bio,
  tier,
  metrics,
  isCreator = false,
  isOnline = false,
  className,
}: CreatorHeaderProps) => {
  // Format large numbers with K or M suffix
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const tierProgressMap = {
    bronze: { current: 'Bronze', next: 'Silver' },
    silver: { current: 'Silver', next: 'Gold' },
    gold: { current: 'Gold', next: 'Platinum' },
    platinum: { current: 'Platinum', next: 'Diamond' },
    diamond: { current: 'Diamond', next: 'Diamond' },
  };

  const isMaxTier = tier === 'diamond';

  return (
    <div className={cn("glass-card rounded-2xl p-6", className)}>
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <ProfileAvatar 
          src={avatar} 
          size="xl" 
          hasStory={true} 
          status={isOnline ? 'online' : undefined}
        />

        <div className="flex-grow space-y-3">
          <div className="flex flex-wrap justify-between items-center gap-2">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-display font-bold">{name}</h1>
              <CreatorBadge tier={tier} />
            </div>

            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="rounded-full"
              >
                <MessageSquare size={18} className="mr-1" />
                Message
              </Button>

              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-full w-9 p-0"
              >
                <Bell size={18} />
              </Button>

              <Button 
                variant="ghost" 
                size="sm" 
                className="rounded-full w-9 p-0"
              >
                <MoreHorizontal size={18} />
              </Button>
            </div>
          </div>

          <div>
            <p className="text-muted-foreground">@{username}</p>
            <p className="mt-2 text-sm">{bio}</p>
          </div>

          <div className="pt-2">
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm mb-3">
              <div>
                <span className="font-semibold">{formatNumber(metrics.followers)}</span>{' '}
                <span className="text-muted-foreground">abonnés</span>
              </div>
              
              {metrics.following !== undefined && (
                <div>
                  <span className="font-semibold">{formatNumber(metrics.following)}</span>{' '}
                  <span className="text-muted-foreground">abonnements</span>
                </div>
              )}
              
              {metrics.superfans !== undefined && (
                <div>
                  <span className="font-semibold">{formatNumber(metrics.superfans)}</span>{' '}
                  <span className="text-muted-foreground">super-fans</span>
                </div>
              )}
              
              {metrics.retentionRate !== undefined && (
                <div>
                  <span className="font-semibold">{metrics.retentionRate}%</span>{' '}
                  <span className="text-muted-foreground">fidélisation</span>
                </div>
              )}
              
              {metrics.watchMinutes !== undefined && (
                <div>
                  <span className="font-semibold">{formatNumber(metrics.watchMinutes)}</span>{' '}
                  <span className="text-muted-foreground">min regardées</span>
                </div>
              )}
            </div>
            
            {isCreator && metrics.revenue && (
              <div className="bg-black/5 dark:bg-white/5 rounded-lg p-3 mb-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Revenus ce mois</span>
                  <div className="font-semibold">
                    ${metrics.revenue} 
                    {metrics.growthRate && metrics.growthRate > 0 && (
                      <span className="text-green-500 text-xs ml-1">
                        +{metrics.growthRate}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {metrics.nextTierProgress !== undefined && !isMaxTier && (
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span>{tierProgressMap[tier].current}</span>
                  <span>{tierProgressMap[tier].next}</span>
                </div>
                <ProgressBar 
                  value={metrics.nextTierProgress} 
                  max={100} 
                  color={tier === 'gold' ? 'bg-xvush-gold' : 'bg-xvush-pink'} 
                  height="h-1" 
                />
                <div className="text-xs text-muted-foreground text-center">
                  {metrics.nextTierProgress}% vers le niveau {tierProgressMap[tier].next}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorHeader;
