
import { useState, useRef, useCallback } from 'react';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { VideoMetadata } from '@/types/video';

export const videoSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().optional(),
  type: z.enum(["standard", "teaser", "premium", "vip"]),
  tier: z.enum(["free", "fan", "superfan", "vip", "exclusive"]),
  sharingAllowed: z.boolean().default(false),
  downloadsAllowed: z.boolean().default(false),
  tokenPrice: z.number().optional(),
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
  const videoElement = useRef<HTMLVideoElement | null>(null);
  const { user } = useAuth();

  // Detect video format when a video is loaded
  const detectVideoFormat = (width: number, height: number) => {
    const aspectRatio = width / height;
    
    if (Math.abs(aspectRatio - 16/9) < 0.1) {
      return '16:9';
    } else if (Math.abs(aspectRatio - 9/16) < 0.1) {
      return '9:16';
    } else if (Math.abs(aspectRatio - 1) < 0.1) {
      return '1:1';
    } else {
      return 'other';
    }
  };

  // Handle video file change
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setVideoFile(file);
    setUploadError(null);

    // Create object URL for preview
    const objectURL = URL.createObjectURL(file);
    setVideoPreviewUrl(objectURL);

    // Create a video element to get dimensions
    const video = document.createElement("video");
    video.onloadedmetadata = () => {
      const format = detectVideoFormat(video.videoWidth, video.videoHeight);
      setVideoFormat(format);
      videoElement.current = video;
    };
    video.src = objectURL;
  };

  // Handle thumbnail file change
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setThumbnailFile(file);
    setUploadError(null);

    // Clear previous thumbnail URL if it exists
    if (thumbnailPreviewUrl) {
      URL.revokeObjectURL(thumbnailPreviewUrl);
    }

    // Create new thumbnail URL
    const objectURL = URL.createObjectURL(file);
    setThumbnailPreviewUrl(objectURL);
  };

  // Generate thumbnail from video
  const generateThumbnail = useCallback(() => {
    const video = videoElement.current;
    if (!video || !videoPreviewUrl) return;

    // Create a canvas element
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Set the current time to get a frame from the middle of the video
    video.currentTime = video.duration / 2;

    // Once the time is set, draw the video frame to the canvas
    video.onseeked = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert the canvas to a blob
      canvas.toBlob((blob) => {
        if (!blob) return;

        // Create a file from the blob
        const file = new File([blob], "thumbnail.jpg", { type: "image/jpeg" });
        setThumbnailFile(file);

        // Clear previous thumbnail URL if it exists
        if (thumbnailPreviewUrl) {
          URL.revokeObjectURL(thumbnailPreviewUrl);
        }

        // Create new thumbnail URL
        const objectURL = URL.createObjectURL(file);
        setThumbnailPreviewUrl(objectURL);
      }, "image/jpeg", 0.8);
    };
  }, [videoPreviewUrl, thumbnailPreviewUrl, videoElement]);

  // Reset the form
  const resetForm = () => {
    if (videoPreviewUrl) {
      URL.revokeObjectURL(videoPreviewUrl);
    }
    if (thumbnailPreviewUrl) {
      URL.revokeObjectURL(thumbnailPreviewUrl);
    }
    setVideoFile(null);
    setThumbnailFile(null);
    setVideoPreviewUrl(null);
    setThumbnailPreviewUrl(null);
    setVideoFormat('16:9');
    setIsUploading(false);
    setUploadProgress(0);
    setUploadError(null);
    videoElement.current = null;
  };

  // Upload to Supabase
  const uploadToSupabase = async (formValues: VideoFormValues) => {
    if (!videoFile || !user) return null;

    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    try {
      console.log("Début de l'upload...");
      
      // 1. Upload video file
      const videoFileName = `${user.id}/${Date.now()}-${videoFile.name.replace(/\s+/g, '-')}`;
      console.log("Uploading video:", videoFileName);
      
      const { error: videoUploadError, data: videoUploadData } = await supabase.storage
        .from('videos')
        .upload(videoFileName, videoFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: videoFile.type,
        });

      if (videoUploadError) {
        console.error("Erreur d'upload vidéo:", videoUploadError);
        throw new Error(`Erreur lors de l'upload de la vidéo: ${videoUploadError.message}`);
      }
      
      console.log("Vidéo uploadée avec succès:", videoUploadData);
      setUploadProgress(50);

      // Get video URL
      const { data: videoUrl } = supabase.storage
        .from('videos')
        .getPublicUrl(videoFileName);

      console.log("URL de la vidéo:", videoUrl.publicUrl);

      // 2. Upload thumbnail if provided
      let thumbnailUrl = null;
      if (thumbnailFile) {
        console.log("Uploading thumbnail...");
        const thumbnailFileName = `${user.id}/${Date.now()}-thumbnail-${thumbnailFile.name.replace(/\s+/g, '-')}`;
        const { error: thumbnailUploadError, data: thumbnailUploadData } = await supabase.storage
          .from('thumbnails')
          .upload(thumbnailFileName, thumbnailFile, {
            cacheControl: '3600',
            upsert: false,
            contentType: thumbnailFile.type,
          });

        if (thumbnailUploadError) {
          console.error("Erreur d'upload miniature:", thumbnailUploadError);
          throw new Error(`Erreur lors de l'upload de la miniature: ${thumbnailUploadError.message}`);
        }
        
        console.log("Miniature uploadée avec succès:", thumbnailUploadData);
        
        // Get thumbnail URL
        const { data: thumbnailUrlData } = supabase.storage
          .from('thumbnails')
          .getPublicUrl(thumbnailFileName);
          
        thumbnailUrl = thumbnailUrlData.publicUrl;
        console.log("URL de la miniature:", thumbnailUrl);
      }
      
      setUploadProgress(75);

      // 3. Add record to database
      console.log("Ajout des informations à la base de données...");
      const { error: dbError, data: dbData } = await supabase
        .from('videos')
        .insert({
          title: formValues.title,
          description: formValues.description || '',
          user_id: user.id,
          video_url: videoUrl.publicUrl,
          thumbnail_url: thumbnailUrl,
          type: formValues.type,
          format: videoFormat,
          is_premium: formValues.type === 'premium' || formValues.type === 'vip',
          token_price: formValues.tokenPrice,
          restrictions: {
            tier: formValues.tier,
            sharingAllowed: formValues.sharingAllowed,
            downloadsAllowed: formValues.downloadsAllowed,
          },
          uploadedat: new Date().toISOString(),
        })
        .select()
        .single();

      if (dbError) {
        console.error("Erreur d'insertion en base de données:", dbError);
        throw new Error(`Erreur lors de l'enregistrement en base de données: ${dbError.message}`);
      }
      
      console.log("Vidéo enregistrée avec succès:", dbData);
      setUploadProgress(100);

      // Return metadata for the upload
      const metadata: VideoMetadata = {
        id: dbData.id.toString(),
        title: formValues.title,
        description: formValues.description || '',
        type: formValues.type,
        videoFile: videoFile,
        thumbnailUrl: thumbnailUrl,
        video_url: videoUrl.publicUrl,
        format: videoFormat,
        isPremium: formValues.type === 'premium' || formValues.type === 'vip',
        tokenPrice: formValues.tokenPrice,
        restrictions: {
          tier: formValues.tier,
          sharingAllowed: formValues.sharingAllowed,
          downloadsAllowed: formValues.downloadsAllowed,
        },
      };

      return metadata;
    } catch (error) {
      console.error('Erreur complète d\'upload:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue lors de l\'upload';
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
    handleVideoChange,
    handleThumbnailChange,
    generateThumbnail,
    resetForm,
    uploadToSupabase
  };
};

export default useVideoUpload;
