
import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { VideoMetadata } from '@/types/video';
import { z } from 'zod';

interface UseVideoUploadProps {
  toast: any;
  user: any;
}

export const videoSchema = z.object({
  title: z.string().min(3, { message: "Le titre doit contenir au moins 3 caractères" }),
  description: z.string().optional(),
  type: z.enum(['standard', 'teaser', 'premium', 'vip']),
  tokenPrice: z.number().optional(),
  tier: z.enum(['free', 'fan', 'superfan', 'vip', 'exclusive']),
  sharingAllowed: z.boolean().default(false),
  downloadsAllowed: z.boolean().default(false),
});

export type VideoFormValues = z.infer<typeof videoSchema>;

export const useVideoUpload = ({ toast, user }: UseVideoUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(null);
  const [videoFormat, setVideoFormat] = useState<'16:9' | '9:16' | '1:1' | 'other'>('16:9');

  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreviewUrl(url);

      // Detect aspect ratio
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        const ratio = video.videoWidth / video.videoHeight;
        if (ratio > 0.95 && ratio < 1.05) {
          setVideoFormat('1:1');
        } else if (ratio > 1.7) {
          setVideoFormat('16:9');
        } else if (ratio < 0.6) {
          setVideoFormat('9:16');
        } else {
          setVideoFormat('other');
        }
      };
      video.src = url;
    } else {
      toast({
        title: "Format non supporté",
        description: "Seuls les fichiers vidéo sont acceptés.",
        variant: "destructive",
      });
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setThumbnailFile(file);
      setThumbnailPreviewUrl(URL.createObjectURL(file));
    } else {
      toast({
        title: "Format non supporté",
        description: "Seules les images sont acceptées pour la miniature.",
        variant: "destructive",
      });
    }
  };

  const generateThumbnail = () => {
    if (!videoPreviewUrl) return;

    const video = document.createElement('video');
    video.src = videoPreviewUrl;
    video.currentTime = 1; // Capture thumbnail at 1 second
    video.addEventListener('loadeddata', () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob(blob => {
        if (blob) {
          const file = new File([blob], "thumbnail.jpg", { type: "image/jpeg" });
          setThumbnailFile(file);
          setThumbnailPreviewUrl(URL.createObjectURL(blob));
        }
      }, 'image/jpeg', 0.7);
    });
  };

  const resetForm = () => {
    setVideoFile(null);
    setThumbnailFile(null);
    setVideoPreviewUrl(null);
    setThumbnailPreviewUrl(null);
    setVideoFormat('16:9');
    setUploadProgress(0);
    setIsUploading(false);
    if (videoInputRef.current) videoInputRef.current.value = '';
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
  };

  const uploadToSupabase = async (values: VideoFormValues): Promise<VideoMetadata | null> => {
    if (!videoFile || !user) {
      toast({
        title: "Erreur",
        description: "Vidéo ou utilisateur non disponible",
        variant: "destructive",
      });
      return null;
    }

    try {
      setIsUploading(true);
      
      // 1. Upload de la vidéo
      const userId = user.id;
      const videoFileName = `${Date.now()}_${videoFile.name.replace(/\s+/g, '_')}`;
      const videoPath = `${userId}/${videoFileName}`;
      
      // Mise à jour de la barre de progression
      setUploadProgress(20);
      
      // Upload de la vidéo
      const { data: videoData, error: videoError } = await supabase.storage
        .from('videos')
        .upload(videoPath, videoFile, {
          cacheControl: '3600',
          upsert: false
        });
      
      // Update progress manually
      setUploadProgress(50);
      
      if (videoError) throw videoError;
      
      // Récupérer l'URL publique de la vidéo
      const { data: videoUrlData } = await supabase.storage
        .from('videos')
        .createSignedUrl(videoPath, 60 * 60 * 24 * 365); // URL valide 1 an
      
      const videoUrl = videoUrlData?.signedUrl;
      setUploadProgress(70);
      
      // 2. Upload de la miniature si disponible
      let thumbnailUrl = null;
      if (thumbnailFile) {
        const thumbnailFileName = `thumbnail_${Date.now()}_${thumbnailFile.name.replace(/\s+/g, '_')}`;
        const thumbnailPath = `${userId}/${thumbnailFileName}`;
        
        const { data: thumbnailData, error: thumbnailError } = await supabase.storage
          .from('videos')
          .upload(thumbnailPath, thumbnailFile, {
            cacheControl: '3600',
            upsert: false
          });
        
        // Update progress manually
        setUploadProgress(90);
        
        if (thumbnailError) throw thumbnailError;
        
        // Récupérer l'URL publique de la miniature
        const { data: thumbnailUrlData } = await supabase.storage
          .from('videos')
          .createSignedUrl(thumbnailPath, 60 * 60 * 24 * 365); // URL valide 1 an
        
        thumbnailUrl = thumbnailUrlData?.signedUrl;
      }
      
      // 3. Sauvegarder les métadonnées dans la base de données
      const isPremium = values.type !== 'standard';
      const restrictions = {
        tier: values.tier,
        sharingAllowed: values.sharingAllowed,
        downloadsAllowed: values.downloadsAllowed
      };
      
      const { data: videoRecord, error: dbError } = await supabase
        .from('videos')
        .insert({
          title: values.title,
          description: values.description || '',
          type: values.type,
          is_premium: isPremium,
          format: videoFormat,
          video_url: videoUrl,
          thumbnail_url: thumbnailUrl,
          user_id: userId,
          token_price: isPremium ? values.tokenPrice : null,
          restrictions: restrictions
        })
        .select()
        .single();
      
      if (dbError) throw dbError;
      
      // Update to 100% when everything is done
      setUploadProgress(100);
      
      // Préparer les métadonnées pour le retour
      const metadata: VideoMetadata = {
        id: videoRecord.id.toString(),
        title: values.title,
        description: values.description || '',
        type: values.type,
        videoFile: videoFile,
        thumbnailFile: thumbnailFile || undefined,
        thumbnailUrl: thumbnailUrl || undefined,
        format: videoFormat,
        isPremium: isPremium,
        tokenPrice: isPremium ? values.tokenPrice : undefined,
        restrictions: restrictions
      };
      
      return metadata;
    } catch (error) {
      console.error("Erreur lors de l'upload :", error);
      throw error;
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
    videoInputRef,
    thumbnailInputRef,
    handleVideoChange,
    handleThumbnailChange,
    generateThumbnail,
    resetForm,
    uploadToSupabase
  };
};
