
import React, { useState } from 'react';
import MuxUploader, { MuxUploaderDrop } from '@mux/mux-uploader-react';
import { useAuth } from '@/contexts/AuthContext';
import { auth } from '@/integrations/firebase/firebase';
import { toast } from 'sonner';

// Define the expected structure of the success event detail from MuxUploader
interface MuxSuccessEventDetail {
  id: string; // The upload ID
  url?: string;
  assetId?: string;
  // Include other properties if they are part of the success event detail
}

interface MuxDirectUploaderProps {
  onUploadStart?: () => void;
  onSuccess?: (uploadId: string) => void;
  onError?: (error: any) => void;
  setVideoFile: (file: File | null) => void;
}

const MuxDirectUploader: React.FC<MuxDirectUploaderProps> = ({
  onUploadStart,
  onSuccess,
  onError,
  setVideoFile,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const getUploadUrl = async () => {
    setIsLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error("Veuillez vous connecter pour téléverser des vidéos");
        throw new Error('User not authenticated');
      }
      
      // Get the Firebase ID token from the user object
      const token = await user.getIdToken();
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/create-mux-upload`, // Make sure the endpoint is correct
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to get Mux upload URL');
      }
      const data = await response.json();
      setIsLoading(false);
      return data.uploadUrl; // The 'uploadUrl' from our edge function
    } catch (error) {
      console.error('Error getting Mux upload URL:', error);
      setIsLoading(false);
      onError && onError(error);
      throw error;
    }
  };

  return (
    <div className="w-full">
      {isLoading && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2 text-sm text-muted-foreground">Préparation de l'upload...</span>
        </div>
      )}
      <MuxUploader
        endpoint={getUploadUrl}
        onUploadStart={() => {
          setIsLoading(false);
          onUploadStart && onUploadStart();
        }}
        onSuccess={(event: CustomEvent<MuxSuccessEventDetail>) => {
          console.log('Mux upload initiated successfully:', event.detail);
          const uploadId = event.detail?.id; // Access id from the detail property
          if (onSuccess && uploadId) {
            onSuccess(uploadId);
          }
        }}
        onError={(error) => {
          console.error('Mux uploader error:', error);
          if (onError) {
            onError(error);
          }
        }}
        onChange={(files) => {
          if (files && files[0]) {
            setVideoFile(files[0]);
          } else {
            setVideoFile(null);
          }
        }}
      >
        {/* Fix the ReactNode issue by not passing a function as a child but rendering directly */}
        <MuxUploaderDrop>
          {({ isDragActive }) => (
            <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${isDragActive ? 'border-primary bg-primary/5' : 'border-border'}`}>
              <div className="flex flex-col items-center justify-center space-y-2 py-4">
                <div className="text-3xl mb-2">📤</div>
                <p className="text-sm font-medium">
                  {isDragActive ? "Déposez la vidéo ici" : "Glissez-déposez votre vidéo ou cliquez pour sélectionner un fichier"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  MP4, MOV ou WebM. 1080p ou supérieur recommandé.
                </p>
              </div>
            </div>
          )}
        </MuxUploaderDrop>
      </MuxUploader>
    </div>
  );
};

export default MuxDirectUploader;
