
import React, { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useNeuroAesthetic } from '@/hooks/use-neuro-aesthetic';
import { useAuth } from '@/contexts/AuthContext';
import { VideoData } from '@/services/creatorService';
import EnhancedVideoUploadModal from './EnhancedVideoUploadModal';

interface VideoUploaderProps {
  onUploadComplete: (metadata?: VideoData | null) => void;
  isCreator: boolean;
  className?: string;
}

const VideoUploader: React.FC<VideoUploaderProps> = ({ 
  onUploadComplete, 
  isCreator,
  className 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { triggerMicroReward } = useNeuroAesthetic();
  const { user } = useAuth();

  // Check for authentication
  useEffect(() => {
    if (isOpen && !user) {
      toast("Authentification requise", {
        description: "Vous devez être connecté pour téléverser des vidéos."
      });
      setIsOpen(false);
    }
  }, [isOpen, user]);

  const handleUploadCompleteInternal = (metadata?: VideoData | null) => {
    onUploadComplete(metadata);
    
    if(metadata && typeof metadata.id === 'number') { 
      triggerMicroReward('interaction');
      toast("Vidéo initiée", {
        description: "Votre vidéo est en cours de téléchargement et de traitement."
      });
    } else { 
      toast("Téléchargement initié", {
        description: "Votre vidéo est en cours de traitement."
      });
    }
  };

  return (
    <>
      {isCreator && (
        <Button 
          onClick={() => {
            console.log('Uploader une vidéo cliqué');
            setIsOpen(true);
            triggerMicroReward('click'); // Changed from button_click to click
          }} 
          className={className}
          size="sm"
        >
          <Upload className="mr-2 h-4 w-4" />
          Uploader une vidéo
        </Button>
      )}
      
      <EnhancedVideoUploadModal 
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        onUploadComplete={handleUploadCompleteInternal}
      />
    </>
  );
};

export default VideoUploader;
