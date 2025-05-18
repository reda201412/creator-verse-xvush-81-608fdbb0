
import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { uploadVideoToMux, uploadThumbnail } from '@/services/muxService';
import { saveVideoMetadata, type VideoMetadata } from '@/services/videoService';

// Type pour l'utilisateur Firebase
type FirebaseUser = {
  uid: string;
  // Ajoutez d'autres propriétés utilisateur si nécessaire
};

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB
const ACCEPTED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm', 'video/x-matroska', 'video/x-msvideo', 'video/mpeg']; // MKV, AVI, MPEG

// Define Zod schema for form validation
const videoFormSchema = z.object({
  title: z.string().min(3, 'Le titre doit contenir au moins 3 caractères.'),
  description: z.string().optional(),
  type: z.enum(['standard', 'teaser', 'premium', 'vip']),
  isPremium: z.boolean().default(false),
  tokenPrice: z.number().min(0, 'Le prix doit être positif.').optional(),
  // Add other fields as needed based on VideoMetadata
});

export type VideoFormValues = z.infer<typeof videoFormSchema>;

// Define a type for the MUX direct upload response
interface MuxUploadResponse {
  id: string;
  url: string;
  // Add other relevant fields from MUX API if needed
}

type UploadStage = 'idle' | 'creating_upload' | 'uploading' | 'processing_metadata' | 'generating_thumbnail' | 'complete' | 'error';


const useVideoUpload = () => {
  const auth = useAuth();
  const user = auth?.user as unknown as FirebaseUser | undefined;
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(null);
  const videoFormat = useRef<'16:9' | '9:16' | '1:1' | 'other'>('other');
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadStage, setUploadStage] = useState<UploadStage>('idle');

  // Référence pour annuler l'upload si nécessaire
  const abortControllerRef = useRef<AbortController | null>(null);

  const form = useForm<VideoFormValues>({
    resolver: zodResolver(videoFormSchema),
    defaultValues: {
      title: '',
      description: '',
      type: 'standard',
      isPremium: false,
      tokenPrice: 0,
    },
  });

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'type') {
        form.setValue('isPremium', value.type === 'premium' || value.type === 'vip');
        if (value.type !== 'premium' && value.type !== 'vip') {
          form.setValue('tokenPrice', 0); // Reset token price if not premium/vip
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);


  const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setUploadError(`La taille du fichier dépasse la limite de ${MAX_FILE_SIZE / (1024*1024)}MB.`);
        toast.error("Fichier trop volumineux", { description: `La taille du fichier dépasse la limite de ${MAX_FILE_SIZE / (1024*1024)}MB.`});
        setVideoFile(null);
        setVideoPreviewUrl(null);
        return;
      }
      if (!ACCEPTED_VIDEO_TYPES.includes(file.type)) {
        setUploadError("Type de fichier vidéo non supporté.");
        toast.error("Format non supporté", { description: "Veuillez choisir un fichier MP4, MOV, WebM, MKV, AVI ou MPEG."});
        setVideoFile(null);
        setVideoPreviewUrl(null);
        return;
      }

      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreviewUrl(url);
      setUploadError(null);

      // Detect video format (aspect ratio)
      const videoElement = document.createElement('video');
      videoElement.src = url;
      videoElement.onloadedmetadata = () => {
        const aspectRatio = videoElement.videoWidth / videoElement.videoHeight;
        if (Math.abs(aspectRatio - 16/9) < 0.1) videoFormat.current = '16:9';
        else if (Math.abs(aspectRatio - 9/16) < 0.1) videoFormat.current = '9:16';
        else if (Math.abs(aspectRatio - 1/1) < 0.1) videoFormat.current = '1:1';
        else videoFormat.current = 'other';
      };
    }
  };

  const handleThumbnailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreviewUrl(URL.createObjectURL(file));
    }
  };

  const generateThumbnail = async () => {
    if (!videoFile || !videoPreviewUrl) return;
    setUploadStage('generating_thumbnail');
    const video = document.createElement('video');
    video.src = videoPreviewUrl;
    video.currentTime = 1; // Capture frame at 1 second

    video.onloadeddata = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(blob => {
          if (blob) {
            const thumbFile = new File([blob], 'thumbnail.jpg', { type: 'image/jpeg' });
            setThumbnailFile(thumbFile);
            setThumbnailPreviewUrl(URL.createObjectURL(thumbFile));
            toast.success("Miniature générée avec succès!");
          }
          setUploadStage('idle'); 
        }, 'image/jpeg');
      } else {
        setUploadStage('error');
        setUploadError("Impossible de générer la miniature (erreur canvas).");
      }
    };
    video.onerror = () => {
      setUploadStage('error');
      setUploadError("Erreur lors du chargement de la vidéo pour la miniature.");
      toast.error("Erreur de miniature", { description: "Impossible de charger la vidéo pour générer la miniature."});
    }
  };

  const resetForm = () => {
    setVideoFile(null);
    setThumbnailFile(null);
    if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
    if (thumbnailPreviewUrl) URL.revokeObjectURL(thumbnailPreviewUrl);
    setVideoPreviewUrl(null);
    setThumbnailPreviewUrl(null);
    form.reset();
    setIsUploading(false);
    setUploadProgress(0);
    setUploadError(null);
    videoFormat.current = 'other';
    
    // Annuler tout upload en cours
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    setUploadStage('idle');
  };

  const uploadVideoAndSaveMetadata = async (values: VideoFormValues): Promise<VideoMetadata | null> => {
    if (!videoFile || !user) {
      setUploadError("Fichier vidéo ou utilisateur manquant.");
      return null;
    }

    // Créer un nouvel AbortController pour cette requête
    const controller = new AbortController();
    abortControllerRef.current = controller;
    
    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);
    setUploadStage('creating_upload');

    try {
      // 1. Uploader la vidéo vers MUX avec support d'annulation
      setUploadStage('uploading');
      const muxResponse = await uploadVideoToMux(videoFile, controller.signal);
      
      // Vérifier si la requête a été annulée
      if (controller.signal.aborted) {
        return null;
      }
      
      // Mettre à jour la progression
      setUploadProgress(100);
      
      // 2. Uploader la miniature si elle existe
      let thumbnailUrl: string | undefined;
      if (thumbnailFile) {
        setUploadStage('generating_thumbnail');
        thumbnailUrl = await uploadThumbnail(thumbnailFile, user?.uid || '', { signal: controller.signal });
        
        // Vérifier si la requête a été annulée après l'upload de la miniature
        if (controller.signal.aborted) {
          return null;
        }
      }
      
      // Vérifier à nouveau si la requête a été annulée
      if (controller.signal.aborted) {
        return null;
      }
      
      // 3. Sauvegarder les métadonnées dans Neon DB
      setUploadStage('processing_metadata');
      const videoMetadata: Omit<VideoMetadata, 'id' | 'created_at' | 'updated_at'> = {
        user_id: user?.uid || '',
        title: values.title,
        description: values.description,
        type: values.type,
        is_premium: values.isPremium,
        token_price: values.isPremium ? values.tokenPrice : undefined,
        mux_asset_id: muxResponse.assetId,
        mux_playback_id: muxResponse.playbackId,
        mux_upload_id: muxResponse.uploadId,
        thumbnail_url: thumbnailUrl,
        status: 'processing', // MUX mettra à jour ce statut via le webhook
      };
      
      const savedMetadata = await saveVideoMetadata(videoMetadata);
      
      // Vérifier une dernière fois si la requête a été annulée
      if (controller.signal.aborted) {
        return null;
      }
      
      setUploadStage('complete');
      toast.success("Vidéo téléversée avec succès !", {
        description: "Votre vidéo est en cours de traitement et sera bientôt disponible."
      });
      
      return savedMetadata;
      
    } catch (error: any) {
      // Ne pas afficher d'erreur si la requête a été annulée
      if (error.name === 'AbortError') {
        console.log('Upload annulé par l\'utilisateur');
        return null;
      }
      
      console.error('Erreur lors du téléversement de la vidéo:', error);
      setUploadError(error.message || "Une erreur est survenue lors du téléversement de la vidéo.");
      setUploadStage('error');
      toast.error("Erreur de téléversement", { 
        description: error.message || "Une erreur est survenue lors du téléversement de la vidéo." 
      });
      return null;
    } finally {
      // Nettoyer l'AbortController
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
      setIsUploading(false);
    }
  };


  // Nettoyer les URLs d'objets blob lors du démontage du composant
  useEffect(() => {
    return () => {
      if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
      if (thumbnailPreviewUrl) URL.revokeObjectURL(thumbnailPreviewUrl);
    };
  }, [videoPreviewUrl, thumbnailPreviewUrl]);

  return {
    form,
    videoFile,
    thumbnailFile,
    videoPreviewUrl,
    thumbnailPreviewUrl,
    videoFormat: videoFormat.current,
    isUploading,
    uploadProgress,
    uploadError,
    uploadStage,
    handleVideoChange,
    handleThumbnailChange,
    generateThumbnail,
    resetForm,
    uploadVideoAndSaveMetadata,
    setUploadError,
  };
};

export default useVideoUpload;

