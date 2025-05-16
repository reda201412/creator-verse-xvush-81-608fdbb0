/**
 * Service de simulation pour les uploads vidéo
 * Cette solution temporaire permet de contourner les problèmes d'API et de CORS
 */

// Types pour les réponses simulées
export interface MockUploadResponse {
  uploadUrl: string;
  uploadId: string;
  assetId: string;
}

export interface MockVideoData {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  playbackId: string;
  duration: number;
  createdAt: string;
}

export const MockVideoService = {
  /**
   * Simuler la création d'une URL d'upload
   */
  createUploadUrl: async (): Promise<MockUploadResponse> => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Générer des identifiants uniques
    const uploadId = `mock_upload_${Date.now()}`;
    const assetId = `mock_asset_${Math.floor(Math.random() * 10000)}`;
    
    return {
      uploadUrl: 'https://mock-upload-url.com/upload',
      uploadId,
      assetId
    };
  },
  
  /**
   * Simuler l'upload d'une vidéo
   * Cette fonction est appelée par le composant d'upload
   */
  simulateVideoUpload: async (file: File, onProgress: (progress: number) => void): Promise<string> => {
    // Simuler un upload progressif
    const totalSteps = 10;
    for (let i = 1; i <= totalSteps; i++) {
      await new Promise(resolve => setTimeout(resolve, 300));
      onProgress(Math.floor((i / totalSteps) * 100));
    }
    
    // Générer un ID de lecture simulé
    const playbackId = `mock_playback_${Math.floor(Math.random() * 10000)}`;
    return playbackId;
  },
  
  /**
   * Créer une vidéo dans la base de données
   */
  createVideo: async (data: {
    title: string;
    description: string;
    thumbnailUrl: string;
    playbackId: string;
    assetId: string;
  }): Promise<MockVideoData> => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Créer une vidéo simulée
    const videoId = `video_${Date.now()}`;
    
    return {
      id: videoId,
      title: data.title,
      description: data.description,
      thumbnailUrl: data.thumbnailUrl,
      videoUrl: `https://stream.mux.com/${data.playbackId}/high.mp4`,
      playbackId: data.playbackId,
      duration: Math.floor(Math.random() * 300) + 30, // 30-330 secondes
      createdAt: new Date().toISOString()
    };
  }
};
