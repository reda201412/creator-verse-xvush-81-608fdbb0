
import { useForm } from 'react-hook-form';
import { useState, useCallback } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Define the form schema with Zod for validation
export const videoFormSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().optional(),
  videoType: z.enum(["standard", "teaser", "premium", "vip"]),
  tokenPrice: z.number().optional(),
  subscriptionLevel: z.string().optional(),
  allowSharing: z.boolean().optional(),
  allowDownload: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
});

// Define the form schema
export interface VideoFormValues {
  title: string;
  description: string;
  videoType: 'standard' | 'teaser' | 'premium' | 'vip';
  tokenPrice?: number;
  subscriptionLevel?: string;
  allowSharing?: boolean;
  allowDownload?: boolean;
  tags?: string[];
}

// Extended form data with file information
export interface VideoFormData extends VideoFormValues {
  videoFile?: File;
  thumbnailFile?: File;
}

export const useVideoUpload = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(null);
  const [videoFormat, setVideoFormat] = useState<'16:9' | '9:16' | '1:1' | 'other'>('16:9');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadStage, setUploadStage] = useState<string>("Préparation");

  const form = useForm<VideoFormValues>({
    resolver: zodResolver(videoFormSchema),
    defaultValues: {
      title: '',
      description: '',
      videoType: 'standard',
      tokenPrice: 5,
      subscriptionLevel: 'premium',
      allowSharing: false,
      allowDownload: false,
      tags: []
    },
  });

  const handleVideoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Create an object URL for the video
      const objectUrl = URL.createObjectURL(file);
      setVideoFile(file);
      setVideoPreviewUrl(objectUrl);
      
      // Detect video format (aspect ratio)
      const video = document.createElement('video');
      video.onloadedmetadata = () => {
        const aspectRatio = video.videoWidth / video.videoHeight;
        if (Math.abs(aspectRatio - 16/9) < 0.1) {
          setVideoFormat('16:9');
        } else if (Math.abs(aspectRatio - 9/16) < 0.1) {
          setVideoFormat('9:16');
        } else if (Math.abs(aspectRatio - 1) < 0.1) {
          setVideoFormat('1:1');
        } else {
          setVideoFormat('other');
        }
      };
      video.src = objectUrl;
    }
  }, []);

  const handleThumbnailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Create an object URL for the thumbnail
      const objectUrl = URL.createObjectURL(file);
      setThumbnailFile(file);
      setThumbnailPreviewUrl(objectUrl);
    }
  }, []);

  const generateThumbnail = useCallback(() => {
    if (!videoPreviewUrl) return;
    
    const video = document.createElement('video');
    video.src = videoPreviewUrl;
    video.currentTime = 2; // Skip to 2 seconds
    video.onseeked = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'thumbnail.png', { type: 'image/png' });
            const objectUrl = URL.createObjectURL(file);
            setThumbnailFile(file);
            setThumbnailPreviewUrl(objectUrl);
          }
        }, 'image/png');
      }
    };
  }, [videoPreviewUrl]);

  const resetForm = useCallback(() => {
    form.reset();
    if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
    if (thumbnailPreviewUrl) URL.revokeObjectURL(thumbnailPreviewUrl);
    setVideoFile(null);
    setThumbnailFile(null);
    setVideoPreviewUrl(null);
    setThumbnailPreviewUrl(null);
    setVideoFormat('16:9');
    setUploadProgress(0);
    setUploadError(null);
    setUploadStage("Préparation");
  }, [form, videoPreviewUrl, thumbnailPreviewUrl]);

  const uploadVideoAndSaveMetadata = async (values: VideoFormData): Promise<{ success: boolean }> => {
    if (!videoFile) {
      throw new Error("Aucun fichier vidéo sélectionné");
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);
    setUploadStage("Création de l'upload...");

    try {
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prev + 5;
        });
      }, 500);

      // Simulate API call
      setUploadStage("Téléchargement en cours...");
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setUploadStage("Traitement de la vidéo...");
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      clearInterval(interval);
      setUploadProgress(100);
      
      console.log('Video upload successful', values);
      return { success: true };
    } catch (error) {
      console.error('Video upload failed:', error);
      setUploadError('Failed to upload video. Please try again.');
      return { success: false };
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpload = async (values: VideoFormValues) => {
    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    try {
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prev + 5;
        });
      }, 500);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      clearInterval(interval);
      setUploadProgress(100);
      
      console.log('Video upload successful', values);
      return { success: true };
    } catch (error) {
      setUploadError('Failed to upload video. Please try again.');
      console.error('Video upload failed:', error);
      return { success: false, error };
    } finally {
      setIsUploading(false);
    }
  };

  return {
    form,
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
    setUploadError,
    handleUpload
  };
};
