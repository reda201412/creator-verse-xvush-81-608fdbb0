import React, { useCallback } from 'react';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ThumbnailUpload } from './ThumbnailUpload';
import VideoFormDetails from './VideoFormDetails';
import VideoFormatInfo from './VideoFormatInfo';
import FormFooterActions from './FormFooterActions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { videoSchema, VideoFormValues } from './useVideoUpload';
import MuxDirectUploader from './MuxDirectUploader';

interface VideoUploadFormProps {
  videoFile: File | null;
  thumbnailFile: File | null;
  videoPreviewUrl: string | null;
  thumbnailPreviewUrl: string | null;
  videoFormat: '16:9' | '9:16' | '1:1' | 'other';
  isUploading: boolean;
  uploadProgress: number;
  uploadError: string | null;
  uploadStage?: string;
  handleVideoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleThumbnailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  generateThumbnail: () => void; // Added this prop
  resetForm: () => void;
  onClose: () => void;
  onSubmit: (values: VideoFormValues, onUploadProgress: (progress: number) => void) => Promise<void>;
  setVideoFile: (file: File | null) => void;
  setUploadProgress: (progress: number) => void;
  setUploadStage: (stage: string) => void;
}

export const VideoUploadForm: React.FC<VideoUploadFormProps> = ({
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
  onClose,
  onSubmit,
  setVideoFile,
  setUploadProgress,
  setUploadStage
}) => {
  const form = useForm<VideoFormValues>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      title: '',
      description: '',
      type: 'standard',
      tier: 'free',
      sharingAllowed: false,
      downloadsAllowed: false,
      tokenPrice: 0
    },
  });

  // Create refs for thumbnail input
  const thumbnailInputRef = React.useRef<HTMLInputElement>(null);

  const handleRemoveThumbnail = () => {
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
    if (thumbnailPreviewUrl) URL.revokeObjectURL(thumbnailPreviewUrl);
  };

  const handleSubmit = useCallback(async (values: VideoFormValues) => {
    // Pass setUploadProgress as the onUploadProgress callback to the onSubmit prop
    await onSubmit(values, setUploadProgress);
  }, [onSubmit, setUploadProgress]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-6 py-4">
        {uploadError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{uploadError}</AlertDescription>
          </Alert>
        )}

        {/* Video Upload Section */}
        <MuxDirectUploader
          setVideoFile={setVideoFile}
          // Removed handleVideoChange as MuxDirectUploader handles file changes internally
          onUploadStart={() => setUploadStage("Préparation de l'upload...")}
          onSuccess={(uploadId) => {
            console.log(`Mux upload initiated with uploadId: ${uploadId}`);
            setUploadStage("Vidéo uploadée vers MUX. Enregistrement des métadonnées...");
          }}
          onError={(error) => {
            console.error('Mux upload error:', error);
            setUploadStage("Erreur d'upload");
          }}
        />

        {/* Video Format Information */}
        <VideoFormatInfo videoPreviewUrl={videoPreviewUrl} videoFormat={videoFormat} />

        {/* Thumbnail Upload Section */}
        {videoPreviewUrl && (
          <ThumbnailUpload
            ref={thumbnailInputRef}
            thumbnailPreviewUrl={thumbnailPreviewUrl}
            onThumbnailChange={handleThumbnailChange}
            onRemoveThumbnail={handleRemoveThumbnail}
            onGenerateThumbnail={generateThumbnail}
            showGenerateButton={!!videoPreviewUrl}
          />
        )}

        {/* Video Details */}
        <VideoFormDetails form={form} />

        <FormFooterActions
          isUploading={isUploading}
          uploadProgress={uploadProgress}
          uploadStage={uploadStage}
          onClose={onClose}
          videoFile={videoFile}
        />
      </form>
    </Form>
  );
};
