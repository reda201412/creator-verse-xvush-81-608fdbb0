
import React, { useState } from 'react';
import { VideoMetadata } from '@/types/video';
import { 
  MoreVertical, 
  Play, 
  Trash2, 
  Edit, 
  BarChart3, 
  Share
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Dialog, DialogContent } from '@/components/ui/dialog';

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'standard': return 'Gratuit';
      case 'teaser': return 'Xtease';
      case 'premium': return 'Premium';
      case 'vip': return 'VIP';
      default: return type;
    }
  };

  return (
    <div className="bg-card rounded-lg overflow-hidden shadow transition-all hover:shadow-md">
      {/* Video Thumbnail */}
      <div 
        className="relative aspect-video bg-muted cursor-pointer"
        onClick={() => setVideoDialogOpen(true)}
      >
        {video.thumbnailUrl ? (
          <img 
            src={video.thumbnailUrl} 
            alt={video.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary/10">
            <Play className="h-12 w-12 text-primary opacity-50" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
          <Play className="h-12 w-12 text-white" />
        </div>
        
        {/* Video Type Badge */}
        <div className="absolute top-2 left-2 px-2 py-1 text-xs font-medium bg-primary text-primary-foreground rounded">
          {getTypeLabel(video.type)}
        </div>
      </div>
      
      {/* Video Details */}
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between">
          <h3 className="font-medium line-clamp-1">{video.title}</h3>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="-mr-2">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(video.id)}>
                <Edit className="mr-2 h-4 w-4" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onPromote(video.id)}>
                <Share className="mr-2 h-4 w-4" />
                Promouvoir
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAnalytics(video.id)}>
                <BarChart3 className="mr-2 h-4 w-4" />
                Statistiques
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setDeleteDialogOpen(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {video.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {video.description}
          </p>
        )}
        
        {video.isPremium && video.tokenPrice && (
          <div className="text-sm font-medium text-primary">
            {video.tokenPrice} tokens
          </div>
        )}
      </div>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette vidéo?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La vidéo sera définitivement supprimée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => onDelete(video.id)}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Video Preview Dialog */}
      <Dialog open={videoDialogOpen} onOpenChange={setVideoDialogOpen}>
        <DialogContent className="sm:max-w-3xl">
          <div className="aspect-video bg-black rounded-md overflow-hidden">
            {video.video_url ? (
              <video
                src={video.video_url}
                className="w-full h-full"
                controls
                autoPlay
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-white">Erreur: Vidéo non disponible</p>
              </div>
            )}
          </div>
          <h3 className="text-lg font-medium mt-2">{video.title}</h3>
          {video.description && (
            <p className="text-sm text-muted-foreground">{video.description}</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VideoCard;
