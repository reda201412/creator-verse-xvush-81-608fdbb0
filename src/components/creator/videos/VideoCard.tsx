import React, { useState } from 'react';
// Use the Supabase data type
import { VideoData } from '@/services/creatorService';
import { 
  MoreVertical, 
  Play, 
  Trash2, 
  Edit, 
  BarChart3, 
  Share,
  Loader2, // Added Loader icon
  AlertCircle // Added Alert icon
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
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'; // Corrected import if installed

import EnhancedVideoPlayer from '@/components/video/EnhancedVideoPlayer';
import { MediaCacheService } from '@/services/media-cache.service';
import { useMicroRewards } from '@/hooks/use-microrewards';
import { useToast } from '@/hooks/use-toast'; // Import useToast hook

interface VideoCardProps {
  // Use the Supabase data type
  video: VideoData;
  onDelete: (videoId: number) => void; // Updated to use number ID
  onEdit: (videoId: number) => void; // Updated to use number ID
  onPromote: (videoId: number) => void; // Updated to use number ID
  onAnalytics: (videoId: number) => void; // Updated to use number ID
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
  const { triggerMediaReward } = useMicroRewards();
  const { toast } = useToast(); // Call the useToast hook

  const getTypeLabel = (type?: string | null) => {
     if (!type) return 'Standard'; // Default label if type is null/undefined
    switch (type) {
      case 'standard': return 'Gratuit';
      case 'teaser': return 'Xtease';
      case 'premium': return 'Premium';
      case 'vip': return 'VIP';
      default: return type;
    }
  };

  // Determine the video URL based on MUX playback ID and status
  const getPlaybackUrl = () => {
    if (video.status === 'ready' && video.mux_playback_id) {
      return `https://stream.mux.com/${video.mux_playback_id}.m3u8`; // Mux HLS streaming URL
    }
    return null; // Return null if not ready or no playback ID
  };

   // Get the current video status message
   const getStatusMessage = () => {
       switch (video.status) {
           case 'pending': // Fallthrough
           case 'processing':
               return 'Vidéo en cours de traitement...';
           case 'error':
               return 'Erreur lors du traitement de la vidéo.';
           case 'ready':
               return 'Vidéo prête.';
           default:
               // If status is null/undefined but no playback ID (which getPlaybackUrl handles)
               if (video.playbackId) return 'Vidéo prête.';
               return 'Vidéo non disponible.'; // General fallback
       }
   };

  // Preload video when hover (only if status is ready)
  const handleHover = async () => {
    const playbackUrl = getPlaybackUrl();
    if (playbackUrl && MediaCacheService.isCacheAvailable()) {
      try {
        await fetch(playbackUrl, { method: 'HEAD' });
      } catch (error) {
        console.error('Error preloading video:', error);
      }
    }
  };

  // Log metadata for debugging
  // console.log("Video metadata dans VideoCard:", video);
  // console.log("Playback URL used:", getPlaybackUrl());
  // console.log("Video status:", video.status);

   const playbackUrl = getPlaybackUrl();
   const isVideoReady = !!playbackUrl; // Check if we have a valid playback URL

  return (
    <div 
      className="bg-card rounded-lg overflow-hidden shadow transition-all hover:shadow-md"
      onMouseEnter={handleHover}
    >
      {/* Video Thumbnail */}
      <div 
        className="relative aspect-video bg-muted cursor-pointer"
        onClick={() => {
          // Only open the dialog if the video is ready for playback
          if (isVideoReady) {
             setVideoDialogOpen(true);
             triggerMediaReward(); // Trigger reward on play
          } else {
             // Show a toast with the status message
              toast({
                  title: "Statut de la vidéo",
                  description: getStatusMessage(),
                  variant: video.status === 'error' ? 'destructive' : 'default',
              });
          }
        }}
      >
        {/* Thumbnail - use thumbnail_url from Supabase schema */}
        {video.thumbnail_url ? (
          <img 
            src={video.thumbnail_url} 
            alt={video.title || 'Video thumbnail'} 
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary/10">
            {/* Show loading/error icon based on status if no thumbnail */}
             {!isVideoReady && video.status === 'processing' && <Loader2 className="h-12 w-12 text-primary opacity-50 animate-spin" />} 
             {!isVideoReady && video.status === 'error' && <AlertCircle className="h-12 w-12 text-destructive opacity-50" />} 
             {/* Default icon if status is not processing/error and video not ready */}
             {!isVideoReady && video.status !== 'processing' && video.status !== 'error' && <Play className="h-12 w-12 text-primary opacity-50" />}
             {isVideoReady && <Play className="h-12 w-12 text-primary opacity-50" />} {/* Show play icon if ready and no thumbnail */}
          </div>
        )}

        {/* Overlay with Play button / Status Indicator */}
        <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
           {isVideoReady ? (
              <Play className="h-12 w-12 text-white" />
           ) : (
              <div className="text-white text-center p-2">
                 {video.status === 'processing' && <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />}
                 {video.status === 'error' && <AlertCircle className="h-8 w-8 mx-auto mb-2" />}
                 <p className="text-sm font-medium">{getStatusMessage()}</p>
              </div>
           )}
        </div>
        
        {/* Video Type Badge */}
        <div className="absolute top-2 left-2 px-2 py-1 text-xs font-medium bg-primary text-primary-foreground rounded">
          {getTypeLabel(video.type)}
        </div>
      </div>
      
      {/* Video Details */}
      <div className="p-4 space-y-2"> {/* Corrected class from space-space-y-2 */}
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
        
        {/* Use is_premium and token_price from Supabase schema */}
        {video.is_premium && video.token_price !== undefined && video.token_price !== null && (
          <div className="text-sm font-medium text-primary">
            {video.token_price} tokens
          </div>
        )}
      </div>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette vidéo?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La vidéo sera définitivement supprimée. (Le fichier Mux devra également être supprimé via une action backend).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => onDelete(video.id)} // Pass the number ID
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Video Playback Dialog */}
      <Dialog open={videoDialogOpen} onOpenChange={setVideoDialogOpen}>
        {/* Added accessible title for DialogContent as per console warning */}
         <DialogTitle className="sr-only"><VisuallyHidden>Video Playback</VisuallyHidden></DialogTitle>
         <DialogDescription className="sr-only"><VisuallyHidden>Dialog for video playback</VisuallyHidden></DialogDescription>

        <DialogContent className="sm:max-w-3xl p-0">
          {/* Render player only if video is ready and playbackUrl exists */}
          {isVideoReady && playbackUrl ? ( // Ensure playbackUrl is also checked
            <EnhancedVideoPlayer
              src={playbackUrl} // playbackUrl is guaranteed to be a string here
              thumbnailUrl={video.thumbnail_url || undefined} // Use thumbnail_url
              title={video.title || undefined}
              autoPlay={true}
              onPlay={() => {
                triggerMediaReward();
              }}
            />
          ) : (
             // Display status message if video is not ready
            <div className="aspect-video bg-black rounded-md overflow-hidden flex items-center justify-center">
              <div className="text-white text-center p-4">
                 {video.status === 'processing' && <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />}
                 {video.status === 'error' && <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />}
                 <p className="text-lg font-medium">{getStatusMessage()}</p>
                 {video.status === 'error' && video.error_details && (
                    <p className="text-sm text-muted-foreground mt-2">Détails: {typeof video.error_details === 'string' ? video.error_details : JSON.stringify(video.error_details)}</p>
                 )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VideoCard;
