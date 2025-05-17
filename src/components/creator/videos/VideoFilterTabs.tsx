
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface VideoFilterTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

const VideoFilterTabs: React.FC<VideoFilterTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="mb-6">
      <Tabs defaultValue="all" value={activeTab} onValueChange={onTabChange}>
        <TabsList>
          <TabsTrigger value="all">Toutes</TabsTrigger>
          <TabsTrigger value="teaser">Xtease</TabsTrigger>
          <TabsTrigger value="standard">Gratuites</TabsTrigger>
          <TabsTrigger value="premium">Premium</TabsTrigger>
          <TabsTrigger value="vip">VIP</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default VideoFilterTabs;
