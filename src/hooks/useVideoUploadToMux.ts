import { useState, useCallback } from 'react';
import { uploadVideoToMux, type VideoUploadResponse } from '@/services/muxService';

type UploadState = 'idle' | 'uploading' | 'success' | 'error';

interface UseVideoUploadToMuxReturn {
  uploadState: UploadState;
  uploadProgress: number;
  uploadVideo: (file: File) => Promise<VideoUploadResponse>;
  error: Error | null;
  reset: () => void;
}

export const useVideoUploadToMux = (): UseVideoUploadToMuxReturn => {
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  const uploadVideo = useCallback(async (file: File): Promise<VideoUploadResponse> => {
    if (!file) {
      const err = new Error('No file provided');
      setError(err);
      throw err;
    }

    setUploadState('uploading');
    setUploadProgress(0);
    setError(null);

    try {
      // Utilisez le service existant pour l'upload
      const response = await uploadVideoToMux(file);
      
      setUploadState('success');
      setUploadProgress(100);
      
      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to upload video');
      setError(error);
      setUploadState('error');
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setUploadState('idle');
    setUploadProgress(0);
    setError(null);
  }, []);

  return {
    uploadState,
    uploadProgress,
    uploadVideo,
    error,
    reset,
  };
};

export default useVideoUploadToMux;
