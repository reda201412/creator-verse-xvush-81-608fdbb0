import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNeuroAesthetic } from '@/hooks/use-neuro-aesthetic';
import { supabase } from '@/integrations/supabase/client';
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
  const { toast } = useToast();
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
    handleVideoChange,
    handleThumbnailChange,
    generateThumbnail,
    resetForm,
    uploadToSupabase
  } = useVideoUpload({ toast, user });

  const handleUploadComplete = (metadata: VideoMetadata) => {
    onUploadComplete(metadata);
    triggerMicroReward('interaction');
    
    toast({
      title: "Vidéo téléchargée avec succès",
      description: "Votre vidéo a été mise en ligne et est maintenant visible.",
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
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Uploader une vidéo</DialogTitle>
          </DialogHeader>
          
          <VideoUploadForm
            videoFile={videoFile}
            thumbnailFile={thumbnailFile}
            videoPreviewUrl={videoPreviewUrl}
            thumbnailPreviewUrl={thumbnailPreviewUrl}
            videoFormat={videoFormat}
            isUploading={isUploading}
            uploadProgress={uploadProgress}
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
                toast({
                  title: "Information manquante",
                  description: "Veuillez fournir une vidéo et un titre.",
                  variant: "destructive",
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
                toast({
                  title: "Erreur de téléchargement",
                  description: error.message || "Une erreur s'est produite lors du téléchargement de votre vidéo.",
                  variant: "destructive",
                });
              }
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VideoUploader;
