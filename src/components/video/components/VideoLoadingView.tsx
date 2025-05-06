
import React from 'react';

const VideoLoadingView: React.FC = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
      <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
    </div>
  );
};

export default VideoLoadingView;
