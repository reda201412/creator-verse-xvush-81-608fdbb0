
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { VideoMetadata } from '@/components/creator/VideoUploader';
import VideoHeader from '@/components/creator/videos/VideoHeader';
import VideoFilterTabs from '@/components/creator/videos/VideoFilterTabs';
import VideoGrid from '@/components/creator/videos/VideoGrid';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const CreatorVideos: React.FC = () => {
  const [videos, setVideos] = useState<VideoMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
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
          id: video.id.toString(),
          title: video.title || 'Sans titre',
          description: video.description || '',
          type: video.type as ContentType,
          videoFile: {} as File, // We don't have the actual file object from database
          thumbnailUrl: video.thumbnail_url,
          format: video.format as '16:9' | '9:16' | '1:1' | 'other' || '16:9',
          isPremium: video.is_premium || false,
          tokenPrice: video.token_price,
          restrictions: video.restrictions
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
      // Delete from Supabase
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', videoId);
      
      if (error) throw error;
      
      // Update local state
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

  return (
    <div className="container mx-auto px-4 py-8">
      <VideoHeader onUploadComplete={handleUploadComplete} />
      
      <VideoFilterTabs 
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <VideoGrid
        videos={videos}
        activeTab={activeTab}
        onDeleteVideo={handleDeleteVideo}
        onEditVideo={handleEditVideo}
        onPromoteVideo={handlePromoteVideo}
        onAnalyticsVideo={handleAnalyticsVideo}
        onUploadComplete={handleUploadComplete}
        isLoading={loading}
      />
    </div>
  );
};

export default CreatorVideos;
