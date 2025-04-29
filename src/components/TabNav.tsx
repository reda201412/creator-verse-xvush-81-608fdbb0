
import React from 'react';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Grid, PlayCircle, Crown, Star, BarChart3 } from 'lucide-react';

interface TabNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isCreator?: boolean;
  className?: string;
}

const TabNav = ({ activeTab, onTabChange, isCreator = false, className }: TabNavProps) => {
  return (
    <div className={cn("w-full", className)}>
      <Tabs 
        defaultValue={activeTab} 
        value={activeTab} 
        onValueChange={onTabChange}
        className="w-full"
      >
        <TabsList className="w-full flex">
          <TabsTrigger value="grid" className="flex-1 flex items-center justify-center gap-1">
            <Grid size={16} />
            Tous
          </TabsTrigger>
          <TabsTrigger value="videos" className="flex-1 flex items-center justify-center gap-1">
            <PlayCircle size={16} />
            Vidéos
          </TabsTrigger>
          <TabsTrigger value="premium" className="flex-1 flex items-center justify-center gap-1">
            <Crown size={16} />
            Premium
          </TabsTrigger>
          <TabsTrigger value="vip" className="flex-1 flex items-center justify-center gap-1">
            <Star size={16} />
            VIP
          </TabsTrigger>
          {isCreator && (
            <TabsTrigger value="stats" className="flex-1 flex items-center justify-center gap-1">
              <BarChart3 size={16} />
              Statistiques
            </TabsTrigger>
          )}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default TabNav;
