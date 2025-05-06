
import React from 'react';
import { Button } from '@/components/ui/button';

interface VideoErrorViewProps {
  message: string;
  onRetry: () => void;
}

const VideoErrorView: React.FC<VideoErrorViewProps> = ({ message, onRetry }) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white text-center p-4">
      <div className="text-lg font-semibold mb-2">Oups, une erreur est survenue</div>
      <p className="text-sm text-gray-300 mb-4">{message}</p>
      <Button variant="outline" onClick={onRetry}>
        Réessayer
      </Button>
    </div>
  );
};

export default VideoErrorView;
