import { useState, useCallback } from 'react';

export interface MuxUploadResponse {
  id: string;
  url: string;
  assetId: string;
  status: string;
  playbackId?: string;
}

type UploadState = 'idle' | 'preparing' | 'uploading' | 'processing' | 'success' | 'error';

interface UseVideoUploadToMuxReturn {
  uploadState: UploadState;
  uploadProgress: number;
  uploadVideo: (file: File) => Promise<MuxUploadResponse>;
  error: Error | null;
  reset: () => void;
}

// Helper function to get auth headers for API requests
const getAuthHeaders = () => {
  // This is a mock implementation
  return {
    'Authorization': 'Bearer mock-token'
  };
};

export class MuxUploadManager {
  async init(filename: string, userId: string): Promise<{ uploadId: string; assetId: string }> {
    const uploadResponse = await fetch('/api/mux/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json();
      throw new Error(errorData.error || 'Failed to create upload');
    }

    const { url, id, assetId } = await uploadResponse.json();
    
    return { uploadId: id, assetId };
  }

  async start(file: File, uploadId: string, progressCallback: (progress: number) => void): Promise<void> {
    // Create a custom XMLHttpRequest for progress tracking
    const xhr = new XMLHttpRequest();
    
    // Set up the upload promise
    return new Promise<void>((resolve, reject) => {
      // Track progress
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          progressCallback(progress);
        }
      };
      
      // Handle completion
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      };
      
      // Handle errors
      xhr.onerror = () => {
        reject(new Error('Network error during upload'));
      };
      
      // Handle abort
      xhr.onabort = () => {
        reject(new Error('Upload aborted'));
      };
      
      // Open the request
      xhr.open('PUT', `/api/mux/upload/${uploadId}`, true);
      
      // Set the Content-Type header
      xhr.setRequestHeader('Content-Type', file.type);
      
      // Send the file
      xhr.send(file);
    });
  }
}

// Create a progress tracking function
export const onProgress = (callback: (progress: number) => void) => {
  return (progress: number) => {
    callback(progress);
  };
};

export const useVideoUploadToMux = (): UseVideoUploadToMuxReturn => {
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  const reset = useCallback(() => {
    if (abortController) {
      abortController.abort();
    }
    setUploadState('idle');
    setUploadProgress(0);
    setError(null);
    setAbortController(null);
  }, [abortController]);

  const uploadVideo = useCallback(async (file: File): Promise<MuxUploadResponse> => {
    if (!file) {
      const err = new Error('No file provided');
      setError(err);
      throw err;
    }

    // Reset state
    reset();
    setUploadState('preparing');

    try {
      // Create a new MuxUploadManager instance
      const manager = new MuxUploadManager();
      
      // Step 1: Get a direct upload URL from our API
      const uploadResponse = await fetch('/api/mux/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || 'Failed to create upload');
      }

      const { url, id, assetId } = await uploadResponse.json();

      // Step 2: Create a new AbortController for this upload
      const controller = new AbortController();
      setAbortController(controller);

      // Step 3: Upload the file to Mux
      setUploadState('uploading');

      // Create a custom XMLHttpRequest for progress tracking
      const xhr = new XMLHttpRequest();
      
      // Set up the upload promise
      const uploadPromise = new Promise<void>((resolve, reject) => {
        // Track progress
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(progress);
          }
        };
        
        // Handle completion
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        };
        
        // Handle errors
        xhr.onerror = () => {
          reject(new Error('Network error during upload'));
        };
        
        // Handle abort
        xhr.onabort = () => {
          reject(new Error('Upload aborted'));
        };
        
        // Open the request
        xhr.open('PUT', url, true);
        
        // Set the Content-Type header
        xhr.setRequestHeader('Content-Type', file.type);
        
        // Send the file
        xhr.send(file);
        
        // Handle abort signal
        controller.signal.addEventListener('abort', () => {
          xhr.abort();
        });
      });

      // Wait for the upload to complete
      await uploadPromise;

      // Step 4: Upload is complete
      setUploadState('processing');
      setUploadProgress(100);
      
      // Return the upload information
      return {
        id,
        url,
        assetId,
        status: 'uploaded',
      };
      
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to upload video');
      console.error('Video upload error:', error);
      setError(error);
      setUploadState('error');
      throw error;
    }
  }, [reset]);

  return {
    uploadState,
    uploadProgress,
    uploadVideo,
    error,
    reset,
  };
};

export default useVideoUploadToMux;
