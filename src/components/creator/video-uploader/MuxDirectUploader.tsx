import React from 'react';
import MuxUploader, { MuxUploaderStatus, MuxUploaderDrop } from '@mux/mux-uploader-react'; // Corrected import
import { useAuth } from '@/contexts/AuthContext';
import { auth } from '@/integrations/firebase/firebase';

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
  // const { user } = useAuth(); -- REMOVE THIS LINE
  // Removed local status state and setStatus as MuxUploaderDrop handles status display
  // const [status, setStatus] = React.useState<typeof MuxUploaderStatus | null>(null);

  const getUploadUrl = async () => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }
    try {
      // Get the Firebase ID token from the user object
      const token = await user.getIdToken();
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}`, // Ensure this URL is correct
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
        // Correctly type the event and access the detail property
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
        // Removed onStatusChange prop
        onChange={(files) => {
          if (files && files[0]) {
            setVideoFile(files[0]);
          } else {
            setVideoFile(null);
          }
        }}
      >
        {/* MuxUploaderDrop children will automatically react to the status */}
        <MuxUploaderDrop>
          {/* Conditional rendering based on status is handled by MuxUploaderDrop */}
          <p>Glissez-déposez votre vidéo ou cliquez pour sélectionner un fichier</p>
        </MuxUploaderDrop>
      </MuxUploader>
    </div>
  );
};

export default MuxDirectUploader;
