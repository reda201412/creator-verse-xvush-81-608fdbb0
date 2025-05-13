import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { VideoMetadata, ContentType, VideoRestrictions } from '@/types/video';
import { z } from 'zod';
import { useMobile } from '@/hooks/useMobile';
// Import the UpChunk library
import * as UpChunk from '@mux/upchunk';
// Import the Supabase data type
import { VideoSupabaseData } from '@/services/creatorService';

// Define VideoFormat to match expected types
export type VideoFormat = '16:9' | '9:16' | '1:1' | 'other';

export const videoSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().optional(),
  type: z.enum(['standard', 'teaser', 'premium', 'vip']),
  tier: z.enum(['free', 'fan', 'superfan', 'vip', 'exclusive']),
  tokenPrice: z.number().min(0).optional(),
  sharingAllowed: z.boolean().default(false),
  downloadsAllowed: z.boolean().default(false),
});

export type VideoFormValues = z.infer<typeof videoSchema>;

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
      setUploadError(null);
      if (isMobile && file.size > 100 * 1024 * 1024) {
        alert("Attention: Le téléchargement de très grands fichiers sur mobile peut être lent.");
      }
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        const width = video.videoWidth;
        const height = video.videoHeight;
        const ratio = width / height;
        let format: VideoFormat = '16:9';
        if (ratio < 0.8) format = '9:16';
        else if (ratio >= 0.8 && ratio <= 1.2) format = '1:1';
        setVideoFormat(format);
        URL.revokeObjectURL(video.src);
      };
      video.onerror = () => { setUploadError('Format vidéo non valide'); URL.revokeObjectURL(video.src); };
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
      video.onloadeddata = () => { video.currentTime = 1; };
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
    } catch (error) { console.error('Failed to generate thumbnail:', error); }
  };

  const resetForm = () => {
    setVideoFile(null); setThumbnailFile(null); setVideoPreviewUrl(null);
    setThumbnailPreviewUrl(null); setVideoFormat('16:9'); setIsUploading(false);
    setUploadProgress(0); setUploadError(null); setUploadStage('prêt');
  };

  // *** Explicitly define the return type of the function ***
  const uploadVideoAndSaveMetadata = async (values: VideoFormValues): Promise<VideoSupabaseData | null> => {
    if (!videoFile || !user) {
      setUploadError('Fichier vidéo ou utilisateur manquant');
      return null;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);
    setUploadStage("Initiation de l'upload MUX...");

    try {
      // --- ÉTAPE 1: Obtenir une URL d'upload signée depuis l'Edge Function ---
      const edgeFunctionUrl = import.meta.env.VITE_CREATE_MUX_UPLOAD_URL; // Use import.meta.env with VITE_ prefix
      if (!edgeFunctionUrl) {
        throw new Error('VITE_CREATE_MUX_UPLOAD_URL environment variable not set.');
      }

      const firebaseIdToken = await user.getIdToken();

      const createUploadResponse = await fetch(edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${firebaseIdToken}`, // Pass Firebase token for auth
        },
      });

      if (!createUploadResponse.ok) {
        const errorData = await createUploadResponse.json();
        throw new Error(`Failed to get MUX upload URL: ${errorData.details || createUploadResponse.statusText}`);
      }

      const { uploadId, uploadUrl } = await createUploadResponse.json();

      // --- ÉTAPE 2: Uploader le fichier vidéo en utilisant MUX Uploader SDK ---
      setUploadStage("Upload de la vidéo...");

      // Wrap the UpChunk upload in a promise to await its completion
      await new Promise<void>((resolveUpChunk, rejectUpChunk) => {
        const uploader = UpChunk.createUpload({
          endpoint: uploadUrl,
          file: videoFile,
          chunkSize: 5120, // Recommend 5MB chunk size
        });

        // Subscribe to events - *** Explicitly cast event names to any ***
        uploader.on('chunk-success' as any, (event) => {
          console.log('Chunk uploaded successfully:', event.detail);
        });

        uploader.on('progress' as any, (event) => {
          console.log(`Upload progress: ${event.detail}%`);
          setUploadProgress(Math.round(event.detail));
          setUploadStage(`Upload en cours (${Math.round(event.detail)}%)...`);
        });

        uploader.on('success' as any, () => {
          console.log('File upload complete!');
          setUploadProgress(100);
          setUploadStage("Upload terminé. En attente de traitement MUX...");
          resolveUpChunk(); // Resolve the UpChunk promise
        });

        uploader.on('error' as any, (event) => {
          console.error('Upload failed:', event.detail);
          setUploadError(`Upload failed: ${event.detail.message}`);
          setUploadStage('Erreur Upload');
          setIsUploading(false);
          rejectUpChunk(event.detail); // Reject the UpChunk promise
        });
      }); // Await the UpChunk promise

      // --- ÉTAPE 3: Insérer les métadonnées initiales dans Supabase ---
      // This now happens *after* the UpChunk upload successfully completes.

      setUploadStage("Enregistrement des métadonnées...");

      const videoType = values.type as ContentType;

      const initialMetadata = {
          title: values.title,
          description: values.description || '',
          format: videoFormat,
          type: videoType === 'teaser' ? 'standard' as ContentType : videoType,
          is_premium: ['premium', 'vip'].includes(values.type), // Assuming snake_case for Supabase
          token_price: ['premium', 'vip'].includes(values.type) ? values.tokenPrice || 0 : 0, // Assuming snake_case
          sharing_allowed: values.sharingAllowed,
          downloads_allowed: values.downloadsAllowed,
          thumbnail_url: thumbnailPreviewUrl || null,
          // status is 'created' initially by the edge function. Webhook updates to 'processing', 'ready', 'error'
          // upload_id is already set by the edge function.
          user_id: user.uid, // Ensure user_id is set here as well, although edge function sets it initially
      };

      // Update the row that the create-mux-upload edge function created
      // *** Ensure the select() returns data if successful ***
      const { data: videoData, error: dbError } = await supabase
        .from('videos')
        .update(initialMetadata)
        .eq('upload_id', uploadId) // Find the row by upload_id
        .select(); // Select the updated row to return

      if (dbError) {
        console.error('Supabase metadata update error:', dbError);
        setUploadError(`Database error: ${dbError.message}`);
        setUploadStage('Erreur Base de Données');
        setIsUploading(false);
        return null; // Return null on DB error
      }

      // *** Return the first element if data array is not empty and is an array ***
      if (Array.isArray(videoData) && videoData.length > 0) {
          setUploadStage("Métadonnées enregistrées. Vidéo en cours de traitement.");
          setIsUploading(false);
          // Return the Supabase data object, explicitly cast to VideoSupabaseData
          return videoData[0] as VideoSupabaseData; 
      } else {
          // This case indicates the update query didn't find the row by upload_id, or select() returned empty
          const unexpectedError = new Error(`Metadata update failed: No row found with upload_id ${uploadId} or empty response.`);
           console.error(unexpectedError);
           setUploadError(unexpectedError.message);
           setUploadStage('Erreur Interne');
           setIsUploading(false);
           return null;
      }

    } catch (error: any) {
      // Catch errors from fetch, UpChunk (via rejectUpChunk), or initial DB update if moved here
      const errorMessage = error.message || "Une erreur est survenue lors du processus d'upload.";
      console.error('Upload process error (caught in useVideoUpload):', error);
      // Error state might already be set by UpChunk error handler, but set here too as a fallback
      if (!uploadError) setUploadError(errorMessage);
      if (uploadStage !== 'Erreur Upload' && uploadStage !== 'Erreur Base de Données' && uploadStage !== 'Erreur Interne') {
         setUploadStage('Erreur Globale');
      }
      setIsUploading(false);
      return null; // Ensure null is returned on catch
    }
  };

  return {
    videoFile, thumbnailFile, videoPreviewUrl, thumbnailPreviewUrl, videoFormat,
    isUploading, uploadProgress, uploadError, uploadStage,
    handleVideoChange, handleThumbnailChange, generateThumbnail, resetForm,
    uploadVideoAndSaveMetadata,
    setUploadError // Expose setter for external use if needed (though onSubmit handles it now)
  };
};

export default useVideoUpload;
