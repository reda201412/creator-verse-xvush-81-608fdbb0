import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ContentGrid from "@/components/ContentGrid";
import ContentCreatorCard from "@/components/ContentCreatorCard";
import { useNeuroAesthetic } from "@/hooks/use-neuro-aesthetic";
import { useUserBehavior } from "@/hooks/use-user-behavior";
import AdaptiveMoodLighting from "@/components/neuro-aesthetic/AdaptiveMoodLighting";
import GoldenRatioGrid from "@/components/neuro-aesthetic/GoldenRatioGrid";
import MicroRewardsEnhanced from "@/components/effects/MicroRewardsEnhanced";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Filter, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import XteasePlayerModal from "@/components/video/XteasePlayerModal";
import { fetchAvailableCreators } from "@/utils/create-conversation-utils";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Types pour les créateurs
interface Creator {
  id: number;
  user_id: string;
  username: string;
  name: string | null;
  avatar: string | null;
  bio: string | null;
  metrics?: {
    followers?: number;
    likes?: number;
    rating?: number;
  };
  isPremium?: boolean;
}

// Contenu trending avec des vidéos premium et VIP
const allTrendingContent = [
  // Contenu de la page d'accueil
  {
    id: "trend1",
    imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop",
    title: "Morning Coffee Routine",
    type: "premium" as const,
    format: "video" as const,
    duration: 345,
    video_url: "https://assets.mixkit.co/videos/preview/mixkit-woman-taking-cold-pictures-33355-large.mp4",
    videoFormat: "9:16" as const,
    metrics: {
      likes: 1200,
      comments: 89,
      views: 5600,
    }
  },
  {
    id: "trend2",
    imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop",
    title: "Spring Fashion Look",
    type: "vip" as const,
    format: "video" as const,
    duration: 520,
    video_url: "https://assets.mixkit.co/videos/preview/mixkit-going-down-a-curved-highway-through-a-mountain-range-41576-large.mp4",
    videoFormat: "9:16" as const,
    metrics: {
      likes: 950,
      comments: 63,
      views: 4100
    }
  },
  {
    id: "trend3",
    imageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop",
    title: "Sunset at the Mountain",
    type: "standard" as const,
    format: "video" as const,
    duration: 187,
    video_url: "https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4",
    videoFormat: "9:16" as const,
    metrics: {
      likes: 2300,
      comments: 156,
      views: 12400,
    }
  },
  {
    id: "trend4",
    imageUrl: "https://images.unsplash.com/photo-1566554273541-37a9ca77b91f?w=800&auto=format&fit=crop",
    title: "Boulangerie Tour Paris",
    type: "vip" as const,
    format: "video" as const,
    duration: 845,
    video_url: "https://assets.mixkit.co/videos/preview/mixkit-woman-flipping-her-egg-with-a-kick-1728-large.mp4",
    videoFormat: "9:16" as const,
    metrics: {
      likes: 3200,
      comments: 278,
      views: 15600,
    }
  },
  {
    id: "trend5",
    imageUrl: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=800&auto=format&fit=crop",
    title: "Backstage Fashion Week",
    type: "premium" as const,
    format: "video" as const,
    duration: 652,
    video_url: "https://assets.mixkit.co/videos/preview/mixkit-woman-running-above-the-camera-on-a-running-track-32807-large.mp4",
    videoFormat: "9:16" as const,
    metrics: {
      likes: 4100,
      comments: 215,
      views: 18900,
    }
  },
  {
    id: "trend6",
    imageUrl: "https://images.unsplash.com/photo-1605812276723-c31bb1a68285?w=800&auto=format&fit=crop",
    title: "Exclusive Interview",
    type: "vip" as const,
    format: "video" as const,
    duration: 1245,
    video_url: "https://assets.mixkit.co/videos/preview/mixkit-woman-model-walking-and-talking-on-a-city-street-43027-large.mp4",
    videoFormat: "9:16" as const,
    metrics: {
      likes: 5800,
      comments: 420,
      views: 23500,
    }
  },
  // Contenu supplémentaire pour la page trending
  {
    id: "trend7",
    imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop",
    title: "Styling Tips - Summer 2025",
    type: "premium" as const,
    format: "video" as const,
    duration: 732,
    video_url: "https://assets.mixkit.co/videos/preview/mixkit-portrait-of-a-fashion-woman-with-silver-makeup-39875-large.mp4",
    videoFormat: "9:16" as const,
    metrics: {
      likes: 2700,
      comments: 185,
      views: 9800,
    }
  },
  {
    id: "trend8",
    imageUrl: "https://images.unsplash.com/photo-1485178575877-1a9987fcd40d?w=800&auto=format&fit=crop",
    title: "Luxury Yacht Tour",
    type: "vip" as const,
    format: "video" as const,
    duration: 1054,
    video_url: "https://assets.mixkit.co/videos/preview/mixkit-woman-modeling-fashion-clothes-outdoors-34908-large.mp4",
    videoFormat: "9:16" as const,
    metrics: {
      likes: 3900,
      comments: 320,
      views: 14500,
    }
  },
  {
    id: "trend9",
    imageUrl: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&auto=format&fit=crop",
    title: "Coastal Drone Footage",
    type: "premium" as const,
    format: "video" as const,
    duration: 428,
    video_url: "https://assets.mixkit.co/videos/preview/mixkit-woman-dancing-to-the-rhythm-of-music-42816-large.mp4",
    videoFormat: "9:16" as const,
    metrics: {
      likes: 1900,
      comments: 110,
      views: 8200,
    }
  },
  {
    id: "trend10",
    imageUrl: "https://images.unsplash.com/photo-1512484776495-a09d92e87c3b?w=800&auto=format&fit=crop",
    title: "Photography Masterclass",
    type: "vip" as const,
    format: "video" as const,
    duration: 2250,
    video_url: "https://assets.mixkit.co/videos/preview/mixkit-portrait-of-a-woman-with-a-blue-background-39669-large.mp4",
    videoFormat: "9:16" as const,
    metrics: {
      likes: 4700,
      comments: 350,
      views: 19200,
    }
  },
  {
    id: "trend11",
    imageUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop",
    title: "Fashion Week Highlights",
    type: "premium" as const,
    format: "video" as const,
    duration: 875,
    video_url: "https://assets.mixkit.co/videos/preview/mixkit-woman-modeling-a-dress-outdoors-34932-large.mp4",
    videoFormat: "9:16" as const,
    metrics: {
      likes: 3100,
      comments: 210,
      views: 13600,
    }
  },
  {
    id: "trend12",
    imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop",
    title: "Backstage Access Pass",
    type: "vip" as const,
    format: "video" as const,
    duration: 1640,
    video_url: "https://assets.mixkit.co/videos/preview/mixkit-woman-posing-for-photos-on-a-rooftop-34421-large.mp4",
    videoFormat: "9:16" as const,
    metrics: {
      likes: 5200,
      comments: 410,
      views: 21000,
    }
  }
];

const TrendingContent = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [creatorTab, setCreatorTab] = useState<string>("content");
  const { config } = useNeuroAesthetic();
  const { trackInteraction, trackContentPreference } = useUserBehavior();
  const { triggerMicroReward } = useNeuroAesthetic();
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [isLoadingCreators, setIsLoadingCreators] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Track page view on mount
    trackInteraction("view", { page: "trending" });
    
    // Charger les créateurs
    loadCreators();
    
    // Charger les contenus à partir de Supabase
    loadContentFromVideosTable();
  }, [trackInteraction]);
  
  const loadCreators = async () => {
    setIsLoadingCreators(true);
    try {
      const creatorData = await fetchAvailableCreators();
      
      // Ajouter des métriques fictives pour l'UI
      const creatorsWithMetrics = creatorData.map(creator => ({
        ...creator,
        metrics: {
          followers: Math.floor(Math.random() * 10000),
          likes: Math.floor(Math.random() * 5000),
          rating: 4 + Math.random(),
        },
        isPremium: Math.random() > 0.5
      }));
      
      setCreators(creatorsWithMetrics);
    } catch (error) {
      console.error("Erreur lors du chargement des créateurs:", error);
    } finally {
      setIsLoadingCreators(false);
    }
  };
  
  // Charger le contenu depuis la table videos de Supabase
  const loadContentFromVideosTable = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('uploadedat', { ascending: false });
        
      if (error) throw error;
      
      // Les données sont chargées mais on garde aussi le contenu statique pour l'instant
      console.log("Vidéos chargées depuis Supabase:", data);
      
      // On pourrait remplacer allTrendingContent par ces données
      // Mais pour l'instant, on garde le contenu statique
    } catch (error) {
      console.error("Erreur lors du chargement des vidéos:", error);
    }
  };

  const handleContentClick = (contentId: string) => {
    triggerMicroReward('click');
    trackInteraction('click', { contentId });
    
    const selectedContent = allTrendingContent.find(item => item.id === contentId);
    if (selectedContent && selectedContent.format === 'video') {
      setSelectedVideo(selectedContent);
      setIsPlayerOpen(true);
    }
  };

  const handleCreatorClick = (creator: Creator) => {
    triggerMicroReward('click');
    trackInteraction('click', { creatorId: creator.user_id });
    
    // Naviguer vers la page de messagerie avec ce créateur
    navigate('/secure-messaging', { state: { creatorId: creator.user_id } });
  };

  const filteredContent = activeTab === 'all' 
    ? allTrendingContent
    : allTrendingContent.filter(content => content.type === activeTab);

  return (
    <div className="relative z-10">
      {/* Neuro-aesthetic elements */}
      <GoldenRatioGrid visible={config.goldenRatioVisible || false} opacity={0.05} />
      <AdaptiveMoodLighting currentMood={config.adaptiveMood} intensity={config.moodIntensity} />
      <MicroRewardsEnhanced 
        enable={config.microRewardsEnabled} 
        rewardIntensity={config.microRewardsIntensity}
        adaptToContext={true}
        reducedMotion={config.animationSpeed === 'reduced'}
      />

      <div className="container px-4 mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">Trending Content</h1>
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtres
          </Button>
        </div>
        
        <Tabs defaultValue="content" value={creatorTab} onValueChange={setCreatorTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="content">Contenu</TabsTrigger>
            <TabsTrigger value="creators" className="flex items-center gap-1">
              <Users size={14} />
              Créateurs
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="content">
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="all">Tous</TabsTrigger>
                <TabsTrigger value="standard">Standard</TabsTrigger>
                <TabsTrigger value="premium">Premium</TabsTrigger>
                <TabsTrigger value="vip">VIP</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab} className="mt-0">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <ContentGrid 
                    contents={filteredContent} 
                    layout="masonry"
                    onItemClick={handleContentClick}
                  />
                </motion.div>
              </TabsContent>
            </Tabs>
          </TabsContent>
          
          <TabsContent value="creators">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {creators.map((creator) => (
                  <ContentCreatorCard
                    key={creator.id} 
                    creator={{
                      id: creator.id,
                      userId: creator.user_id,
                      username: creator.username,
                      name: creator.name || creator.username,
                      avatar: creator.avatar || `https://i.pravatar.cc/300?u=${creator.user_id}`,
                      bio: creator.bio || undefined,
                      metrics: creator.metrics,
                      isPremium: creator.isPremium
                    }}
                    onClick={() => handleCreatorClick(creator)}
                  />
                ))}
                
                {isLoadingCreators && (
                  <div className="col-span-full flex justify-center py-10">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                  </div>
                )}
                
                {!isLoadingCreators && creators.length === 0 && (
                  <div className="col-span-full text-center py-10">
                    <p className="text-lg text-muted-foreground">Aucun créateur disponible</p>
                    <Button variant="outline" className="mt-4" onClick={loadCreators}>
                      Actualiser
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Vertical 9:16 Video Player Modal */}
      <XteasePlayerModal
        isOpen={isPlayerOpen}
        onClose={() => setIsPlayerOpen(false)}
        videoSrc={selectedVideo?.video_url || ''}
        thumbnailUrl={selectedVideo?.imageUrl}
        title={selectedVideo?.title}
      />
    </div>
  );
};

export default TrendingContent;
