
import React, { forwardRef } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ThumbnailUploadProps {
  thumbnailPreviewUrl: string | null;
  onThumbnailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveThumbnail: () => void;
  onGenerateThumbnail: () => void;
  showGenerateButton: boolean;
}

export const ThumbnailUpload = forwardRef<HTMLInputElement, ThumbnailUploadProps>(
  ({ thumbnailPreviewUrl, onThumbnailChange, onRemoveThumbnail, onGenerateThumbnail, showGenerateButton }, ref) => {
    return (
      <div>
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
      </div>
    );
  }
);

ThumbnailUpload.displayName = 'ThumbnailUpload';
