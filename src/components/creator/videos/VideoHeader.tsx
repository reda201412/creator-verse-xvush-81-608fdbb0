import React from 'react';
import VideoUploader from '@/components/creator/VideoUploader';
import { useAuth } from '@/contexts/AuthContext';
import { VideoData } from '@/services/creatorService';

interface VideoHeaderProps {
  // Use the Supabase data type for onUploadComplete metadata
  onUploadComplete: (metadata?: VideoData | null) => void;
}

const VideoHeader: React.FC<VideoHeaderProps> = ({ onUploadComplete }) => {
  const { isCreator } = useAuth();
  console.log('VideoHeader rendu, isCreator =', isCreator);
  
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-bold">Mes Vidéos</h1>
        <p className="text-muted-foreground">
          Gérez vos vidéos et suivez leurs performances
        </p>
      </div>

      {isCreator && (
        // Pass the onUploadComplete handler to VideoUploader
        <VideoUploader 
          onUploadComplete={onUploadComplete} 
          isCreator={true} 
        />
      )}
    </div>
  );
};

export default VideoHeader;
