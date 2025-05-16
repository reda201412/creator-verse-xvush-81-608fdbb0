import { useState, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import * as UpChunk from '@mux/upchunk';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { VideoService } from '@/services/videoService';

// Types
export type VideoType = 'video/mp4' | 'video/quicktime';
export type ThumbnailType = 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';

export type UploadStage =
  | 'idle'
  | 'preparing'
  | 'uploading'
  | 'processing'
  | 'complete'
  | 'error'
  | 'creating_upload'
  | 'retrying'
  | 'processing_metadata'
  | 'generating_thumbnail';

export interface UploadProgress {
  stage: UploadStage;
  progress: number;
  currentChunk: number;
  totalChunks: number;
  uploadSpeed: number; // bytes/sec
  timeRemaining: number; // seconds
}

export interface VideoFormData {
  title: string;
  description: string;
  format: string;
  visibility: string;
  category: string;
  tags: string[];
}

// Constants
export const ACCEPTED_VIDEO_TYPES: VideoType[] = ['video/mp4', 'video/quicktime'];
export const ACCEPTED_THUMBNAIL_TYPES: ThumbnailType[] = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
export const MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 500MB
export const MAX_THUMBNAIL_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_UPLOAD_RETRIES = 3;
export const RETRY_DELAY = 2000; // 2 seconds
export const CHUNK_SIZE = 5120; // 5MB chunks

// Schema for form validation
export const videoFormSchema = z.object({
  title: z.string().min(3, 'Le titre doit contenir au moins 3 caractères.'),
  description: z.string().max(5000, 'La description ne peut pas dépasser 5000 caractères'),
  format: z.string(),
  visibility: z.string(),
  category: z.string(),
  tags: z.array(z.string())
});

// Interface for the hook return value
export interface VideoUploadHook {
  form: ReturnType<typeof useForm<VideoFormData>>;
  videoFile: File | null;
  thumbnailFile: File | null;
  videoPreviewUrl: string | null;
  thumbnailPreviewUrl: string | null;
  videoFormat: string;
  isUploading: boolean;
  uploadProgress: UploadProgress;
  uploadSpeed: number;
  timeRemaining: number;
  currentChunk: number;
  totalChunks: number;
  handleVideoChange: (file: File) => Promise<void>;
  handleThumbnailChange: (file: File) => Promise<void>;
  handleSubmit: (data: VideoFormData) => Promise<void>;
  cancelUpload: () => void;
  setUploadError: (error: string | null) => void;
}

// Helper function to convert file to base64
const toBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// Helper function to compress image
const compressImage = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      const maxWidth = 1280;
      const maxHeight = 720;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to compress image'));
            return;
          }
          resolve(new File([blob], file.name, { type: 'image/jpeg' }));
        },
        'image/jpeg',
        0.8
      );
    };
    img.onerror = () => reject(new Error('Failed to load image'));
  });
};

// Helper function to generate thumbnail from video
const generateThumbnail = async (videoFile: File, videoUrl: string): Promise<File | null> => {
  return new Promise((resolve) => {
    try {
      const video = document.createElement('video');
      video.src = videoUrl;
      video.crossOrigin = 'anonymous';
      video.muted = true;
      video.currentTime = 1; // Capture frame at 1 second

      video.onloadeddata = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(null);
          return;
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(null);
              return;
            }
            const thumbnailFile = new File([blob], `${videoFile.name.split('.')[0]}-thumbnail.jpg`, {
              type: 'image/jpeg',
            });
            resolve(thumbnailFile);
          },
          'image/jpeg',
          0.8
        );
      };

      video.onerror = () => resolve(null);
    } catch (error) {
      console.error('Error generating thumbnail:', error);
      resolve(null);
    }
  });
};

// Helper function to calculate upload progress
const calculateProgress = (
  progress: number,
  videoFile: File,
  startTime: number,
  lastProgress: number
): {
  uploadSpeed: number;
  timeRemaining: number;
  currentChunk: number;
  totalChunks: number;
} => {
  const now = Date.now();
  const timeElapsed = (now - startTime) / 1000; // in seconds
  const progressDelta = progress - lastProgress;
  
  // Calculate upload speed (bytes per second)
  const uploadSpeed = progressDelta > 0 
    ? (progressDelta / 100) * videoFile.size / (timeElapsed || 1)
    : 0;
  
  // Calculate time remaining (in seconds)
  const remainingProgress = 100 - progress;
  const timeRemaining = uploadSpeed > 0
    ? (remainingProgress / 100) * videoFile.size / uploadSpeed
    : 0;
  
  // Calculate chunks
  const totalChunks = Math.ceil(videoFile.size / CHUNK_SIZE);
  const currentChunk = progress > 0 ? Math.ceil((progress / 100) * totalChunks) : 0;
  
  return {
    uploadSpeed,
    timeRemaining,
    currentChunk,
    totalChunks
  };
};

// Main hook implementation
export const useVideoUpload = (): VideoUploadHook => {
  const { user } = useAuth();
  const form = useForm<VideoFormData>({
    resolver: zodResolver(videoFormSchema),
    defaultValues: {
      title: '',
      description: '',
      format: 'standard',
      visibility: 'public',
      category: '',
      tags: []
    }
  });

  // State
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(null);
  const [videoFormat] = useState<string>('standard');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [, setUploadError] = useState<string | null>(null);
  
  const upchunkRef = useRef<UpChunk.UpChunk | null>(null);
  const startTimeRef = useRef<number>(0);
  const lastProgressRef = useRef<number>(0);
  
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    stage: 'idle',
    progress: 0,
    currentChunk: 0,
    totalChunks: 0,
    uploadSpeed: 0,
    timeRemaining: 0
  });

  // Handle video file selection
  const handleVideoChange = useCallback(async (file: File): Promise<void> => {
    try {
      if (!file) {
        toast.error('No file selected');
        return;
      }

      if (!ACCEPTED_VIDEO_TYPES.includes(file.type as VideoType)) {
        toast.error(`Invalid file type. Accepted types: ${ACCEPTED_VIDEO_TYPES.join(', ')}`);
        return;
      }

      if (file.size > MAX_VIDEO_SIZE) {
        toast.error(`File size exceeds the maximum limit of ${MAX_VIDEO_SIZE / (1024 * 1024)}MB`);
        return;
      }

      // Set video file and create preview URL
      setVideoFile(file);
      const videoUrl = URL.createObjectURL(file);
      setVideoPreviewUrl(videoUrl);

      // Auto-generate thumbnail
      setUploadProgress(prev => ({ ...prev, stage: 'generating_thumbnail' }));
      const thumbnail = await generateThumbnail(file, videoUrl);
      if (thumbnail) {
        setThumbnailFile(thumbnail);
        setThumbnailPreviewUrl(URL.createObjectURL(thumbnail));
      }

      setUploadProgress(prev => ({ ...prev, stage: 'idle' }));
      setUploadError(null);
    } catch (error) {
      console.error('Error handling video change:', error);
      setUploadError('Failed to process video file');
      setUploadProgress(prev => ({ ...prev, stage: 'error' }));
      toast.error('Failed to process video file');
    }
  }, []);

  // Handle thumbnail file selection
  const handleThumbnailChange = useCallback(async (file: File): Promise<void> => {
    try {
      if (!file) {
        toast.error('No thumbnail selected');
        return;
      }

      if (!ACCEPTED_THUMBNAIL_TYPES.includes(file.type as ThumbnailType)) {
        toast.error(`Invalid thumbnail type. Accepted types: ${ACCEPTED_THUMBNAIL_TYPES.join(', ')}`);
        return;
      }

      if (file.size > MAX_THUMBNAIL_SIZE) {
        toast.error(`Thumbnail size exceeds the maximum limit of ${MAX_THUMBNAIL_SIZE / (1024 * 1024)}MB`);
        return;
      }

      setIsUploading(true);
      setUploadError(null);

      try {
        // Compress the image before setting it
        const compressedFile = await compressImage(file);
        setThumbnailFile(compressedFile);
        setThumbnailPreviewUrl(URL.createObjectURL(compressedFile));
      } catch (error) {
        console.error('Error compressing thumbnail:', error);
        // If compression fails, use the original file
        setThumbnailFile(file);
        setThumbnailPreviewUrl(URL.createObjectURL(file));
      }

      setIsUploading(false);
    } catch (error) {
      console.error('Error handling thumbnail change:', error);
      setUploadError('Failed to process thumbnail');
      setIsUploading(false);
      toast.error('Failed to process thumbnail');
    }
  }, []);

  // Upload thumbnail to server
  const uploadThumbnail = async (thumbnailFile: File): Promise<string | null> => {
    if (!thumbnailFile) return null;
    
    try {
      setUploadProgress(prev => ({ ...prev, stage: 'uploading' }));
      
      // Convert thumbnail to base64
      const base64Data = await toBase64(thumbnailFile);
      
      // Get authentication token
      if (!user) {
        throw new Error('Authentication required');
      }
      
      // Upload thumbnail to server
      // Obtenir le token d'authentification
      const token = await user.getIdToken();
      
      const response = await fetch('/api/oss/upload-thumbnail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ image: base64Data })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to upload thumbnail: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      setUploadError('Failed to upload thumbnail');
      toast.error('Failed to upload thumbnail');
      return null;
    }
  };

  // Cancel ongoing upload
  const cancelUpload = useCallback((): void => {
    if (upchunkRef.current) {
      upchunkRef.current.abort();
      upchunkRef.current = null;
    }
    
    setUploadProgress(prev => ({ ...prev, stage: 'idle', progress: 0 }));
    setUploadError(null);
    setIsUploading(false);
  }, []);

  // Reset form and state
  const resetForm = (): void => {
    setVideoFile(null);
    setThumbnailFile(null);
    
    if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
    if (thumbnailPreviewUrl) URL.revokeObjectURL(thumbnailPreviewUrl);
    
    setVideoPreviewUrl(null);
    setThumbnailPreviewUrl(null);
    form.reset();
    setIsUploading(false);
    setUploadProgress({
      stage: 'idle',
      progress: 0,
      currentChunk: 0,
      totalChunks: 0,
      uploadSpeed: 0,
      timeRemaining: 0
    });
    setUploadError(null);
  };

  // Upload video to Mux and save metadata
  const uploadVideoAndSaveMetadata = async (formData: VideoFormData): Promise<void> => {
    if (!videoFile) {
      setUploadError('No video file selected');
      toast.error('No video file selected');
      return;
    }
    
    let thumbnailUrl = null;
    let muxUploadUrl = null;
    let muxAssetId = null;
    let retryCount = 0;
    
    try {
      // Step 1: Upload thumbnail if available
      if (thumbnailFile) {
        thumbnailUrl = await uploadThumbnail(thumbnailFile);
      }
      
      // Step 2: Get Mux upload URL
      setUploadProgress(prev => ({ ...prev, stage: 'creating_upload' }));
      
      if (!user) {
        throw new Error('Authentication required');
      }
      
      const uploadUrlResponse = await VideoService.createUploadUrl();
      muxUploadUrl = uploadUrlResponse.url;
      muxAssetId = uploadUrlResponse.id;
      
      if (!muxUploadUrl) {
        throw new Error('Failed to get upload URL');
      }
      
      // Step 3: Upload video to Mux
      setUploadProgress(prev => ({ ...prev, stage: 'uploading', progress: 0 }));
      setIsUploading(true);
      
      // Create uploader instance
      upchunkRef.current = UpChunk.createUpload({
        endpoint: muxUploadUrl,
        file: videoFile,
        chunkSize: CHUNK_SIZE, // 5MB chunks
      });
      
      // Track upload progress
      startTimeRef.current = Date.now();
      lastProgressRef.current = 0;
      
      upchunkRef.current.on('error', (error) => {
        console.error('Upload error:', error);
        setUploadError(`Upload failed: ${error.detail || 'Unknown error'}`);
        setUploadProgress(prev => ({ ...prev, stage: 'error' }));
        setIsUploading(false);
        toast.error('Upload failed');
      });
      
      upchunkRef.current.on('progress', (progress) => {
        const progressValue = progress.detail;
        const { uploadSpeed, timeRemaining, currentChunk, totalChunks } = calculateProgress(
          progressValue,
          videoFile,
          startTimeRef.current,
          lastProgressRef.current
        );
        
        lastProgressRef.current = progressValue;
        
        setUploadProgress({
          stage: 'uploading',
          progress: progressValue,
          currentChunk,
          totalChunks,
          uploadSpeed,
          timeRemaining
        });
      });
      
      upchunkRef.current.on('success', async () => {
        setUploadProgress(prev => ({ ...prev, stage: 'processing' }));
        
        // Step 4: Save video metadata to database
        try {
          // Get the authentication token
          const token = await user.getIdToken();
          
          const response = await fetch('/api/videos/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              title: formData.title,
              description: formData.description,
              format: formData.format,
              visibility: formData.visibility,
              category: formData.category,
              tags: formData.tags,
              assetId: muxAssetId,
              thumbnailUrl
            })
          });
          
          if (!response.ok) {
            throw new Error(`Failed to save video metadata: ${response.statusText}`);
          }
          
          await response.json(); // Response data not currently used
          
          // Success
          setUploadProgress(prev => ({ ...prev, stage: 'complete' }));
          toast.success('Video uploaded successfully!');
          resetForm();
          
        } catch (error) {
          console.error('Error saving video metadata:', error);
          setUploadError('Failed to save video metadata');
          setUploadProgress(prev => ({ ...prev, stage: 'error' }));
          toast.error('Failed to save video metadata');
        } finally {
          setIsUploading(false);
        }
      });
      
    } catch (error) {
      console.error('Upload error:', error);
      
      // Retry logic
      if (retryCount < MAX_UPLOAD_RETRIES) {
        retryCount++;
        setUploadProgress(prev => ({ ...prev, stage: 'retrying' }));
        
        setTimeout(() => {
          uploadVideoAndSaveMetadata(formData);
        }, RETRY_DELAY);
      } else {
        setUploadError(`Upload failed after ${MAX_UPLOAD_RETRIES} attempts`);
        setUploadProgress(prev => ({ ...prev, stage: 'error' }));
        setIsUploading(false);
        toast.error(`Upload failed after ${MAX_UPLOAD_RETRIES} attempts`);
      }
    }
  };

  // Handle form submission
  const handleSubmit = useCallback(async (data: VideoFormData): Promise<void> => {
    setIsUploading(true);
    setUploadError(null);
    
    try {
      await uploadVideoAndSaveMetadata(data);
    } catch (error) {
      console.error('Submission error:', error);
      setUploadError('Failed to submit video');
      toast.error('Failed to submit video');
    } finally {
      setIsUploading(false);
    }
  }, [videoFile, thumbnailFile, user]);

  return {
    form,
    videoFile,
    thumbnailFile,
    videoPreviewUrl,
    thumbnailPreviewUrl,
    videoFormat,
    isUploading,
    uploadProgress,
    uploadSpeed: uploadProgress.uploadSpeed,
    timeRemaining: uploadProgress.timeRemaining,
    currentChunk: uploadProgress.currentChunk,
    totalChunks: uploadProgress.totalChunks,
    handleVideoChange,
    handleThumbnailChange,
    handleSubmit,
    cancelUpload,
    setUploadError
  };
};
