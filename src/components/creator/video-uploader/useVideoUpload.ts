import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ContentType } from '@/types/video';
import { z } from 'zod';
import { useMobile } from '@/hooks/useMobile';
import { db } from '@/integrations/firebase/firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore'; // Ajout de doc et updateDoc
import { VideoFirestoreData } from '@/services/creatorService';

// Get the API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

type VideoFormat = '16:9' | '9:16' | '1:1' | 'other';

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
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null); // Gardé pour la preview locale
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
      setUploadProgress(0); // Réinitialiser la progression
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

  const uploadVideoAndSaveMetadata = async (values: VideoFormValues): Promise<VideoFirestoreData | null> => {
    if (!videoFile || !user) {
      setUploadError('Fichier vidéo ou utilisateur manquant');
      return null;
    }
    
    if (!API_BASE_URL) {
      setUploadError('Configuration error: VITE_API_BASE_URL is not set.');
      console.error('VITE_API_BASE_URL is not set. Cannot make API calls.');
      return null;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);
    setUploadStage("Préparation de l'upload...");

    let muxUploadUrl = '';
    let muxUploadId = ''; // Cet ID sera utile pour suivre l'upload et potentiellement pour les webhooks

    try {
      // ÉTAPE 1: Obtenir l'URL d'upload signée depuis notre backend Vercel
      setUploadStage("Obtention de l'URL d'upload MUX...");
      // Construct the full API URL
      const apiUrl = `${API_BASE_URL.replace(/\/+$/, '')}/api/create-mux-upload`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { error: response.statusText }; // Fallback if response is not JSON
        }
        throw new Error(`Erreur serveur (${response.status}) lors de la création de l'upload MUX: ${errorData.error || response.statusText}`);
      }

      const { uploadUrl, uploadId } = await response.json();
      if (!uploadUrl || !uploadId) {
        throw new Error("L'URL d'upload MUX ou l'ID d'upload n'a pas été retourné par l'API.");
      }
      muxUploadUrl = uploadUrl;
      muxUploadId = uploadId; // Sauvegardons cet ID

      setUploadStage("Upload de la vidéo vers MUX...");

      // ÉTAPE 2: Uploader le fichier vidéo directement vers MUX avec XMLHttpRequest pour la progression
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', muxUploadUrl, true);
        xhr.setRequestHeader('Content-Type', videoFile.type); 

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(progress);
            setUploadStage(`Upload en cours: ${progress}%`);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            setUploadProgress(100); 
            setUploadStage("Vidéo uploadée vers MUX. Enregistrement des métadonnées...");
            resolve();
          } else {
            setUploadStage(`Erreur d'upload MUX: ${xhr.statusText} (${xhr.status})`);
            reject(new Error(`Erreur d'upload MUX: ${xhr.statusText} (${xhr.status})`));
          }
        };

        xhr.onerror = () => {
          setUploadStage("Erreur réseau lors de l'upload vers MUX.");
          reject(new Error("Erreur réseau ou CORS lors de l'upload vers MUX."));
        };
        
        xhr.send(videoFile);
      });

      const videoType = values.type as ContentType;
      
      setUploadStage("Enregistrement des métadonnées initiales...");
      const videoDocData: Omit<VideoFirestoreData, 'id'> = {
        userId: user.uid,
        title: values.title,
        description: values.description || '',
        muxUploadId: muxUploadId,
        muxAssetId: '',
        muxPlaybackId: '',
        thumbnailUrl: '',
        videoUrl: '',
        status: 'processing',
        format: videoFormat,
        type: videoType,
        isPremium: ['premium', 'vip'].includes(values.type),
        tokenPrice: ['premium', 'vip'].includes(values.type) ? values.tokenPrice || 0 : 0,
        uploadedAt: serverTimestamp(),
        views: 0,
        likes: 0,
      };

      const docRef = await addDoc(collection(db, "videos"), videoDocData);

      setUploadProgress(100);
      setUploadStage("Terminé ! Vidéo en cours de traitement par MUX.");
      
      return { id: docRef.id, ...videoDocData } as VideoFirestoreData;

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
  };

  return {
    videoFile, thumbnailFile, videoPreviewUrl, thumbnailPreviewUrl, videoFormat,
    isUploading, uploadProgress, uploadError, uploadStage,
    handleVideoChange, handleThumbnailChange, generateThumbnail, resetForm,
    uploadVideoAndSaveMetadata
  };
};

export default useVideoUpload;
