import React from 'react';
import { Video } from 'lucide-react';
import VideoCard from './VideoCard';
// Import the data type
import { VideoData } from '@/services/creatorService';
// Removed original VideoMetadata import:
// import { VideoMetadata } from '@/types/video';
import VideoUploader from '@/components/creator/VideoUploader';
import { Skeleton } from '@/components/ui/skeleton'; 

interface VideoGridProps {
  // Use the VideoData type for the videos array
  videos: VideoData[];
  activeTab: string;
  searchQuery: string;
  // videoId is a number
  onDeleteVideo: (videoId: number) => void;
  onEditVideo: (videoId: number) => void;
  onPromoteVideo: (videoId: number) => void;
  onAnalyticsVideo: (videoId: number) => void;
  // onUploadComplete callback with VideoData type
  onUploadComplete: (metadata?: VideoData | null) => void;
  isLoading?: boolean;
}

const VideoGrid: React.FC<VideoGridProps> = ({
  videos,
  activeTab,
  searchQuery,
  onDeleteVideo,
  onEditVideo,
  onPromoteVideo,
  onAnalyticsVideo,
  onUploadComplete,
  isLoading = false
}) => {
  const getFilteredVideos = () => {
    let filteredVideos = videos;

    // Filter by tab (video.type should exist in VideoSupabaseData)
    if (activeTab !== 'all') {
      filteredVideos = filteredVideos.filter(video => video.type === activeTab);
    }

    // Filter by search query (video.title, video.description should exist)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filteredVideos = filteredVideos.filter(video => 
        (video.title && video.title.toLowerCase().includes(query)) || 
        (video.description && video.description.toLowerCase().includes(query))
      );
    }

    return filteredVideos;
  };

  // getTypeLabel function remains the same, it works with string types
  const getTypeLabel = (type?: string | null) => { // Allow null/undefined type
     if (!type) return 'Standard';
    switch (type) {
      case 'standard': return 'Gratuit';
      case 'teaser': return 'Xtease';
      case 'premium': return 'Premium';
      case 'vip': return 'VIP';
      default: return type;
    }
  };

  const filteredVideos = getFilteredVideos();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-lg overflow-hidden">
            <Skeleton className="aspect-video w-full" />
            <div className="p-3 space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {filteredVideos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <VideoCard
              key={video.id} // Use video.id (number)
              video={video} // Pass the VideoSupabaseData object
              onDelete={onDeleteVideo} // Pass the handler (expects number)
              onEdit={onEditVideo} // Pass the handler (expects number)
              onPromote={onPromoteVideo} // Pass the handler (expects number)
              onAnalytics={onAnalyticsVideo} // Pass the handler (expects number)
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Video className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Aucune vidéo</h3>
          <p className="text-muted-foreground mt-1 mb-4">
            {searchQuery.trim() 
              ? "Aucune vidéo ne correspond à votre recherche."
              : `Vous n'avez pas encore ajouté de vidéo${activeTab !== 'all' ? ` de type ${getTypeLabel(activeTab)}` : ''}.`
            }
          </p>
          {/* Ensure VideoUploader also uses the updated onUploadComplete type */}
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
