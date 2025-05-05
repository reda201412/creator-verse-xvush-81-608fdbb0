
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { VideoMetadata } from '@/types/video';
import VideoHeader from '@/components/creator/videos/VideoHeader';
import VideoFilterTabs from '@/components/creator/videos/VideoFilterTabs';
import VideoGrid from '@/components/creator/videos/VideoGrid';
import VideoSearch from '@/components/creator/videos/VideoSearch';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import VideoAnalyticsModal from '@/components/creator/videos/VideoAnalyticsModal';

const CreatorVideos: React.FC = () => {
  const [videos, setVideos] = useState<VideoMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch videos from Supabase when component mounts
  useEffect(() => {
    const fetchVideos = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('videos')
          .select('*')
          .eq('user_id', user.id)
          .order('uploadedat', { ascending: false });
        
        if (error) throw error;
        
        // Transform Supabase data to VideoMetadata format
        const transformedData: VideoMetadata[] = data.map(video => ({
          id: video.id?.toString() || '',
          title: video.title || 'Sans titre',
          description: video.description || '',
          type: video.type as VideoMetadata['type'],
          videoFile: {} as File, // We don't have the actual file object from database
          thumbnailUrl: video.thumbnail_url,
          format: video.format as '16:9' | '9:16' | '1:1' | 'other' || '16:9',
          isPremium: video.is_premium || false,
          tokenPrice: video.token_price || undefined,
          restrictions: video.restrictions as VideoMetadata['restrictions']
        }));
        
        setVideos(transformedData);
      } catch (error) {
        console.error('Error fetching videos:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger vos vidéos. Veuillez réessayer.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [user, toast]);

  const handleUploadComplete = (metadata: VideoMetadata) => {
    setVideos(prev => [metadata, ...prev]);
  };

  const handleDeleteVideo = async (videoId: string) => {
    try {
      // Convert string ID to number for Supabase query
      const id = parseInt(videoId, 10);
      
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setVideos(prev => prev.filter(video => video.id !== videoId));
      
      toast({
        title: "Vidéo supprimée",
        description: "La vidéo a été supprimée avec succès."
      });
    } catch (error) {
      console.error('Error deleting video:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la vidéo. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };

  const handleEditVideo = (videoId: string) => {
    console.log("Edit video:", videoId);
  };

  const handlePromoteVideo = (videoId: string) => {
    console.log("Promote video:", videoId);
  };

  const handleAnalyticsVideo = (videoId: string) => {
    setSelectedVideoId(videoId);
    setIsAnalyticsModalOpen(true);
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
        videos={videos}
        activeTab={activeTab}
        searchQuery={searchQuery}
        onDeleteVideo={handleDeleteVideo}
        onEditVideo={handleEditVideo}
        onPromoteVideo={handlePromoteVideo}
        onAnalyticsVideo={handleAnalyticsVideo}
        onUploadComplete={handleUploadComplete}
        isLoading={loading}
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
