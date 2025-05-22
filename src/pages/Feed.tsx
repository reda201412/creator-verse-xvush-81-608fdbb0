import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Search, FileVideo, Play, Sparkles, TrendingUp, BadgeDollarSign } from 'lucide-react';
import { VideoData } from '@/types/video';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import ContentPricing from '@/components/creator/ContentPricing';

const Feed = () => {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('latest');
  const { user, profile } = useAuth();

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    setIsLoading(true);
    try {
      // Since we don't have a real backend, let's mock some data
      const mockVideos: VideoData[] = [
        {
          id: 1,
          title: "Comment créer du contenu viral",
          description: "Les meilleures stratégies pour créer du contenu qui devient viral sur les réseaux sociaux",
          type: "standard",
          thumbnailUrl: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?q=80&w=1974&auto=format&fit=crop",
          creator_id: "user1",
          userId: "user1",
          viewCount: 1250,
          likeCount: 350,
          commentCount: 45,
          isPremium: false,
          uploadDate: "2023-05-15",
          status: "ready",
        },
        {
          id: 2,
          title: "Tutoriel d'édition vidéo avancée",
          description: "Apprenez des techniques professionnelles d'édition vidéo",
          type: "premium",
          thumbnailUrl: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=2070&auto=format&fit=crop",
          creator_id: "user2",
          userId: "user2",
          viewCount: 845,
          likeCount: 210,
          commentCount: 32,
          isPremium: true,
          price: 25,
          uploadDate: "2023-05-20",
          status: "ready",
        },
        {
          id: 3,
          title: "Les bases de la photographie",
          description: "Tout ce que vous devez savoir pour débuter en photographie",
          type: "standard",
          thumbnailUrl: "https://images.unsplash.com/photo-1516357231954-91487b459602?q=80&w=1972&auto=format&fit=crop",
          creator_id: "user3",
          userId: "user3",
          viewCount: 3500,
          likeCount: 780,
          commentCount: 95,
          isPremium: false,
          uploadDate: "2023-06-01",
          status: "ready",
        },
        {
          id: 4,
          title: "Accès exclusif à mon studio de création",
          description: "Une visite guidée de mon studio de création et des coulisses de mes projets",
          type: "vip",
          thumbnailUrl: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?q=80&w=2070&auto=format&fit=crop",
          creator_id: "user2",
          userId: "user2",
          viewCount: 450,
          likeCount: 120,
          commentCount: 18,
          isPremium: true,
          price: 50,
          uploadDate: "2023-06-10",
          status: "ready",
        }
      ];
      
      setTimeout(() => {
        setVideos(mockVideos);
        setIsLoading(false);
      }, 1000); // Simulate API call
    } catch (error) {
      console.error('Error fetching videos:', error);
      toast.error('Impossible de charger les vidéos');
      setIsLoading(false);
    }
  };

  const filterVideos = () => {
    let filteredVideos = [...videos];
    
    // Filter by search query
    if (searchQuery) {
      filteredVideos = filteredVideos.filter(video => 
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by tab
    switch (activeTab) {
      case 'trending':
        filteredVideos.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
        break;
      case 'premium':
        filteredVideos = filteredVideos.filter(video => video.isPremium);
        break;
      case 'latest':
      default:
        // Already sorted by date
        break;
    }
    
    return filteredVideos;
  };

  const handlePurchase = (videoId: number) => {
    if (!user) {
      toast("Connectez-vous pour acheter ce contenu", {
        action: {
          label: "Connexion",
          onClick: () => window.location.href = "/auth"
        }
      });
      return;
    }
    
    toast.success("Achat effectué avec succès!");
  };

  const handleSubscribe = () => {
    if (!user) {
      toast("Connectez-vous pour vous abonner", {
        action: {
          label: "Connexion",
          onClick: () => window.location.href = "/auth"
        }
      });
      return;
    }
    
    toast("Abonnement en cours de développement");
  };

  const renderContent = () => {
    const filteredVideos = filterVideos();
    
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-40" />
              <CardContent className="p-4">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }
    
    if (filteredVideos.length === 0) {
      return (
        <div className="text-center py-16">
          <FileVideo className="w-16 h-16 mx-auto text-muted-foreground" />
          <h3 className="text-xl font-medium mt-4">Aucune vidéo trouvée</h3>
          <p className="text-muted-foreground mt-2">
            Essayez de modifier vos critères de recherche
          </p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredVideos.map(video => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ContentPricing
              contentId={String(video.id)}
              title={video.title}
              pricing={{
                type: video.isPremium ? 'token' : 'free',
                tokenPrice: video.price || 0,
              }}
              thumbnailUrl={video.thumbnailUrl || '/placeholder-video.jpg'}
              onPurchase={() => handlePurchase(video.id)}
              onSubscribe={handleSubscribe}
              className="h-full"
            />
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Découvrir du contenu</h1>
        <p className="text-muted-foreground">
          Explorez le contenu de nos créateurs talentueux
        </p>
      </div>
      
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="relative w-full sm:w-64 md:w-80 lg:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher des vidéos..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Tabs defaultValue="latest" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="latest" className="flex items-center gap-1">
              <FileVideo className="h-4 w-4" />
              <span className="hidden sm:inline">Nouveautés</span>
            </TabsTrigger>
            <TabsTrigger value="trending" className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Tendances</span>
            </TabsTrigger>
            <TabsTrigger value="premium" className="flex items-center gap-1">
              <BadgeDollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">Premium</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Featured Section */}
      {activeTab === 'latest' && !searchQuery && (
        <Card className="mb-8 overflow-hidden">
          <div className="relative h-[300px] sm:h-[400px]">
            <img 
              src="https://images.unsplash.com/photo-1618609377864-68609b857e90?q=80&w=2070&auto=format&fit=crop" 
              alt="Featured Content"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6">
              <Badge className="mb-2 w-fit bg-primary">Tendance</Badge>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Les secrets de la création de contenu
              </h2>
              <p className="text-white/80 mb-4 max-w-lg">
                Apprenez les techniques avancées utilisées par les meilleurs créateurs pour produire du contenu de qualité.
              </p>
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8 border-2 border-white">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=creator1" />
                  <AvatarFallback>CC</AvatarFallback>
                </Avatar>
                <span className="text-white font-medium">CreativeMaster</span>
                <Badge variant="secondary" className="h-6">
                  <Play className="h-3 w-3 mr-1" />
                  Regarder
                </Badge>
              </div>
            </div>
          </div>
        </Card>
      )}
      
      {/* Content Grid */}
      {renderContent()}
      
      {/* Creator CTA for non-creators */}
      {user && profile && profile.role !== 'creator' && (
        <div className="mt-16 text-center p-8 bg-gradient-to-r from-xvush-purple/20 to-xvush-pink/20 rounded-xl">
          <Sparkles className="h-12 w-12 mx-auto text-primary mb-4" />
          <h2 className="text-2xl font-bold mb-2">Devenez créateur</h2>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Vous avez du contenu à partager ? Devenez créateur et commencez à monétiser vos créations dès aujourd'hui.
          </p>
          <Button asChild>
            <Link to="/dashboard">Devenir créateur</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Feed;
