
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VideoData, getCreators, getAllVideos, CreatorProfile } from '@/services/creatorService';
import { useAuth } from '@/contexts/AuthContext';
import CreatorCard from '@/components/creator/CreatorCard';
import VideoCard from '@/components/creator/videos/VideoCard';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const TrendingContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [creators, setCreators] = useState<CreatorProfile[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const videoData = await getAllVideos();
        setVideos(videoData);
        
        const creatorData = await getCreators();
        setCreators(creatorData);
      } catch (error) {
        console.error('Error fetching content:', error);
      }
    };
    
    fetchData();
  }, []);

  const filteredVideos = videos.filter(video => {
    if (activeTab !== 'all' && video.format !== activeTab) {
      return false;
    }
    if (searchQuery && !video.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleVideoClick = (video: VideoData) => {
    console.log('Video clicked:', video);
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Contenu Tendance</h1>

      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList>
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="9:16">Xtease</TabsTrigger>
            <TabsTrigger value="16:9">Standard</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full md:w-64 mt-4 md:mt-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <Input
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Vidéos Tendances</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map(video => (
          <VideoCard
            key={video.id}
            video={video}
            onClick={() => handleVideoClick(video)}
          />
        ))}
      </div>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Créateurs Populaires</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {creators.map(creator => (
          <CreatorCard
            key={creator.id}
            id={creator.id}
            username={creator.username}
            displayName={creator.displayName}
            avatarUrl={creator.avatarUrl}
            bio={creator.bio || ''}
            followersCount={creator.followersCount || 0}
            isOnline={creator.isOnline || false}
          />
        ))}
      </div>
    </div>
  );
};

export default TrendingContent;
