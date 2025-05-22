import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import CreatorHeader from '@/components/layout/CreatorHeader';
import VideoGrid from '@/components/creator/videos/VideoGrid';
import VideoUploader from '@/components/creator/VideoUploader';
import { getCreatorProfile } from '@/services/profileService';
import { getCreatorVideos } from '@/services/creatorService';
import { CreatorProfileData, VideoData, VideoMetadata, convertMetadataToVideoData, convertVideoDataToMetadata } from '@/types/video';

const CreatorProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [creatorProfile, setCreatorProfile] = useState<CreatorProfileData | null>(null);
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingVideos, setIsLoadingVideos] = useState(true);
  const [activeTab, setActiveTab] = useState('videos');
  const [error, setError] = useState<string | null>(null);
  
  // Determine if the current user is the creator
  const isCreator = user?.uid === creatorProfile?.uid || user?.uid === creatorProfile?.userId || user?.uid === id;
  
  // Get the creator ID (either from URL or current user)
  const creatorId = id || user?.uid;
  
  // Fetch creator profile
  const fetchCreatorProfile = useCallback(async () => {
    if (!creatorId) return;
    
    try {
      setIsLoading(true);
      const profile = await getCreatorProfile(creatorId);
      
      if (!profile) {
        setError("Profil de créateur non trouvé.");
        return;
      }
      
      setCreatorProfile(profile);
    } catch (error) {
      console.error("Error fetching creator profile:", error);
      setError("Impossible de charger le profil du créateur.");
    } finally {
      setIsLoading(false);
    }
  }, [creatorId]);
  
  // Fetch creator videos
  const fetchCreatorVideos = useCallback(async () => {
    if (!creatorId) return;
    
    try {
      setIsLoadingVideos(true);
      const fetchedVideos = await getCreatorVideos(creatorId);
      console.log("Creator videos:", fetchedVideos);
      
      // Ensure type compatibility
      const typedVideos = Array.isArray(fetchedVideos) ? fetchedVideos.map(v => {
        return {
          ...v,
          type: v.type || 'standard',
          id: typeof v.id === 'string' ? parseInt(v.id, 10) : v.id,
        } as VideoData;
      }) : [];
      
      setVideos(typedVideos);
    } catch (error) {
      console.error("Error fetching creator videos:", error);
      setError("Impossible de charger les vidéos du créateur.");
    } finally {
      setIsLoadingVideos(false);
    }
  }, [creatorId]);
  
  // Initial data loading
  useEffect(() => {
    fetchCreatorProfile();
    fetchCreatorVideos();
  }, [fetchCreatorProfile, fetchCreatorVideos]);
  
  // Handle video upload completion
  const handleUploadComplete = (newVideo: VideoData | null) => {
    if (newVideo) {
      // Add the new video to the list
      setVideos(prevVideos => [newVideo, ...prevVideos]);
      
      toast({
        title: "Vidéo téléchargée avec succès",
        description: "Votre vidéo est en cours de traitement et sera bientôt disponible.",
      });
    }
  };
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  // Render loading state
  if (isLoading && !creatorProfile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-muted-foreground">Chargement du profil...</p>
        </div>
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <p className="text-xl font-semibold text-destructive">{error}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => navigate('/')}
          >
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }
  
  // Render creator profile
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Creator Header */}
      {creatorProfile && (
        <CreatorHeader 
          creator={{
            id: creatorProfile.id,
            username: creatorProfile.username,
            displayName: creatorProfile.displayName || creatorProfile.name || creatorProfile.username,
            bio: creatorProfile.bio || undefined,
            avatarUrl: creatorProfile.avatarUrl || creatorProfile.profileImageUrl,
            coverImageUrl: creatorProfile.coverImageUrl,
            joinDate: new Date().toISOString(), // Placeholder
            isCurrentUser: isCreator,
            metrics: {
              followers: creatorProfile.metrics?.followers || 0,
              videos: videos.length,
              likes: creatorProfile.metrics?.likes || 0,
              views: 0, // Placeholder
            },
            revenue: isCreator ? {
              total: 0, // Placeholder
              tokens: 0, // Placeholder
              percentChange: 0, // Placeholder
            } : undefined,
            tier: isCreator ? {
              current: 'Bronze',
              next: 'Silver',
              currentPoints: 75,
              nextTierPoints: 100,
            } : undefined,
          }}
        />
      )}
      
      {/* Content Tabs */}
      <Tabs defaultValue="videos" value={activeTab} onValueChange={handleTabChange}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="videos">Vidéos</TabsTrigger>
            <TabsTrigger value="about">À propos</TabsTrigger>
            {isCreator && (
              <TabsTrigger value="analytics">Analytiques</TabsTrigger>
            )}
          </TabsList>
          
          {renderUploadHandler()}
        </div>
        
        <Separator className="my-4" />
        
        <TabsContent value="videos" className="space-y-6">
          <VideoGrid
            videos={videos}
            isLoading={isLoadingVideos}
            onDeleteVideo={(id) => console.log('Delete video', id)}
            onEditVideo={(id) => console.log('Edit video', id)}
            onPromoteVideo={(id) => console.log('Promote video', id)}
            onAnalyticsVideo={(id) => console.log('Analytics video', id)}
            onUploadComplete={handleUploadComplete}
          />
        </TabsContent>
        
        <TabsContent value="about">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">À propos</h2>
            <p className="text-muted-foreground">
              {creatorProfile?.bio || "Ce créateur n'a pas encore ajouté de biographie."}
            </p>
          </div>
        </TabsContent>
        
        {isCreator && (
          <TabsContent value="analytics">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Analytiques</h2>
              <p className="text-muted-foreground">
                Consultez les statistiques détaillées de votre chaîne et de vos vidéos.
              </p>
              
              <Button onClick={() => navigate('/creator/revenue')}>
                Voir le tableau de bord complet
              </Button>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
  
  function renderUploadHandler() {
    if (!isCreator) return null;
    
    return (
      <VideoUploader 
        onUploadComplete={(newVideo) => {
          if (newVideo) {
            handleUploadComplete(newVideo as VideoData);
          }
        }}
        isCreator={isCreator} 
        className="w-full md:w-auto"
      />
    );
  }
};

export default CreatorProfile;
