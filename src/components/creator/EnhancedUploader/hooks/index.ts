
import { useState, useCallback } from 'react';
import { useVideoUploadToMux } from '@/hooks/useVideoUploadToMux';
import { ShieldStatus } from '../types';

export const useVideoUpload = () => {
  const {
    uploadState,
    uploadProgress,
    uploadVideo,
    error,
    reset: resetUpload,
  } = useVideoUploadToMux();
  
  const [shieldStatus, setShieldStatus] = useState<ShieldStatus>({
    encryption: 'pending',
    watermark: 'pending',
    drm: 'pending',
  });

  // Simulate shield status check after upload
  const checkShieldStatus = useCallback(async (assetId: string) => {
    try {
      console.log('Checking shield status for asset:', assetId);
      // Simulate a delay for processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update shield status
      setShieldStatus({
        encryption: 'active',
        watermark: 'active',
        drm: 'pending',
      });
      
      return true;
    } catch (error) {
      console.error('Error checking shield status:', error);
      return false;
    }
  }, []);

  // Wrapper function that combines upload and shield check
  const upload = useCallback(async (file: File) => {
    try {
      const result = await uploadVideo(file);
      
      // Check shield status if upload was successful
      if (result.assetId) {
        await checkShieldStatus(result.assetId);
      }
      
      return result;
    } catch (err) {
      // Let the error propagate
      throw err;
    }
  }, [uploadVideo, checkShieldStatus]);

  return {
    upload,
    uploadProgress,
    uploadState,
    shieldStatus,
    error,
    resetUpload,
  };
};

export const useVideoProcessing = () => {
  const [processingStatus, setProcessingStatus] = useState<'idle' | 'processing' | 'completed' | 'failed'>('idle');
  const [processingProgress, setProcessingProgress] = useState(0);
  
  const process = useCallback(async (videoId: string) => {
    try {
      setProcessingStatus('processing');
      setProcessingProgress(0);
      
      console.log('Processing video:', videoId);
      
      // Simulate processing with progress updates
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 300));
        setProcessingProgress(progress);
      }
      
      setProcessingStatus('completed');
      return { status: 'completed' };
    } catch (err) {
      setProcessingStatus('failed');
      throw err;
    }
  }, []);
  
  const resetProcessing = useCallback(() => {
    setProcessingStatus('idle');
    setProcessingProgress(0);
  }, []);
  
  return {
    process,
    processingStatus,
    processingProgress,
    resetProcessing,
  };
};
