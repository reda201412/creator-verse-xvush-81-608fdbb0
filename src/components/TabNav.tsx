
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutGrid, PlayCircle, Crown, Star, BarChart3, Folder } from 'lucide-react';

interface Tab {
  value: string;
  label: string;
  icon: string;
}

interface TabNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isCreator?: boolean;
  className?: string;
  tabs?: Tab[];
}

const TabNav = ({ 
  activeTab, 
  onTabChange, 
  isCreator = false, 
  className,
  tabs
}: TabNavProps) => {
  // Tabs par défaut si non spécifiés
  const defaultTabs = [
    { value: 'grid', label: 'Tous', icon: 'layout-grid' },
    { value: 'videos', label: 'Vidéos', icon: 'play-circle' },
    { value: 'premium', label: 'Premium', icon: 'crown' },
    { value: 'vip', label: 'VIP', icon: 'star' },
  ];
  
  if (isCreator) {
    defaultTabs.push({ value: 'stats', label: 'Statistiques', icon: 'bar-chart-3' });
  }
  
  const tabsToRender = tabs || defaultTabs;
  
  // Helper pour rendre l'icône selon son nom
  const renderIcon = (iconName: string, size: number = 16) => {
    switch (iconName) {
      case 'layout-grid': return <LayoutGrid size={size} />;
      case 'play-circle': 
      case 'film': return <PlayCircle size={size} />;
      case 'crown': return <Crown size={size} />;
      case 'star': return <Star size={size} />;
      case 'bar-chart-3': return <BarChart3 size={size} />;
      case 'folder': return <Folder size={size} />;
      default: return <LayoutGrid size={size} />;
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <Tabs 
        defaultValue={activeTab} 
        value={activeTab} 
        onValueChange={onTabChange}
        className="w-full"
      >
        <TabsList className="w-full flex">
          {tabsToRender.map((tab) => (
            <TabsTrigger 
              key={tab.value}
              value={tab.value} 
              className="flex-1 flex items-center justify-center gap-1"
            >
              {renderIcon(tab.icon)}
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default TabNav;
