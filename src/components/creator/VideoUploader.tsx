
import React, { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useNeuroAesthetic } from '@/hooks/use-neuro-aesthetic';
import { useAuth } from '@/contexts/AuthContext';
import { VideoMetadata } from '@/types/video';
import { VideoUploadForm } from './video-uploader/VideoUploadForm';
import useVideoUpload from './video-uploader/useVideoUpload';

interface VideoUploaderProps {
  onUploadComplete: (metadata: VideoMetadata) => void;
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
  
  const {
    videoFile,
    thumbnailFile,
    videoPreviewUrl,
    thumbnailPreviewUrl,
    videoFormat,
    isUploading,
    uploadProgress,
    uploadError,
    uploadStage,
    handleVideoChange,
    handleThumbnailChange,
    generateThumbnail,
    resetForm,
    uploadToSupabase
  } = useVideoUpload();

  // Check for authentication
  useEffect(() => {
    if (isOpen && !user) {
      toast("Authentification requise", {
        description: "Vous devez être connecté pour téléverser des vidéos."
      });
      setIsOpen(false);
    }
  }, [isOpen, user]);

  const handleUploadComplete = (metadata: VideoMetadata) => {
    onUploadComplete(metadata);
    triggerMicroReward('interaction');
    
    toast("Vidéo téléchargée avec succès", {
      description: "Votre vidéo a été mise en ligne et est maintenant visible."
    });
    
    setTimeout(() => {
      setIsOpen(false);
      resetForm();
    }, 1000);
  };

  return (
    <>
      {isCreator && (
        <Button 
          onClick={() => setIsOpen(true)} 
          className={className}
          size="sm"
        >
          <Upload className="mr-2 h-4 w-4" />
          Uploader une vidéo
        </Button>
      )}
      
      <Dialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Uploader une vidéo</DialogTitle>
          </DialogHeader>
          
          {user ? (
            <VideoUploadForm
              videoFile={videoFile}
              thumbnailFile={thumbnailFile}
              videoPreviewUrl={videoPreviewUrl}
              thumbnailPreviewUrl={thumbnailPreviewUrl}
              videoFormat={videoFormat}
              isUploading={isUploading}
              uploadProgress={uploadProgress}
              uploadError={uploadError}
              uploadStage={uploadStage}
              handleVideoChange={handleVideoChange}
              handleThumbnailChange={handleThumbnailChange}
              generateThumbnail={generateThumbnail}
              resetForm={resetForm}
              onClose={() => {
                setIsOpen(false);
                resetForm();
              }}
              onSubmit={async (values) => {
                if (!videoFile) {
                  toast("Information manquante", {
                    description: "Veuillez fournir une vidéo et un titre."
                  });
                  return;
                }
                
                try {
                  const metadata = await uploadToSupabase(values);
                  if (metadata) {
                    handleUploadComplete(metadata);
                  }
                } catch (error: any) {
                  console.error('Upload error:', error);
                  toast("Erreur de téléchargement", {
                    description: error.message || "Une erreur s'est produite lors du téléchargement de votre vidéo."
                  });
                }
              }}
            />
          ) : (
            <div className="p-4 text-center">
              <p>Vous devez être connecté pour téléverser des vidéos.</p>
              <Button 
                onClick={() => setIsOpen(false)} 
                className="mt-4"
              >
                Fermer
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VideoUploader;
