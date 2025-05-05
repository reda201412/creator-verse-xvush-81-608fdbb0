
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { VideoMetadata } from '@/types/video';
import { z } from 'zod';

// Define form schema with zod
export const videoSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().optional(),
  type: z.enum(["standard", "teaser", "premium", "vip"]),
  sharingAllowed: z.boolean().default(false),
  downloadsAllowed: z.boolean().default(false),
  tokenPrice: z.number().min(1).optional(),
  tier: z.enum(["free", "fan", "superfan", "vip", "exclusive"]).default("free"),
});

export type VideoFormValues = z.infer<typeof videoSchema>;

export interface VideoFormData {
  title: string;
  description?: string;
  contentType: VideoMetadata['type'];
  videoFile: File;
  thumbnailFile?: File;
  format: VideoMetadata['format'];
  isPremium: boolean;
  tokenPrice?: number;
  tier?: VideoMetadata['restrictions']['tier'];
  sharingAllowed?: boolean;
  downloadsAllowed?: boolean;
  expiresAt?: Date;
}

const useVideoUpload = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(null);
  const [videoFormat, setVideoFormat] = useState<'16:9' | '9:16' | '1:1' | 'other'>('16:9');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleVideoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setVideoFile(file);

    // Create a preview URL
    const url = URL.createObjectURL(file);
    setVideoPreviewUrl(url);

    // Determine video format
    const video = document.createElement('video');
    video.onloadedmetadata = () => {
      const ratio = video.videoWidth / video.videoHeight;
      if (ratio > 1.7 && ratio < 1.8) {
        setVideoFormat('16:9');
      } else if (ratio < 0.6) {
        setVideoFormat('9:16');
      } else if (ratio >= 0.9 && ratio <= 1.1) {
        setVideoFormat('1:1');
      } else {
        setVideoFormat('other');
      }
    };
    video.src = url;
  }, []);

  const handleThumbnailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setThumbnailFile(file);

    // Create a preview URL
    const url = URL.createObjectURL(file);
    setThumbnailPreviewUrl(url);
  }, []);

  const generateThumbnail = useCallback(() => {
    if (!videoFile || !videoPreviewUrl) return;

    // Create a video element to capture a frame
    const video = document.createElement('video');
    video.src = videoPreviewUrl;
    video.currentTime = 1; // Seek to 1 second
    
    video.onseeked = () => {
      // Create a canvas and draw the video frame
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to a Blob and then to a File
        canvas.toBlob((blob) => {
          if (blob) {
            const thumbnailFile = new File([blob], 'thumbnail.jpg', { type: 'image/jpeg' });
            setThumbnailFile(thumbnailFile);
            
            // Create a preview URL
            const url = URL.createObjectURL(thumbnailFile);
            setThumbnailPreviewUrl(url);
          }
        }, 'image/jpeg', 0.8);
      }
    };
  }, [videoFile, videoPreviewUrl]);

  const resetForm = useCallback(() => {
    if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
    if (thumbnailPreviewUrl) URL.revokeObjectURL(thumbnailPreviewUrl);
    
    setVideoFile(null);
    setThumbnailFile(null);
    setVideoPreviewUrl(null);
    setThumbnailPreviewUrl(null);
    setVideoFormat('16:9');
    setUploadProgress(0);
  }, [videoPreviewUrl, thumbnailPreviewUrl]);

  const uploadToSupabase = async (values: VideoFormValues): Promise<VideoMetadata | null> => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour télécharger une vidéo.",
        variant: "destructive",
      });
      return null;
    }

    if (!videoFile) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier vidéo.",
        variant: "destructive",
      });
      return null;
    }

    try {
      setIsUploading(true);
      setUploadProgress(10);

      // Create a user-specific path for video files
      const userId = user.id;
      const videoFileName = `${userId}/${crypto.randomUUID()}-${videoFile.name}`;
      
      console.log("Début du téléversement de la vidéo:", videoFileName);
      console.log("Taille du fichier vidéo:", videoFile.size, "bytes");
      
      // Upload video file to Supabase Storage
      const { data: videoUploadData, error: videoUploadError } = await supabase.storage
        .from('videos')
        .upload(videoFileName, videoFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (videoUploadError) {
        console.error("Video upload error:", videoUploadError);
        throw videoUploadError;
      }

      console.log("Vidéo téléversée avec succès:", videoUploadData);
      setUploadProgress(50);

      // Get the public URL for the uploaded video
      const { data: videoPublicUrl } = supabase.storage.from('videos').getPublicUrl(videoFileName);
      const videoUrl = videoPublicUrl.publicUrl;
      
      console.log("URL publique de la vidéo:", videoUrl);

      // Upload thumbnail if provided
      let thumbnailUrl: string | undefined;
      if (thumbnailFile) {
        // Create a user-specific path for thumbnail files
        const thumbnailFileName = `${userId}/${crypto.randomUUID()}-${thumbnailFile.name}`;
        
        console.log("Début du téléversement de la miniature:", thumbnailFileName);
        
        const { data: thumbnailUploadData, error: thumbnailUploadError } = await supabase.storage
          .from('thumbnails')
          .upload(thumbnailFileName, thumbnailFile, {
            cacheControl: '3600',
            upsert: false
          });

        if (thumbnailUploadError) {
          console.error("Thumbnail upload error:", thumbnailUploadError);
          throw thumbnailUploadError;
        }

        console.log("Miniature téléversée avec succès:", thumbnailUploadData);

        // Get the public URL for the uploaded thumbnail
        const { data: thumbnailPublicUrl } = supabase.storage.from('thumbnails').getPublicUrl(thumbnailFileName);
        thumbnailUrl = thumbnailPublicUrl.publicUrl;
        
        console.log("URL publique de la miniature:", thumbnailUrl);
      }

      setUploadProgress(75);

      // Determine if video is premium based on type
      const isPremium = values.type === 'premium' || values.type === 'vip';

      // Create a unique string ID for the video
      const videoId = crypto.randomUUID();

      // Create metadata object
      const videoMetadata: VideoMetadata = {
        id: videoId,
        title: values.title,
        description: values.description || '',
        type: values.type,
        videoFile: videoFile,
        thumbnailUrl: thumbnailUrl,
        format: videoFormat,
        isPremium: isPremium,
        tokenPrice: isPremium ? values.tokenPrice : undefined,
        restrictions: isPremium ? {
          tier: values.tier,
          sharingAllowed: values.sharingAllowed,
          downloadsAllowed: values.downloadsAllowed
        } : undefined
      };

      // Save video metadata to Supabase database
      const { data: insertData, error: insertError } = await supabase
        .from('videos')
        .insert({
          user_id: user.id,
          title: values.title,
          description: values.description,
          type: values.type,
          video_url: videoUrl,
          thumbnail_url: thumbnailUrl,
          format: videoFormat,
          is_premium: isPremium,
          token_price: values.tokenPrice,
          restrictions: isPremium ? {
            tier: values.tier,
            sharingAllowed: values.sharingAllowed,
            downloadsAllowed: values.downloadsAllowed
          } : null,
          uploadedat: new Date().toISOString()
        })
        .select();

      if (insertError) {
        console.error("Database insert error:", insertError);
        throw insertError;
      }

      console.log("Métadonnées de la vidéo insérées en base:", insertData);

      // Update the metadata with the database-generated ID
      if (insertData && insertData.length > 0 && insertData[0].id) {
        videoMetadata.id = insertData[0].id.toString();
      }

      setUploadProgress(100);

      toast({
        title: "Succès",
        description: "Vidéo téléchargée avec succès!",
      });

      return videoMetadata;
    } catch (error: any) {
      console.error("Error uploading video:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors du téléchargement de la vidéo: " + (error.message || "Veuillez réessayer."),
        variant: "destructive",
      });
      return null;
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
    handleVideoChange,
    handleThumbnailChange,
    generateThumbnail,
    resetForm,
    uploadToSupabase
  };
};

export default useVideoUpload;
