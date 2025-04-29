
import React from 'react';
import RevenueChart from '../RevenueChart';
import UpcomingEvent from '../UpcomingEvent';

interface RevenueSectionProps {
  isCreator: boolean;
  revenue?: number;
  growthRate?: number;
  upcomingEvent: {
    title: string;
    time: string;
    type: 'live';
    countdown: string;
  };
  onSubscribe: () => void;
}

const RevenueSection = ({ 
  isCreator, 
  revenue, 
  growthRate,
  upcomingEvent,
  onSubscribe 
}: RevenueSectionProps) => {
  return (
    <div className="space-y-3">
      {isCreator && revenue && (
        <div className="bg-black/5 dark:bg-white/5 rounded-lg p-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm">Revenus ce mois</span>
            <div className="font-semibold">
              ${revenue}
            </div>
          </div>
          <RevenueChart 
            growthRate={growthRate} 
          />
        </div>
      )}
      
      <UpcomingEvent 
        {...upcomingEvent}
        onSubscribe={onSubscribe}
      />
    </div>
  );
};

export default RevenueSection;
