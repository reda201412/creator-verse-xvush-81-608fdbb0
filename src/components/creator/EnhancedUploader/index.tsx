import React from 'react';
import { VideoUploader } from './VideoUploader';
import { UploaderProvider } from './UploaderContext';

export const EnhancedVideoUploader: React.FC<{
  onUploadComplete: (metadata?: any) => void;
  isCreator: boolean;
  className?: string;
}> = (props) => {
  return (
    <UploaderProvider>
      <VideoUploader {...props} />
    </UploaderProvider>
  );
};

export * from './types';
export * from './hooks';
export * from './utils';
