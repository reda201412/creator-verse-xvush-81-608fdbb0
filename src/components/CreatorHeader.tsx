
import React from 'react';
import ProfileAvatar from './ProfileAvatar';
import CreatorBadge from './CreatorBadge';
import ProgressBar from './ProgressBar';
import RevenueChart from './RevenueChart';
import CreatorPulse from './CreatorPulse';
import UpcomingEvent from './UpcomingEvent';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { MessageSquare, Bell, MoreHorizontal, Star, StarHalf, Badge } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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
    bronze: { current: 'Bronze', next: 'Silver', revShare: '60%' },
    silver: { current: 'Silver', next: 'Gold', revShare: '70%' },
    gold: { current: 'Gold', next: 'Platinum', revShare: '80%' },
    platinum: { current: 'Platinum', next: 'Diamond', revShare: '90%' },
    diamond: { current: 'Diamond', next: 'Diamond', revShare: '95%' },
  };

  const isMaxTier = tier === 'diamond';
  
  // Mock data for upcoming event
  const upcomingEvent = {
    title: "Session photo spéciale abonnés",
    time: "Demain, 20:00",
    type: 'live' as const,
    countdown: "23h 45m"
  };

  return (
    <div className={cn("glass-card rounded-2xl p-6", className)}>
      <div className="flex flex-col md:flex-row md:items-start gap-6">
        <div className="flex flex-col items-center gap-2">
          <ProfileAvatar 
            src={avatar} 
            size="xl" 
            hasStory={true} 
            status={isOnline ? 'online' : undefined}
          />
          
          <CreatorPulse 
            status={isOnline ? 'online' : 'creating'} 
            className="mt-1"
          />
        </div>

        <div className="flex-grow space-y-4">
          <div className="flex flex-wrap justify-between items-start">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-display font-bold">{name}</h1>
                <CreatorBadge tier={tier} />
              </div>

              <p className="text-muted-foreground">@{username}</p>
              <p className="text-sm max-w-lg">{bio}</p>
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

          <Separator className="my-3" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-2">
              <div className="space-y-4">
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
                
                {metrics.nextTierProgress !== undefined && !isMaxTier && (
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
                      value={metrics.nextTierProgress} 
                      max={100} 
                      color={tier === 'gold' ? 'bg-xvush-gold' : 'bg-xvush-pink'} 
                      height="h-1.5" 
                    />
                    <div className="text-xs text-muted-foreground text-center">
                      {metrics.nextTierProgress}% vers le niveau {tierProgressMap[tier].next} ({tierProgressMap[tier === 'diamond' ? 'diamond' : tierProgressMap[tier].next.toLowerCase() as keyof typeof tierProgressMap].revShare} de revenus)
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="col-span-1">
              {isCreator ? (
                <div className="space-y-3">
                  {metrics.revenue && (
                    <div className="bg-black/5 dark:bg-white/5 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Revenus ce mois</span>
                        <div className="font-semibold">
                          ${metrics.revenue}
                        </div>
                      </div>
                      <RevenueChart 
                        growthRate={metrics.growthRate} 
                      />
                    </div>
                  )}
                  
                  <UpcomingEvent 
                    {...upcomingEvent}
                    onSubscribe={() => console.log("Reminder set for upcoming event")}
                  />
                </div>
              ) : (
                <UpcomingEvent 
                  {...upcomingEvent}
                  onSubscribe={() => console.log("Reminder set for upcoming event")}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorHeader;
