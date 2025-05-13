import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import VideoHeader from '@/components/creator/videos/VideoHeader';
import VideoFilterTabs from '@/components/creator/videos/VideoFilterTabs';
import VideoGrid from '@/components/creator/videos/VideoGrid';
import VideoSearch from '@/components/creator/videos/VideoSearch';
import { useAuth } from '@/contexts/AuthContext';
import VideoAnalyticsModal from '@/components/creator/videos/VideoAnalyticsModal';
import { getCreatorVideos, VideoFirestoreData } from '@/services/creatorService';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/integrations/firebase/firebase';
import { VideoMetadata } from '@/types/video';

const CreatorVideos: React.FC = () => {
  const [videos, setVideos] = useState<VideoFirestoreData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch videos from Firestore when component mounts or user changes
  useEffect(() => {
    const fetchVideos = async () => {
      if (!user) {
        setLoading(false);
        setVideos([]);
        return;
      }
      
      setLoading(true);
      try {
        const fetchedVideos = await getCreatorVideos(user.uid);
        console.log("Vidéos récupérées:", fetchedVideos);
        setVideos(fetchedVideos);
      } catch (error) {
        console.error('Error fetching videos:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger vos vidéos. Veuillez réessayer.",
          variant: "destructive"
        });
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [user, toast]);

  // Convert VideoFirestoreData to VideoMetadata for the component props
  const handleUploadComplete = (firestoreData: VideoFirestoreData) => {
    // Add the new video to the beginning of the list
    setVideos(prev => [firestoreData, ...prev]);
  };

  const handleDeleteVideo = async (videoId: string) => {
    if (!videoId) {
        toast({ title: "Erreur", description: "ID de vidéo invalide.", variant: "destructive" });
        return;
    }
    try {
      // Delete the video metadata from Firestore
      const videoRef = doc(db, 'videos', videoId);
      await deleteDoc(videoRef);
      
      setVideos(prev => prev.filter(video => video.id !== videoId));
      
      toast({
        title: "Métadonnées vidéo supprimées",
        description: "Les informations de la vidéo ont été supprimées de la base de données. N'oubliez pas de supprimer le fichier vidéo de MUX si nécessaire.",
      });
    } catch (error) {
      console.error('Error deleting video metadata:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer les métadonnées de la vidéo. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };

  const handleEditVideo = (videoId: string) => {
    const videoToEdit = videos.find(v => v.id === videoId);
    if (videoToEdit) {
      toast({ title: "Fonctionnalité à implémenter", description: `Éditer la vidéo : ${videoToEdit.title}`});
    } else {
      toast({ title: "Erreur", description: "Vidéo non trouvée pour l'édition.", variant: "destructive"});
    }
  };

  const handlePromoteVideo = (videoId: string) => {
    console.log("Promote video ID:", videoId);
    toast({ title: "Fonctionnalité à implémenter", description: `Promouvoir la vidéo ID: ${videoId}`});
  };

  const handleAnalyticsVideo = (videoId: string) => {
    setSelectedVideoId(videoId);
    setIsAnalyticsModalOpen(true);
  };

  // Convert FirestoreData to VideoMetadata for the grid component
  const convertToVideoMetadata = (videos: VideoFirestoreData[]): VideoMetadata[] => {
    return videos.map(video => ({
      id: video.id || '',
      title: video.title,
      description: video.description || '',
      type: video.type,
      videoFile: new File([], 'placeholder'), // Placeholder file since we don't have the actual file
      thumbnailUrl: video.thumbnailUrl,
      video_url: video.videoUrl,
      url: video.videoUrl,
      format: video.format || '16:9',
      isPremium: video.isPremium || false,
      tokenPrice: video.tokenPrice,
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Pass the handler that accepts VideoFirestoreData */}
      <VideoHeader onUploadComplete={handleUploadComplete} /> 
      
      <div className="mb-6 space-y-4">
        <VideoSearch 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <VideoFilterTabs 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      <VideoGrid 
        videos={videos as unknown as VideoMetadata[]} 
        activeTab={activeTab}
        searchQuery={searchQuery}
        onDeleteVideo={handleDeleteVideo}
        onEditVideo={handleEditVideo}
        onPromoteVideo={handlePromoteVideo}
        onAnalyticsVideo={handleAnalyticsVideo}
        isLoading={loading}
        onUploadComplete={(metadata) => handleUploadComplete(metadata as unknown as VideoFirestoreData)}
      />

      <VideoAnalyticsModal
        videoId={selectedVideoId}
        isOpen={isAnalyticsModalOpen}
        onClose={() => setIsAnalyticsModalOpen(false)}
      />
    </div>
  );
};

export default CreatorVideos;
