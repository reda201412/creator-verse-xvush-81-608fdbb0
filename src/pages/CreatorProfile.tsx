
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { FileVideo, Play, BarChart, Users, Star, Heart, MessageSquare } from 'lucide-react';
import { getVideosByUserId } from '@/services/videoService';
import ContentPricing from '@/components/creator/ContentPricing';
import { VideoData } from '@/types/video';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import CreatorDNA from '@/components/creator/CreatorDNA';
import ProfileSection from '@/components/header/ProfileSection';
import HeaderInfo from '@/components/header/HeaderInfo';
import CreatorMetrics from '@/components/header/CreatorMetrics';
import RevenueSection from '@/components/header/RevenueSection';
import ContentGrid from '@/components/shared/ContentGrid';

interface CreatorData {
  id: string;
  displayName: string;
  username: string;
  avatarUrl: string;
  bio: string;
  followers?: number;
  isPremium?: boolean;
  tier?: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  skills?: string[];
  style?: string[];
  achievements?: string[];
}

const CreatorProfile = () => {
  const { username } = useParams<{ username: string }>();
  const [creator, setCreator] = useState<CreatorData | null>(null);
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('videos');
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
          bio: "Créateur de contenu passionné qui explore les frontières de l'art digital et de l'expression créative. Je partage mon monde avec vous, à travers des expériences uniques et immersives.",
          followers: 1250,
          isPremium: true,
          tier: 'gold' as const,
          skills: ['Photographie', 'Montage vidéo', 'Direction artistique', 'Motion design', 'Narration visuelle'],
          style: ['Minimaliste', 'Contemporain', 'Avant-garde', 'Expérimental', 'Immersif'],
          achievements: ['1M vues', 'Collaboration internationale', 'Prix d\'excellence', 'Artiste émergent']
        };
        setCreator(mockCreator);
        
        if (mockCreator.id) {
          // Fetch videos for this creator
          try {
            const creatorVideos = await getVideosByUserId(mockCreator.id);
            
            // Convert VideoMetadata to VideoData
            const formattedVideos: VideoData[] = creatorVideos.map(video => ({
              id: typeof video.id === 'string' ? parseInt(video.id, 10) : video.id as number,
              userId: video.userId || video.user_id,
              title: video.title,
              description: video.description || '',
              type: (video.type as VideoData['type']) || 'standard',
              thumbnailUrl: video.thumbnailUrl || video.thumbnail_url,
              isPremium: video.isPremium || video.is_premium || false,
              price: video.price || video.token_price || 0,
              status: video.status
            }));
            
            setVideos(formattedVideos);
          } catch (error) {
            console.error('Error converting video data:', error);
            setVideos([]);
          }
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

  // Convert videos to a format compatible with ContentGrid
  const contentItems = videos.map(video => ({
    id: video.id.toString(),
    title: video.title,
    thumbnailUrl: video.thumbnailUrl || '/placeholder-video.jpg',
    type: video.type,
    format: video.format || '16:9',
    isPremium: video.isPremium,
    metrics: {
      views: Math.floor(Math.random() * 10000),
      likes: Math.floor(Math.random() * 500),
      comments: Math.floor(Math.random() * 100)
    }
  }));

  const heroSectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <motion.div 
        className="bg-gradient-to-br from-background to-background/80 rounded-2xl mb-8 p-8 overflow-hidden border border-primary/20 shadow-lg relative"
        initial="hidden"
        animate="visible"
        variants={heroSectionVariants}
      >
        {/* Background gradients */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-xvush-purple/10 rounded-full blur-3xl"></div>
        
        <div className="flex flex-col lg:flex-row gap-8 relative z-10">
          {/* Creator Profile Section */}
          <motion.div variants={itemVariants} className="w-full lg:w-1/3">
            <ProfileSection 
              avatar={creator.avatarUrl}
              isOnline={true}
              pulseStatus="creating"
              className="mb-6"
            />
            
            <RevenueSection 
              isCreator={true}
              isOwner={user?.uid === creator.id}
              revenue={1250}
              growthRate={12}
              upcomingEvent={{
                title: "Live de maquillage",
                time: "Demain 18:00",
                type: "live",
                countdown: "22:15:30"
              }}
              className="mt-6"
            />
          </motion.div>
          
          {/* Creator Info Section */}
          <motion.div variants={itemVariants} className="w-full lg:w-2/3 space-y-6">
            <HeaderInfo 
              name={creator.displayName}
              username={creator.username}
              bio={creator.bio}
              tier={creator.tier || 'bronze'}
            />
            
            <CreatorMetrics 
              metrics={{
                followers: creator.followers || 0,
                following: 128,
                retentionRate: 76,
                superfans: 45,
                watchMinutes: 36500
              }}
            />
            
            <CreatorDNA 
              creatorName={creator.displayName}
              creatorSkills={creator.skills || []}
              creatorStyle={creator.style || []}
              creatorAchievements={creator.achievements || []}
            />
          </motion.div>
        </div>
      </motion.div>
      
      {/* Content Tabs Section */}
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mt-8">
        <TabsList className="mb-6 bg-background/80 backdrop-blur-sm border border-border/30 p-1 overflow-x-auto flex-nowrap w-full justify-start">
          <TabsTrigger value="videos" className="flex items-center gap-2">
            <FileVideo className="w-4 h-4" />
            Vidéos
            <Badge className="ml-1 bg-primary/15 text-primary">{videos.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="livestreams" className="flex items-center gap-2">
            <Play className="w-4 h-4" />
            Directs
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart className="w-4 h-4" />
            Stats
          </TabsTrigger>
          <TabsTrigger value="community" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Communauté
          </TabsTrigger>
          <TabsTrigger value="reviews" className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            Avis
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="videos" className="focus-visible:outline-none">
          {videos.length > 0 ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-medium">Vidéos récentes</h3>
                <div className="flex gap-2">
                  <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                    Populaires
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                    Récentes
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                    Premium
                  </Badge>
                </div>
              </div>
              <ContentGrid 
                contents={contentItems}
                layout="masonry" 
                isCreator={false}
                onItemClick={(id) => console.log("Video clicked:", id)}
              />
            </>
          ) : (
            <div className="text-center py-16 bg-muted/20 rounded-lg border border-border/50">
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
          <div className="text-center py-16 bg-muted/20 rounded-lg border border-border/50">
            <Play className="w-16 h-16 mx-auto text-muted-foreground" />
            <h3 className="text-xl font-medium mt-4">Aucun direct programmé</h3>
            <p className="text-muted-foreground mt-2">
              Revenez plus tard pour les diffusions en direct de ce créateur.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="stats">
          <div className="text-center py-16 bg-muted/20 rounded-lg border border-border/50">
            <BarChart className="w-16 h-16 mx-auto text-muted-foreground" />
            <h3 className="text-xl font-medium mt-4">Statistiques privées</h3>
            <p className="text-muted-foreground mt-2">
              Les statistiques détaillées ne sont visibles que par le créateur lui-même.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="community">
          <div className="text-center py-16 bg-muted/20 rounded-lg border border-border/50">
            <Users className="w-16 h-16 mx-auto text-muted-foreground" />
            <h3 className="text-xl font-medium mt-4">Rejoignez la communauté</h3>
            <p className="text-muted-foreground mt-2">
              Abonnez-vous pour participer aux discussions et événements exclusifs.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="reviews">
          <div className="text-center py-16 bg-muted/20 rounded-lg border border-border/50">
            <Star className="w-16 h-16 mx-auto text-muted-foreground" />
            <h3 className="text-xl font-medium mt-4">Évaluations</h3>
            <p className="text-muted-foreground mt-2">
              Les évaluations seront bientôt disponibles.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreatorProfile;
