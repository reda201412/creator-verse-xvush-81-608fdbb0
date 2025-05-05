
import React from 'react';
import VideoUploader from '@/components/creator/VideoUploader';
import { VideoMetadata } from '@/components/creator/VideoUploader';

interface VideoHeaderProps {
  onUploadComplete: (metadata: VideoMetadata) => void;
}

const VideoHeader: React.FC<VideoHeaderProps> = ({ onUploadComplete }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-bold">Mes Vidéos</h1>
        <p className="text-muted-foreground">
          Gérez vos vidéos et suivez leurs performances
        </p>
      </div>

      <VideoUploader 
        onUploadComplete={onUploadComplete} 
        isCreator={true} 
      />
    </div>
  );
};

export default VideoHeader;
