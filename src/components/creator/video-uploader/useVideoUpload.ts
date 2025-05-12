
import { useState } from 'react';
// import { supabase } from '@/integrations/supabase/client'; // Supprimé
import { useAuth } from '@/contexts/AuthContext';
import { VideoMetadata, ContentType, VideoRestrictions } from '@/types/video'; // Ce type VideoMetadata devra peut-être être aligné avec VideoFirestoreData
import { z } from 'zod';
import { useMobile } from '@/hooks/useMobile';
import { db } from '@/integrations/firebase/firebase'; // Ajout de db pour Firestore
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; // Ajout pour Firestore
import { VideoFirestoreData } from '@/services/creatorService'; // Utiliser notre type Firestore

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

// MAX_CHUNK_SIZE n'est plus pertinent si MUX gère les uploads de gros fichiers via son SDK
// const MAX_CHUNK_SIZE = 5 * 1024 * 1024; 

const useVideoUpload = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(null);
  const [videoFormat, setVideoFormat] = useState<VideoFormat>('16:9');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // La progression sera gérée par le SDK MUX
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadStage, setUploadStage] = useState<string>('prêt');
  const { isMobile } = useMobile();
  const { user } = useAuth();

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const videoUrl = URL.createObjectURL(file);
      setUploadError(null);
      if (isMobile && file.size > 100 * 1024 * 1024) { // Augmenter la limite pour l'alerte
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

  // La fonction uploadLargeFile n'est plus nécessaire avec MUX (MUX SDK gère cela)

  const uploadVideoAndSaveMetadata = async (values: VideoFormValues): Promise<VideoFirestoreData | null> => {
    if (!videoFile || !user) {
      setUploadError('Fichier vidéo ou utilisateur manquant');
      return null;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);
    setUploadStage("Initialisation de l'upload MUX...");

    try {
      // --- ÉTAPE 1 & 2: Upload vers MUX (Vidéo et Miniature) ---
      // Ici, vous intégrerez le SDK MUX ou votre logique d'upload vers MUX.
      // 1. Obtenir une URL d'upload signée depuis votre backend (Firebase Function) qui interagit avec l'API MUX.
      // 2. Uploader le videoFile vers cette URL, en utilisant les callbacks de progression du SDK MUX pour setUploadProgress.
      // 3. Une fois l'upload vidéo terminé, MUX vous donnera un `assetId`.
      // 4. Optionnel: Uploader la miniature (thumbnailFile) vers MUX associée à cet asset, ou vers Firebase Storage.
      //    Si upload vers Firebase Storage, vous obtiendrez une `thumbnailUrl`.
      //    MUX peut aussi générer des miniatures à partir de la vidéo.

      setUploadStage("Upload de la vidéo vers MUX...");
      // Exemple de placeholder pour l'ID d'asset MUX et l'ID de playback (à obtenir de MUX)
      // const muxUploadResponse = await uploadToMuxService(videoFile, (progress) => setUploadProgress(progress));
      // const muxAssetId = muxUploadResponse.assetId;
      // const muxPlaybackId = muxUploadResponse.playbackId; // ou un des playback IDs
      // let thumbnailUrlFromStorage = "";
      // if (thumbnailFile) { 
      //   // thumbnailUrlFromStorage = await uploadThumbnailToFirebaseStorage(thumbnailFile, user.uid);
      // }

      // POUR L'EXEMPLE, nous allons simuler la réponse de MUX et l'URL de la miniature
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simuler l'upload
      const muxAssetId = `mux_asset_${Date.now()}`;
      const muxPlaybackId = `mux_playback_${Date.now()}`;
      let thumbnailUrl = thumbnailPreviewUrl || ""; // Utiliser la preview si aucune miniature uploadée
      // Si vous avez uploadé la miniature séparément vers Firebase Storage par exemple:
      // if(thumbnailFile) { thumbnailUrl = "URL_DE_FIREBASE_STORAGE_POUR_MINIATURE";}

      setUploadProgress(90); // Simuler la fin de l'upload MUX
      setUploadStage("Enregistrement des métadonnées...");

      const videoType = values.type as ContentType;
      
      // --- ÉTAPE 3: Insérer les métadonnées dans Firestore ---
      const videoDocData: Omit<VideoFirestoreData, 'id'> = {
        userId: user.uid,
        title: values.title,
        description: values.description || '',
        muxAssetId: muxAssetId,       // ID de l'asset MUX
        muxPlaybackId: muxPlaybackId, // ID de playback MUX (pour le lecteur)
        thumbnailUrl: thumbnailUrl,     // URL de la miniature (MUX ou Firebase Storage)
        videoUrl: `https://stream.mux.com/${muxPlaybackId}.m3u8`, // URL de streaming MUX typique
        format: videoFormat,
        // Corrige le problème de type en convertissant 'teaser' en 'standard' si nécessaire
        type: videoType === 'teaser' ? 'standard' as ContentType : videoType,
        isPremium: ['premium', 'vip'].includes(values.type),
        tokenPrice: ['premium', 'vip'].includes(values.type) ? values.tokenPrice || 0 : 0,
        uploadedAt: serverTimestamp(),
        // Les restrictions sont maintenant des champs de haut niveau ou une map
        // restrictions: { tier: values.tier, sharingAllowed: values.sharingAllowed, downloadsAllowed: values.downloadsAllowed },
        // Plutôt les inclure directement si nécessaire ou dans un objet dédié comme avant
        // views, likes, etc., seront initialisés à 0 ou gérés par des triggers/fonctions
        views: 0,
        likes: 0,
      };

      const docRef = await addDoc(collection(db, "videos"), videoDocData);

      setUploadProgress(100);
      setUploadStage("Terminé !");
      
      return { id: docRef.id, ...videoDocData } as VideoFirestoreData;

    } catch (error: any) {
      const errorMessage = error.message || "Une erreur est survenue lors du processus d'upload.";
      console.error('Upload process error:', error);
      setUploadError(errorMessage);
      setUploadStage('Erreur');
      setIsUploading(false); // S'assurer de réinitialiser l'état d'upload en cas d'erreur
      throw error; // Projeter l'erreur pour que le composant parent puisse la gérer
    } finally {
      // setIsUploading(false); // Déjà géré dans le catch pour l'erreur, ou ici si succès
      if(uploadStage !== 'Erreur') setIsUploading(false); 
    }
  };

  return {
    videoFile, thumbnailFile, videoPreviewUrl, thumbnailPreviewUrl, videoFormat,
    isUploading, uploadProgress, uploadError, uploadStage,
    handleVideoChange, handleThumbnailChange, generateThumbnail, resetForm,
    uploadVideoAndSaveMetadata // Renommé depuis uploadToSupabase
  };
};

export default useVideoUpload;
