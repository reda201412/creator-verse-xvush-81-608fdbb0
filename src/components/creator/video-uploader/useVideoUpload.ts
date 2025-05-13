
import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ContentType } from '@/types/video';
import { z } from 'zod';

export const videoSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().optional(),
  isPremium: z.boolean().default(false),
  tokenPrice: z.number().optional(),
  type: z.enum(["standard", "premium", "teaser", "vip"] as const).default("standard"),
  tags: z.array(z.string()).optional()
});

export type VideoFormValues = z.infer<typeof videoSchema>;

export const useVideoUpload = () => {
  const { isMobile } = useIsMobile();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState('');
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState('');
  const [videoFormat, setVideoFormat] = useState<"16:9" | "9:16" | "1:1" | "other">("16:9");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState('preparing');
  const [error, setError] = useState('');
  
  const handleVideoChange = (file: File | null) => {
    if (file) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreviewUrl(url);
      
      // Detect the video format/aspect ratio
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onloadedmetadata = () => {
        URL.revokeObjectURL(url);
        const { videoWidth, videoHeight } = video;
        const ratio = videoWidth / videoHeight;
        
        if (Math.abs(ratio - 16/9) < 0.1) {
          setVideoFormat("16:9");
        } else if (Math.abs(ratio - 9/16) < 0.1) {
          setVideoFormat("9:16");
        } else if (Math.abs(ratio - 1) < 0.1) {
          setVideoFormat("1:1");
        } else {
          setVideoFormat("other");
        }
      };
      
      video.src = url;
    }
  };
  
  const handleThumbnailChange = (file: File | null) => {
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreviewUrl(URL.createObjectURL(file));
    }
  };
  
  const generateThumbnail = async () => {
    if (!videoFile) return;
    
    try {
      if (isMobile) {
        setError('Auto-thumbnail generation is not available on mobile devices');
        return null;
      }
      
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.src = URL.createObjectURL(videoFile);
      video.currentTime = 1; // Seek to 1 second
      
      return new Promise<File>((resolve, reject) => {
        video.onseeked = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            canvas.toBlob((blob) => {
              if (!blob) {
                reject(new Error('Failed to generate thumbnail'));
                return;
              }
              
              const thumbnailFile = new File([blob], `thumbnail-${videoFile.name}.jpg`, { type: 'image/jpeg' });
              handleThumbnailChange(thumbnailFile);
              resolve(thumbnailFile);
            }, 'image/jpeg', 0.95);
          } catch (err) {
            reject(err);
          } finally {
            URL.revokeObjectURL(video.src);
          }
        };
        
        video.onerror = () => {
          URL.revokeObjectURL(video.src);
          reject(new Error('Error loading video'));
        };
      });
    } catch (err: any) {
      setError(`Failed to generate thumbnail: ${err.message}`);
      return null;
    }
  };
  
  const resetForm = () => {
    setVideoFile(null);
    setThumbnailFile(null);
    setVideoPreviewUrl('');
    setThumbnailPreviewUrl('');
    setVideoFormat("16:9");
    setIsUploading(false);
    setUploadProgress(0);
    setUploadStage('preparing');
    setError('');
  };
  
  // Mock function for uploading the video
  const uploadVideoAndSaveMetadata = async (values: VideoFormValues, onProgress: (progress: number) => void) => {
    if (!videoFile) {
      throw new Error("No video file selected");
    }
    
    setIsUploading(true);
    setUploadStage('uploading');
    setError('');
    
    try {
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress > 100) progress = 100;
        setUploadProgress(progress);
        onProgress(progress);
        if (progress === 100) {
          clearInterval(interval);
          setUploadStage('processing');
        }
      }, 500);
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Mock response data
      const firestoreData = {
        id: `video-${Date.now()}`,
        title: values.title,
        description: values.description || '',
        thumbnailUrl: thumbnailPreviewUrl || 'https://via.placeholder.com/640x360',
        videoUrl: videoPreviewUrl || 'https://example.com/video.mp4',
        userId: 'current-user-id',
        uploadStatus: 'complete' as 'complete',
        uploadProgress: 100,
        uploadedAt: new Date(),
        format: videoFormat,
        type: values.type,
        isPremium: values.isPremium,
        tokenPrice: values.tokenPrice,
        tags: values.tags || []
      };
      
      setUploadStage('complete');
      return firestoreData;
    } catch (err: any) {
      setError(err.message || 'Upload failed');
      setUploadStage('error');
      throw err;
    } finally {
      setIsUploading(false);
    }
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
    setVideoFile,
    setThumbnailFile,
    handleVideoChange,
    handleThumbnailChange,
    generateThumbnail,
    resetForm,
    uploadVideoAndSaveMetadata,
    setUploadProgress,
    setUploadStage
  };
};

export default useVideoUpload;
