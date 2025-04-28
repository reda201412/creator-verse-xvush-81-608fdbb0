
import React from 'react';
import { cn } from '@/lib/utils';
import { Grid, Play, Crown, Calendar, Sparkles } from 'lucide-react';

interface TabNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  className?: string;
  isCreator?: boolean;
}

const TabNav = ({ activeTab, onTabChange, className, isCreator = false }: TabNavProps) => {
  const tabs = [
    { id: 'grid', label: 'Grid', icon: <Grid size={20} /> },
    { id: 'videos', label: 'Videos', icon: <Play size={20} /> },
    { id: 'premium', label: 'Premium', icon: <Sparkles size={20} /> },
    { id: 'vip', label: 'VIP', icon: <Crown size={20} /> },
  ];
  
  if (isCreator) {
    tabs.push({ id: 'calendar', label: 'Calendar', icon: <Calendar size={20} /> });
  }

  return (
    <div className={cn("flex justify-center border-b", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "flex flex-1 md:flex-none items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all",
            "md:min-w-[100px] relative",
            activeTab === tab.id ? 
              "text-primary border-b-2 border-xvush-pink -mb-px" : 
              "text-muted-foreground hover:text-primary"
          )}
        >
          {tab.icon}
          <span className="hidden sm:inline">{tab.label}</span>
          
          {activeTab === tab.id && (
            <span 
              className="absolute bottom-0 left-0 w-full h-0.5 bg-xvush-pink"
              style={{
                transform: 'translateY(1px)'
              }}
            />
          )}
        </button>
      ))}
    </div>
  );
};

export default TabNav;
