// Importer le client Prisma
import { PrismaClient } from '@prisma/client';

// Initialiser le client Prisma
const prisma = new PrismaClient();

// Types pour les mÃ©tadonnÃ©es de la vidÃ©o
export type VideoStatus = 'processing' | 'ready' | 'error';
export type VideoType = 'standard' | 'teaser' | 'premium' | 'vip';

// Type pour le prix en tokens
type TokenPrice = number | string | null;

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

export const saveVideoMetadata = async (metadata: VideoMetadata): Promise<VideoMetadata> => {
  try {
    // VÃ©rifier si c'est une mise Ã  jour ou une crÃ©ation
    let video;
    if (metadata.id) {
      // Mise Ã  jour d'une vidÃ©o existante
      video = await prisma.video.update({
        where: { id: metadata.id },
        data: {
          title: metadata.title,
          description: metadata.description || null,
          mux_asset_id: metadata.mux_asset_id,
          mux_playback_id: metadata.mux_playback_id || null,
          mux_upload_id: metadata.mux_upload_id || null,
          thumbnail_url: metadata.thumbnail_url || null,
          duration: metadata.duration || null,
          aspect_ratio: metadata.aspect_ratio || null,
          status: metadata.status,
          type: metadata.type,
          is_premium: metadata.is_premium || false,
          token_price: metadata.token_price ? Number(metadata.token_price) : null,
        },
      });
    } else {
      // CrÃ©ation d'une nouvelle vidÃ©o
      video = await prisma.video.create({
        data: {
          user_id: metadata.user_id,
          title: metadata.title,
          description: metadata.description || null,
          mux_asset_id: metadata.mux_asset_id,
          mux_playback_id: metadata.mux_playback_id || null,
          mux_upload_id: metadata.mux_upload_id || null,
          thumbnail_url: metadata.thumbnail_url || null,
          duration: metadata.duration || null,
          aspect_ratio: metadata.aspect_ratio || null,
          status: metadata.status,
          type: metadata.type,
          is_premium: metadata.is_premium || false,
          token_price: metadata.token_price ? Number(metadata.token_price) : null,
        },
      });
    }
    return video as unknown as VideoMetadata;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des mÃ©tadonnÃ©es de la vidÃ©o:', error);
    throw new Error(`Ã‰chec de la sauvegarde des mÃ©tadonnÃ©es: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
};

export const updateVideoMetadata = async (id: number, updates: Partial<VideoMetadata>): Promise<VideoMetadata> => {
  try {
    const data = { ...updates };
    delete data.id; // Ne pas mettre Ã  jour l'ID
    
    const video = await prisma.video.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date(),
      },
    });
    
    return video as unknown as VideoMetadata;
  } catch (error) {
    console.error('Erreur lors de la mise Ã  jour des mÃ©tadonnÃ©es de la vidÃ©o:', error);
    throw new Error(`Ã‰chec de la mise Ã  jour des mÃ©tadonnÃ©es: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
};

export const getVideosByUserId = async (userId: string): Promise<VideoMetadata[]> => {
  try {
    const videos = await prisma.video.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });
    
    return videos.map(video => ({
      ...video,
      created_at: video.created_at || undefined,
      updated_at: video.updated_at || undefined,
    }));
  } catch (error) {
    console.error('Erreur lors de la rÃ©cupÃ©ration des vidÃ©os:', error);
    throw new Error('Ã‰chec de la rÃ©cupÃ©ration des vidÃ©os');
  }
};

export const getVideoById = async (id: number): Promise<VideoMetadata | null> => {
  try {
    const video = await prisma.video.findUnique({
      where: { id },
    });
    
    if (!video) return null;
    
    return {
      ...video,
      created_at: video.created_at || undefined,
      updated_at: video.updated_at || undefined,
    } as VideoMetadata;
  } catch (error) {
    console.error('Erreur lors de la rÃ©cupÃ©ration de la vidÃ©o:', error);
    throw new Error('Ã‰chec de la rÃ©cupÃ©ration de la vidÃ©o');
  }
};

export const deleteVideo = async (id: number): Promise<void> => {
  try {
    await prisma.video.delete({
      where: { id },
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la vidÃ©o:', error);
    throw new Error('Ã‰chec de la suppression de la vidÃ©o');
  }
};

// Fonction utilitaire pour vÃ©rifier la connexion Ã  la base de donnÃ©es
export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    // Essayer d'exÃ©cuter une requÃªte simple pour vÃ©rifier la connexion
    await prisma.$queryRaw`SELECT 1`;
    console.log('âœ… Connexion Ã  la base de donnÃ©es Ã©tablie avec succÃ¨s');
    return true;
  } catch (error) {
    console.error('âŒ Ã‰chec de la connexion Ã  la base de donnÃ©es:', error);
    return false;
  }
};

// Fonction utilitaire pour crÃ©er la table si elle n'existe pas
export const ensureVideosTableExists = async (): Promise<void> => {
  try {
    // Avec Prisma, la crÃ©ation des tables est gÃ©rÃ©e par les migrations
    // Cette fonction sert maintenant principalement Ã  vÃ©rifier que la table existe
    const tableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'videos'
      );
    `;
    
    if (tableExists && tableExists[0]?.exists === false) {
      console.warn('âš ï¸ La table videos n\'existe pas. ExÃ©cutez les migrations Prisma.');
    } else {
      console.log('âœ… Table videos vÃ©rifiÃ©e avec succÃ¨s');
    }
  } catch (error) {
    console.error('âŒ Erreur lors de la vÃ©rification de la table videos:', error);
    throw error;
  }
};
