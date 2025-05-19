
import { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import { storage } from '@/firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as UpChunk from '@mux/upchunk';

interface MuxUploadOptions {
  onProgress?: (progress: number) => void;
  onSuccess?: (data: MuxUploadResult) => void;
  onError?: (error: Error) => void;
}

export interface MuxUploadResult {
  uploadId: string;
  assetId: string;
  playbackId?: string;
  thumbnailUrl?: string;
}

export function useMuxUpload() {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<MuxUploadResult | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Create a new abort controller for each upload
  const createAbortController = () => {
    // Clean up any existing controllers
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;
    return controller;
  };

  const uploadToMux = async (
    videoFile: File,
    thumbnailFile?: File | null,
    options?: MuxUploadOptions
  ): Promise<MuxUploadResult> => {
    if (!user || !user.id) {
      const error = new Error('User not authenticated');
      setError(error);
      options?.onError?.(error);
      throw error;
    }

    setIsUploading(true);
    setProgress(0);
    setError(null);
    setResult(null);

    const controller = createAbortController();

    try {
      // Step 1: Create direct upload URL from our API
      const uploadResponse = await fetch('/api/mux/direct-upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user.getIdToken()}`
        },
        signal: controller.signal
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || 'Failed to create upload');
      }

      const { url, id: uploadId, assetId } = await uploadResponse.json();
      
      if (!url || !uploadId) {
        throw new Error('Invalid upload response');
      }

      // Step 2: Upload the file using UpChunk
      return new Promise((resolve, reject) => {
        const upload = UpChunk.createUpload({
          endpoint: url,
          file: videoFile,
          chunkSize: 5120, // 5MB chunks
        });

        // Track progress
        upload.on('progress', (e: any) => {
          const uploadProgress = Math.round(e.detail * 100);
          setProgress(uploadProgress);
          options?.onProgress?.(uploadProgress);
        });

        // Handle successful upload
        upload.on('success', async () => {
          try {
            let thumbnailUrl;
            // Upload thumbnail if provided
            if (thumbnailFile) {
              const storageRef = ref(storage, `thumbnails/${user.id}/${uuidv4()}-${thumbnailFile.name}`);
              await uploadBytes(storageRef, thumbnailFile);
              thumbnailUrl = await getDownloadURL(storageRef);
            }

            const uploadResult = {
              uploadId,
              assetId,
              thumbnailUrl
            };
            
            setResult(uploadResult);
            setIsUploading(false);
            setProgress(100);
            options?.onSuccess?.(uploadResult);
            resolve(uploadResult);
          } catch (err: any) {
            setError(err);
            setIsUploading(false);
            options?.onError?.(err);
            reject(err);
          }
        });

        // Handle upload errors
        upload.on('error', (err: any) => {
          const error = new Error(err.detail || 'Upload failed');
          setError(error);
          setIsUploading(false);
          options?.onError?.(error);
          reject(error);
        });

        // Clean up on abort
        controller.signal.addEventListener('abort', () => {
          upload.pause();
          const error = new Error('Upload aborted');
          setError(error);
          setIsUploading(false);
          reject(error);
        });
      });
    } catch (err: any) {
      // Don't set error if aborted
      if (err.name === 'AbortError') {
        setIsUploading(false);
        throw err;
      }
      
      setError(err);
      setIsUploading(false);
      options?.onError?.(err);
      throw err;
    }
  };

  const cancelUpload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  const getAssetStatus = async (assetId: string): Promise<any> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const response = await fetch(`/api/mux/direct-upload?assetId=${assetId}`, {
        headers: {
          'Authorization': `Bearer ${await user.getIdToken()}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get asset status');
      }

      return await response.json();
    } catch (err) {
      console.error('Error getting asset status:', err);
      throw err;
    }
  };

  return {
    uploadToMux,
    cancelUpload,
    getAssetStatus,
    isUploading,
    progress,
    error,
    result
  };
}
