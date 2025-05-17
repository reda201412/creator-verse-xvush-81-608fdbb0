
import { cn } from '@/lib/utils';
import { CalendarClock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UpcomingEventProps {
  title: string;
  time: string;
  type: 'live' | 'post' | 'event';
  countdown?: string;
  className?: string;
  onSubscribe?: () => void;
}

const UpcomingEvent = ({ 
  title, 
  time, 
  type, 
  countdown,
  className,
  onSubscribe
}: UpcomingEventProps) => {
  return (
    <div className={cn(
      "bg-black/5 dark:bg-white/5 rounded-lg p-3",
      className
    )}>
      <div className="flex items-center gap-2 mb-2">
        <CalendarClock size={16} className="text-xvush-pink" />
        <span className="text-xs font-medium">{type === 'live' ? 'Live à venir' : type === 'post' ? 'Nouvelle publication' : 'Événement'}</span>
      </div>
      
      <h4 className="font-medium text-sm mb-1">{title}</h4>
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          {time} {countdown && <span className="font-medium text-xvush-pink">({countdown})</span>}
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs h-7 px-2"
          onClick={onSubscribe}
        >
          Rappel
        </Button>
      </div>
    </div>
  );
};

export default UpcomingEvent;
