
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { VideoMetadata } from '@/components/creator/VideoUploader';
import { initialVideos } from '@/data/mockVideos';
import VideoHeader from '@/components/creator/videos/VideoHeader';
import VideoFilterTabs from '@/components/creator/videos/VideoFilterTabs';
import VideoGrid from '@/components/creator/videos/VideoGrid';

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
      />
    </div>
  );
};

export default CreatorVideos;
