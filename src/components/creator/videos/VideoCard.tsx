import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Eye, MessageSquare, Loader2, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { VideoData } from '@/types/video';

interface VideoCardProps {
  video: VideoData;
  onPlay: (videoId: string) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onPlay }) => {
  const handlePlay = () => {
    if (video.id) {
      onPlay(String(video.id));
    }
  };
  
  const renderStatus = () => {
    if (video.status === "processing") {
      return (
        <div className="flex items-center text-amber-500">
          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
          <span className="text-xs">Traitement...</span>
        </div>
      );
    } else if (video.status === "ready") {
      return (
        <div className="flex items-center text-green-500">
          <CheckCircle className="h-3 w-3 mr-1" />
          <span className="text-xs">Prêt</span>
        </div>
      );
    } else if (video.status === "pending") {
      return (
        <div className="flex items-center text-blue-500">
          <Clock className="h-3 w-3 mr-1" />
          <span className="text-xs">En attente...</span>
        </div>
      );
    } else if (video.status === "error") {
      return (
        <div className="flex items-center text-red-500">
          <AlertCircle className="h-3 w-3 mr-1" />
          <span className="text-xs">Erreur</span>
        </div>
      );
    }
    
    return null;
  };

  return (
    <Card className="bg-muted/50">
      <CardContent className="p-3 relative">
        {/* Thumbnail */}
        <div className="aspect-video rounded-md overflow-hidden bg-background relative">
          <img
            src={video.thumbnailUrl || '/placeholder.svg'}
            alt={video.title}
            className="object-cover w-full h-full"
          />
          
          {/* Play Button Overlay */}
          <button
            onClick={handlePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity"
          >
            <Play className="h-9 w-9 text-white" />
          </button>
        </div>
        
        {/* Video Title */}
        <h3 className="mt-2 font-medium line-clamp-1">{video.title}</h3>
        
        {/* Video Stats */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
          <div className="flex items-center">
            <Eye className="h-3 w-3 mr-1" />
            <span>{video.viewCount || 0} vues</span>
          </div>
          
          {renderStatus()}
        </div>
        
        {/* Error Message */}
        {video.status === "error" && (
          <div className="mt-2 p-2 bg-red-50 text-red-800 text-xs rounded-md">
            <strong>Erreur:</strong> {video.error || "Une erreur est survenue lors du traitement de la vidéo."}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VideoCard;
