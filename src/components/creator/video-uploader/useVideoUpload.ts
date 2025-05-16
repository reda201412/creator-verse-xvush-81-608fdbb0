
import { useForm } from 'react-hook-form';
import { useState } from 'react';

// Define the form schema
export interface VideoFormValues {
  title: string;
  description: string;
  videoType: 'standard' | 'teaser' | 'premium' | 'vip';
  tokenPrice?: number;
  subscriptionLevel?: string;
  allowSharing?: boolean;
  allowDownload?: boolean;
  tags?: string[];
}

// Extended form data with file information
export interface VideoFormData extends VideoFormValues {
  videoFile?: File;
  thumbnailFile?: File;
}

export const useVideoUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const form = useForm<VideoFormValues>({
    defaultValues: {
      title: '',
      description: '',
      videoType: 'standard',
      tokenPrice: 5,
      subscriptionLevel: 'premium',
      allowSharing: false,
      allowDownload: false,
      tags: []
    },
  });

  const handleUpload = async (values: VideoFormValues) => {
    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    try {
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prev + 5;
        });
      }, 500);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      clearInterval(interval);
      setUploadProgress(100);
      
      console.log('Video upload successful', values);
      return { success: true };
    } catch (error) {
      setUploadError('Failed to upload video. Please try again.');
      console.error('Video upload failed:', error);
      return { success: false, error };
    } finally {
      setIsUploading(false);
    }
  };

  return {
    form,
    isUploading,
    uploadProgress,
    uploadError,
    handleUpload
  };
};
