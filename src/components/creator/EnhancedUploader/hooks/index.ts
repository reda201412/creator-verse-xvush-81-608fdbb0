
import { useState, useCallback } from 'react';
import { useUploader } from '../UploaderContext';
import { ShieldStatus, ShieldFeatureStatus } from '../types';
import { uploadVideoToMux } from '@/services/muxService';

export function useShieldProtection() {
  const { setShieldStatus } = useUploader();
  const [isProcessing, setIsProcessing] = useState(false);

  const applyShield = useCallback(async () => {
    setIsProcessing(true);
    
    // Set features to "pending" status during processing
    setShieldStatus({
      encryption: 'pending' as ShieldFeatureStatus,
      watermark: 'pending' as ShieldFeatureStatus,
      drm: 'pending' as ShieldFeatureStatus
    });
    
    try {
      // Simulating shield application process
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // All features applied successfully
      setShieldStatus({
        encryption: 'active' as ShieldFeatureStatus,
        watermark: 'active' as ShieldFeatureStatus,
        drm: 'active' as ShieldFeatureStatus
      });
      
      return true;
    } catch (error) {
      // Application failed
      setShieldStatus({
        encryption: 'error' as ShieldFeatureStatus,
        watermark: 'error' as ShieldFeatureStatus,
        drm: 'error' as ShieldFeatureStatus
      });
      
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, [setShieldStatus]);

  return {
    applyShield,
    isProcessing
  };
}

export function useVideoUpload() {
  const { file, setProgress, setStage, setError } = useUploader();
  const [isUploading, setIsUploading] = useState(false);

  const uploadVideo = useCallback(async () => {
    if (!file) {
      setError('No file selected');
      return null;
    }

    try {
      setIsUploading(true);
      
      // Start the upload process
      const uploadResponse = await uploadVideoToMux(file);
      
      // Move to the metadata stage after successful upload
      setStage('metadata');
      setProgress(100);
      
      return uploadResponse;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Upload failed');
      setStage('error');
      return null;
    } finally {
      setIsUploading(false);
    }
  }, [file, setError, setProgress, setStage]);

  return {
    uploadVideo,
    isUploading
  };
}
