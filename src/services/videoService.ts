// Types pour les métadonnées de la vidéo
export type VideoStatus = 'pending' | 'processing' | 'ready' | 'error';

export interface VideoMetadata {
  id: number;
  userId: string;
  user_id?: string; // Pour la rétrocompatibilité
  title: string;
  description: string | null;
  assetId: string | null;
  mux_asset_id?: string | null; // Pour la rétrocompatibilité
  uploadId: string | null;
  mux_upload_id?: string | null; // Pour la rétrocompatibilité
  playbackId: string | null;
  mux_playback_id?: string | null; // Pour la rétrocompatibilité
  status: VideoStatus;
  duration: number | null;
  aspectRatio: string | null;
  aspect_ratio?: string | null; // Pour la rétrocompatibilité
  thumbnailUrl: string | null;
  thumbnail_url?: string | null; // Pour la rétrocompatibilité
  videoUrl: string | null;
  video_url?: string | null; // Pour la rétrocompatibilité
  isPublished: boolean;
  isPremium: boolean;
  is_premium?: boolean; // Pour la rétrocompatibilité
  price: number | null;
  token_price?: number | null; // Pour la rétrocompatibilité
  viewCount: number;
  view_count?: number; // Pour la rétrocompatibilité
  likeCount: number;
  like_count?: number; // Pour la rétrocompatibilité
  commentCount: number;
  comment_count?: number; // Pour la rétrocompatibilité
  type?: string; // Type de vidéo (standard, teaser, premium, vip)
  format?: {
    duration?: number;
    width?: number;
    height?: number;
    aspect_ratio?: string;
    [key: string]: unknown;
  };
  error_details?: Record<string, unknown>; // Détails d'erreur éventuels
  createdAt: Date | string;
  updatedAt: Date | string;
  metadata?: Record<string, unknown> | null;
}

export interface CreateVideoInput {
  userId: string;
  title: string;
  description?: string;
  assetId?: string;
  uploadId?: string;
  playbackId?: string;
  status?: VideoStatus;
  duration?: number;
  aspectRatio?: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  isPublished?: boolean;
  isPremium?: boolean;
  price?: number;
  type?: string; // Add type for video categorization
}

export interface UpdateVideoInput {
  title?: string;
  description?: string | null;
  status?: VideoStatus;
  duration?: number | null;
  aspectRatio?: string | null;
  thumbnailUrl?: string | null;
  videoUrl?: string | null;
  isPublished?: boolean;
  isPremium?: boolean;
  price?: number | null;
  type?: string;
  tokenPrice?: number;
  metadata?: Record<string, unknown> | null;
}

const API_BASE_URL = '/api/videos';

/**
 * Enregistre les métadonnées d'une vidéo
 */
export const saveVideoMetadata = async (data: CreateVideoInput): Promise<VideoMetadata> => {
  try {
    // Modifié: POST directement vers /api/videos au lieu de /api/videos/metadata
    const response = await fetch(`${API_BASE_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement des métadonnées de la vidéo:', error);
    throw new Error(`Échec de l'enregistrement des métadonnées: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
};

/**
 * Crée une nouvelle vidéo
 * @deprecated Utilisez saveVideoMetadata à la place
 */
export const createVideo = async (data: CreateVideoInput): Promise<VideoMetadata> => {
  console.warn('La fonction createVideo est dépréciée. Utilisez saveVideoMetadata à la place.');
  return saveVideoMetadata(data);
};

/**
 * Met à jour une vidéo existante
 */
export const updateVideo = async (id: number, updates: UpdateVideoInput): Promise<VideoMetadata> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la vidéo:', error);
    throw new Error(`Échec de la mise à jour de la vidéo: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
};

/**
 * Récupère toutes les vidéos d'un utilisateur
 */
export const getVideosByUserId = async (userId: string): Promise<VideoMetadata[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}?userId=${userId}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la récupération des vidéos:', error);
    throw new Error(`Échec de la récupération des vidéos: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
};

/**
 * Récupère une vidéo par son ID
 */
export const getVideoById = async (id: number): Promise<VideoMetadata | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    
    if (response.status === 404) {
      return null;
    }
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la récupération de la vidéo:', error);
    throw new Error(`Échec de la récupération de la vidéo: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
};

/**
 * Supprime une vidéo par son ID
 */
export const deleteVideo = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Erreur lors de la suppression de la vidéo:', error);
    throw new Error(`Échec de la suppression de la vidéo: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
};

/**
 * Met à jour le statut d'une vidéo
 */
export const updateVideoStatus = async (id: number, status: VideoStatus, metadata?: Partial<VideoMetadata>): Promise<VideoMetadata> => {
  return updateVideo(id, { status, ...metadata });
};

/**
 * Incrémente le compteur de vues d'une vidéo
 */
export const incrementViewCount = async (id: number): Promise<VideoMetadata> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}/views`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erreur lors de l\'incrémentation du compteur de vues:', error);
    throw new Error(`Échec de l'incrémentation du compteur de vues: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
};

/**
 * Vérifie la connexion à l'API
 * Note: Cette fonction est simplifiée car la gestion de la base de données
 * est maintenant gérée côté serveur uniquement
 */
export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch(API_BASE_URL, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('Échec de la connexion à l\'API:', error);
    return false;
  }
};

/**
 * Vérifie que l'API est fonctionnelle
 * Note: Cette fonction remplace l'ancienne vérification de table
 */
export const ensureVideosTableExists = async (): Promise<void> => {
  try {
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      console.warn('⚠️ Impossible de se connecter à l\'API');
    } else {
      console.log('✅ Connexion à l\'API établie avec succès');
    }
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'API:', error);
    throw error;
  }
};
