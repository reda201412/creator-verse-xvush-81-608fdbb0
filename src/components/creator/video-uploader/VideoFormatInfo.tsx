
import React from 'react';
import { Film } from 'lucide-react';

interface VideoFormatInfoProps {
  videoPreviewUrl: string | null;
  videoFormat: '16:9' | '9:16' | '1:1' | 'other';
}

const VideoFormatInfo: React.FC<VideoFormatInfoProps> = ({ 
  videoPreviewUrl, 
  videoFormat 
}) => {
  if (!videoPreviewUrl) return null;
  
  return (
    <div className="flex items-center gap-2 text-sm">
      <Film className="h-4 w-4 text-muted-foreground" />
      <span>Format détecté: {videoFormat}</span>
      {videoFormat === '9:16' && (
        <span className="text-primary font-semibold">
          (Format idéal pour Xtease)
        </span>
      )}
    </div>
  );
};

export default VideoFormatInfo;
