import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { VideoMetadata } from '@/types/video';

interface VideoFormData {
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

      const videoUrl = `${supabase.storageUrl}/videos/${videoFileName}`;

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

        thumbnailUrl = `${supabase.storageUrl}/thumbnails/${thumbnailFileName}`;
      }

      // Create metadata object
      const videoMetadata: VideoMetadata = {
        id: crypto.randomUUID(),
        title: data.title,
        description: data.description || '',
        type: data.contentType,
        videoFile: data.videoFile,
        thumbnailUrl: thumbnailUrl, // Use thumbnailUrl instead of thumbnailFile
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
        .insert([
          {
            id: videoMetadata.id,
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
          }
        ]);

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
