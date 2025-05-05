
import React from 'react';
import { Video } from 'lucide-react';
import VideoCard from './VideoCard';
import { VideoMetadata } from '@/components/creator/VideoUploader';
import VideoUploader from '@/components/creator/VideoUploader';

interface VideoGridProps {
  videos: VideoMetadata[];
  activeTab: string;
  onDeleteVideo: (videoId: string) => void;
  onEditVideo: (videoId: string) => void;
  onPromoteVideo: (videoId: string) => void;
  onAnalyticsVideo: (videoId: string) => void;
  onUploadComplete: (metadata: VideoMetadata) => void;
}

const VideoGrid: React.FC<VideoGridProps> = ({
  videos,
  activeTab,
  onDeleteVideo,
  onEditVideo,
  onPromoteVideo,
  onAnalyticsVideo,
  onUploadComplete
}) => {
  const getFilteredVideos = () => {
    switch (activeTab) {
      case 'all':
        return videos;
      case 'standard':
        return videos.filter(video => video.type === 'standard');
      case 'teaser':
        return videos.filter(video => video.type === 'teaser');
      case 'premium':
        return videos.filter(video => video.type === 'premium');
      case 'vip':
        return videos.filter(video => video.type === 'vip');
      default:
        return videos;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'standard': return 'Gratuit';
      case 'teaser': return 'Xtease';
      case 'premium': return 'Premium';
      case 'vip': return 'VIP';
      default: return type;
    }
  };

  const filteredVideos = getFilteredVideos();

  return (
    <>
      {filteredVideos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onDelete={onDeleteVideo}
              onEdit={onEditVideo}
              onPromote={onPromoteVideo}
              onAnalytics={onAnalyticsVideo}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Video className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Aucune vidéo</h3>
          <p className="text-muted-foreground mt-1 mb-4">
            Vous n'avez pas encore ajouté de vidéo{activeTab !== 'all' ? ` de type ${getTypeLabel(activeTab)}` : ''}.
          </p>
          <VideoUploader 
            onUploadComplete={onUploadComplete} 
            isCreator={true} 
          />
        </div>
      )}
    </>
  );
};

export default VideoGrid;
