import React, { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useNeuroAesthetic } from '@/hooks/use-neuro-aesthetic';
import { useAuth } from '@/contexts/AuthContext';
import { VideoData } from '@/services/creatorService';
import { VideoUploadForm } from './video-uploader/VideoUploadForm';
import useVideoUpload from './video-uploader/useVideoUpload';

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
    uploadVideoAndSaveMetadata,
    setUploadError
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

  const handleUploadCompleteInternal = (metadata?: VideoData | null) => {
    onUploadComplete(metadata);
    
    // *** Modified condition to explicitly check for metadata and metadata.id ***
    if(metadata && typeof metadata.id === 'number') { 
       triggerMicroReward('interaction');
        toast("Vidéo initiée", {
          description: "Votre vidéo est en cours de téléchargement et de traitement."
        });
    } else { 
         // This else block covers cases where metadata is null, undefined, or doesn't have a valid id
         toast("Échec de l'initiation de l'upload", {
            description: "Une erreur s'est produite et l'upload n'a pas pu être démarré."
         });
    }

    setTimeout(() => {
      setIsOpen(false);
      resetForm();
    }, metadata ? 1000 : 3000); 
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
                  const metadata: VideoData | null = await uploadVideoAndSaveMetadata(values);
                   handleUploadCompleteInternal(metadata);
                } catch (error: unknown) {
                  console.error('Upload process error (caught in onSubmit):', error);
                  const errorMessage = error instanceof Error 
                    ? error.message 
                    : "Une erreur s'est produite lors du téléchargement de votre vidéo.";
                  setUploadError(errorMessage);
                  toast("Erreur de téléchargement", {
                    description: errorMessage
                  });
                  handleUploadCompleteInternal(null);
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
