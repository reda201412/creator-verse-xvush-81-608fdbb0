
import { useState } from 'react';
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
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (data: VideoFormData) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour télécharger une vidéo.",
        variant: "destructive",
      });
      return;
    }

    if (!data.videoFile) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier vidéo.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);

      // Upload video file to Supabase Storage
      const videoFileName = `${crypto.randomUUID()}-${data.videoFile.name}`;
      const { data: videoUploadData, error: videoUploadError } = await supabase.storage
        .from('videos')
        .upload(videoFileName, data.videoFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (videoUploadError) {
        throw videoUploadError;
      }

      // Get the public URL for the uploaded video
      const { data: videoPublicUrl } = supabase.storage.from('videos').getPublicUrl(videoFileName);
      const videoUrl = videoPublicUrl.publicUrl;

      // Upload thumbnail if provided
      let thumbnailUrl: string | undefined;
      if (data.thumbnailFile) {
        const thumbnailFileName = `${crypto.randomUUID()}-${data.thumbnailFile.name}`;
        const { data: thumbnailUploadData, error: thumbnailUploadError } = await supabase.storage
          .from('thumbnails')
          .upload(thumbnailFileName, data.thumbnailFile, {
            cacheControl: '3600',
            upsert: false
          });

        if (thumbnailUploadError) {
          throw thumbnailUploadError;
        }

        // Get the public URL for the uploaded thumbnail
        const { data: thumbnailPublicUrl } = supabase.storage.from('thumbnails').getPublicUrl(thumbnailFileName);
        thumbnailUrl = thumbnailPublicUrl.publicUrl;
      }

      // Create metadata object
      const videoMetadata: VideoMetadata = {
        id: crypto.randomUUID(),
        title: data.title,
        description: data.description || '',
        type: data.contentType,
        videoFile: data.videoFile,
        thumbnailUrl: thumbnailUrl,
        format: data.format,
        isPremium: data.isPremium,
        tokenPrice: data.isPremium ? data.tokenPrice : undefined,
        restrictions: data.isPremium ? {
          tier: data.tier,
          sharingAllowed: data.sharingAllowed,
          downloadsAllowed: data.downloadsAllowed,
          expiresAt: data.expiresAt
        } : undefined
      };

      // Save video metadata to Supabase database
      const { data: insertData, error: insertError } = await supabase
        .from('videos')
        .insert({
          id: parseInt(videoMetadata.id) || undefined, // Convert to number or use default
          user_id: user.id,
          title: data.title,
          description: data.description,
          type: data.contentType,
          video_url: videoUrl,
          thumbnail_url: thumbnailUrl,
          format: data.format,
          is_premium: data.isPremium,
          token_price: data.tokenPrice,
          restrictions: data.isPremium ? {
            tier: data.tier,
            sharingAllowed: data.sharingAllowed,
            downloadsAllowed: data.downloadsAllowed,
            expiresAt: data.expiresAt?.toISOString()
          } : null,
          uploadedat: new Date().toISOString()
        });

      if (insertError) {
        throw insertError;
      }

      toast({
        title: "Succès",
        description: "Vidéo téléchargée avec succès!",
      });

      return videoMetadata;
    } catch (error: any) {
      console.error("Error uploading video:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors du téléchargement de la vidéo. Veuillez réessayer.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return { isUploading, handleSubmit };
};

export default useVideoUpload;
