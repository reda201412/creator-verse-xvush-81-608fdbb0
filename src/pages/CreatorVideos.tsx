
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Film, Video, ChevronDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import VideoUploader, { VideoMetadata } from '@/components/creator/VideoUploader';
import { ContentType } from '@/types/content';

// Mock video data
const initialVideos: VideoMetadata[] = [
  {
    id: 'video-1',
    title: 'Morning Routine - Behind the scenes',
    description: 'Découvrez ma routine matinale et mes secrets pour bien commencer la journée.',
    type: 'premium',
    videoFile: new File([], 'video1.mp4'),
    thumbnailUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop',
    format: '16:9',
    isPremium: true,
    tokenPrice: 50,
    restrictions: {
      tier: 'fan',
      sharingAllowed: true,
      downloadsAllowed: false
    }
  },
  {
    id: 'video-2',
    title: 'Xtease - Spring Collection Preview',
    description: 'Un aperçu exclusif de ma collection de printemps.',
    type: 'teaser',
    videoFile: new File([], 'video2.mp4'),
    thumbnailUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop',
    format: '9:16',
    isPremium: true,
    tokenPrice: 25,
    restrictions: {
      tier: 'free',
      sharingAllowed: true,
      downloadsAllowed: false
    }
  },
  {
    id: 'video-3',
    title: 'Mountain Hike - Full Experience',
    description: 'Accompagnez-moi pour une randonnée complète dans les montagnes.',
    type: 'standard',
    videoFile: new File([], 'video3.mp4'),
    thumbnailUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop',
    format: '16:9',
    isPremium: false
  },
  {
    id: 'video-4',
    title: 'Boulangerie Tour Paris - Exclusive',
    description: 'Découvrez les meilleures boulangeries de Paris dans cette visite exclusive.',
    type: 'vip',
    videoFile: new File([], 'video4.mp4'),
    thumbnailUrl: 'https://images.unsplash.com/photo-1566554273541-37a9ca77b91f?w=800&auto=format&fit=crop',
    format: '16:9',
    isPremium: true,
    tokenPrice: 150,
    restrictions: {
      tier: 'vip',
      sharingAllowed: false,
      downloadsAllowed: false
    }
  }
];

const CreatorVideos: React.FC = () => {
  const [videos, setVideos] = useState<VideoMetadata[]>(initialVideos);
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();

  const handleUploadComplete = (metadata: VideoMetadata) => {
    setVideos(prev => [metadata, ...prev]);
  };

  const handleDeleteVideo = (videoId: string) => {
    setVideos(prev => prev.filter(video => video.id !== videoId));
    toast({
      title: "Vidéo supprimée",
      description: "La vidéo a été supprimée avec succès."
    });
  };

  const handleEditVideo = (videoId: string) => {
    // This would open the edit modal in a real implementation
    toast({
      title: "Modifier la vidéo",
      description: "Fonctionnalité à venir.",
    });
  };

  const handlePromoteVideo = (videoId: string) => {
    toast({
      title: "Promotion de vidéo",
      description: "Fonctionnalité à venir.",
    });
  };

  const handleAnalyticsVideo = (videoId: string) => {
    toast({
      title: "Statistiques de vidéo",
      description: "Fonctionnalité à venir.",
    });
  };

  const getFilteredVideos = () => {
    switch (activeTab) {
      case 'all':
        return videos;
      case 'standard':
        return videos.filter(video => video.type === 'standard');
      case 'teaser':
        return videos.filter(video => video.type === 'teaser');
      case 'premium':
        return videos.filter(video => video.type === 'premium');
      case 'vip':
        return videos.filter(video => video.type === 'vip');
      default:
        return videos;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'standard': return 'Gratuit';
      case 'teaser': return 'Xtease';
      case 'premium': return 'Premium';
      case 'vip': return 'VIP';
      default: return type;
    }
  };

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'standard': return 'bg-green-500/10 text-green-600 hover:bg-green-500/20';
      case 'teaser': return 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20';
      case 'premium': return 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20';
      case 'vip': return 'bg-purple-500/10 text-purple-600 hover:bg-purple-500/20';
      default: return 'bg-primary/10 text-primary hover:bg-primary/20';
    }
  };

  const formatInfoText = (video: VideoMetadata) => {
    const parts = [];

    if (video.isPremium && video.tokenPrice) {
      parts.push(`${video.tokenPrice} tokens`);
    }

    if (video.restrictions?.tier && video.restrictions.tier !== 'free') {
      parts.push(`Niveau ${video.restrictions.tier}`);
    }

    return parts.join(' • ');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Mes Vidéos</h1>
          <p className="text-muted-foreground">
            Gérez vos vidéos et suivez leurs performances
          </p>
        </div>

        <VideoUploader 
          onUploadComplete={handleUploadComplete} 
          isCreator={true} 
        />
      </div>

      <div className="mb-6">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">Toutes</TabsTrigger>
            <TabsTrigger value="teaser">Xtease</TabsTrigger>
            <TabsTrigger value="standard">Gratuites</TabsTrigger>
            <TabsTrigger value="premium">Premium</TabsTrigger>
            <TabsTrigger value="vip">VIP</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {getFilteredVideos().map((video) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="overflow-hidden">
              <div className="relative">
                <div className={cn(
                  "aspect-video bg-muted relative overflow-hidden",
                  video.format === '9:16' && "aspect-[9/16]",
                  video.format === '1:1' && "aspect-square"
                )}>
                  <img 
                    src={video.thumbnailUrl || 'https://placehold.co/600x400/jpeg'} 
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-3">
                    <Badge className={cn(
                      "absolute top-2 left-2",
                      getTypeBadgeClass(video.type)
                    )}>
                      {getTypeLabel(video.type)}
                    </Badge>

                    <div className="absolute top-2 right-2">
                      <Button
                        variant="ghost" 
                        size="icon" 
                        className="bg-black/40 hover:bg-black/60 text-white rounded-full h-8 w-8"
                      >
                        <Play size={16} />
                      </Button>
                    </div>

                    <div className="w-full">
                      <h3 className="text-white font-medium truncate">{video.title}</h3>
                      {video.isPremium && (
                        <p className="text-white/80 text-xs">
                          {formatInfoText(video)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Film className="mr-1 h-3 w-3" />
                        <span>{video.format}</span>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Video className="mr-1 h-3 w-3" />
                        <span>0 vues</span>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <ChevronDown size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditVideo(video.id)}>
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handlePromoteVideo(video.id)}>
                          Promouvoir
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAnalyticsVideo(video.id)}>
                          Statistiques
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteVideo(video.id)}
                          className="text-red-500 focus:text-red-500"
                        >
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {getFilteredVideos().length === 0 && (
        <div className="text-center py-16">
          <Video className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Aucune vidéo</h3>
          <p className="text-muted-foreground mt-1 mb-4">
            Vous n'avez pas encore ajouté de vidéo{activeTab !== 'all' ? ` de type ${getTypeLabel(activeTab)}` : ''}.
          </p>
          <VideoUploader 
            onUploadComplete={handleUploadComplete} 
            isCreator={true} 
          />
        </div>
      )}
    </div>
  );
};

export default CreatorVideos;
