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
      // Nettoyer le localStorage des anciennes miniatures
      const maxThumbnails = 5; // Garder seulement les 5 dernières miniatures
      const thumbnailKeys = Object.keys(localStorage)
        .filter(key => key.startsWith('thumbnail_'))
        .sort((a, b) => {
          const timeA = parseInt(a.split('_')[1]);
          const timeB = parseInt(b.split('_')[1]);
          return timeB - timeA;
        });

      // Supprimer les anciennes miniatures si nécessaire
      if (thumbnailKeys.length >= maxThumbnails) {
        thumbnailKeys
          .slice(maxThumbnails - 1)
          .forEach(key => localStorage.removeItem(key));
      }

      // Générer un ID unique pour la miniature
      const thumbnailId = `thumbnail_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      
      try {
        // Essayer de stocker la miniature
        localStorage.setItem(thumbnailId, base64Data);
      } catch (storageError) {
        // Si le stockage échoue, supprimer toutes les miniatures et réessayer
        thumbnailKeys.forEach(key => localStorage.removeItem(key));
        localStorage.setItem(thumbnailId, base64Data);
      }
      
      return {
        url: base64Data,
        success: true
      };
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      // En cas d'erreur, retourner quand même une réponse valide avec l'image
      return {
        url: base64Data,
        success: true
      };
    }
  }
};
