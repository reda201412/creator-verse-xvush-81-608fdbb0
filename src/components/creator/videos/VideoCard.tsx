
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { 
  MoreVertical, 
  Play, 
  Eye, 
  ThumbsUp, 
  MessageCircle,
  Trash2,
  Edit,
  Share2,
  ChartBar,
  AlertTriangle,
  RefreshCcw
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VideoData } from '@/types/video';
import { useToast } from '@/hooks/use-toast';

interface VideoCardProps {
  video: VideoData;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
  onPromote: (id: number) => void;
  onAnalytics: (id: number) => void;
}

const VideoTypeLabel = ({ type }: { type?: string }) => {
  if (!type || type === 'standard') return null;

  let label = type;
  let variant: "default" | "secondary" | "destructive" | "outline" = "default";

  switch (type) {
    case 'premium':
      label = 'Premium';
      variant = "default";
      break;
    case 'teaser':
      label = 'Teaser';
      variant = "secondary";
      break;
    case 'vip':
      label = 'VIP';
      variant = "destructive";
      break;
    default:
      label = type;
      variant = "outline";
  }

  return (
    <Badge variant={variant} className="absolute top-2 right-2">
      {label}
    </Badge>
  );
};

const VideoCard: React.FC<VideoCardProps> = ({ 
  video, 
  onDelete, 
  onEdit, 
  onPromote, 
  onAnalytics 
}) => {
  const { toast } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleDelete = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette vidéo ?')) {
      onDelete(video.id);
    }
  };

  const handleRetry = () => {
    toast({
      title: "Traitement redémarré",
      description: "Le traitement de votre vidéo a été relancé.",
    });
  };

  const isProcessing = video.status === 'processing';
  const isFailed = video.status === 'failed';
  const isReady = video.status === 'ready';

  const formatCountValue = (value?: number) => {
    if (value === undefined || value === null) return '0';
    if (value < 1000) return value.toString();
    if (value < 1000000) return `${(value / 1000).toFixed(1)}K`;
    return `${(value / 1000000).toFixed(1)}M`;
  };
  
  const formatVideoPrice = () => {
    if (!video.is_premium) return null;
    
    // Use the tokenPrice property instead of token_price
    if (video.tokenPrice) {
      return `${video.tokenPrice} tokens`;
    }
    
    return "Premium";
  };

  return (
    <Card className="overflow-hidden flex flex-col h-full">
      {/* Video Thumbnail */}
      <div className="aspect-video relative overflow-hidden bg-black">
        {/* Processing Overlay */}
        {isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
            <div className="text-center p-4">
              <RefreshCcw className="mx-auto h-6 w-6 animate-spin text-primary mb-2" />
              <p className="text-sm font-medium text-white">Traitement en cours...</p>
            </div>
          </div>
        )}

        {/* Error Overlay */}
        {isFailed && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
            <div className="text-center p-4">
              <AlertTriangle className="mx-auto h-6 w-6 text-destructive mb-2" />
              <p className="text-sm font-medium text-white">Échec du traitement</p>
              <p className="text-xs text-muted-foreground mt-1">
                {video.error_message || "Une erreur est survenue lors du traitement de la vidéo."}
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={handleRetry}
              >
                Réessayer
              </Button>
            </div>
          </div>
        )}

        {/* Thumbnail */}
        <img 
          src={video.thumbnail_url || '/placeholder.svg'} 
          alt={video.title} 
          className="w-full h-full object-cover"
        />

        {/* Type Badge */}
        <VideoTypeLabel type={video.type} />

        {/* Price Badge (if premium) */}
        {video.is_premium && (
          <Badge variant="secondary" className="absolute bottom-2 right-2">
            {formatVideoPrice()}
          </Badge>
        )}

        {/* Play Button Overlay */}
        {isReady && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/40">
            <Button size="icon" variant="ghost" className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30">
              <Play className="h-6 w-6 text-white" />
            </Button>
          </div>
        )}
      </div>

      {/* Video Info */}
      <CardContent className="p-4 flex-grow">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold line-clamp-1">{video.title}</h3>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {video.description}
            </p>
          </div>

          <DropdownMenu onOpenChange={setIsMenuOpen} open={isMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="-mr-2">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(video.id)}>
                <Edit className="mr-2 h-4 w-4" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onPromote(video.id)}>
                <Share2 className="mr-2 h-4 w-4" />
                Promouvoir
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAnalytics(video.id)}>
                <ChartBar className="mr-2 h-4 w-4" />
                Analytiques
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>

      {/* Video Stats */}
      <CardFooter className="px-4 py-3 border-t flex justify-between text-xs text-muted-foreground">
        <div className="flex space-x-4">
          <div className="flex items-center">
            <Eye className="h-3 w-3 mr-1" />
            <span>{formatCountValue(video.viewCount)}</span>
          </div>
          <div className="flex items-center">
            <ThumbsUp className="h-3 w-3 mr-1" />
            <span>{formatCountValue(video.likeCount)}</span>
          </div>
          <div className="flex items-center">
            <MessageCircle className="h-3 w-3 mr-1" />
            <span>{formatCountValue(video.commentCount)}</span>
          </div>
        </div>
        
        <div>
          {new Date(video.createdAt || Date.now()).toLocaleDateString()}
        </div>
      </CardFooter>
    </Card>
  );
};

export default VideoCard;
