
import React, { forwardRef } from 'react';
import { Video, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface VideoFileUploadProps {
  videoPreviewUrl: string | null;
  onVideoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveVideo: () => void;
}

export const VideoFileUpload = forwardRef<HTMLInputElement, VideoFileUploadProps>(
  ({ videoPreviewUrl, onVideoChange, onRemoveVideo }, ref) => {
    return (
      <div>
        <Label htmlFor="video">Fichier vidéo</Label>
        
        {!videoPreviewUrl ? (
          <div 
            className="mt-2 border-2 border-dashed border-primary/30 rounded-lg p-8 text-center cursor-pointer hover:bg-primary/5 transition-colors"
            onClick={() => (ref as React.RefObject<HTMLInputElement>)?.current?.click()}
          >
            <Video className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-sm font-medium">Cliquez pour sélectionner une vidéo</p>
            <p className="text-xs text-muted-foreground mt-1">
              MP4, MOV ou WebM. 1080p ou supérieur recommandé.
            </p>
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
              className="absolute top-2 right-2 h-8 w-8"
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
          onChange={onVideoChange} 
        />
      </div>
    );
  }
);

VideoFileUpload.displayName = 'VideoFileUpload';
