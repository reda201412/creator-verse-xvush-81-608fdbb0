
/**
 * Service pour gérer l'upload de fichiers
 * Avec optimisations pour la fluidité et la performance
 */

export interface FileUploadResponse {
  url: string;
  path: string;
  success: boolean;
  error?: string;
}

export interface FileValidationOptions {
  maxSizeMB?: number;
  allowedTypes?: string[];
}

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

// Cache pour les URLs d'objets créés
const objectUrlCache = new Map<string, string>();

export const fileUploadService = {
  /**
   * Upload un fichier et retourne l'URL
   * Version optimisée avec gestion de cache et mise à l'échelle
   */
  uploadFile: async (file: File, folder: string = 'avatars'): Promise<FileUploadResponse> => {
    return new Promise((resolve) => {
      // Simuler un délai réseau
      setTimeout(() => {
        // Vérifier si nous avons déjà un URL pour ce fichier dans le cache
        const fileId = `${file.name}-${file.size}-${file.lastModified}`;
        
        // Utiliser l'URL du cache s'il existe déjà pour ce fichier
        // Ceci améliore les performances sur les retentatives
        let objectUrl = objectUrlCache.get(fileId);
        
        if (!objectUrl) {
          objectUrl = URL.createObjectURL(file);
          objectUrlCache.set(fileId, objectUrl);
          
          // Nettoyer automatiquement l'URL après un certain temps pour éviter les fuites de mémoire
          setTimeout(() => {
            URL.revokeObjectURL(objectUrl as string);
            objectUrlCache.delete(fileId);
          }, 5 * 60 * 1000); // 5 minutes
        }
        
        console.log(`File upload simulated: ${file.name} to folder ${folder}`);
        
        resolve({
          url: objectUrl,
          path: `${folder}/${file.name}`,
          success: true
        });
      }, 800); // Délai réduit pour améliorer l'expérience utilisateur
    });
  },
  
  /**
   * Valide un fichier avant upload avec gestion de cache de validation
   */
  validateFile: (file: File, options: FileValidationOptions = {}): FileValidationResult => {
    const {
      maxSizeMB = 5,
      allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    } = options;
    
    // Vérifier le type de fichier
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `Type de fichier non supporté. Types acceptés: ${allowedTypes.join(', ')}`
      };
    }
    
    // Vérifier la taille
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return {
        valid: false,
        error: `Le fichier est trop volumineux. Taille maximum: ${maxSizeMB}MB`
      };
    }
    
    return { valid: true };
  },

  /**
   * Prévisualiser une image avec redimensionnement optimal
   * Cette fonction aide à optimiser l'affichage des prévisualisations
   */
  createOptimizedPreview: (file: File, maxWidth: number = 800): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        // Si ce n'est pas une image, renvoyer simplement l'URL direct
        const url = URL.createObjectURL(file);
        resolve(url);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Ne pas redimensionner si l'image est plus petite que maxWidth
          if (img.width <= maxWidth) {
            resolve(e.target?.result as string);
            return;
          }

          const canvas = document.createElement('canvas');
          const ratio = maxWidth / img.width;
          canvas.width = maxWidth;
          canvas.height = img.height * ratio;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(e.target?.result as string);
            return;
          }
          
          // Dessiner l'image redimensionnée
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // Convertir en URL de données optimisée
          const optimizedUrl = canvas.toDataURL(file.type, 0.85); // Compression légère
          resolve(optimizedUrl);
        };
        
        img.onerror = () => {
          // En cas d'erreur, utiliser l'URL direct
          const url = URL.createObjectURL(file);
          resolve(url);
        };
        
        img.src = e.target?.result as string;
      };
      
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  /**
   * Libérer les ressources d'une URL d'objet
   */
  revokeObjectUrl: (url: string): void => {
    // Supprimer du cache
    for (const [key, cachedUrl] of objectUrlCache.entries()) {
      if (cachedUrl === url) {
        objectUrlCache.delete(key);
        break;
      }
    }
    
    // Révoquer l'URL
    URL.revokeObjectURL(url);
  }
};
