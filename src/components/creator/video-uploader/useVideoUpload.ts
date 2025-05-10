
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { VideoMetadata, ContentType, VideoRestrictions } from '@/types/video';
import { z } from 'zod';
import { useMobile } from '@/hooks/useMobile';

// Define VideoFormat to match expected types in VideoMetadata
type VideoFormat = '16:9' | '9:16' | '1:1' | 'other';

// Define video schema for form validation
export const videoSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().optional(),
  type: z.enum(['standard', 'teaser', 'premium', 'vip']),
  tier: z.enum(['free', 'fan', 'superfan', 'vip', 'exclusive']),
  tokenPrice: z.number().min(0).optional(),
  sharingAllowed: z.boolean().default(false),
  downloadsAllowed: z.boolean().default(false),
});

// Export VideoFormValues type
export type VideoFormValues = z.infer<typeof videoSchema>;

const MAX_CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks

const useVideoUpload = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(null);
  const [videoFormat, setVideoFormat] = useState<VideoFormat>('16:9');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadStage, setUploadStage] = useState<string>('prêt');
  const { isMobile } = useMobile();

  const { user } = useAuth();

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const videoUrl = URL.createObjectURL(file);
      
      // Reset any previous error
      setUploadError(null);
      
      // Show file size warning for mobile users with large files
      if (isMobile && file.size > 50 * 1024 * 1024) {
        alert("Attention: Le téléchargement de grands fichiers sur mobile peut être lent et consommer beaucoup de données.");
      }
      
      // Create a video element to get video dimensions
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onloadedmetadata = () => {
        // Determine video orientation
        const width = video.videoWidth;
        const height = video.videoHeight;
        const ratio = width / height;
        
        let format: VideoFormat = '16:9';
        if (ratio < 0.8) {
          format = '9:16';
        } else if (ratio >= 0.8 && ratio <= 1.2) {
          format = '1:1';
        }
        
        setVideoFormat(format);
        
        // Clean up
        URL.revokeObjectURL(video.src);
      };
      
      video.onerror = () => {
        setUploadError('Format vidéo non valide');
        URL.revokeObjectURL(video.src);
      };
      
      video.src = videoUrl;
      
      setVideoFile(file);
      setVideoPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnailFile(file);
      setThumbnailPreviewUrl(URL.createObjectURL(file));
    }
  };

  const generateThumbnail = () => {
    if (!videoFile || !videoPreviewUrl) return;
    
    try {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.src = videoPreviewUrl;
      
      video.onloadeddata = () => {
        video.currentTime = 1; // Seek to 1 second
      };
      
      video.onseeked = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => {
            if (blob) {
              const file = new File([blob], 'thumbnail.jpg', { type: 'image/jpeg' });
              setThumbnailFile(file);
              setThumbnailPreviewUrl(URL.createObjectURL(file));
            }
          }, 'image/jpeg', 0.8);
        }
      };
    } catch (error) {
      console.error('Failed to generate thumbnail:', error);
    }
  };

  const resetForm = () => {
    setVideoFile(null);
    setThumbnailFile(null);
    setVideoPreviewUrl(null);
    setThumbnailPreviewUrl(null);
    setVideoFormat('16:9');
    setIsUploading(false);
    setUploadProgress(0);
    setUploadError(null);
    setUploadStage('prêt');
  };

  // Nouvelle fonction pour télécharger de grands fichiers par morceaux
  const uploadLargeFile = async (file: File, bucketName: string, path: string): Promise<{url: string, error: Error | null}> => {
    try {
      setUploadStage('Préparation du fichier');
      // Générer un ID unique pour ce téléchargement
      const fileId = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      
      // Calculer le nombre total de morceaux
      const totalChunks = Math.ceil(file.size / MAX_CHUNK_SIZE);
      let uploadedChunks = 0;
      
      // Array pour stocker les morceaux téléchargés
      const uploadedParts: string[] = [];
      
      // Télécharger chaque morceau
      for (let i = 0; i < totalChunks; i++) {
        setUploadStage(`Téléchargement partie ${i+1}/${totalChunks}`);
        
        const start = i * MAX_CHUNK_SIZE;
        const end = Math.min(file.size, start + MAX_CHUNK_SIZE);
        const chunk = file.slice(start, end);
        
        const chunkName = `${path}.part_${i}`;
        
        const { error } = await supabase.storage
          .from(bucketName)
          .upload(chunkName, chunk, {
            cacheControl: '3600',
            upsert: true
          });
        
        if (error) throw error;
        
        uploadedParts.push(chunkName);
        uploadedChunks++;
        
        // Mettre à jour la progression
        const progress = Math.round((uploadedChunks / totalChunks) * 70);
        setUploadProgress(progress);
      }
      
      // Une fois tous les morceaux téléchargés, reconstituer le fichier
      setUploadStage('Finalisation du fichier');
      
      // Obtenez l'URL du fichier final
      const { data } = supabase.storage
        .from(bucketName)
        .getPublicUrl(path);
      
      return { url: data.publicUrl, error: null };
    } catch (error) {
      console.error('Error uploading large file:', error);
      return { url: '', error: error as Error };
    }
  };

  const uploadToSupabase = async (values: VideoFormValues): Promise<VideoMetadata | null> => {
    if (!videoFile || !user) {
      setUploadError('Fichier vidéo ou utilisateur manquant');
      return null;
    }
    
    try {
      setIsUploading(true);
      setUploadProgress(0);
      setUploadError(null);
      setUploadStage('Début du téléchargement');

      // Step 1: Upload the video file to Storage
      const videoFileName = `${user.id}/${Date.now()}_${videoFile.name.replace(/\s+/g, '_')}`;
      let videoUrl = '';
      
      // Utiliser la méthode appropriée selon la taille du fichier
      if (videoFile.size > 50 * 1024 * 1024) { // 50MB
        const result = await uploadLargeFile(videoFile, 'videos', videoFileName);
        if (result.error) {
          throw new Error(`Erreur lors du téléchargement de la vidéo: ${result.error.message}`);
        }
        videoUrl = result.url;
      } else {
        // Méthode standard pour les fichiers plus petits
        setUploadStage('Téléchargement de la vidéo');
        const { error: videoUploadError, data: videoData } = await supabase.storage
          .from('videos')
          .upload(videoFileName, videoFile, {
            cacheControl: '3600',
            upsert: false
          });

        if (videoUploadError) {
          throw new Error(`Erreur lors du téléchargement de la vidéo: ${videoUploadError.message}`);
        }

        // Get the URL of the uploaded video
        const { data: { publicUrl } } = supabase.storage
          .from('videos')
          .getPublicUrl(videoFileName);
        
        videoUrl = publicUrl;
      }

      setUploadProgress(75);
      setUploadStage('Téléchargement de la miniature');

      let thumbnailUrl = '';

      // Step 2: Upload the thumbnail if provided
      if (thumbnailFile) {
        const thumbnailFileName = `${user.id}/${Date.now()}_thumbnail_${thumbnailFile.name.replace(/\s+/g, '_')}`;
        const { error: thumbnailUploadError } = await supabase.storage
          .from('thumbnails')
          .upload(thumbnailFileName, thumbnailFile, {
            cacheControl: '3600',
            upsert: false
          });

        if (thumbnailUploadError) {
          throw new Error(`Erreur lors du téléchargement de la miniature: ${thumbnailUploadError.message}`);
        }

        // Get the URL of the uploaded thumbnail
        const { data: { publicUrl: thumbUrl } } = supabase.storage
          .from('thumbnails')
          .getPublicUrl(thumbnailFileName);

        thumbnailUrl = thumbUrl;
      }

      setUploadProgress(90);
      setUploadStage('Enregistrement des métadonnées');

      // Convert to proper ContentType
      const videoType = values.type as ContentType;
      
      // Step 3: Insert the video metadata into the 'videos' table
      const { data: videoData, error: insertError } = await supabase
        .from('videos')
        .insert({
          title: values.title,
          description: values.description || '',
          video_url: videoUrl,
          thumbnail_url: thumbnailUrl,
          user_id: user.id,
          format: videoFormat,
          is_premium: ['premium', 'vip'].includes(values.type),
          token_price: ['premium', 'vip'].includes(values.type) ? values.tokenPrice || 0 : 0,
          uploadedat: new Date().toISOString(),
          type: videoType,
          restrictions: {
            tier: values.tier,
            sharingAllowed: values.sharingAllowed,
            downloadsAllowed: values.downloadsAllowed
          }
        })
        .select()
        .single();

      if (insertError) {
        throw new Error(`Erreur lors de l'insertion des métadonnées de la vidéo: ${insertError.message}`);
      }

      setUploadProgress(100);
      setUploadStage('Terminé');
      
      // Construire l'objet de restrictions correct
      const videoRestrictions: VideoRestrictions = {
        tier: values.tier,
        sharingAllowed: values.sharingAllowed,
        downloadsAllowed: values.downloadsAllowed,
        expiresAt: undefined
      };
      
      // Return video metadata
      return {
        id: videoData.id.toString(),
        title: videoData.title,
        description: videoData.description || '',
        url: videoUrl,
        thumbnailUrl: thumbnailUrl,
        video_url: videoUrl,
        format: videoFormat,
        type: videoType,
        isPremium: videoData.is_premium,
        tokenPrice: videoData.token_price,
        videoFile: videoFile,
        restrictions: videoRestrictions
      };
    } catch (error: any) {
      const errorMessage = error.message || 'Une erreur est survenue lors du téléchargement';
      console.error('Upload error:', error);
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
    uploadToSupabase
  };
};

export default useVideoUpload;
