
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Play, Heart, MessageCircle, Share2 } from 'lucide-react';
import { getCreatorVideos } from '@/services/creatorService';
import { VideoData } from '@/types/video';
import VideoPlayer from '@/components/shared/VideoPlayer';
import ContentPurchaseModal from '@/components/monetization/ContentPurchaseModal';

const Feed = () => {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const fetchedVideos = await getCreatorVideos('all');
        setVideos(fetchedVideos);
        if (fetchedVideos.length > 0) {
          setSelectedVideo(fetchedVideos[0]);
        }
      } catch (error) {
        console.error('Error loading videos:', error);
        toast.error('Impossible de charger les vidéos');
      } finally {
        setIsLoading(false);
      }
    };

    loadVideos();
  }, []);

  const handleVideoSelect = (video: VideoData) => {
    if (video.isPremium || video.is_premium) {
      setSelectedVideo(video);
      setIsPurchaseModalOpen(true);
    } else {
      setSelectedVideo(video);
    }
  };

  const handleVideoPurchase = () => {
    toast.success('Achat réussi!');
    setIsPurchaseModalOpen(false);
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">Découvrir du contenu</h1>
      
      <Tabs defaultValue="trending">
        <TabsList className="mb-4">
          <TabsTrigger value="trending">Tendance</TabsTrigger>
          <TabsTrigger value="newest">Récent</TabsTrigger>
          <TabsTrigger value="following">Abonnements</TabsTrigger>
        </TabsList>
        
        <TabsContent value="trending" className="space-y-6">
          {isLoading ? (
            <div className="text-center py-12">Chargement...</div>
          ) : (
            <>
              {/* Featured Video */}
              {selectedVideo && (
                <div className="rounded-lg overflow-hidden bg-card">
                  <div className="aspect-video">
                    {(selectedVideo.isPremium || selectedVideo.is_premium) ? (
                      <div className="h-full flex items-center justify-center bg-muted">
                        <Button 
                          onClick={() => setIsPurchaseModalOpen(true)}
                          className="flex items-center gap-2"
                        >
                          <Play size={16} />
                          Accéder au contenu premium
                        </Button>
                      </div>
                    ) : (
                      <VideoPlayer 
                        playbackId={selectedVideo.playbackId || selectedVideo.mux_playback_id} 
                        title={selectedVideo.title} 
                      />
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h2 className="text-xl font-semibold">{selectedVideo.title}</h2>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{selectedVideo.description}</p>
                    
                    <div className="flex justify-between items-center mt-4">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-muted-foreground"
                        onClick={() => navigate(`/creator/${selectedVideo.userId || selectedVideo.creator_id}`)}
                      >
                        Voir le créateur
                      </Button>
                      
                      <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon">
                          <Heart className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <MessageCircle className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Share2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Video Grid */}
              <h3 className="text-lg font-medium mt-6 mb-4">Vidéos recommandées</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {videos.map((video) => (
                  <Card 
                    key={video.id} 
                    className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => handleVideoSelect(video)}
                  >
                    <div className="aspect-video bg-muted relative">
                      <img 
                        src={video.thumbnailUrl || video.thumbnail_url || '/placeholder.svg'} 
                        alt={video.title} 
                        className="w-full h-full object-cover"
                      />
                      {(video.isPremium || video.is_premium) && (
                        <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                          Premium
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium line-clamp-1">{video.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {video.viewCount || 0} vues
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </TabsContent>
        
        <TabsContent value="newest">
          <div className="text-center py-12">
            Contenu récent à venir prochainement...
          </div>
        </TabsContent>
        
        <TabsContent value="following">
          <div className="text-center py-12">
            Connectez-vous pour voir le contenu de vos abonnements
          </div>
        </TabsContent>
      </Tabs>
      
      {selectedVideo && (
        <ContentPurchaseModal 
          isOpen={isPurchaseModalOpen}
          onClose={() => setIsPurchaseModalOpen(false)}
          onPurchaseComplete={handleVideoPurchase}
          contentTitle={selectedVideo.title}
          contentThumbnail={selectedVideo.thumbnailUrl || selectedVideo.thumbnail_url || ''}
          pricing={{
            price: selectedVideo.tokenPrice || 0,
            currency: 'tokens'
          }}
          userTokenBalance={1000}
        />
      )}
    </div>
  );
};

export default Feed;
