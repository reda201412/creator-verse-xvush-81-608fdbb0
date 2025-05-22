import React, { useState, useEffect, useCallback } from 'react'; 
import { useToast } from '@/hooks/use-toast';
import VideoHeader from '@/components/creator/videos/VideoHeader';
import VideoFilterTabs from '@/components/creator/videos/VideoFilterTabs';
import VideoGrid from '@/components/creator/videos/VideoGrid';
import VideoSearch from '@/components/creator/videos/VideoSearch';
import { useAuth } from '@/contexts/AuthContext';
import VideoAnalyticsModal from '@/components/creator/videos/VideoAnalyticsModal';
// Update imports to resolve type conflicts
import { getCreatorVideos } from '@/services/creatorService';
import { VideoData } from '@/types/video'; // Use the type from types/video.ts

const CreatorVideos: React.FC = () => {
  // Use VideoData type for the videos state
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideoId, setSelectedVideoId] = useState<number | null>(null);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const { toast: showToast } = useToast();
  const { user } = useAuth();

  // Moved fetchVideos outside useEffect
  const fetchVideos = useCallback(async () => {
    if (!user || !user.uid) {
      setLoading(false);
      setVideos([]);
      return;
    }
    
    setLoading(true);
    try {
      // Fix: Add mapping between service VideoData and our VideoData type
      const fetchedVideos = await getCreatorVideos(user.uid);
      console.log("Vidéos récupérées de Supabase:", fetchedVideos);
      
      // Map serviceVideoData to our VideoData type to ensure type compatibility
      const mappedVideos: VideoData[] = Array.isArray(fetchedVideos) 
        ? fetchedVideos.map(video => ({
            id: video.id,
            userId: video.creatorId || video.userId || user.uid, // Using camelCase properties
            title: video.title || "",
            description: video.description,
            type: video.type || "standard",
            thumbnailUrl: video.thumbnailUrl || video.thumbnail_url,
            isPremium: video.isPremium || video.is_premium,
            playbackId: video.playbackId || video.mux_playback_id,
            viewCount: video.viewCount,
            likeCount: 0, // Default values for required fields
            commentCount: 0, // Default values for required fields
            status: video.status
          }))
        : [];
        
      setVideos(mappedVideos);
    } catch (error) {
      console.error('Error fetching videos from Supabase:', error);
      showToast({
        title: "Erreur",
        description: "Impossible de charger vos vidéos. Veuillez réessayer.",
        variant: "destructive"
      });
      setVideos([]);
    } finally {
      setLoading(false);
    }
  }, [user, showToast]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  // Update the handler to match the correct VideoData type
  const handleUploadComplete = (newVideoData?: VideoData | null) => {
    console.log("Upload initiated, initial Supabase record created or error:", newVideoData);
    fetchVideos();
  };

  const handleDeleteVideo = async (videoId: number) => {
    if (videoId === undefined || videoId === null) { // Check for number ID
        showToast({ title: "Erreur", description: "ID de vidéo invalide.", variant: "destructive" });
        return;
    }
    console.warn("Video deletion needs a backend function to delete from MUX and Supabase.");
    showToast({
        title: "Fonctionnalité à implémenter",
        description: "La suppression de vidéo nécessite une fonction backend sécurisée.",
    });
  };

  const handleEditVideo = (videoId: number) => { // Use number ID
    // Logic to edit video metadata
    console.log("Edit video metadata for ID:", videoId);
    const videoToEdit = videos.find(v => v.id === videoId);
    if (videoToEdit) {
      showToast({ title: "Fonctionnalité à implémenter", description: `Éditer la vidéo : ${videoToEdit.title}`});
    } else {
      showToast({ title: "Erreur", description: "Vidéo non trouvée pour l'édition.", variant: "destructive"});
    }
  };

  const handlePromoteVideo = (videoId: number) => { // Use number ID
    // Logic to promote a video
    console.log("Promote video ID:", videoId);
    showToast({ title: "Fonctionnalité à implémenter", description: `Promouvoir la vidéo ID: ${videoId}`});
  };

  const handleAnalyticsVideo = (videoId: number) => { // Use number ID
    setSelectedVideoId(videoId);
    setIsAnalyticsModalOpen(true);
    // Analytics data should be fetched from MUX Data API or your stored metrics
  };

  return (
    <div className="container mx-auto px-4 py-8">
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
        videos={videos.filter(video => {
          const matchesTab = activeTab === 'all' || (video.type && video.type === activeTab);
          const matchesSearch = searchQuery === '' || 
                              (video.title && video.title.toLowerCase().includes(searchQuery.toLowerCase())) || 
                              (video.description && video.description.toLowerCase().includes(searchQuery.toLowerCase()));
          return matchesTab && matchesSearch;
        })}
        activeTab={activeTab}
        searchQuery={searchQuery}
        onDeleteVideo={(id) => console.log('Delete video', id)}
        onEditVideo={(id) => console.log('Edit video', id)}
        onPromoteVideo={(id) => console.log('Promote video', id)}
        onAnalyticsVideo={(id) => {
          setSelectedVideoId(id);
          setIsAnalyticsModalOpen(true);
        }}
        isLoading={loading} 
        onUploadComplete={handleUploadComplete}
      />

      <VideoAnalyticsModal
        videoId={selectedVideoId !== null ? selectedVideoId.toString() : null}
        isOpen={isAnalyticsModalOpen}
        onClose={() => setIsAnalyticsModalOpen(false)}
      />
    </div>
  );
};

export default CreatorVideos;
