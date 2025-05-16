/**
 * Service pour gérer l'upload des miniatures
 * Solution temporaire pour contourner les problèmes d'API
 */

// Type pour la réponse de l'API
export interface ThumbnailUploadResponse {
  url: string;
  success: boolean;
}

export const ThumbnailService = {
  /**
   * Télécharger une miniature en base64 et retourner l'URL
   * Cette fonction simule un téléchargement réussi en générant une URL locale
   */
  uploadThumbnail: async (base64Data: string): Promise<ThumbnailUploadResponse> => {
    try {
      // Simuler un délai d'upload
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Générer un ID unique pour la miniature
      const thumbnailId = `thumbnail_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      
      // Stocker temporairement l'image en base64 dans le localStorage
      // Note: Ceci est une solution temporaire, pas idéale pour la production
      localStorage.setItem(`thumbnail_${thumbnailId}`, base64Data);
      
      // Retourner une URL "factice" qui pointe vers l'image en base64
      // Dans une vraie implémentation, cela serait une URL vers un service de stockage
      return {
        url: base64Data, // Utiliser directement le base64 comme URL
        success: true
      };
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      throw new Error(`Failed to upload thumbnail: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
};
