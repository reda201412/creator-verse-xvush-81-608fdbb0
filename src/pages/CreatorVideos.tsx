
import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback
import { useToast } from '@/hooks/use-toast';
// import { VideoMetadata } from '@/types/video'; // Replaced by VideoSupabaseData
import VideoHeader from '@/components/creator/videos/VideoHeader';
import VideoFilterTabs from '@/components/creator/videos/VideoFilterTabs';
import VideoGrid from '@/components/creator/videos/VideoGrid';
import VideoSearch from '@/components/creator/videos/VideoSearch';
import { useAuth } from '@/contexts/AuthContext';
import VideoAnalyticsModal from '@/components/creator/videos/VideoAnalyticsModal';
// Import the Supabase version of the service function and the Supabase data type
import { getCreatorVideos, VideoSupabaseData } from '@/services/creatorService';
// Removed Firebase imports for deletion:
// import { doc, deleteDoc } from 'firebase/firestore';
// import { db } from '@/integrations/firebase/firebase';

const CreatorVideos: React.FC = () => {
  // Use VideoSupabaseData type for the videos state
  const [videos, setVideos] = useState<VideoSupabaseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideoId, setSelectedVideoId] = useState<number | null>(null); // Use number for Supabase ID
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const { toast: showToast } = useToast(); // Renamed to avoid conflict if `toast` is used as a variable
  const { user } = useAuth();

  // *** Moved fetchVideos outside useEffect ***
  const fetchVideos = useCallback(async () => { // Wrapped with useCallback
    if (!user || !user.id) { // Check for user and user.id
      setLoading(false);
      setVideos([]); // Clear videos if no user
      return;
    }
    
    setLoading(true);
    try {
      // Use the updated getCreatorVideos function from creatorService.ts
      // Assuming user.id (Supabase UUID string) is compatible with Supabase user_id (uuid type stored as string)
      const fetchedVideos = await getCreatorVideos(user.id); // Corrected from user.uid
      console.log("Vidéos récupérées de Supabase:", fetchedVideos);
      // Ensure fetchedVideos is an array before setting state
      setVideos(Array.isArray(fetchedVideos) ? fetchedVideos : []);
    } catch (error) {
      console.error('Error fetching videos from Supabase:', error);
      showToast({
        title: "Erreur",
        description: "Impossible de charger vos vidéos. Veuillez réessayer.",
        variant: "destructive"
      });
      setVideos([]); // Ensure videos is an empty array on error
    } finally {
      setLoading(false);
    }
  }, [user, showToast]); // Added dependencies

  // Fetch videos from Supabase when component mounts or user changes
  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]); // Added fetchVideos as a dependency

  // This function needs to be updated to handle upload completion via the useVideoUpload hook
  // and react to the Supabase table updates (potentially via realtime subscriptions or refetching)
  const handleUploadComplete = (newVideoData?: VideoSupabaseData | null) => { // Allow null/undefined
     console.log("Upload initiated, initial Supabase record created or error:", newVideoData);
     // Refetch the videos list after an upload is initiated
     fetchVideos(); 
  };

  // *** THIS NEEDS TO BE UPDATED TO USE A BACKEND FUNCTION TO DELETE FROM MUX AND SUPABASE ***
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

  // Filter and search videos based on active tab and search query
  const filteredAndSearchedVideos = videos.filter(video => {
    const matchesTab = activeTab === 'all' || (video.type && video.type === activeTab);
    const matchesSearch = searchQuery === '' || 
                          (video.title && video.title.toLowerCase().includes(searchQuery.toLowerCase())) || 
                          (video.description && video.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* onUploadComplete prop is passed down. It should trigger a refetch or state update */}
      {/* Ensure VideoHeader calls this handleUploadComplete when useVideoUpload is used successfully */}
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
        videos={filteredAndSearchedVideos} // Pass filtered/searched videos
        activeTab={activeTab}
        searchQuery={searchQuery}
        onDeleteVideo={handleDeleteVideo}
        onEditVideo={handleEditVideo}
        onPromoteVideo={handlePromoteVideo}
        onAnalyticsVideo={handleAnalyticsVideo}
        isLoading={loading} 
        onUploadComplete={handleUploadComplete} // Correctly pass the handler
      />

      <VideoAnalyticsModal
        // *** Convert videoId to string here ***
        videoId={selectedVideoId !== null ? selectedVideoId.toString() : null} // Pass videoId as string
        isOpen={isAnalyticsModalOpen}
        onClose={() => setIsAnalyticsModalOpen(false)}
        // This modal will need to fetch analytics data from MUX Data API or your stored metrics
      />
    </div>
  );
};

export default CreatorVideos;
