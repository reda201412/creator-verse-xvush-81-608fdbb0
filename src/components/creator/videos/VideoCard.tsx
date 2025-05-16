
import React, { useState } from 'react';
import { 
  MoreHorizontal, 
  Play, 
  Shield, 
  Users,
  TrendingUp,
  Trash2,
  Edit,
  Clock
} from 'lucide-react';
import { VideoData } from '@/services/creatorService';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface VideoCardProps {
  video: VideoData;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onPromote: (id: string) => void;
  onAnalytics: (id: string) => void;
  className?: string;
}

const VideoCard: React.FC<VideoCardProps> = ({ 
  video, 
  onDelete, 
  onEdit, 
  onPromote, 
  onAnalytics,
  className
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const isProcessing = video.status === 'processing';
  const hasError = video.status === 'errored';
  const isReady = video.status === 'ready';
  
  const handleCopyLink = () => {
    if (!video.muxPlaybackId) {
      toast.error("Lien de la vidéo non disponible");
      return;
    }
    
    navigator.clipboard.writeText(
      `${window.location.origin}/watch/${video.muxPlaybackId}`
    ).then(() => {
      toast.success("Lien copié dans le presse-papier");
    }).catch(() => {
      toast.error("Échec de la copie du lien");
    });
  };

  const handleDeleteClick = () => {
    if (showConfirmDelete) {
      setIsDeleting(true);
      
      // Call the delete function
      onDelete(video.id);
      
      setIsDeleting(false);
      setShowConfirmDelete(false);
    } else {
      setShowConfirmDelete(true);
      
      // Auto-hide the confirmation after 3 seconds
      setTimeout(() => {
        setShowConfirmDelete(false);
      }, 3000);
    }
  };

  const getVideoTypeLabel = (type?: string) => {
    switch (type) {
      case 'premium': return 'Premium';
      case 'teaser': return 'Teaser';
      case 'vip': return 'VIP';
      default: return 'Standard';
    }
  };

  const getVideoTypeColor = (type?: string) => {
    switch (type) {
      case 'premium': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'teaser': return 'bg-sky-500/10 text-sky-500 border-sky-500/20';
      case 'vip': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      default: return 'bg-green-500/10 text-green-500 border-green-500/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'processing': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'errored': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ready': return 'Prêt';
      case 'processing': return 'En cours...';
      case 'errored': return 'Erreur';
      default: return status;
    }
  };

  return (
    <div className={cn(
      "rounded-lg border overflow-hidden bg-card transition-all duration-200 hover:shadow-md", 
      className
    )}>
      <div className="relative aspect-video bg-muted">
        {/* Thumbnail */}
        {video.thumbnailUrl && (
          <img 
            src={video.thumbnailUrl} 
            alt={video.title} 
            className={cn(
              "w-full h-full object-cover transition-opacity",
              isProcessing && "opacity-60"
            )}
          />
        )}
        
        {/* Processing overlay */}
        {isProcessing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-2"></div>
            <p className="text-white text-sm font-medium">Traitement en cours...</p>
          </div>
        )}

        {/* Error overlay */}
        {hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30">
            <div className="bg-red-500 rounded-full p-2 mb-2">
              <span className="text-white text-xl">!</span>
            </div>
            <p className="text-white text-sm font-medium">Erreur de traitement</p>
          </div>
        )}
        
        {/* Play button overlay */}
        {isReady && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/30">
            <Button variant="ghost" size="icon" className="rounded-full bg-white/30 hover:bg-white/50">
              <Play className="h-8 w-8 text-white" />
            </Button>
          </div>
        )}
        
        {/* Type badge */}
        <Badge
          className={cn(
            "absolute top-2 left-2 border",
            getVideoTypeColor(video.type)
          )}
        >
          {getVideoTypeLabel(video.type)}
        </Badge>
        
        {/* Status badge */}
        <Badge
          className={cn(
            "absolute top-2 right-2 border",
            getStatusColor(video.status)
          )}
        >
          {getStatusLabel(video.status)}
        </Badge>
      </div>
      
      <div className="p-3">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold line-clamp-1">{video.title}</h3>
          
          <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="-mr-2">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit(video.id)}>
                <Edit className="mr-2 h-4 w-4" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAnalytics(video.id)}>
                <TrendingUp className="mr-2 h-4 w-4" />
                Analytics
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCopyLink}>
                <Shield className="mr-2 h-4 w-4" />
                Copier le lien
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onPromote(video.id)}>
                <Users className="mr-2 h-4 w-4" />
                Promouvoir
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-600 focus:text-red-600"
                onClick={handleDeleteClick}
                disabled={isDeleting}
              >
                {showConfirmDelete ? (
                  <>
                    <Clock className="mr-2 h-4 w-4" />
                    Confirmer la suppression
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Supprimer
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
          {video.description || "Aucune description"}
        </p>
        
        {video.isPremium && video.tokenPrice && (
          <div className="flex items-center mt-2">
            <span className="text-amber-500 text-sm font-medium">
              {video.tokenPrice} Tokens
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCard;
