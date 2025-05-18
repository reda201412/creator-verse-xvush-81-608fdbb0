import * as UpChunk from '@mux/upchunk';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { storage } from '@/firebase/config';

declare global {
  interface Window {
    UpChunk: any;
  }
}

// Configuration MUX
// Utilisation du proxy d'API pour éviter les problèmes CORS
const MUX_UPLOAD_ENDPOINT = '/api/mux/upload';

// Vérification des variables d'environnement
if (!import.meta.env.VITE_MUX_TOKEN_ID || !import.meta.env.VITE_MUX_TOKEN_SECRET) {
  console.warn('VITE_MUX_TOKEN_ID et VITE_MUX_TOKEN_SECRET doivent être définis dans .env');
}

// Types
export interface VideoUploadResponse {
  uploadId: string;
  assetId: string;
  playbackId: string;
  status: string;
}

export const uploadVideoToMux = (file: File, signal?: AbortSignal): Promise<VideoUploadResponse> => {
  return new Promise((resolve, reject) => {
    if (!MUX_UPLOAD_ENDPOINT) {
      return reject(new Error('MUX_UPLOAD_ENDPOINT is not defined'));
    }

    // Créer un nouvel upload avec UpChunk
    // Configuration de l'authentification via le proxy
    const upload = UpChunk.createUpload({
      endpoint: MUX_UPLOAD_ENDPOINT,
      file,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Variables pour stocker les informations de la réponse
    let uploadId: string | null = null;
    let assetId: string | null = null;
    let playbackId: string | null = null;

    // Gestion des événements
    upload.on('success', (event: any) => {
      try {
        const data = typeof event.detail === 'string' ? JSON.parse(event.detail) : event.detail;
        uploadId = data.id;
        assetId = data.asset_id;
        playbackId = data.playback_ids?.[0]?.id || '';

        resolve({
          uploadId: uploadId || '',
          assetId: assetId || '',
          playbackId: playbackId || '',
          status: 'processing',
        });
      } catch (error) {
        console.error('Error parsing upload success response:', error);
        reject(new Error('Failed to process upload response'));
      }
    });

    upload.on('error', (error: any) => {
      console.error('Upload error:', error);
      reject(new Error(error.detail?.message || 'Upload failed'));
    });

    upload.on('progress', (event: any) => {
      const progress = event.detail;
      console.log(`Upload progress: ${Math.round(progress * 100)}%`);
    });

    // Gestion de l'annulation
    if (signal) {
      const onAbort = () => {
        upload.pause();
        reject(new DOMException('Upload aborted', 'AbortError'));
      };

      if (signal.aborted) {
        onAbort();
      } else {
        signal.addEventListener('abort', onAbort, { once: true });
      }
    }
  });
};

interface UploadThumbnailOptions {
  signal?: AbortSignal;
}

export const uploadThumbnail = async (file: File, userId: string, options?: UploadThumbnailOptions): Promise<string> => {
  const signal = options?.signal;
  try {
    const storageRef = ref(storage, `thumbnails/${userId}/${uuidv4()}-${file.name}`);
    
    // Créer un AbortController pour cette requête
    const controller = new AbortController();
    
    // Si un signal est fourni, écouter l'événement d'annulation
    if (signal) {
      if (signal.aborted) {
        controller.abort();
      } else {
        const abortListener = () => controller.abort();
        signal.addEventListener('abort', abortListener, { once: true });
      }
    }
    
    try {
      // Uploader le fichier avec support d'annulation
      const snapshot = await uploadBytes(storageRef, file, {
        // @ts-ignore - La propriété signal n'est pas encore dans les types
        signal: controller.signal
      });
      
      // Récupérer l'URL de téléchargement
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } finally {
      // Nettoyer l'écouteur d'événement si nécessaire
      if (signal) {
        // Pas besoin de removeEventListener car on utilise { once: true }
      }
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Upload de la miniature annulé');
      throw error;
    }
    console.error('Erreur lors de l\'upload de la miniature:', error);
    throw error;
  }
};

export const getVideoStatus = async (assetId: string): Promise<string> => {
  console.warn('getVideoStatus: Cette fonction nécessite une implémentation côté serveur');
  return 'processing';
};
