
import { z } from 'zod';
import { useState, useCallback } from 'react';

// Define the schema for the form
export const videoFormSchema = z.object({
  title: z.string().min(1, 'Un titre est requis'),
  description: z.string().optional(),
  videoType: z.enum(['standard', 'teaser', 'premium', 'vip']),
  allowSharing: z.boolean().default(false),
  allowDownload: z.boolean().default(false),
  subscriptionLevel: z.enum(['free', 'fan', 'superfan', 'vip', 'exclusive']).default('free'),
  tokenPrice: z.number().min(0).default(0),
});

// Define the type based on the schema
export type VideoFormValues = z.infer<typeof videoFormSchema>;
export type VideoFormData = VideoFormValues;

// Function to convert file size to readable format
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Helper function to generate a thumbnail from a video file
export const generateVideoThumbnail = (videoFile: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      // Seek to a frame at 25% of the video
      video.currentTime = video.duration * 0.25;
    };
    video.oncanplay = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
      resolve(thumbnail);
    };
    video.onerror = (e) => {
      reject(new Error('Error generating thumbnail: ' + e));
    };
    video.src = URL.createObjectURL(videoFile);
  });
};

// Helper function to detect video format based on aspect ratio
export const detectVideoFormat = (width: number, height: number): '16:9' | '9:16' | '1:1' | 'other' => {
  const ratio = width / height;
  if (Math.abs(ratio - 16/9) < 0.1) return '16:9';
  if (Math.abs(ratio - 9/16) < 0.1) return '9:16';
  if (Math.abs(ratio - 1) < 0.1) return '1:1';
  return 'other';
};

// Add the useVideoUpload hook
export const useVideoUpload = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(null);
  const [videoFormat, setVideoFormat] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ progress: 0, loaded: 0, total: 0 });
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadStage, setUploadStage] = useState<string | undefined>(undefined);

  const handleVideoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setVideoFile(file);
    setVideoPreviewUrl(URL.createObjectURL(file));
    setUploadError(null);

    // Detect the video format
    const video = document.createElement('video');
    video.onloadedmetadata = () => {
      const format = detectVideoFormat(video.videoWidth, video.videoHeight);
      setVideoFormat(format);
    };
    video.src = URL.createObjectURL(file);
  }, []);

  const handleThumbnailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setThumbnailFile(file);
    if (thumbnailPreviewUrl) URL.revokeObjectURL(thumbnailPreviewUrl);
    setThumbnailPreviewUrl(URL.createObjectURL(file));
  }, [thumbnailPreviewUrl]);

  const generateThumbnail = useCallback(async () => {
    if (!videoFile) return;
    try {
      const thumbnail = await generateVideoThumbnail(videoFile);
      setThumbnailPreviewUrl(thumbnail);
      
      // Convert data URL to file
      const response = await fetch(thumbnail);
      const blob = await response.blob();
      const file = new File([blob], "thumbnail.jpg", { type: "image/jpeg" });
      setThumbnailFile(file);
    } catch (error) {
      console.error('Error generating thumbnail:', error);
    }
  }, [videoFile]);

  const resetForm = useCallback(() => {
    if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
    if (thumbnailPreviewUrl) URL.revokeObjectURL(thumbnailPreviewUrl);
    
    setVideoFile(null);
    setThumbnailFile(null);
    setVideoPreviewUrl(null);
    setThumbnailPreviewUrl(null);
    setVideoFormat(null);
    setIsUploading(false);
    setUploadProgress({ progress: 0, loaded: 0, total: 0 });
    setUploadError(null);
    setUploadStage(undefined);
  }, [videoPreviewUrl, thumbnailPreviewUrl]);

  const uploadVideoAndSaveMetadata = async (formData: VideoFormData) => {
    if (!videoFile) {
      throw new Error("No video file selected");
    }

    setIsUploading(true);
    setUploadStage("Préparation de l'upload...");

    try {
      // Mock implementation for video upload
      await new Promise<void>((resolve) => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          setUploadProgress({
            progress,
            loaded: (progress / 100) * videoFile.size,
            total: videoFile.size
          });
          setUploadStage(`Téléchargement en cours (${progress}%)...`);
          
          if (progress >= 100) {
            clearInterval(interval);
            setUploadStage("Traitement de la vidéo...");
            setTimeout(resolve, 1000);
          }
        }, 500);
      });
      
      // Mock processing time
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setUploadStage("Finalisation...");
      
      // Mock final delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      return {
        id: `video-${Date.now()}`,
        title: formData.title,
        description: formData.description,
        type: formData.videoType
      };
    } catch (error: any) {
      setUploadError(error.message || "Une erreur s'est produite lors de l'upload");
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    videoFile,
    thumbnailFile,
    videoPreviewUrl,
    thumbnailPreviewUrl,
    videoFormat,
    isUploading,
    uploadProgress,
    uploadError,
    uploadStage,
    handleVideoChange,
    handleThumbnailChange,
    generateThumbnail,
    resetForm,
    uploadVideoAndSaveMetadata,
    setUploadError
  };
};
