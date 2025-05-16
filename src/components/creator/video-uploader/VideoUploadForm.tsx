
import React from 'react';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { VideoFileUpload } from './VideoFileUpload';
import { ThumbnailUpload } from './ThumbnailUpload';
import VideoFormDetails from './VideoFormDetails';
import VideoFormatInfo from './VideoFormatInfo';
import FormFooterActions from './FormFooterActions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { VideoFormValues, videoFormSchema } from './useVideoUpload';

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
  generateThumbnail: () => void;
  resetForm: () => void;
  onClose: () => void;
  onSubmit: (values: VideoFormValues) => Promise<void>;
}

export const VideoUploadForm: React.FC<VideoUploadFormProps> = ({
  videoFile,
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
  onSubmit
}) => {
  const form = useForm<VideoFormValues>({
    resolver: zodResolver(videoFormSchema),
    defaultValues: {
      title: '',
      description: '',
      videoType: 'standard',
      allowSharing: false,
      allowDownload: false,
      subscriptionLevel: 'free',
      tokenPrice: 0
    },
  });

  // Create refs for video and thumbnail inputs
  const videoInputRef = React.useRef<HTMLInputElement>(null);
  const thumbnailInputRef = React.useRef<HTMLInputElement>(null);

  const handleRemoveVideo = () => {
    if (videoInputRef.current) videoInputRef.current.value = '';
    resetForm();
  };

  const handleRemoveThumbnail = () => {
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
    if (thumbnailPreviewUrl) URL.revokeObjectURL(thumbnailPreviewUrl);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 py-4">
        {uploadError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{uploadError}</AlertDescription>
          </Alert>
        )}
        
        {/* Video Upload Section */}
        <VideoFileUpload
          ref={videoInputRef}
          videoPreviewUrl={videoPreviewUrl}
          onVideoChange={handleVideoChange}
          onRemoveVideo={handleRemoveVideo}
        />
        
        {/* Video Format Information */}
        <VideoFormatInfo 
          videoPreviewUrl={videoPreviewUrl} 
          videoFormat={videoFormat} 
        />
        
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
