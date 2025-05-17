
import React, { forwardRef } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import DynamicThumbnailGenerator from './DynamicThumbnailGenerator';

interface ThumbnailUploadProps {
  thumbnailPreviewUrl: string | null;
  videoPreviewUrl?: string | null; // Made optional with ? instead of required
  onThumbnailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveThumbnail: () => void;
  onGenerateThumbnail: () => void;
  onThumbnailGenerated?: (file: File) => void;
  showGenerateButton: boolean;
}

export const ThumbnailUpload = forwardRef<HTMLInputElement, ThumbnailUploadProps>(
  ({ 
    thumbnailPreviewUrl, 
    videoPreviewUrl,
    onThumbnailChange, 
    onRemoveThumbnail, 
    onGenerateThumbnail, 
    onThumbnailGenerated,
    showGenerateButton 
  }, ref) => {
    // Handler for dynamic thumbnail generator
    const handleThumbnailGenerated = (file: File) => {
      if (onThumbnailGenerated) {
        onThumbnailGenerated(file);
      }
    };
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="thumbnail">Miniature</Label>
          {showGenerateButton && !thumbnailPreviewUrl && (
            <Button 
              variant="outline" 
              size="sm" 
              type="button"
              onClick={onGenerateThumbnail}
            >
              Générer automatiquement
            </Button>
          )}
        </div>
        
        {!thumbnailPreviewUrl ? (
          <div 
            className="mt-2 border-2 border-dashed border-primary/30 rounded-lg p-4 text-center cursor-pointer hover:bg-primary/5 transition-colors"
            onClick={() => (ref as React.RefObject<HTMLInputElement>)?.current?.click()}
          >
            <p className="text-sm">Sélectionner une image de miniature</p>
          </div>
        ) : (
          <div className="mt-2 relative rounded-lg overflow-hidden aspect-video">
            <img 
              src={thumbnailPreviewUrl} 
              className="w-full h-full object-cover"
              alt="Thumbnail preview"
            />
            <Button 
              size="icon"
              variant="destructive"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={onRemoveThumbnail}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        <Input 
          id="thumbnail" 
          ref={ref}
          type="file" 
          accept="image/*" 
          className="hidden"
          onChange={onThumbnailChange} 
        />
        
        {/* Dynamic Thumbnail Generator */}
        {videoPreviewUrl && !thumbnailPreviewUrl && (
          <DynamicThumbnailGenerator 
            videoUrl={videoPreviewUrl}
            onThumbnailGenerated={handleThumbnailGenerated}
            className="mt-4"
          />
        )}
      </div>
    );
  }
);

ThumbnailUpload.displayName = 'ThumbnailUpload';
