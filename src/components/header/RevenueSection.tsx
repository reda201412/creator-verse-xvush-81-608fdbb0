
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CreditCard, Crown } from 'lucide-react';
import RevenueChart from '@/components/viewer/RevenueChart';
import UpcomingEvent from '@/components/viewer/UpcomingEvent';

interface RevenueSectionProps {
  isCreator?: boolean;
  isOwner?: boolean;
  revenue?: number;
  growthRate?: number;
  upcomingEvent?: {
    title: string;
    time: string;
    type: 'live' | 'post' | 'event';
    countdown: string;
  };
  onSubscribe?: () => void;
  className?: string;
}

const RevenueSection: React.FC<RevenueSectionProps> = ({
  isCreator = false,
  isOwner = false,
  revenue,
  growthRate = 0,
  upcomingEvent,
  onSubscribe,
  className
}) => {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Creator revenue display - only visible to the profile owner */}
      {isCreator && isOwner && revenue !== undefined && (
        <div className="glass-card p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <div className="text-xs text-muted-foreground">Revenu mensuel</div>
            <CreditCard size={16} className="text-muted-foreground" />
          </div>
          
          <div className="text-2xl font-bold">${revenue}</div>
          
          <RevenueChart growthRate={growthRate} className="mt-2" />
        </div>
      )}
      
      {/* Subscriber button (for fans) */}
      {!isCreator && (
        <Button className="w-full bg-xvush-pink hover:bg-xvush-pink-dark">
          <Crown className="mr-2 h-4 w-4" />
          S'abonner
        </Button>
      )}
      
      {/* Upcoming event */}
      {upcomingEvent && (
        <UpcomingEvent 
          title={upcomingEvent.title}
          time={upcomingEvent.time}
          type={upcomingEvent.type}
          countdown={upcomingEvent.countdown}
          onSubscribe={onSubscribe}
        />
      )}
    </div>
  );
};

export default RevenueSection;
