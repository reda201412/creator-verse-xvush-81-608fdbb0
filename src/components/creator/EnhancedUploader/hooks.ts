import { useState, useCallback, useEffect } from 'react';
import { useMuxUpload } from '@/hooks/use-mux-upload';
import { useAuth } from '@/contexts/AuthContext';
import { useUploader } from './UploaderContext';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase-client';

export function useEnhancedUploader(onUploadComplete?: (metadata?: any) => void) {
  const { user } = useAuth();
  const {
    file,
    thumbnail,
    metadata,
    stage,
    setStage,
    setProgress,
    setError,
    reset
  } = useUploader();
  
  const {
    uploadToMux,
    getAssetStatus,
    isUploading,
    progress,
    error
  } = useMuxUpload();
  
  // Update progress in the uploader context
  useEffect(() => {
    if (isUploading) {
      setProgress(progress);
    }
  }, [progress, isUploading, setProgress]);
  
  // Handle errors
  useEffect(() => {
    if (error) {
      setError(error.message);
      setStage('error');
    }
  }, [error, setError, setStage]);

  // Monitor video status if we have an asset ID
  const [assetId, setAssetId] = useState<string | null>(null);
  const [checkingStatus, setCheckingStatus] = useState(false);
  
  const checkAssetStatus = useCallback(async (id: string) => {
    if (!id || checkingStatus) return;
    
    try {
      setCheckingStatus(true);
      const status = await getAssetStatus(id);
      
      if (status.status === 'ready') {
        // Video is ready
        setStage('metadata');
      } else if (status.status === 'errored') {
        setError('Video processing failed');
        setStage('error');
      }
      // Otherwise continue processing
    } catch (err) {
      console.error('Error checking asset status:', err);
    } finally {
      setCheckingStatus(false);
    }
  }, [getAssetStatus, setStage, setError, checkingStatus]);
  
  // Check status periodically
  useEffect(() => {
    if (!assetId || stage !== 'processing') return;
    
    const interval = setInterval(() => {
      checkAssetStatus(assetId);
    }, 5000); // Check every 5 seconds
    
    return () => clearInterval(interval);
  }, [assetId, stage, checkAssetStatus]);
  
  // Upload handler
  const handleUpload = useCallback(async () => {
    if (!file || !user) {
      setError('File or user is missing');
      return;
    }
    
    setStage('uploading');
    
    try {
      // Upload to Mux
      const result = await uploadToMux(file, thumbnail, {
        onProgress: (progress) => {
          setProgress(progress);
        }
      });
      
      // Store asset ID for status checking
      setAssetId(result.assetId);
      
      // Set to processing stage
      setStage('processing');
      
      // Now we'll wait for the metadata stage
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError(err.message);
        setStage('error');
      }
    }
  }, [file, thumbnail, user, uploadToMux, setProgress, setStage, setError]);
  
  // Submit metadata and finalize upload
  const submitMetadata = useCallback(async () => {
    if (!assetId || !user || !metadata.title) {
      setError('Missing required information');
      return;
    }
    
    try {
      // Save video metadata to Supabase
      const { data, error: saveError } = await supabase
        .from('videos')
        .upsert({
          user_id: user.id,
          title: metadata.title,
          description: metadata.description || '',
          type: metadata.type,
          is_premium: metadata.isPremium,
          token_price: metadata.isPremium ? metadata.tokenPrice : null,
          mux_asset_id: assetId,
          thumbnail_url: thumbnail ? (await supabase.storage.from('thumbnails').upload(
            `${user.id}/${Date.now()}.jpg`,
            thumbnail,
            { upsert: true }
          )).data?.path : null,
          tags: metadata.tags || [],
          category: metadata.category,
          visibility: metadata.visibility || 'public',
          schedule_publish: metadata.schedulePublish,
          created_at: new Date().toISOString(),
          status: 'processing'
        })
        .select()
        .single();
      
      if (saveError) {
        throw saveError;
      }
      
      // Success!
      setStage('complete');
      
      // Call completion callback
      if (onUploadComplete && data) {
        onUploadComplete(data);
      }
    } catch (err: any) {
      console.error('Error saving metadata:', err);
      setError('Failed to save video metadata: ' + err.message);
      setStage('error');
    }
  }, [assetId, user, metadata, thumbnail, setStage, setError, onUploadComplete]);
  
  return {
    handleUpload,
    submitMetadata,
    isUploading,
    assetId,
    checkingStatus
  };
}
