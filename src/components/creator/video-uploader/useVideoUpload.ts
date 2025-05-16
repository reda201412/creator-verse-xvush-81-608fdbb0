import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { auth } from '@/lib/firebase';
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

const MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 500MB
const MAX_THUMBNAIL_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm', 'video/x-matroska', 'video/x-msvideo', 'video/mpeg']; // MKV, AVI, MPEG
const ACCEPTED_THUMBNAIL_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_UPLOAD_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

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

type UploadStage = 'idle' | 'creating_upload' | 'uploading' | 'retrying' | 'processing_metadata' | 'generating_thumbnail' | 'complete' | 'error';

interface UploadProgress {
  stage: UploadStage;
  progress: number;
  currentChunk: number;
  totalChunks: number;
  uploadSpeed: number;
  timeRemaining: number;
}


const useVideoUpload = () => {
  const { user } = useAuth();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(null);
  const videoFormat = useRef<'16:9' | '9:16' | '1:1' | 'other'>('other');
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    stage: 'idle',
    progress: 0,
    currentChunk: 0,
    totalChunks: 0,
    uploadSpeed: 0,
    timeRemaining: 0
  });
  const [uploadError, setUploadError] = useState<string | null>(null);


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
      if (file.size > MAX_VIDEO_SIZE) {
        setUploadError(`La taille du fichier dépasse la limite de ${MAX_VIDEO_SIZE / (1024*1024)}MB.`);
        toast.error("Fichier trop volumineux", { description: `La taille du fichier dépasse la limite de ${MAX_VIDEO_SIZE / (1024*1024)}MB.`});
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
      if (file.size > MAX_THUMBNAIL_SIZE) {
        toast.error("Miniature trop volumineuse", { 
          description: `La taille de l'image dépasse la limite de ${MAX_THUMBNAIL_SIZE / (1024*1024)}MB.`
        });
        return;
      }
      if (!ACCEPTED_THUMBNAIL_TYPES.includes(file.type)) {
        toast.error("Format non supporté", { 
          description: "La miniature doit être au format JPEG, PNG ou WebP."
        });
        return;
      }

      // Compress the thumbnail if it's too large
      if (file.size > 1024 * 1024) { // If larger than 1MB
        compressImage(file).then(compressedFile => {
          setThumbnailFile(compressedFile);
          setThumbnailPreviewUrl(URL.createObjectURL(compressedFile));
        }).catch(error => {
          console.error('Error compressing thumbnail:', error);
          setThumbnailFile(file);
          setThumbnailPreviewUrl(URL.createObjectURL(file));
        });
      } else {
        setThumbnailFile(file);
        setThumbnailPreviewUrl(URL.createObjectURL(file));
      }
    }
  };

  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        const maxDim = 1920; // Max dimension

        if (width > height && width > maxDim) {
          height = (height * maxDim) / width;
          width = maxDim;
        } else if (height > maxDim) {
          width = (width * maxDim) / height;
          height = maxDim;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Could not compress image'));
              return;
            }
            resolve(new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            }));
          },
          'image/jpeg',
          0.8 // Quality
        );
      };
      img.onerror = () => reject(new Error('Could not load image'));
    });
  };

  const generateThumbnail = async () => {
    if (!videoFile || !videoPreviewUrl) return;
    setUploadProgress(prev => ({ ...prev, stage: 'generating_thumbnail' }));
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
          setUploadProgress(prev => ({ ...prev, stage: 'idle' }));
        }, 'image/jpeg');
      } else {
        setUploadProgress(prev => ({ ...prev, stage: 'error' }));
        setUploadError("Impossible de générer la miniature (erreur canvas).");
      }
    };
    video.onerror = () => {
      setUploadProgress(prev => ({ ...prev, stage: 'error' }));
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
    setUploadProgress({
      stage: 'idle',
      progress: 0,
      currentChunk: 0,
      totalChunks: 0,
      uploadSpeed: 0,
      timeRemaining: 0
    });
    setUploadError(null);
    videoFormat.current = 'other';
    if (upchunkRef.current) {
      upchunkRef.current.abort(); // Abort ongoing upload if any
      upchunkRef.current = null;
    }
    setUploadProgress(prev => ({ ...prev, stage: 'idle' }));
  };

  const uploadThumbnailWithRetry = async (file: File, retryCount = 0): Promise<string> => {
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

      const base64Data = await toBase64(file);
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        throw new Error('Non authentifié');
      }

      const response = await fetch(API_ENDPOINTS.OSS.UPLOAD_THUMBNAIL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          filename: file.name,
          data: base64Data
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'upload de la miniature');
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      if (retryCount < MAX_UPLOAD_RETRIES) {
        console.log(`Retry thumbnail upload attempt ${retryCount + 1}/${MAX_UPLOAD_RETRIES}`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return uploadThumbnailWithRetry(file, retryCount + 1);
      }
      throw error;
    }
  };

  const uploadVideoAndSaveMetadata = async (values: VideoFormValues): Promise<VideoData | null> => {
    if (!videoFile || !user) {
      setUploadError("Fichier vidéo ou utilisateur manquant.");
      return null;
    }

    setIsUploading(true);
    setUploadProgress({
      stage: 'creating_upload',
      progress: 0,
      currentChunk: 0,
      totalChunks: 0,
      uploadSpeed: 0,
      timeRemaining: 0
    });
    setUploadError(null);

    let thumbnailUrl: string | undefined = undefined;
    // 0. Upload du thumbnail sur Alibaba OSS si présent
    if (thumbnailFile) {
      try {
        thumbnailUrl = await uploadThumbnailWithRetry(thumbnailFile);
        toast.success("Miniature uploadée avec succès");
      } catch (error) {
        console.error('Erreur lors de l\'upload de la miniature:', error);
        toast.error("Erreur de miniature", { 
          description: "Impossible d'uploader la miniature sur OSS. Réessayez plus tard." 
        });
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
      // 2. Upload video file to MUX using UpChunk with retry logic
      setUploadProgress(prev => ({ ...prev, stage: 'uploading' }));
      let retryCount = 0;
      let lastProgress = 0;
      let startTime = Date.now();
      let uploadedBytes = 0;

      const calculateProgress = (progress: number) => {
        const currentTime = Date.now();
        const timeElapsed = (currentTime - startTime) / 1000; // in seconds
        const progressDiff = progress - lastProgress;
        const bytesUploaded = (progressDiff / 100) * videoFile.size;
        uploadedBytes += bytesUploaded;

        const uploadSpeed = uploadedBytes / timeElapsed; // bytes per second
        const remainingBytes = videoFile.size - uploadedBytes;
        const timeRemaining = remainingBytes / uploadSpeed;

        const totalChunks = Math.ceil(videoFile.size / 7680);
        const currentChunk = Math.ceil((progress / 100) * totalChunks);

        setUploadProgress({
          stage: 'uploading',
          progress,
          currentChunk,
          totalChunks,
          uploadSpeed,
          timeRemaining
        });

        lastProgress = progress;
      };

      const createUploadWithRetry = async (): Promise<VideoData | null> => {
        try {
          return await new Promise<VideoData | null>((resolve, reject) => {
            upchunkRef.current = UpChunk.createUpload({
              endpoint: muxUploadUrl,
              file: videoFile,
              chunkSize: 7680,
            });

            upchunkRef.current.on('progress', (progressEvent: { detail: number }) => {
              calculateProgress(Math.floor(progressEvent.detail));
            });

            upchunkRef.current.on('success', async () => {
              console.log('Video uploaded to Mux successfully!');
              setIsUploading(false);
              setUploadProgress(prev => ({ ...prev, stage: 'complete' }));
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

            upchunkRef.current.on('error', async (errorEvent: { detail: any }) => {
              if (retryCount < MAX_UPLOAD_RETRIES) {
                retryCount++;
                setUploadProgress(prev => ({ ...prev, stage: 'retrying' }));
                console.log(`Retry upload attempt ${retryCount}/${MAX_UPLOAD_RETRIES}`);
                toast.info(`Tentative de reprise ${retryCount}/${MAX_UPLOAD_RETRIES}`, {
                  description: "L'upload va reprendre automatiquement..."
                });
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
                const result = await createUploadWithRetry();
                resolve(result);
                return;
              }
              console.error('UpChunk upload error:', errorEvent.detail);
              setIsUploading(false);
              setUploadError(`Erreur lors du téléversement: ${errorEvent.detail?.message || 'Erreur UpChunk'}`);
              setUploadProgress(prev => ({ ...prev, stage: 'error' }));
              toast.error("Erreur de téléversement", { 
                description: errorEvent.detail?.message || 'Une erreur est survenue lors du téléversement.'
              });
              reject(new Error(errorEvent.detail?.message || 'Erreur UpChunk'));
            });
          });
        } catch (error) {
          if (retryCount < MAX_UPLOAD_RETRIES) {
            retryCount++;
            setUploadProgress(prev => ({ ...prev, stage: 'retrying' }));
            console.log(`Retry upload attempt ${retryCount}/${MAX_UPLOAD_RETRIES}`);
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
            return createUploadWithRetry();
          }
          throw error;
        }
      };

      return createUploadWithRetry();
    } catch (error: any) {
      console.error('General upload process error:', error);
      setIsUploading(false);
      setUploadError(error.message || "Une erreur générale est survenue lors de l'upload.");
      setUploadProgress(prev => ({ ...prev, stage: 'error' }));
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
    uploadProgress: uploadProgress.progress,
    uploadSpeed: uploadProgress.uploadSpeed,
    timeRemaining: uploadProgress.timeRemaining,
    currentChunk: uploadProgress.currentChunk,
    totalChunks: uploadProgress.totalChunks,
    uploadError,
    uploadStage: uploadProgress.stage,
    handleVideoChange,
    handleThumbnailChange,
    generateThumbnail,
    resetForm,
    uploadVideoAndSaveMetadata,
    setUploadError,
  };
};

export default useVideoUpload;

