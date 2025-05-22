
import { useState, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import * as z from 'zod';
import { MuxUploadManager, onProgress } from '@/hooks/useVideoUploadToMux';
import { saveVideoMetadata, VideoMetadata } from '@/services/videoService';

// Updated schema to include isPremium and tokenPrice fields
export const videoSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  description: z.string().optional(),
  type: z.enum(["standard", "premium", "teaser", "vip"]).default("standard"),
  isPremium: z.boolean().default(false),
  tokenPrice: z.number().min(0).optional()
});

export type VideoFormValues = z.infer<typeof videoSchema>;

const useVideoUpload = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(null);
  const [videoFormat, setVideoFormat] = useState<'16:9' | '9:16' | '1:1' | 'other'>('16:9');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadStage, setUploadStage] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { user } = useAuth();

  // Handle video file selection
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setVideoFile(file);
      
      const videoUrl = URL.createObjectURL(file);
      setVideoPreviewUrl(videoUrl);
      
      // Reset thumbnail when new video is selected
      if (thumbnailPreviewUrl) {
        URL.revokeObjectURL(thumbnailPreviewUrl);
        setThumbnailPreviewUrl(null);
      }
      setThumbnailFile(null);
      
      // Detect video format when loaded
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
        
        videoRef.current = video;
      };
      
      video.src = videoUrl;
    }
  };

  // Handle thumbnail file selection
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setThumbnailFile(file);
      
      // Revoke previous URL to avoid memory leaks
      if (thumbnailPreviewUrl) {
        URL.revokeObjectURL(thumbnailPreviewUrl);
      }
      
      setThumbnailPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Generate a thumbnail from the video
  const generateThumbnail = useCallback(() => {
    if (videoRef.current && videoPreviewUrl) {
      const video = videoRef.current;
      video.currentTime = 2; // Skip to 2 seconds
      
      // Use a canvas to capture a frame
      video.onseeked = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to blob
        canvas.toBlob(blob => {
          if (blob) {
            const file = new File([blob], "thumbnail.png", { type: "image/png" });
            setThumbnailFile(file);
            
            // Revoke previous URL to avoid memory leaks
            if (thumbnailPreviewUrl) {
              URL.revokeObjectURL(thumbnailPreviewUrl);
            }
            
            setThumbnailPreviewUrl(URL.createObjectURL(file));
          }
        }, 'image/png');
      };
    }
  }, [videoPreviewUrl, thumbnailPreviewUrl, videoRef]);

  // Reset the form
  const resetForm = () => {
    if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
    if (thumbnailPreviewUrl) URL.revokeObjectURL(thumbnailPreviewUrl);
    
    setVideoFile(null);
    setThumbnailFile(null);
    setVideoPreviewUrl(null);
    setThumbnailPreviewUrl(null);
    setVideoFormat('16:9');
    setUploadProgress(0);
    setUploadError(null);
    setIsUploading(false);
    setUploadStage('');
  };

  // Upload video to MUX and save metadata
  const uploadVideoAndSaveMetadata = async (formValues: VideoFormValues): Promise<VideoMetadata> => {
    if (!videoFile || !user) {
      throw new Error('Fichier vidéo manquant ou utilisateur non connecté');
    }
    
    setIsUploading(true);
    setUploadStage('Préparation du téléchargement...');
    
    try {
      // Get upload URL from our backend
      const uploadManager = new MuxUploadManager();
      
      setUploadStage('Initialisation du téléchargement...');
      
      const { uploadId, assetId } = await uploadManager.init(videoFile.name, user.uid);
      
      setUploadStage('Téléchargement en cours...');
      
      // Start upload with progress tracking
      await uploadManager.start(videoFile, uploadId, onProgress(setUploadProgress));
      
      setUploadStage('Traitement de la vidéo...');
      
      // Save video metadata
      const metadata = await saveVideoMetadata({
        userId: user.uid,
        title: formValues.title,
        description: formValues.description || '',
        assetId,
        uploadId,
        isPremium: formValues.isPremium,
        price: formValues.tokenPrice,
        type: formValues.type,
      });
      
      setUploadStage('Finalisation...');
      
      // Add thumbnail if available
      if (thumbnailFile) {
        // Here you would upload the thumbnail to your storage
        // And then update the video metadata with the thumbnail URL
        // This functionality would be implemented elsewhere
      }
      
      return metadata;
      
    } catch (error) {
      console.error("Upload error:", error);
      const errorMessage = error instanceof Error ? error.message : "Une erreur s'est produite lors du téléchargement";
      setUploadError(errorMessage);
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
    setUploadError,
  };
};

export default useVideoUpload;
