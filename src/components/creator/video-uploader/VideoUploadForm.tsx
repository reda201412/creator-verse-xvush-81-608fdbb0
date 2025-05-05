
import React from 'react';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { VideoFileUpload } from './VideoFileUpload';
import { ThumbnailUpload } from './ThumbnailUpload';
import VideoFormDetails from './VideoFormDetails';
import VideoFormatInfo from './VideoFormatInfo';
import FormFooterActions from './FormFooterActions';
import { videoSchema, VideoFormValues } from './useVideoUpload';

interface VideoUploadFormProps {
  videoFile: File | null;
  thumbnailFile: File | null;
  videoPreviewUrl: string | null;
  thumbnailPreviewUrl: string | null;
  videoFormat: '16:9' | '9:16' | '1:1' | 'other';
  isUploading: boolean;
  uploadProgress: number;
  handleVideoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleThumbnailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  generateThumbnail: () => void;
  resetForm: () => void;
  onClose: () => void;
  onSubmit: (values: VideoFormValues) => Promise<void>;
}

export const VideoUploadForm: React.FC<VideoUploadFormProps> = ({
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
  onClose,
  onSubmit
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
          onClose={onClose}
          videoFile={videoFile}
        />
      </form>
    </Form>
  );
};
