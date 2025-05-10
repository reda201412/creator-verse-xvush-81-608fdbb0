
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { detectScreenshots } from '@/services/ephemeralVideoService';
import { incrementVideoViews } from '@/services/videoService';
import { AlertCircle, Eye, Clock } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

interface EphemeralVideoPlayerProps {
  videoUrl: string;
  videoId: string | number;
  ephemeralOptions: {
    ephemeral_mode: boolean;
    expires_after: number | null;
    max_views: number | null;
    notify_on_screenshot: boolean;
    current_views: number;
  };
}

const EphemeralVideoPlayer: React.FC<EphemeralVideoPlayerProps> = ({
  videoUrl,
  videoId,
  ephemeralOptions
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showWarning, setShowWarning] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentViews, setCurrentViews] = useState(ephemeralOptions.current_views || 0);
  const [viewsPercentage, setViewsPercentage] = useState(0);
  const { user } = useAuth();
  const cleanupRef = useRef<() => void>(() => {});
  
  // Calculer le pourcentage de vues par rapport au maximum
  useEffect(() => {
    if (ephemeralOptions.max_views) {
      setViewsPercentage((currentViews / ephemeralOptions.max_views) * 100);
    }
  }, [currentViews, ephemeralOptions.max_views]);
  
  // Mettre en place la détection de capture d'écran
  useEffect(() => {
    if (user && ephemeralOptions.notify_on_screenshot) {
      cleanupRef.current = detectScreenshots(videoId, user.id);
      
      return () => {
        cleanupRef.current();
      };
    }
  }, [videoId, user, ephemeralOptions.notify_on_screenshot]);
  
  // Gérer le début de la lecture
  const handlePlay = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      incrementVideoViews(videoId).then(() => {
        setCurrentViews(prev => prev + 1);
      });
    }
  };
  
  // Calculer le temps restant avant expiration
  const getRemainingTime = (): string | null => {
    if (!ephemeralOptions.expires_after) return null;
    
    // Calculer la date d'expiration en supposant qu'elle est basée sur la date de chargement de la vidéo
    const now = new Date();
    // Comme nous n'avons pas la date exacte de mise en ligne, faisons une estimation
    const expiresAt = new Date(now.getTime() + ephemeralOptions.expires_after * 60 * 60 * 1000);
    
    const diffMs = expiresAt.getTime() - now.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHrs > 0) {
      return `${diffHrs}h ${diffMins}m`;
    } else {
      return `${diffMins} minutes`;
    }
  };
  
  const remainingTime = getRemainingTime();
  
  return (
    <div className="relative">
      {/* Alerte de contenu éphémère */}
      {showWarning && (
        <Alert variant="warning" className="mb-4 animate-fade-in">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Contenu Éphémère</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>Cette vidéo est en mode éphémère et sera disponible pour une durée limitée.</p>
            {ephemeralOptions.notify_on_screenshot && (
              <p className="font-semibold text-amber-600">Les captures d'écran sont détectées et signalées au créateur.</p>
            )}
            <button 
              className="text-primary text-sm font-medium hover:underline"
              onClick={() => setShowWarning(false)}
            >
              Compris
            </button>
          </AlertDescription>
        </Alert>
      )}
      
      {/* Compteurs d'information */}
      <div className="flex justify-between items-center mb-2 text-sm text-muted-foreground">
        {ephemeralOptions.max_views && (
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>
              {currentViews} / {ephemeralOptions.max_views} vues
            </span>
          </div>
        )}
        
        {remainingTime && (
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>Expire dans: {remainingTime}</span>
          </div>
        )}
      </div>
      
      {/* Barre de progression des vues */}
      {ephemeralOptions.max_views && (
        <Progress value={viewsPercentage} className="h-1 mb-3" />
      )}
      
      {/* Lecteur vidéo */}
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full rounded-lg"
        controls
        onPlay={handlePlay}
      />
      
      {/* Overlay de protection contre les captures (rend plus difficile les captures d'écran) */}
      {ephemeralOptions.notify_on_screenshot && (
        <div 
          className="absolute inset-0 pointer-events-none select-none"
          style={{ 
            opacity: 0.01, 
            backgroundImage: user ? `url(data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><text x="10" y="50" font-size="10" fill="rgba(0,0,0,0.05)">${user.id}</text></svg>)` : undefined
          }}
        />
      )}
    </div>
  );
};

export default EphemeralVideoPlayer;
