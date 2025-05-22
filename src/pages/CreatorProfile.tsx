
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { FileVideo, Play, BarChart } from 'lucide-react';
import { getVideosByUserId } from '@/services/videoService';
import ContentPricing from '@/components/creator/ContentPricing';
import { VideoData } from '@/types/video';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface CreatorData {
  id: string;
  displayName: string;
  username: string;
  avatarUrl: string;
  bio: string;
  followers?: number;
  isPremium?: boolean;
}

const CreatorProfile = () => {
  const { username } = useParams<{ username: string }>();
  const [creator, setCreator] = useState<CreatorData | null>(null);
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCreatorData = async () => {
      setIsLoading(true);
      try {
        // For now, we're using mock data
        // In a real app, you would fetch this from your API
        const mockCreator = {
          id: "creator123",
          displayName: username || "Creative Creator",
          username: username || "creator",
          avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=" + username,
          bio: "Créateur de contenu passionné",
          followers: 1250,
          isPremium: true,
        };
        setCreator(mockCreator);
        
        if (mockCreator.id) {
          // Fetch videos for this creator
          const creatorVideos = await getVideosByUserId(mockCreator.id);
          setVideos(creatorVideos);
        }
      } catch (error) {
        console.error('Error fetching creator data:', error);
        toast.error('Impossible de charger le profil créateur');
      } finally {
        setIsLoading(false);
      }
    };

    if (username) {
      fetchCreatorData();
    }
  }, [username]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/3 space-y-6">
            <Skeleton className="h-40 w-40 rounded-full mx-auto" />
            <Skeleton className="h-8 w-2/3 mx-auto" />
            <Skeleton className="h-20 w-full" />
          </div>
          
          <div className="w-full lg:w-2/3">
            <Skeleton className="h-12 w-full mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array(4).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-64 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Créateur non trouvé</h1>
        <p className="text-muted-foreground mb-6">
          Le créateur que vous recherchez n'existe pas ou a supprimé son compte.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Creator Info Section */}
        <div className="w-full lg:w-1/3 space-y-6">
          {/* Avatar and basic info */}
          <div className="text-center">
            <Avatar className="h-40 w-40 mx-auto border-4 border-primary">
              <AvatarImage src={creator.avatarUrl} alt={creator.displayName} />
              <AvatarFallback>{creator.displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            
            <h1 className="text-3xl font-bold mt-4 relative inline-flex items-center gap-2">
              {creator.displayName}
              {creator.isPremium && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600">
                  Premium
                </Badge>
              )}
            </h1>
            
            <p className="text-muted-foreground">@{creator.username}</p>
            
            {creator.followers && (
              <p className="mt-2 font-medium">{creator.followers.toLocaleString()} abonnés</p>
            )}
            
            <div className="flex justify-center gap-2 mt-4">
              {user && user.uid !== creator.id && (
                <button className="px-6 py-2 bg-primary text-white rounded-full font-medium">
                  S'abonner
                </button>
              )}
            </div>
          </div>
          
          {/* Bio */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">À propos</h3>
              <p className="text-muted-foreground">{creator.bio}</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Content Section */}
        <div className="w-full lg:w-2/3">
          <Tabs defaultValue="videos">
            <TabsList className="mb-6">
              <TabsTrigger value="videos" className="flex items-center gap-2">
                <FileVideo className="w-4 h-4" />
                Vidéos
              </TabsTrigger>
              <TabsTrigger value="livestreams" className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                Directs
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex items-center gap-2">
                <BarChart className="w-4 h-4" />
                Stats
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="videos">
              {videos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {videos.map(video => (
                    <div key={video.id}>
                      <ContentPricing
                        contentId={String(video.id)}
                        title={video.title}
                        pricing={{
                          type: video.isPremium ? 'token' : 'free',
                          tokenPrice: video.price || 0,
                        }}
                        thumbnailUrl={video.thumbnailUrl || '/placeholder-video.jpg'}
                        onPurchase={() => console.log("Video purchased")}
                        onSubscribe={() => console.log("User subscribed")}
                        className="h-full"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <FileVideo className="w-16 h-16 mx-auto text-muted-foreground" />
                  <h3 className="text-xl font-medium mt-4">Aucune vidéo</h3>
                  <p className="text-muted-foreground mt-2">
                    {user && user.uid === creator.id 
                      ? "Vous n'avez pas encore de vidéos. Commencez à en télécharger!"
                      : "Ce créateur n'a pas encore publié de vidéos."}
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="livestreams">
              <div className="text-center py-16">
                <Play className="w-16 h-16 mx-auto text-muted-foreground" />
                <h3 className="text-xl font-medium mt-4">Aucun direct programmé</h3>
                <p className="text-muted-foreground mt-2">
                  Revenez plus tard pour les diffusions en direct de ce créateur.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="stats">
              <div className="text-center py-16">
                <BarChart className="w-16 h-16 mx-auto text-muted-foreground" />
                <h3 className="text-xl font-medium mt-4">Statistiques privées</h3>
                <p className="text-muted-foreground mt-2">
                  Les statistiques détaillées ne sont visibles que par le créateur lui-même.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CreatorProfile;
