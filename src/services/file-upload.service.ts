
/**
 * Service pour gérer l'upload de fichiers
 * Dans une implémentation réelle, ce service pourrait utiliser Supabase Storage
 */

export interface FileUploadResponse {
  url: string;
  path: string;
  success: boolean;
  error?: string;
}

export const fileUploadService = {
  /**
   * Upload un fichier et retourne l'URL
   * Note: Dans une implémentation réelle, ceci utiliserait Supabase Storage
   */
  uploadFile: async (file: File, folder: string = 'avatars'): Promise<FileUploadResponse> => {
    return new Promise((resolve) => {
      // Simuler un délai réseau
      setTimeout(() => {
        // Créer un URL d'objet temporaire pour simuler un upload réussi
        // Dans une vraie implémentation, cela renverrait l'URL depuis Supabase Storage
        const objectUrl = URL.createObjectURL(file);
        
        console.log(`File upload simulated: ${file.name} to folder ${folder}`);
        
        resolve({
          url: objectUrl,
          path: `${folder}/${file.name}`,
          success: true
        });
      }, 1500);
    });
  },
  
  /**
   * Valide un fichier avant upload
   */
  validateFile: (file: File, options: {
    maxSizeMB?: number,
    allowedTypes?: string[]
  } = {}): { valid: boolean, error?: string } => {
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
  }
};
