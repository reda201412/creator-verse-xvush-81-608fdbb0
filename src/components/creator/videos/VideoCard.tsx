
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VideoData } from '@/services/creatorService';
import { Play, MoreVertical } from 'lucide-react';

interface VideoCardProps {
  video: VideoData;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  onPromote?: (id: string) => void;
  onAnalytics?: (id: string) => void;
  onClick?: () => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ 
  video,
  onDelete,
  onEdit,
  onPromote,
  onAnalytics,
  onClick
}) => {
  return (
    <Card 
      className="overflow-hidden transition-shadow hover:shadow-md cursor-pointer"
      onClick={onClick}
    >
      <div className="relative aspect-video">
        <img 
          src={video.thumbnailUrl} 
          alt={video.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <Button variant="outline" size="icon" className="rounded-full bg-white/20 border-white/50">
            <Play className="h-6 w-6 text-white" />
          </Button>
        </div>
      </div>
      <CardContent className="p-3">
        <h3 className="font-medium truncate">{video.title}</h3>
        <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{video.description}</p>
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-muted-foreground">{video.views} views</p>
          {video.isPremium && (
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
              Premium
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoCard;
