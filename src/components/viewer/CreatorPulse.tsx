
import React from 'react';
import { cn } from '@/lib/utils';
import { Activity, CircleDot, CirclePause, CalendarClock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type PulseStatus = 'online' | 'creating' | 'scheduled' | 'offline';

interface CreatorPulseProps {
  status: PulseStatus;
  scheduledTime?: string;
  className?: string;
}

const CreatorPulse = ({ status, scheduledTime, className }: CreatorPulseProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'online':
        return {
          color: 'bg-green-500',
          icon: <CircleDot size={14} className="text-green-500" />,
          label: 'En ligne',
          description: 'Disponible maintenant'
        };
      case 'creating':
        return {
          color: 'bg-amber-500',
          icon: <Activity size={14} className="text-amber-500" />,
          label: 'En création',
          description: 'Nouveau contenu en préparation'
        };
      case 'scheduled':
        return {
          color: 'bg-blue-500',
          icon: <CalendarClock size={14} className="text-blue-500" />,
          label: 'Programmé',
          description: scheduledTime ? `Prochain live à ${scheduledTime}` : 'Événement à venir'
        };
      case 'offline':
      default:
        return {
          color: 'bg-gray-400',
          icon: <CirclePause size={14} className="text-gray-400" />,
          label: 'Hors ligne',
          description: 'Reviendra bientôt'
        };
    }
  };

  const { color, icon, label, description } = getStatusConfig();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={cn("flex items-center gap-1.5 group", className)}>
          <span className={cn(
            "relative flex h-2.5 w-2.5 rounded-full",
            status === 'online' && "animate-pulse"
          )}>
            <span className={cn("absolute inline-flex h-full w-full rounded-full", color)} />
          </span>
          <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
            {label}
          </span>
          {icon}
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p className="text-xs">{description}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default CreatorPulse;
