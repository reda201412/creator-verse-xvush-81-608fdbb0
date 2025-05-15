import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { CreatorProfileData, VideoData, getCreatorVideos } from '@/services/creatorService';
import CreatorHeader from '@/components/CreatorHeader';
import ProfileNav from '@/components/ProfileNav';
import ContentGrid from '@/components/ContentGrid';
import { Button } from '@/components/ui/button';
import { MessageCircle, UserPlus, Bell, Settings, Edit3, DollarSign, BarChart2, ShieldCheck, Video as VideoIcon, Image as ImageIcon, Music2 } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import XteasePlayerModal from '@/components/video/XteasePlayerModal';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CreatorProfile: React.FC = () => {
  const { creatorId } = useParams<{ creatorId: string }>();
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [creatorData, setCreatorData] = useState<CreatorProfileData | null>(null);
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('videos');

  useEffect(() => {
    if (authLoading) return;
    if (user && creatorId === user.id) { // Check against user.id
      setIsOwnProfile(true);
    } else {
      setIsOwnProfile(false);
    }
  }, [creatorId, user, authLoading]);

  useEffect(() => {
    const fetchCreatorData = async () => {
      if (!creatorId) return;
      setLoadingProfile(true);
      try {
        const creatorData = await getCreatorById(creatorId);
        if (creatorData) {
          setCreatorData(creatorData);
          const videosData = await getCreatorVideos(creatorId);
          setVideos(videosData);
          setFollowerCount(creatorData.metrics?.followers || 0);
          setIsFollowing(false);
        }
      } catch (error: any) {
        console.error('Error fetching creator data:', error);
        toast.error("Erreur de chargement du profil: " + error.message);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchCreatorData();
  }, [creatorId]);

  const handleFollow = async () => {
    toast.info("La fonctionnalité de follow sera bientôt disponible avec Firebase.");
  };
  
  const handleContentClick = (content: VideoData) => {
    setSelectedVideo(content);
    setIsPlayerOpen(true);
  };

  if (loadingProfile || authLoading) {
    return (
      <div className="container mx-auto p-4">
        <Skeleton className="h-32 w-full mb-4" />
        <Skeleton className="h-8 w-1/2 mb-2" />
        <Skeleton className="h-6 w-1/3 mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-64 w-full" />)}
        </div>
      </div>
    );
  }

  if (!creatorData) {
    return <div className="container mx-auto p-4 text-center">Profil créateur non trouvé.</div>;
  }
  
  const profileActions = isOwnProfile ? (
    <>
      <Button variant="outline" onClick={() => navigate('/settings')}><Settings className="mr-2 h-4 w-4" />Gérer le Profil</Button>
      <Button onClick={() => navigate('/creator/dashboard')}><BarChart2 className="mr-2 h-4 w-4" />Tableau de Bord</Button>
    </>
  ) : (
    <>
      <Button onClick={() => setIsFollowing(!isFollowing)} variant={isFollowing ? "secondary" : "default"}>
        <UserPlus className="mr-2 h-4 w-4" /> {isFollowing ? 'Se désabonner' : 'S\'abonner'}
      </Button>
      <Button variant="outline" onClick={() => navigate(`/secure-messaging`, { state: { recipientId: creatorData.id, recipientName: creatorData.displayName || creatorData.username, recipientAvatar: creatorData.avatarUrl } })}>
        <MessageCircle className="mr-2 h-4 w-4" /> Message
      </Button>
      <Button variant="ghost" size="icon"><Bell className="h-5 w-5" /></Button>
    </>
  );

  // Adapt ContentGrid items to match expected structure if necessary
  const contentGridItems = videos.map(video => ({
    id: video.id?.toString() || Math.random().toString(), // Ensure ID is string for ContentGrid
    title: video.title || "Vidéo sans titre",
    type: video.type === "teaser" ? "teaser" : video.is_premium ? "premium" : "standard", // Example mapping
    format: video.format as '16:9' | '9:16' | '1:1' || '16:9',
    thumbnailUrl: video.thumbnail_url || undefined,
    originalVideo: video, // Renamed from 'data' to avoid confusion
  }));

  return (
    <div className="container mx-auto px-4 py-6">
      {creatorData && (
        <>
          <CreatorHeader
            name={creatorData.displayName || creatorData.username || 'Créateur'}
            username={creatorData.username || 'username'}
            avatar={creatorData.avatarUrl || '/placeholder-avatar.jpg'}
            bio={creatorData.bio || 'Aucune biographie disponible.'}
            tier="bronze"
            metrics={{
              followers: followerCount,
              revenue: 0,
              nextTierProgress: 45,
            }}
            isOwner={isOwnProfile}
          />
          
          {/* Navigation et contenu du profil */}
          <div className="mt-8 space-y-6">
            <div className="flex justify-between items-center">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="videos">Vidéos</TabsTrigger>
                  <TabsTrigger value="images">Photos</TabsTrigger>
                  <TabsTrigger value="audio">Audio</TabsTrigger>
                  <TabsTrigger value="stats">Statistiques</TabsTrigger>
                </TabsList>
                
                <TabsContent value="videos" className="space-y-6">
                  {loadingVideos ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-64 w-full rounded-lg" />
                      ))}
                    </div>
                  ) : videos.length > 0 ? (
                    <ContentGrid 
                      contents={contentGridItems} 
                      layout="masonry" 
                      onItemClick={handleContentClick} 
                    />
                  ) : (
                    <div className="text-center py-12">
                      <VideoIcon size={48} className="mx-auto text-muted-foreground mb-4" />
                      <p>Aucune vidéo disponible pour ce créateur.</p>
                    </div>
                  )}
                </TabsContent>
                
                {/* Autres onglets */}
                <TabsContent value="images">
                  <div className="text-center py-12">
                    <ImageIcon size={48} className="mx-auto text-muted-foreground mb-4" />
                    <p>Les photos seront disponibles prochainement.</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="audio">
                  <div className="text-center py-12">
                    <Music2 size={48} className="mx-auto text-muted-foreground mb-4" />
                    <p>Les contenus audio seront disponibles prochainement.</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="stats">
                  <div className="text-center py-12">
                    <BarChart2 size={48} className="mx-auto text-muted-foreground mb-4" />
                    <p>Les statistiques seront disponibles prochainement.</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </>
      )}
      
      {/* Player modal */}
      {selectedVideo && (
        <XteasePlayerModal
          isOpen={isPlayerOpen}
          onClose={() => setIsPlayerOpen(false)}
          videoSrc={`https://stream.mux.com/${selectedVideo.mux_playback_id}.m3u8`}
          thumbnailUrl={selectedVideo.thumbnail_url || undefined}
          title={selectedVideo.title || "Vidéo"}
        />
      )}
    </div>
  );
};

export default CreatorProfile;
