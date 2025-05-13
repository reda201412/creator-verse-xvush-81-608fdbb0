import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ContentType } from '@/types/video';
import { z } from 'zod';
import { useIsMobile } from '@/hooks/use-mobile';
import { db } from '@/integrations/firebase/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { VideoFirestoreData } from '@/services/creatorService';
import React from 'react';
import { toast } from 'sonner';

// Get the API base URL from environment variables for Vite
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
  const { isMobile } = useIsMobile();
  const { user } = useAuth();

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
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

  const generateThumbnail = useCallback(() => {
    console.log("Generate thumbnail functionality not yet implemented.");
    toast("Génération de vignette", {
      description: "La génération automatique de vignettes n'est pas encore disponible."
    });
  }, []);

  const resetForm = () => {
    setVideoFile(null); setThumbnailFile(null); setVideoPreviewUrl(null);
    setThumbnailPreviewUrl(null); setVideoFormat('16:9'); setIsUploading(false);
    setUploadProgress(0); setUploadError(null); setUploadStage('prêt');
  };

  const uploadVideoAndSaveMetadata = useCallback(async (
    values: VideoFormValues,
    onUploadProgress: (progress: number) => void
  ): Promise<VideoFirestoreData | null> => {
    if (!user) {
      setUploadError('Utilisateur manquant');
      return null;
    }

    if (!API_BASE_URL) {
      const errorMsg = 'Configuration error: VITE_API_BASE_URL is not set.';
      console.error(errorMsg);
      setUploadError(errorMsg);
      return null;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadStage("Préparation de l'upload...");

    try {
      setUploadStage("Enregistrement des métadonnées initiales...");
      // Use a type assertion to handle teaser as standard for backward compatibility
      const videoType = values.type === 'teaser' ? 'standard' as ContentType : values.type as ContentType;

      const videoDocData: Omit<VideoFirestoreData, 'id'> = {
        userId: user.uid,
        title: values.title,
        description: values.description || '',
        muxUploadId: '', // Will be updated after Mux upload
        muxAssetId: '',
        muxPlaybackId: '',
        thumbnailUrl: '',
        videoUrl: '',
        status: 'uploading',
        format: videoFormat,
        type: videoType,
        isPremium: ['premium', 'vip'].includes(values.type),
        tokenPrice: ['premium', 'vip'].includes(values.type) ? values.tokenPrice || 0 : 0,
        uploadedAt: serverTimestamp(),
        views: 0,
        likes: 0,
      };

      const docRef = await addDoc(collection(db, "videos"), videoDocData);
      const videoId = docRef.id;

      return { id: videoId, ...videoDocData } as VideoFirestoreData;

    } catch (error: any) {
      const errorMessage = error.message || "Une erreur est survenue lors du processus d'upload.";
      console.error('Upload process error:', error);
      setUploadError(errorMessage);
      setUploadStage('Erreur');
      setIsUploading(false);
      return null;
    } finally {
      if (uploadStage === 'Erreur') {
        setIsUploading(false);
      }
    }
  }, [user, videoFormat, uploadStage]);

  return {
    videoFile, thumbnailFile, videoPreviewUrl, thumbnailPreviewUrl, videoFormat,
    isUploading, uploadProgress, uploadError, uploadStage,
    handleVideoChange, handleThumbnailChange, generateThumbnail, resetForm,
    uploadVideoAndSaveMetadata, setVideoFile, setUploadProgress, setUploadStage
  };
};

export default useVideoUpload;
