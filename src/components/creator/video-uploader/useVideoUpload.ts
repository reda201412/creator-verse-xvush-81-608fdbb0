import { useState, useCallback } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

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
}

// Define VideoFirestoreData interface
export interface VideoFirestoreData extends VideoMetadata {
  userId: string;
  uploadedAt: Date;
}

export const useVideoUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useIsMobile();

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
  
  return {
    isUploading,
    uploadProgress,
    error,
    startUpload,
    updateProgress,
    completeUpload,
    failUpload,
    isMobile
  };
};
