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
      
      const responseText = await response.text();
      let responseData;

      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        console.error('Server response:', responseText);
        throw new Error('Invalid JSON response from server');
      }

      if (!response.ok) {
        throw new Error(responseData.error || `Server error: ${response.status}`);
      }

      if (!responseData.uploadUrl || !responseData.uploadId) {
        console.error('Invalid response format:', responseData);
        throw new Error('Invalid response format from server');
      }

      return responseData;
    } catch (error) {
      console.error('Error creating direct upload:', error);
      throw error;
    }
  }
};
