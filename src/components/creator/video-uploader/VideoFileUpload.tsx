
import React, { forwardRef, useState } from 'react';
import { Video, X, UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface VideoFileUploadProps {
  videoPreviewUrl: string | null;
  onVideoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveVideo: () => void;
  className?: string;
}

export const VideoFileUpload = forwardRef<HTMLInputElement, VideoFileUploadProps>(
  ({ videoPreviewUrl, onVideoChange, onRemoveVideo, className }, ref) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Gestion des événements de drag & drop
    const handleDragEnter = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isDragging) setIsDragging(true);
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const dt = e.dataTransfer;
      const files = dt.files;

      if (files && files.length) {
        const file = files[0];
        if (file.type.startsWith('video/')) {
          const fileInput = (ref as React.RefObject<HTMLInputElement>)?.current;
          if (fileInput) {
            // Create a new FileList (not directly possible, so we use DataTransfer)
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            fileInput.files = dataTransfer.files;
            
            // Trigger the onChange event programmatically
            const event = new Event('change', { bubbles: true });
            fileInput.dispatchEvent(event);

            // Now call the provided onChange handler with a fabricated event
            // This is a bit of a hack since we can't directly create a ChangeEvent
            onVideoChange({
              target: fileInput,
              currentTarget: fileInput,
              preventDefault: () => {},
              stopPropagation: () => {},
            } as unknown as React.ChangeEvent<HTMLInputElement>);
          }
        }
      }
    };

    // Trigger file input click
    const triggerFileInput = () => {
      (ref as React.RefObject<HTMLInputElement>)?.current?.click();
    };
    
    return (
      <div className={cn("w-full transition-all duration-300", className)}>
        <Label htmlFor="video" className="mb-2 block">Fichier vidéo</Label>
        
        {!videoPreviewUrl ? (
          <div 
            className={cn(
              "mt-2 border-2 border-dashed rounded-lg p-4 md:p-8 text-center cursor-pointer transition-all duration-300",
              isDragging ? "border-primary bg-primary/5" : "border-primary/30 hover:bg-primary/5",
              isHovered && "border-primary"
            )}
            onClick={triggerFileInput}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center space-y-2 py-4">
              {isDragging ? (
                <UploadCloud className="h-10 w-10 text-primary animate-bounce" />
              ) : (
                <Video className="h-8 md:h-12 w-8 md:w-12 text-muted-foreground transition-transform group-hover:scale-110 duration-300" />
              )}
              <p className="text-sm font-medium">
                {isDragging ? "Déposez la vidéo ici" : "Cliquez pour sélectionner une vidéo"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                MP4, MOV ou WebM. 1080p ou supérieur recommandé.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-2 relative rounded-lg overflow-hidden bg-black aspect-video">
            <video 
              src={videoPreviewUrl} 
              className="w-full h-full object-contain"
              controls
            />
            <Button 
              size="icon"
              variant="destructive"
              className="absolute top-2 right-2 h-8 w-8 opacity-80 hover:opacity-100 transition-opacity"
              onClick={onRemoveVideo}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        <Input 
          id="video" 
          ref={ref}
          type="file" 
          accept="video/*" 
          className="hidden"
          onChange={(e) => {
            setIsLoading(true);
            onVideoChange(e);
            setTimeout(() => {
              setIsLoading(false);
            }, 300);
          }} 
        />

        {isLoading && (
          <div className="mt-2 flex items-center space-x-2 text-xs text-muted-foreground">
            <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span>Chargement de la vidéo...</span>
          </div>
        )}
      </div>
    );
  }
);

VideoFileUpload.displayName = 'VideoFileUpload';
