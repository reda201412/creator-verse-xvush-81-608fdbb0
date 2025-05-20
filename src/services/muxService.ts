
import Mux from '@mux/mux-node';
import { getAuthHeaders } from '@/server/middleware/auth';

// Configuration de Mux
const MUX_TOKEN_ID = import.meta.env.VITE_MUX_TOKEN_ID;
const MUX_TOKEN_SECRET = import.meta.env.VITE_MUX_TOKEN_SECRET;

// Initialiser le client Mux si les informations d'authentification sont disponibles
let muxClient: Mux | null = null;

if (MUX_TOKEN_ID && MUX_TOKEN_SECRET) {
  muxClient = new Mux({
    tokenId: MUX_TOKEN_ID,
    tokenSecret: MUX_TOKEN_SECRET
  });
}

export interface VideoUploadResponse {
  id: string;
  url: string;
  assetId: string;
  status: string;
  uploadId?: string;
  playbackId?: string;
}

/**
 * Crée un upload direct vers Mux
 */
export const createDirectUpload = async (): Promise<VideoUploadResponse> => {
  if (!muxClient) {
    throw new Error('Mux client not initialized. Check your environment variables.');
  }

  try {
    const upload = await muxClient.video.uploads.create({
      cors_origin: window.location.origin,
      new_asset_settings: {
        playback_policy: ['public'],
        mp4_support: 'standard',
      },
    });

    return {
      id: upload.id,
      url: upload.url || '',
      assetId: upload.asset_id || '',
      status: upload.status || 'created',
      uploadId: upload.id,
    };
  } catch (error) {
    console.error('Error creating Mux direct upload:', error);
    throw error;
  }
};

/**
 * Récupère les informations d'un asset Mux
 */
export const getAsset = async (assetId: string) => {
  if (!muxClient) {
    throw new Error('Mux client not initialized. Check your environment variables.');
  }

  try {
    const asset = await muxClient.video.assets.retrieve(assetId);
    return asset;
  } catch (error) {
    console.error('Error retrieving Mux asset:', error);
    throw error;
  }
};

/**
 * Upload une vidéo à Mux via un upload direct
 */
export const uploadVideoToMux = async (file: File): Promise<VideoUploadResponse> => {
  // Étape 1: Obtenir une URL d'upload direct de Mux
  const uploadResponse = await fetch('/api/mux/upload', {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!uploadResponse.ok) {
    const error = await uploadResponse.json();
    throw new Error(error.message || 'Failed to create upload');
  }

  const { url, id, assetId } = await uploadResponse.json();

  // Étape 2: Télécharger le fichier directement à l'URL fournie par Mux
  await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
    },
    body: file,
  });

  // Étape 3: Retourner les informations d'upload
  return {
    id,
    url,
    assetId,
    status: 'upload_complete',
    uploadId: id,
  };
};

/**
 * Met à jour le statut d'une vidéo
 */
export const updateVideoStatus = async (assetId: string, status: string, metadata: any = {}) => {
  // Implementée côté serveur uniquement, ce stub est pour compatibilité
  console.log(`Mise à jour du statut pour ${assetId} vers ${status}`, metadata);
  return { success: true };
};

/**
 * Upload thumbnail to Firebase Storage
 */
export const uploadThumbnail = async (file: File, userId: string): Promise<string> => {
  try {
    // Here we would typically upload to Firebase Storage
    // For now, just return a mock URL
    return URL.createObjectURL(file);
  } catch (error) {
    console.error('Error uploading thumbnail:', error);
    throw error;
  }
};
