/**
 * Service pour communiquer avec l'API Mux via notre API route
 */

// Type pour la réponse de l'API Mux
export interface MuxDirectUploadResponse {
  uploadUrl: string;
  uploadId: string;
  assetId: string | null;
}

export const DirectMuxService = {
  /**
   * Créer une URL d'upload direct vers Mux
   */
  createDirectUpload: async (token: string): Promise<MuxDirectUploadResponse> => {
    try {
      // Appeler notre API route
      const response = await fetch('/api/mux/direct-upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create upload URL');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating direct upload:', error);
      throw new Error(`Failed to create upload URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
};
