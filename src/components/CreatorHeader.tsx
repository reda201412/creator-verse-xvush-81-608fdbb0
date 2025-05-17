
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import ProfileSection from './header/ProfileSection';
import HeaderInfo from './header/HeaderInfo';
import CreatorMetrics from './header/CreatorMetrics';
import TierProgressBar from './header/TierProgressBar';
import RevenueSection from './header/RevenueSection';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { MessageSquare } from 'lucide-react';
import { useNeuroAesthetic } from '@/hooks/use-neuro-aesthetic';

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
          <ProfileSection 
            avatar={avatar} 
            isOnline={isOnline} 
            pulseStatus="online"
            scheduledTime=""
            className=""
          />
          
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
