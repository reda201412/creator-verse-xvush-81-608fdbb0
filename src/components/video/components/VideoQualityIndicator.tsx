
import React from 'react';

interface VideoQualityIndicatorProps {
  quality: string;
  show: boolean;
}

const VideoQualityIndicator: React.FC<VideoQualityIndicatorProps> = ({ quality, show }) => {
  if (!show) return null;
  
  return (
    <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
      {quality}
    </div>
  );
};

export default VideoQualityIndicator;
