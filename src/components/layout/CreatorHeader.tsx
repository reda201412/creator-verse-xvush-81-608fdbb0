
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { useNeuroAesthetic } from '@/hooks/use-neuro-aesthetic';
import ProfileAvatar from '@/components/shared/ProfileAvatar';
import { Button } from '@/components/ui/button';

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
  isOwner?: boolean;
  isOnline?: boolean;
  className?: string;
}

// ProfileSection component
const ProfileSection = ({ avatar, isOnline }: { avatar: string; isOnline?: boolean }) => (
  <ProfileAvatar 
    src={avatar} 
    alt="Creator Profile" 
    size="xl" 
    status={isOnline ? 'online' : 'offline'} 
    hasStory={false}
  />
);

// HeaderInfo component
const HeaderInfo = ({ 
  name, 
  username, 
  bio, 
  tier 
}: { 
  name: string; 
  username: string; 
  bio: string; 
  tier: string;
}) => (
  <div className="space-y-2">
    <div>
      <h1 className="text-2xl font-bold">{name}</h1>
      <p className="text-muted-foreground">@{username}</p>
    </div>
    <p className="text-sm text-muted-foreground">{bio}</p>
    <div className="flex items-center gap-2">
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        tier === 'bronze' ? 'bg-amber-100 text-amber-800' :
        tier === 'silver' ? 'bg-gray-100 text-gray-800' :
        tier === 'gold' ? 'bg-yellow-100 text-yellow-800' :
        tier === 'platinum' ? 'bg-blue-100 text-blue-800' :
        'bg-purple-100 text-purple-800'
      }`}>
        {tier.charAt(0).toUpperCase() + tier.slice(1)}
      </span>
    </div>
  </div>
);

// CreatorMetrics component
const CreatorMetrics = ({ metrics }: { metrics: CreatorHeaderProps['metrics'] }) => (
  <div className="grid grid-cols-3 gap-4">
    <div className="text-center">
      <p className="text-xl font-bold">{metrics.followers.toLocaleString()}</p>
      <p className="text-xs text-muted-foreground">Followers</p>
    </div>
    {metrics.following !== undefined && (
      <div className="text-center">
        <p className="text-xl font-bold">{metrics.following.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground">Following</p>
      </div>
    )}
    {metrics.superfans !== undefined && (
      <div className="text-center">
        <p className="text-xl font-bold">{metrics.superfans.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground">Superfans</p>
      </div>
    )}
  </div>
);

// TierProgressBar component
const TierProgressBar = ({ tier, progress }: { tier: string; progress: number }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-xs">
      <span>Next tier: {
        tier === 'bronze' ? 'Silver' :
        tier === 'silver' ? 'Gold' :
        tier === 'gold' ? 'Platinum' :
        'Diamond'
      }</span>
      <span>{progress}%</span>
    </div>
    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
      <div 
        className={`h-full ${
          tier === 'bronze' ? 'bg-gray-400' :
          tier === 'silver' ? 'bg-yellow-400' :
          tier === 'gold' ? 'bg-blue-400' :
          'bg-purple-400'
        }`}
        style={{ width: `${progress}%` }}
      />
    </div>
  </div>
);

// RevenueSection component
const RevenueSection = ({ 
  isCreator, 
  isOwner,
  revenue,
  growthRate,
  upcomingEvent,
  onSubscribe
}: { 
  isCreator?: boolean;
  isOwner?: boolean;
  revenue?: number;
  growthRate?: number;
  upcomingEvent?: {
    title: string;
    time: string;
    type: 'live' | 'premiere' | 'event';
    countdown: string;
  };
  onSubscribe?: () => void;
}) => (
  <div className="space-y-4">
    {(isCreator || isOwner) && revenue !== undefined && (
      <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <p className="text-xs text-muted-foreground">Revenue</p>
        <p className="text-2xl font-bold">${revenue.toLocaleString()}</p>
        {growthRate !== undefined && (
          <p className={`text-xs ${growthRate >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {growthRate >= 0 ? '↑' : '↓'} {Math.abs(growthRate)}% from last month
          </p>
        )}
      </div>
    )}
    
    {upcomingEvent && (
      <div className="p-3 border border-dashed border-primary/50 rounded-lg">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium">{upcomingEvent.title}</p>
            <p className="text-xs text-muted-foreground">{upcomingEvent.time}</p>
          </div>
          <span className="px-1.5 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">
            {upcomingEvent.type}
          </span>
        </div>
        <div className="mt-2 flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Starts in {upcomingEvent.countdown}</span>
          {onSubscribe && (
            <button 
              onClick={onSubscribe} 
              className="text-xs text-primary hover:underline"
            >
              Set reminder
            </button>
          )}
        </div>
      </div>
    )}
  </div>
);

const CreatorHeader = ({
  name,
  username,
  avatar,
  bio,
  tier,
  metrics,
  isCreator = false,
  isOwner = false,
  isOnline = false,
  className,
}: CreatorHeaderProps) => {
  const { triggerMicroReward } = useNeuroAesthetic();
  
  // Mock data for upcoming event
  const upcomingEvent = {
    title: "Session photo spéciale abonnés",
    time: "Demain, 20:00",
    type: 'live' as const,
    countdown: "23h 45m"
  };

  const handleEventSubscribe = () => {
    console.log("Reminder set for upcoming event");
  };
  
  const handleMessageClick = () => {
    triggerMicroReward('navigate');
  };

  return (
    <div className={cn("glass-card rounded-2xl p-6", className)}>
      <div className="flex flex-col md:flex-row md:items-start gap-6">
        <div className="flex flex-col items-center gap-3">
          <ProfileSection avatar={avatar} isOnline={isOnline} />
          
          {/* Message button that links to the messages page with creator username in state */}
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full flex items-center gap-2"
            asChild
            onClick={handleMessageClick}
          >
            <Link to={`/messages?username=${username}`}>
              <MessageSquare size={16} />
              Envoyer un message
            </Link>
          </Button>
        </div>

        <div className="flex-grow space-y-4">
          <HeaderInfo 
            name={name} 
            username={username} 
            bio={bio} 
            tier={tier} 
          />

          <Separator className="my-3" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-2">
              <div className="space-y-4">
                <CreatorMetrics metrics={metrics} />
                
                {metrics.nextTierProgress !== undefined && tier !== 'diamond' && (
                  <TierProgressBar 
                    tier={tier} 
                    progress={metrics.nextTierProgress} 
                  />
                )}
              </div>
            </div>
            
            <div className="col-span-1">
              <RevenueSection 
                isCreator={isCreator}
                isOwner={isOwner}
                revenue={metrics.revenue}
                growthRate={metrics.growthRate}
                upcomingEvent={upcomingEvent}
                onSubscribe={handleEventSubscribe}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorHeader;
