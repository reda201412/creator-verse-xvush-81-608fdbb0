import React from 'react';
import { MuxUploader, MuxUploaderStatus, MuxUploaderDrop } from '@mux/mux-uploader-react';
import { useAuth } from '@/contexts/AuthContext'; // Assuming you have an auth context

interface MuxDirectUploaderProps {
  onUploadStart?: () => void;
  onSuccess?: (uploadId: string) => void; // Changed to only pass uploadId
  onError?: (error: any) => void;
  setVideoFile: (file: File | null) => void;
}

const MuxDirectUploader: React.FC<MuxDirectUploaderProps> = ({
  onUploadStart,
  onSuccess,
  onError,
  setVideoFile,
}) => {
  const { user, getToken } = useAuth(); // Or however you get your Supabase JWT
  const [status, setStatus] = React.useState<MuxUploaderStatus | null>(null);

  const getUploadUrl = async () => {
    if (!user) {
      throw new Error('User not authenticated');
    }
    try {
      const token = await getToken(); // Get the Supabase JWT
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/create-mux-upload`, // Ensure this URL is correct
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          // You might send video metadata here if your Edge Function expects it
          // body: JSON.stringify({ title: "Initial Title" }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to get Mux upload URL');
      }
      const data = await response.json();
      return data.uploadUrl; // The 'uploadUrl' from your create-mux-upload function
    } catch (error) {
      console.error('Error getting Mux upload URL:', error);
      throw error;
    }
  };

  return (
    <div>
      <MuxUploader
        endpoint={getUploadUrl} // Pass the function that returns the Mux upload URL
        onUploadStart={() => {
          onUploadStart && onUploadStart();
        }}
        onSuccess={(details) => {
          console.log('Mux upload initiated successfully:', details);
          // 'details' here is from Mux after the upload *starts* successfully with Mux.
          // The full processing and asset creation is asynchronous via webhooks.
          // You might get `uploadId` here from Mux's client-side events.
          // @ts-ignore Mux types might not be perfectly aligned
          const uploadId = details.id;
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
        onStatusChange={(status) => {
          console.log('Mux Uploader Status:', status);
          setStatus(status);
        }}
        onChange={(files) => {
          if (files && files[0]) {
            setVideoFile(files[0]);
          } else {
            setVideoFile(null);
          }
        }}
      >
        <MuxUploaderDrop>
          {status === MuxUploaderStatus.READY && (
            <p>Glissez-déposez votre vidéo ou cliquez pour sélectionner un fichier</p>
          )}

          {status === MuxUploaderStatus.UPLOADING && (
            <p>Téléchargement en cours...</p>
          )}

          {status === MuxUploaderStatus.PROCESSING && (
            <p>Traitement de la vidéo...</p>
          )}

          {status === MuxUploaderStatus.ERRORED && <p>Une erreur s'est produite</p>}
        </MuxUploaderDrop>
      </MuxUploader>
    </div>
  );
};

export default MuxDirectUploader;
