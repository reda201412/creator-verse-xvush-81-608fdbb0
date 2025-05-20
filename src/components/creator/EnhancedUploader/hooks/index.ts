
export const useVideoUpload = () => {
  // Implémentation simplifiée
  return {
    upload: async (file: File) => {
      console.log('Uploading file:', file.name);
      // Logique d'upload à implémenter selon besoins
      return { id: 'temp-id', url: 'temp-url' };
    }
  };
};

export const useVideoProcessing = () => {
  return {
    process: async (videoId: string) => {
      console.log('Processing video:', videoId);
      // Logique de traitement à implémenter selon besoins
      return { status: 'processing' };
    }
  };
};
