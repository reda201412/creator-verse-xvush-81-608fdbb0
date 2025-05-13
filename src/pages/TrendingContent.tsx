import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAllVideos } from '@/services/creatorService';
import CreatorCard from '@/components/creator/CreatorCard';
import VideoCard from '@/components/creator/videos/VideoCard';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
// Import the creator adapter
import { adaptCreatorProfile } from '@/utils/creator-profile-adapter';

interface TrendingContentItem {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  creatorId: string;
  creatorUsername: string;
  creatorAvatar: string;
  views: number;
  likes: number;
  isPremium: boolean;
  tokenPrice: number;
}

const TrendingContent: React.FC = () => {
  const [videos, setVideos] = useState<VideoMetadata[]>([]);
  const [creators, setCreators] = useState<CreatorProfileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('videos');
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const fetchedVideos = await getAllVideos();
        const fetchedCreators = await getAllCreators();

        // Convert VideoFirestoreData to VideoMetadata
        const videoMetadata: VideoMetadata[] = fetchedVideos.map(video => ({
          id: video.id || '',
          title: video.title,
          description: video.description || '',
          type: video.type as ContentType,
          videoFile: new File([], 'placeholder'), // Placeholder file
          thumbnailUrl: video.thumbnailUrl,
          video_url: video.videoUrl,
          url: video.videoUrl,
          format: video.format || '16:9',
          isPremium: video.isPremium || false,
          tokenPrice: video.tokenPrice,
        }));

        setVideos(videoMetadata);
        setCreators(fetchedCreators);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger le contenu. Veuillez réessayer.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleVideoClick = (videoId: string) => {
    console.log("Video clicked:", videoId);
    toast({ title: "Fonctionnalité à implémenter", description: `Voir la vidéo ID: ${videoId}` });
  };

  const handleCreatorClick = (creatorId: string) => {
    console.log("Creator clicked:", creatorId);
    toast({ title: "Fonctionnalité à implémenter", description: `Voir le profil du créateur ID: ${creatorId}` });
  };

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCreators = creators.filter(creator =>
    creator.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (creator.displayName && creator.displayName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Tendances</h1>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher du contenu ou un créateur..."
          className="pl-10"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <Tabs defaultValue="videos" value={activeTab} onValueChange={handleTabChange} className="mb-6">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="videos">Vidéos</TabsTrigger>
          <TabsTrigger value="creators">Créateurs</TabsTrigger>
        </TabsList>
        <TabsContent value="videos" className="mt-4">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="p-4 border rounded-lg animate-pulse">
                  <Skeleton className="h-32 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-1" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredVideos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredVideos.map(video => (
                <VideoCard
                  key={video.id}
                  id={video.id}
                  title={video.title}
                  description={video.description}
                  thumbnailUrl={video.thumbnailUrl}
                  videoUrl={video.video_url}
                  onClick={() => handleVideoClick(video.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">Aucune vidéo trouvée correspondant à vos critères.</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="creators" className="mt-4">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="p-4 border rounded-lg animate-pulse">
                  <div className="flex items-center space-x-4 mb-2">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          ) : filteredCreators.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredCreators.map(creatorData => {
                // Update any creator access to use our adapter
                const standardizedCreator = adaptCreatorProfile(creatorData);

                return (
                  <CreatorCard
                    key={standardizedCreator.uid}
                    id={standardizedCreator.uid}
                    username={standardizedCreator.username}
                    displayName={standardizedCreator.displayName}
                    avatarUrl={standardizedCreator.avatarUrl}
                    bio={standardizedCreator.bio}
                    followersCount={0} // Add default value for required prop
                    isOnline={false} // Add default for isOnline
                    onClick={() => handleCreatorClick(standardizedCreator.uid)}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">Aucun créateur trouvé correspondant à vos critères.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrendingContent;
