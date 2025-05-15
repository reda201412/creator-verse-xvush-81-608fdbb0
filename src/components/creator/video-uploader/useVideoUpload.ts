import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import * as UpChunk from '@mux/upchunk';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
// Import Supabase data type
import { VideoData } from '@/services/creatorService';
import { VideoService } from '@/services/videoService';
import API_ENDPOINTS from '@/config/api';
// Removed old VideoMetadata import:
// import { VideoMetadata } from '@/types/video';

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

type UploadStage = 'idle' | 'creating_upload' | 'uploading' | 'processing_metadata' | 'generating_thumbnail' | 'complete' | 'error';


const useVideoUpload = () => {
  const { user } = useAuth();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(null);
  const videoFormat = useRef<'16:9' | '9:16' | '1:1' | 'other'>('other');
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadStage, setUploadStage] = useState<UploadStage>('idle');

  const upchunkRef = useRef<UpChunk.UpChunk | null>(null);

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
    if (upchunkRef.current) {
      upchunkRef.current.abort(); // Abort ongoing upload if any
      upchunkRef.current = null;
    }
    setUploadStage('idle');
  };

  const uploadVideoAndSaveMetadata = async (values: VideoFormValues): Promise<VideoData | null> => {
    if (!videoFile || !user) {
      setUploadError("Fichier vidéo ou utilisateur manquant.");
      return null;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);
    setUploadStage('creating_upload');

    let thumbnailUrl: string | undefined = undefined;
    // 0. Upload du thumbnail sur Alibaba OSS si présent
    if (thumbnailFile) {
      try {
        const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            const base64 = (reader.result as string).split(',')[1];
            resolve(base64);
          };
          reader.onerror = error => reject(error);
        });
        const base64Data = await toBase64(thumbnailFile);
        const response = await fetch(API_ENDPOINTS.OSS.UPLOAD_THUMBNAIL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: thumbnailFile.name,
            data: base64Data
          })
        });

        if (!response.ok) {
          throw new Error('Erreur lors de l\'upload de la miniature');
        }

        const data = await response.json();
        thumbnailUrl = data.url;
      } catch (error) {
        console.error('Erreur lors de l\'upload de la miniature:', error);
        toast.error("Erreur de miniature", { description: "Impossible d'uploader la miniature sur OSS." });
        // Continue without thumbnail
      }
    }

    try {
      // 1. Create MUX Direct Upload URL via Vercel API
      const uploadData = await VideoService.createUploadUrl();
      if (!uploadData || !uploadData.url || !uploadData.id) {
        throw new Error("Impossible de préparer l'upload vidéo avec Mux.");
      }
      const muxUploadUrl = uploadData.url;
      // 2. Upload video file to MUX using UpChunk
      setUploadStage('uploading');
      return new Promise<VideoData | null>((resolve, reject) => {
        upchunkRef.current = UpChunk.createUpload({
          endpoint: muxUploadUrl,
          file: videoFile,
          chunkSize: 7680,
        });
        upchunkRef.current.on('progress', (progressEvent: { detail: number }) => {
          setUploadProgress(Math.floor(progressEvent.detail));
        });
        upchunkRef.current.on('success', async () => {
          console.log('Video uploaded to Mux successfully!');
          setIsUploading(false);
          setUploadStage('complete');
          // À migrer : appeler le backend pour enregistrer les métadonnées côté Firestore
          // Ici, on retourne un objet avec thumbnailUrl si upload réussi
          resolve({
            id: '',
            creatorId: user.uid,
            title: values.title,
            description: values.description,
            thumbnailUrl: thumbnailUrl,
            videoUrl: '',
            type: values.type,
            format: (videoFormat.current === '16:9' || videoFormat.current === '9:16' || videoFormat.current === '1:1') ? videoFormat.current : '16:9',
            isPremium: values.isPremium,
            tokenPrice: values.tokenPrice,
            restrictions: undefined,
            status: 'processing',
            errorDetails: undefined,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            muxUploadId: uploadData.id,
            muxAssetId: undefined,
            muxPlaybackId: undefined,
          });
        });
        upchunkRef.current.on('error', (errorEvent: { detail: any }) => {
          console.error('UpChunk upload error:', errorEvent.detail);
          setIsUploading(false);
          setUploadError(`Erreur lors du téléversement: ${errorEvent.detail?.message || 'Erreur UpChunk'}`);
          setUploadStage('error');
          toast.error("Erreur de téléversement", { description: errorEvent.detail?.message || 'Une erreur est survenue lors du téléversement.'});
          reject(new Error(errorEvent.detail?.message || 'Erreur UpChunk'));
        });
      });
    } catch (error: any) {
      console.error('General upload process error:', error);
      setIsUploading(false);
      setUploadError(error.message || "Une erreur générale est survenue lors de l'upload.");
      setUploadStage('error');
      toast.error("Erreur d'upload", { description: error.message || "Une erreur générale est survenue."});
      return null;
    }
  };


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

