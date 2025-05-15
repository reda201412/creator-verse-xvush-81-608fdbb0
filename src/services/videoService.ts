import { auth } from '@/lib/firebase';
import API_ENDPOINTS from '@/config/api';

// Types pour les réponses d'API
export interface MuxUploadResponse {
  id: string;
  url: string;
}

export interface MuxAsset {
  id: string;
  playback_ids: { id: string; policy: string }[];
  status: string;
  created_at: string;
  duration: number;
  aspect_ratio: string;
  mp4_support: string;
}

/**
 * Service pour gérer les interactions avec les API vidéo (Mux via Vercel)
 */
export const VideoService = {
  /**
   * Créer une URL d'upload Mux pour téléverser une vidéo directement
   */
  createUploadUrl: async (): Promise<MuxUploadResponse> => {
    // Obtenir le token ID pour l'authentification
    const token = await auth.currentUser?.getIdToken();
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(API_ENDPOINTS.MUX.CREATE_UPLOAD, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erreur lors de la création de l\'URL d\'upload');
    }

    return response.json();
  },

  /**
   * Récupérer les informations d'un asset vidéo
   */
  getAsset: async (assetId: string): Promise<MuxAsset> => {
    const token = await auth.currentUser?.getIdToken();
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(`${API_ENDPOINTS.MUX.ASSETS}?id=${assetId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erreur lors de la récupération de l\'asset');
    }

    return response.json();
  },

  /**
   * Récupérer une liste paginée d'assets
   */
  listAssets: async (page = 1, limit = 10): Promise<{ data: MuxAsset[], total: number }> => {
    const token = await auth.currentUser?.getIdToken();
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(`${API_ENDPOINTS.MUX.ASSETS}?page=${page}&limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erreur lors de la récupération des assets');
    }

    return response.json();
  },

  /**
   * Supprimer un asset
   */
  deleteAsset: async (assetId: string): Promise<{ deleted: boolean, id: string }> => {
    const token = await auth.currentUser?.getIdToken();
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(`${API_ENDPOINTS.MUX.ASSETS}?id=${assetId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erreur lors de la suppression de l\'asset');
    }

    return response.json();
  },

  /**
   * Construire l'URL de lecture d'une vidéo
   */
  getPlaybackUrl: (playbackId: string, format = 'mp4'): string => {
    if (format === 'mp4') {
      return `https://stream.mux.com/${playbackId}.mp4`;
    }
    return `https://stream.mux.com/${playbackId}.m3u8`;
  },

  /**
   * Construire l'URL d'une image miniature
   */
  getThumbnailUrl: (playbackId: string, time = 0, width = 640): string => {
    return `https://image.mux.com/${playbackId}/thumbnail.jpg?time=${time}&width=${width}`;
  }
}; 