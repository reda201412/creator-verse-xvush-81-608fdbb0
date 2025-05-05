
import React from 'react';
import { motion } from 'framer-motion';
import { Play, Film, Video, ChevronDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { VideoMetadata } from '@/types/video';
import { useToast } from '@/hooks/use-toast';

interface VideoCardProps {
  video: VideoMetadata;
  onDelete: (videoId: string) => void;
  onEdit: (videoId: string) => void;
  onPromote: (videoId: string) => void;
  onAnalytics: (videoId: string) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ 
  video, 
  onDelete, 
  onEdit, 
  onPromote, 
  onAnalytics 
}) => {
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'standard': return 'Gratuit';
      case 'teaser': return 'Xtease';
      case 'premium': return 'Premium';
      case 'vip': return 'VIP';
      default: return type;
    }
  };

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'standard': return 'bg-green-500/10 text-green-600 hover:bg-green-500/20';
      case 'teaser': return 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20';
      case 'premium': return 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20';
      case 'vip': return 'bg-purple-500/10 text-purple-600 hover:bg-purple-500/20';
      default: return 'bg-primary/10 text-primary hover:bg-primary/20';
    }
  };

  const formatInfoText = (video: VideoMetadata) => {
    const parts = [];

    if (video.isPremium && video.tokenPrice) {
      parts.push(`${video.tokenPrice} tokens`);
    }

    if (video.restrictions?.tier && video.restrictions.tier !== 'free') {
      parts.push(`Niveau ${video.restrictions.tier}`);
    }

    return parts.join(' • ');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden">
        <div className="relative">
          <div className={cn(
            "aspect-video bg-muted relative overflow-hidden",
            video.format === '9:16' && "aspect-[9/16]",
            video.format === '1:1' && "aspect-square"
          )}>
            <img 
              src={video.thumbnailUrl || 'https://placehold.co/600x400/jpeg'} 
              alt={video.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-3">
              <Badge className={cn(
                "absolute top-2 left-2",
                getTypeBadgeClass(video.type)
              )}>
                {getTypeLabel(video.type)}
              </Badge>

              <div className="absolute top-2 right-2">
                <Button
                  variant="ghost" 
                  size="icon" 
                  className="bg-black/40 hover:bg-black/60 text-white rounded-full h-8 w-8"
                >
                  <Play size={16} />
                </Button>
              </div>

              <div className="w-full">
                <h3 className="text-white font-medium truncate">{video.title}</h3>
                {video.isPremium && (
                  <p className="text-white/80 text-xs">
                    {formatInfoText(video)}
                  </p>
                )}
              </div>
            </div>
          </div>

          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-xs text-muted-foreground">
                  <Film className="mr-1 h-3 w-3" />
                  <span>{video.format}</span>
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Video className="mr-1 h-3 w-3" />
                  <span>0 vues</span>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ChevronDown size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(video.id)}>
                    Modifier
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onPromote(video.id)}>
                    Promouvoir
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onAnalytics(video.id)}>
                    Statistiques
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDelete(video.id)}
                    className="text-red-500 focus:text-red-500"
                  >
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
};

export default VideoCard;
