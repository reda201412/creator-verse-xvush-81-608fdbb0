
import React, { useCallback, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { useUploader } from './UploaderContext';
import { toast } from 'sonner';

export const UploadDropzone: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { setFile, setThumbnail, setStage, setError } = useUploader();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB
  const ACCEPTED_VIDEO_TYPES = [
    'video/mp4', 
    'video/quicktime', 
    'video/webm', 
    'video/x-matroska', 
    'video/x-msvideo', 
    'video/mpeg'
  ];

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `La taille du fichier dépasse la limite de ${MAX_FILE_SIZE / (1024 * 1024)}MB.`
      };
    }
    
    if (!ACCEPTED_VIDEO_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: "Type de fichier vidéo non supporté. Veuillez choisir un fichier MP4, MOV, WebM, MKV, AVI ou MPEG."
      };
    }
    
    return { valid: true };
  };

  const processFile = useCallback((file: File) => {
    const validation = validateFile(file);
    if (!validation.valid) {
      setError(validation.error);
      toast.error("Erreur de fichier", { description: validation.error });
      return false;
    }

    setFile(file);
    
    // Generate thumbnail preview
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      // Set canvas dimensions
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Capture a frame at 25% of the video duration
      video.currentTime = video.duration * 0.25;
    };
    
    video.onseeked = () => {
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const thumbnailFile = new File([blob], 'thumbnail.png', { type: 'image/png' });
            setThumbnail(thumbnailFile);
          }
        }, 'image/png');
      }
      
      // After setting the file and thumbnail, proceed with upload
      onComplete();
    };
    
    video.src = URL.createObjectURL(file);
    
    return true;
  }, [setFile, setThumbnail, setError, onComplete]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setIsDragging(false);
    if (acceptedFiles.length > 0) {
      processFile(acceptedFiles[0]);
    }
  }, [processFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
    accept: {
      'video/*': ['.mp4', '.mov', '.webm', '.mkv', '.avi', '.mpeg']
    },
    maxFiles: 1,
    multiple: false,
    noClick: true,
    noKeyboard: true
  });

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <div 
      {...getRootProps()} 
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        isDragging ? 'border-primary bg-primary/10' : 'border-muted-foreground/25'
      }`}
    >
      <input 
        {...getInputProps()} 
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileInput}
        className="hidden"
      />
      
      <div className="space-y-4">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-8 w-8 text-primary" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
            />
          </svg>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium">
            {isDragActive ? 'Déposez votre vidéo ici' : 'Glissez et déposez votre vidéo'}
          </h3>
          <p className="text-sm text-muted-foreground">
            ou cliquez pour sélectionner un fichier
          </p>
          <p className="text-xs text-muted-foreground">
            MP4, WebM, MOV, MKV, AVI ou MPEG (max. 500MB)
          </p>
        </div>
        
        <Button 
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="mt-4"
        >
          Sélectionner une vidéo
        </Button>
      </div>
    </div>
  );
};
