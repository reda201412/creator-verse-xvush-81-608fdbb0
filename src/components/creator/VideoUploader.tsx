
import React, { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { useNeuroAesthetic } from '@/hooks/use-neuro-aesthetic';
import { useAuth } from '@/contexts/AuthContext';
import { VideoMetadata, ContentType } from '@/types/video';
import { VideoUploadForm } from './video-uploader/VideoUploadForm';
import { useVideoUpload, VideoFormValues } from './video-uploader/useVideoUpload';
import { VideoFirestoreData, convertVideoMetadataToVideoData } from '@/services/creatorService';

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
    error,
    uploadStage,
    handleVideoChange,
    handleThumbnailChange,
    generateThumbnail,
    resetForm,
    uploadVideoAndSaveMetadata,
    setVideoFile,
    setUploadProgress,
    setUploadStage
  } = useVideoUpload();

  // Check for authentication
  useEffect(() => {
    if (isOpen && !user) {
      toast.error("Authentification requise", {
        description: "Vous devez être connecté pour téléverser des vidéos."
      });
      setIsOpen(false);
    }
  }, [isOpen, user]);

  const handleSuccessfulUpload = (firestoreData: VideoFirestoreData, originalVideoFile: File) => {
    // Construct the full VideoMetadata object needed by onUploadComplete
    const completeMetadata: VideoMetadata = {
      id: firestoreData.id || '',
      title: firestoreData.title,
      description: firestoreData.description || '',
      type: firestoreData.type as ContentType || 'standard',
      videoFile: originalVideoFile, // The actual File object
      thumbnailUrl: firestoreData.thumbnailUrl,
      video_url: firestoreData.videoUrl,
      url: firestoreData.videoUrl,
      format: firestoreData.format || '16:9',
      isPremium: firestoreData.isPremium || false,
      tokenPrice: firestoreData.tokenPrice,
    };

    onUploadComplete(completeMetadata);
    triggerMicroReward('interaction');

    toast.success("Vidéo téléchargée avec succès", {
      description: "Votre vidéo a été mise en ligne et est maintenant visible."
    });

    setTimeout(() => {
      setIsOpen(false);
      resetForm();
    }, 1000);
  };

  // Wrapper functions for handleVideoChange and handleThumbnailChange that adapt to the expected types
  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleVideoChange(e.target.files[0]);
    }
  };

  const handleThumbnailFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleThumbnailChange(e.target.files[0]);
    }
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
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto" aria-describedby="video-upload-dialog-description">
          <DialogHeader>
            <DialogTitle>Uploader une vidéo</DialogTitle>
          </DialogHeader>
          <p id="video-upload-dialog-description" className="sr-only">Formulaire pour téléverser une nouvelle vidéo.</p>

          {user ? (
            <VideoUploadForm
              videoFile={videoFile}
              thumbnailFile={thumbnailFile}
              videoPreviewUrl={videoPreviewUrl}
              thumbnailPreviewUrl={thumbnailPreviewUrl}
              videoFormat={videoFormat}
              isUploading={isUploading}
              uploadProgress={uploadProgress}
              uploadError={error}
              uploadStage={uploadStage}
              handleVideoChange={handleVideoFileChange}
              handleThumbnailChange={handleThumbnailFileChange}
              generateThumbnail={generateThumbnail}
              resetForm={resetForm}
              onClose={() => {
                setIsOpen(false);
                resetForm();
              }}
              onSubmit={async (values: VideoFormValues, onUploadProgress: (progress: number) => void) => {
                if (!videoFile) {
                  toast.error("Information manquante", {
                    description: "Veuillez fournir une vidéo et un titre."
                  });
                  return;
                }

                try {
                  const firestoreUploadData = await uploadVideoAndSaveMetadata(values, onUploadProgress);
                  if (firestoreUploadData) {
                    // Pass both firestore data and the original videoFile
                    handleSuccessfulUpload(firestoreUploadData, videoFile);
                  }
                } catch (error: any) {
                  console.error('Upload error:', error);
                  toast.error("Erreur de téléchargement", {
                    description: error.message || "Une erreur s'est produite lors du téléchargement de votre vidéo."
                  });
                }
              }}
              setVideoFile={setVideoFile}
              setUploadProgress={setUploadProgress}
              setUploadStage={setUploadStage}
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
