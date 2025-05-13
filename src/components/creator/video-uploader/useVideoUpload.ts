
import { useState, useCallback } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { z } from 'zod';

// Define video metadata interface
export interface VideoMetadata {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  isPremium?: boolean;
  tokenPrice?: number;
  tags?: string[];
  uploadStatus: 'pending' | 'processing' | 'complete' | 'error';
  uploadProgress: number;
  type?: string;
  format?: string;
  video_url?: string;
  videoFile?: File;
  url?: string;
}

// Define VideoFirestoreData interface
export interface VideoFirestoreData extends VideoMetadata {
  userId: string;
  uploadedAt: Date;
  videoUrl?: string;
}

// Define form values schema
export const videoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  type: z.string(),
  tier: z.string(),
  sharingAllowed: z.boolean(),
  downloadsAllowed: z.boolean(),
  tokenPrice: z.number().optional(),
});

export type VideoFormValues = z.infer<typeof videoSchema>;

export const useVideoUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(null);
  const [videoFormat, setVideoFormat] = useState<'16:9' | '9:16' | '1:1' | 'other'>('16:9');
  const [uploadStage, setUploadStage] = useState<string>('');
  const { isMobile } = useIsMobile();

  const startUpload = useCallback(() => {
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);
  }, []);

  const updateProgress = useCallback((progress: number) => {
    setUploadProgress(progress);
  }, []);

  const completeUpload = useCallback(() => {
    setIsUploading(false);
    setUploadProgress(100);
  }, []);

  const failUpload = useCallback((errorMessage: string) => {
    setIsUploading(false);
    setError(errorMessage);
  }, []);

  const handleVideoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoPreviewUrl(URL.createObjectURL(file));
    }
  }, []);

  const handleThumbnailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreviewUrl(URL.createObjectURL(file));
    }
  }, []);

  const generateThumbnail = useCallback(() => {
    // Implementation for thumbnail generation
    console.log("Generating thumbnail...");
  }, []);

  const resetForm = useCallback(() => {
    setIsUploading(false);
    setUploadProgress(0);
    setError(null);
    setVideoFile(null);
    setThumbnailFile(null);
    if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
    if (thumbnailPreviewUrl) URL.revokeObjectURL(thumbnailPreviewUrl);
    setVideoPreviewUrl(null);
    setThumbnailPreviewUrl(null);
  }, [videoPreviewUrl, thumbnailPreviewUrl]);

  const uploadVideoAndSaveMetadata = async (
    values: VideoFormValues, 
    onUploadProgress?: (progress: number) => void
  ): Promise<VideoFirestoreData | null> => {
    // Implementation for video upload and metadata saving
    console.log("Uploading video and saving metadata...", values);
    return null;
  };
  
  return {
    isUploading,
    uploadProgress,
    error,
    videoFile,
    thumbnailFile,
    videoPreviewUrl,
    thumbnailPreviewUrl,
    videoFormat,
    uploadStage,
    startUpload,
    updateProgress,
    completeUpload,
    failUpload,
    isMobile,
    handleVideoChange,
    handleThumbnailChange,
    generateThumbnail,
    resetForm,
    uploadVideoAndSaveMetadata,
    setVideoFile,
    setUploadProgress,
    setUploadStage
  };
};

export default useVideoUpload;
