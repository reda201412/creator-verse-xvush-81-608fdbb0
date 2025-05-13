
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Camera, Image, X, Upload } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Story } from '@/types/stories';

// Define interfaces for this component
interface StoryFilter {
  id: string;
  name: string;
  preview: string;
}

interface StoryPublisherProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (data: FormData) => Promise<Story | null>;
}

const StoryPublisher: React.FC<StoryPublisherProps> = ({
  isOpen,
  onClose,
  onPublish
}) => {
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string>('');
  const [caption, setCaption] = useState('');
  const [isVideo, setIsVideo] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('none');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const availableFilters: StoryFilter[] = [
    { id: 'none', name: 'Original', preview: '' },
    { id: 'sepia', name: 'Sépia', preview: 'sepia(100%)' },
    { id: 'grayscale', name: 'Noir & Blanc', preview: 'grayscale(100%)' },
    { id: 'saturate', name: 'Vif', preview: 'saturate(200%)' },
    { id: 'contrast', name: 'Contraste', preview: 'contrast(150%)' },
  ];
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file type
      const isVideoFile = file.type.startsWith('video/');
      setIsVideo(isVideoFile);
      
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size exceeds 10MB limit');
        return;
      }
      
      setMediaFile(file);
      setMediaPreview(URL.createObjectURL(file));
    }
  };
  
  const handleGenerate = async () => {
    if (!mediaFile) {
      toast.error('Please select a media file first');
      return;
    }
    
    if (caption.length > 100) {
      toast.error('Caption must be less than 100 characters');
      return;
    }
    
    // Prepare form data
    const formData = new FormData();
    formData.append('mediaFile', mediaFile);
    if (thumbnailFile) formData.append('thumbnailFile', thumbnailFile);
    formData.append('caption', caption);
    formData.append('filter', selectedFilter);
    
    setIsUploading(true);
    
    try {
      await onPublish(formData);
      resetForm();
    } catch (error) {
      console.error('Error publishing story:', error);
      toast.error('Failed to publish story');
    } finally {
      setIsUploading(false);
    }
  };
  
  const resetForm = () => {
    setMediaFile(null);
    setThumbnailFile(null);
    setMediaPreview('');
    setCaption('');
    setIsVideo(false);
    setSelectedFilter('none');
  };
  
  const handleClose = () => {
    resetForm();
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Créer une Story</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {!mediaPreview ? (
            <div 
              className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Cliquez pour sélectionner une image ou vidéo
              </p>
              <Button variant="outline" size="sm" className="mt-4">
                <Upload className="h-4 w-4 mr-2" /> Choisir un fichier
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*,video/*"
                className="hidden"
              />
            </div>
          ) : (
            <div className="relative">
              <div className="aspect-[9/16] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                {isVideo ? (
                  <video 
                    src={mediaPreview} 
                    className="w-full h-full object-cover"
                    controls
                    style={{ filter: availableFilters.find(f => f.id === selectedFilter)?.preview || 'none' }}
                  />
                ) : (
                  <img 
                    src={mediaPreview} 
                    alt="Story preview" 
                    className="w-full h-full object-cover"
                    style={{ filter: availableFilters.find(f => f.id === selectedFilter)?.preview || 'none' }}
                  />
                )}
              </div>
              <Button
                size="icon"
                variant="destructive"
                className="absolute top-2 right-2 h-8 w-8 rounded-full"
                onClick={() => {
                  setMediaFile(null);
                  setMediaPreview('');
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          {mediaPreview && (
            <>
              <div className="space-y-2">
                <Label htmlFor="caption">Caption</Label>
                <Textarea
                  id="caption"
                  placeholder="Add a caption..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  maxLength={100}
                />
                <div className="text-xs text-right text-muted-foreground">
                  {caption.length}/100
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Filtre</Label>
                <div className="grid grid-cols-5 gap-2">
                  {availableFilters.map((filter) => (
                    <div
                      key={filter.id}
                      className={`cursor-pointer rounded-md p-1 border-2 ${
                        selectedFilter === filter.id 
                          ? 'border-primary' 
                          : 'border-transparent'
                      }`}
                      onClick={() => setSelectedFilter(filter.id)}
                    >
                      <div className="aspect-square rounded overflow-hidden bg-gray-100 dark:bg-gray-800">
                        {mediaPreview ? (
                          <div 
                            className="w-full h-full bg-cover bg-center"
                            style={{ 
                              backgroundImage: `url(${mediaPreview})`,
                              filter: filter.preview || 'none'
                            }}
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <Image className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-center mt-1 truncate">{filter.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleGenerate} 
            disabled={!mediaFile || isUploading}
          >
            {isUploading ? (
              <>
                <span className="mr-2">
                  <svg 
                    className="animate-spin h-4 w-4 text-white" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                  >
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    ></circle>
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </span>
                Publication...
              </>
            ) : (
              'Publier'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StoryPublisher;
