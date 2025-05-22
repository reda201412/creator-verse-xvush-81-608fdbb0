
import React, { useState, useEffect } from 'react';
import { VideoData } from '@/types/video';
import { useAuth } from '@/contexts/AuthContext';
import { FiEye, FiHeart, FiMessageSquare, FiClock, FiLock } from 'react-icons/fi';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { VideoPlayer } from '@/components/shared/VideoPlayer';
import ContentPurchaseModal from '@/components/monetization/ContentPurchaseModal';

// Mock function to fetch videos - replace with actual API call
const fetchVideos = async (): Promise<VideoData[]> => {
  // In a real app, this would be an API call
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          userId: 'user123',
          title: 'Introduction au développement React',
          description: 'Apprenez les bases du développement avec React',
          thumbnail_url: 'https://via.placeholder.com/300x169/4a90e2/ffffff',
          type: 'tutorial',
          viewCount: 12453,
          likeCount: 1245,
          commentCount: 87,
          duration: '12:45',
          uploadDate: '2023-05-15',
          category: 'Tutorials',
          isPremium: false
        },
        {
          id: 2,
          userId: 'user456',
          title: 'Ma routine quotidienne',
          description: 'Une journée dans ma vie de créateur',
          thumbnail_url: 'https://via.placeholder.com/300x169/50e3c2/ffffff',
          type: 'vlog',
          viewCount: 8765,
          likeCount: 654,
          commentCount: 32,
          duration: '8:20',
          uploadDate: '2023-05-12',
          category: 'Vlogs',
          isPremium: true,
          price: 5
        },
        {
          id: 3,
          userId: 'user789',
          title: 'Critique du nouvel iPhone',
          description: 'Mon avis après 1 mois d\'utilisation',
          thumbnail_url: 'https://via.placeholder.com/300x169/9013fe/ffffff',
          type: 'review',
          viewCount: 23456,
          likeCount: 1987,
          commentCount: 143,
          duration: '15:30',
          uploadDate: '2023-05-08',
          category: 'Reviews',
          isPremium: false
        },
        {
          id: 4,
          userId: 'user123',
          title: 'Tuto avancé: Animation en React',
          description: 'Créez des animations fluides avec React',
          thumbnail_url: 'https://via.placeholder.com/300x169/ff6b6b/ffffff',
          type: 'tutorial',
          viewCount: 7689,
          likeCount: 890,
          commentCount: 56,
          duration: '18:15',
          uploadDate: '2023-05-02',
          category: 'Tutorials',
          isPremium: true,
          price: 10
        }
      ]);
    }, 1000);
  });
};

const Feed = () => {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<VideoData[]>([]);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const { user, profile } = useAuth();
  
  // Fetch videos on component mount
  useEffect(() => {
    const loadVideos = async () => {
      try {
        setIsLoading(true);
        const data = await fetchVideos();
        setVideos(data);
        setFilteredVideos(data);
      } catch (error) {
        console.error('Error loading videos:', error);
        toast.error("Impossible de charger les vidéos");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadVideos();
  }, []);
  
  // Apply filter to videos
  const handleFilterChange = (filter: string) => {
    setCurrentFilter(filter);
    
    if (filter === 'all') {
      setFilteredVideos(videos);
    } else if (filter === 'premium') {
      setFilteredVideos(videos.filter(video => video.isPremium || video.is_premium));
    } else if (filter === 'free') {
      setFilteredVideos(videos.filter(video => !(video.isPremium || video.is_premium)));
    } else {
      setFilteredVideos(videos.filter(video => video.type === filter));
    }
  };
  
  // Handle video click to play
  const handleVideoClick = (video: VideoData) => {
    if (video.isPremium && (!user || !hasAccessToContent(video))) {
      setSelectedVideo(video);
      setIsPurchaseModalOpen(true);
    } else {
      setSelectedVideo(video);
    }
  };
  
  // Check if user has access to premium content
  const hasAccessToContent = (video: VideoData): boolean => {
    // In a real app, this would check if the user has purchased the content
    // For now, this is a mock function
    return false;
  };
  
  // Handle purchase confirmation
  const handleCompletePurchase = (video: VideoData) => {
    toast.success(`Vous avez acheté "${video.title}"`);
    setIsPurchaseModalOpen(false);
    // In a real app, we'd update the user's purchases in the database
    
    // After purchase, user has access to the content
    setTimeout(() => {
      setSelectedVideo(video);
    }, 500);
  };
  
  // Format large numbers for display
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Explorer les contenus</h1>
        
        {/* Filter tabs */}
        <Tabs value={currentFilter} onValueChange={handleFilterChange} className="mb-8">
          <TabsList className="mb-2">
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="premium">Premium</TabsTrigger>
            <TabsTrigger value="free">Gratuit</TabsTrigger>
            <TabsTrigger value="tutorial">Tutoriels</TabsTrigger>
            <TabsTrigger value="vlog">Vlogs</TabsTrigger>
            <TabsTrigger value="review">Critiques</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* Videos grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading ? (
            Array(8).fill(null).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-40 w-full" />
                <div className="p-4">
                  <Skeleton className="h-5 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-2" />
                  <div className="flex justify-between mt-4">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </div>
              </Card>
            ))
          ) : filteredVideos.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">Aucune vidéo ne correspond à ce filtre.</p>
            </div>
          ) : (
            filteredVideos.map(video => (
              <Card 
                key={video.id} 
                className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
                onClick={() => handleVideoClick(video)}
              >
                <div className="relative">
                  <img 
                    src={video.thumbnail_url || video.thumbnailUrl || 'https://via.placeholder.com/300x169'}
                    alt={video.title}
                    className="w-full h-40 object-cover"
                  />
                  {(video.isPremium || video.is_premium) && (
                    <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                      <FiLock className="mr-1" size={12} />
                      Premium
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded flex items-center">
                    <FiClock className="mr-1" size={12} />
                    {video.duration || '0:00'}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 line-clamp-2">{video.title}</h3>
                  <p className="text-gray-500 text-sm mt-1 line-clamp-1">{video.description}</p>
                  <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-2">
                      <span className="flex items-center">
                        <FiEye className="mr-1" size={14} />
                        {formatNumber(video.viewCount || 0)}
                      </span>
                      <span className="flex items-center">
                        <FiHeart className="mr-1" size={14} />
                        {formatNumber(video.likeCount || 0)}
                      </span>
                    </div>
                    <span className="text-xs">
                      {new Date(video.uploadDate || video.createdAt || '').toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
        
        {/* Video player dialog */}
        <Dialog open={!!selectedVideo && !isPurchaseModalOpen} onOpenChange={() => setSelectedVideo(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedVideo?.title}</DialogTitle>
              <DialogDescription className="text-gray-500">
                {selectedVideo?.description}
              </DialogDescription>
            </DialogHeader>
            <div className="aspect-video w-full overflow-hidden rounded-md">
              {selectedVideo && selectedVideo.playbackId ? (
                <VideoPlayer
                  playbackId={selectedVideo.playbackId || selectedVideo.mux_playback_id}
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-100">
                  <p className="text-gray-500">Vidéo non disponible</p>
                </div>
              )}
            </div>
            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <FiEye className="mr-1" />
                  {formatNumber(selectedVideo?.viewCount || 0)} vues
                </span>
                <span className="flex items-center">
                  <FiHeart className="mr-1" />
                  {formatNumber(selectedVideo?.likeCount || 0)}
                </span>
                <span className="flex items-center">
                  <FiMessageSquare className="mr-1" />
                  {formatNumber(selectedVideo?.commentCount || 0)}
                </span>
              </div>
              <Button size="sm" variant="outline">
                <FiHeart className="mr-2" />
                J'aime
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Purchase dialog for premium content */}
        {selectedVideo && (
          <ContentPurchaseModal
            isOpen={isPurchaseModalOpen}
            onClose={() => setIsPurchaseModalOpen(false)}
            video={selectedVideo}
            onPurchaseComplete={() => handleCompletePurchase(selectedVideo)}
          />
        )}
      </div>
    </div>
  );
};

export default Feed;
