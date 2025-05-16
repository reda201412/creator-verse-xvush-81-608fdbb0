/**
 * Service pour communiquer directement avec l'API Mux
 * ATTENTION: Cette approche expose les clés d'API dans le frontend
 * À utiliser uniquement comme solution temporaire
 */

// Clés d'API Mux (à remplacer par des variables d'environnement dans une solution définitive)
const MUX_TOKEN_ID = '614f11e3-39f6-46ef-8104-680fda482a19';
const MUX_TOKEN_SECRET = 'TLmLKbeRUVf/zP4JYuU/uSKEle/xzowLpzR6vwFRvoSaMjud1UaQ4XCvezEA6bBSOglm8BUDsHr';

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
  createDirectUpload: async (): Promise<MuxDirectUploadResponse> => {
    try {
      // Encoder les identifiants en Base64 pour l'authentification Basic
      const authHeader = 'Basic ' + btoa(`${MUX_TOKEN_ID}:${MUX_TOKEN_SECRET}`);
      
      // Appeler directement l'API Mux
      const response = await fetch('https://api.mux.com/video/v1/uploads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader
        },
        body: JSON.stringify({
          cors_origin: window.location.origin,
          new_asset_settings: {
            playback_policy: 'public',
            mp4_support: 'standard'
          }
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Mux API error: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
      const data = await response.json();
      
      // Transformer la réponse Mux au format attendu par notre application
      return {
        uploadUrl: data.data.url,
        uploadId: data.data.id,
        assetId: null // Sera disponible après l'upload
      };
    } catch (error) {
      console.error('Error creating direct upload:', error);
      throw new Error(`Failed to create upload URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
};
