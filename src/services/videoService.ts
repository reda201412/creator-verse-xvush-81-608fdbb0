// Types pour les métadonnées de la vidéo
export type VideoStatus = 'processing' | 'ready' | 'error';
export type VideoType = 'standard' | 'teaser' | 'premium' | 'vip';

export interface VideoMetadata {
  id?: number;
  user_id: string;
  title: string;
  description?: string | null;
  mux_asset_id: string;
  mux_playback_id?: string | null;
  mux_upload_id?: string | null;
  thumbnail_url?: string | null;
  duration?: number | null;
  aspect_ratio?: string | null;
  status: VideoStatus;
  type: VideoType;
  is_premium: boolean;
  token_price?: number | null;
  created_at?: Date;
  updated_at?: Date;
}

const API_BASE_URL = '/api/videos';

/**
 * Enregistre ou met à jour les métadonnées d'une vidéo
 */
export const saveVideoMetadata = async (metadata: VideoMetadata): Promise<VideoMetadata> => {
  try {
    const method = metadata.id ? 'PUT' : 'POST';
    const url = metadata.id ? `${API_BASE_URL}/${metadata.id}` : API_BASE_URL;
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metadata),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des métadonnées de la vidéo:', error);
    throw new Error(`Échec de la sauvegarde des métadonnées: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
};

/**
 * Met à jour les métadonnées d'une vidéo existante
 */
export const updateVideoMetadata = async (id: number, updates: Partial<VideoMetadata>): Promise<VideoMetadata> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        ...updates,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la mise à jour des métadonnées de la vidéo:', error);
    throw new Error(`Échec de la mise à jour des métadonnées: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
};

/**
 * Récupère toutes les vidéos d'un utilisateur
 */
export const getVideosByUserId = async (userId: string): Promise<VideoMetadata[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}?userId=${userId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const videos = await response.json();
    return videos.map((video: any) => ({
      ...video,
      created_at: video.created_at ? new Date(video.created_at) : undefined,
      updated_at: video.updated_at ? new Date(video.updated_at) : undefined,
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des vidéos:', error);
    throw new Error('Échec de la récupération des vidéos');
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
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const video = await response.json();
    
    return {
      ...video,
      created_at: video.created_at ? new Date(video.created_at) : undefined,
      updated_at: video.updated_at ? new Date(video.updated_at) : undefined,
    };
  } catch (error) {
    console.error('Erreur lors de la récupération de la vidéo:', error);
    throw new Error('Échec de la récupération de la vidéo');
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
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Erreur lors de la suppression de la vidéo:', error);
    throw new Error('Échec de la suppression de la vidéo');
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
