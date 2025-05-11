
import React, { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useNeuroAesthetic } from '@/hooks/use-neuro-aesthetic';
import { useAuth } from '@/contexts/AuthContext';
import { VideoMetadata, ContentType } from '@/types/video'; // Ensure ContentType is imported if needed here
import { VideoUploadForm } from './video-uploader/VideoUploadForm';
import useVideoUpload, { VideoFormValues } from './video-uploader/useVideoUpload';
import { VideoFirestoreData } from '@/services/creatorService';

// VERY TOP LEVEL DEBUG LOG
console.log('!!!!!!!! VIDEOUPLOADER.TSX MODULE LOADED !!!!!!!!!!');

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
    videoFile, // This is the File object we need
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
    uploadVideoAndSaveMetadata
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

  const handleSuccessfulUpload = (firestoreData: VideoFirestoreData, originalVideoFile: File) => {
    // Construct the full VideoMetadata object needed by onUploadComplete
    const completeMetadata: VideoMetadata = {
      id: firestoreData.id || '', // Ensure id is present
      title: firestoreData.title,
      description: firestoreData.description || '',
      type: firestoreData.type as ContentType, // Type assertion, ensure compatibility
      videoFile: originalVideoFile, // The actual File object
      thumbnailUrl: firestoreData.thumbnailUrl,
      video_url: firestoreData.videoUrl, // Map videoUrl to video_url
      url: firestoreData.videoUrl, // Alias
      format: firestoreData.format || '16:9', // Provide a default if format can be undefined
      isPremium: firestoreData.isPremium || false, // Provide a default
      tokenPrice: firestoreData.tokenPrice,
      // restrictions: firestoreData.restrictions, // Map if restrictions exist in firestoreData and VideoMetadata
    };

    onUploadComplete(completeMetadata);
    triggerMicroReward('interaction');
    
    toast("Vidéo téléchargée avec succès", {
      description: "Votre vidéo a été mise en ligne et est maintenant visible."
    });
    
    setTimeout(() => {
      setIsOpen(false);
      resetForm();
    }, 1000);
  };

  // ADDED DEBUG LOGGING
  console.log('[VideoUploader] Inspecting uploadVideoAndSaveMetadata:', uploadVideoAndSaveMetadata);
  console.log('[VideoUploader] Type of uploadVideoAndSaveMetadata:', typeof uploadVideoAndSaveMetadata);

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
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto" aria-describedby="video-upload-dialog-description">
          <DialogHeader>
            <DialogTitle>Uploader une vidéo</DialogTitle>
            <p id="video-upload-dialog-description" className="sr-only">Formulaire pour téléverser une nouvelle vidéo.</p>
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
              onSubmit={async (values: VideoFormValues) => {
                console.log('[VideoUploader onSubmit] uploadVideoAndSaveMetadata:', uploadVideoAndSaveMetadata);
                console.log('[VideoUploader onSubmit] typeof uploadVideoAndSaveMetadata:', typeof uploadVideoAndSaveMetadata);

                if (!videoFile) {
                  toast("Information manquante", {
                    description: "Veuillez fournir une vidéo et un titre."
                  });
                  return;
                }
                
                try {
                  const firestoreUploadData = await uploadVideoAndSaveMetadata(values); 
                  if (firestoreUploadData) {
                    // Pass both firestore data and the original videoFile
                    handleSuccessfulUpload(firestoreUploadData, videoFile);
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
