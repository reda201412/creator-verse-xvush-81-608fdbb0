
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useStories } from '@/hooks/use-stories';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Upload, X } from 'lucide-react';

interface StoryPublisherProps {
  onCancel: () => void;
}

const StoryPublisher: React.FC<StoryPublisherProps> = ({ onCancel }) => {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Access the useStories hook
  const { uploadStory } = useStories();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check if file is video or image
      if (!selectedFile.type.startsWith('video/') && !selectedFile.type.startsWith('image/')) {
        toast.error("Format non pris en charge", {
          description: "Veuillez sélectionner une image ou une vidéo"
        });
        return;
      }
      
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast.error("Fichier manquant", {
        description: "Veuillez sélectionner une image ou une vidéo pour votre story"
      });
      return;
    }
    
    setIsLoading(true);
    setProgress(0);
    
    try {
      // Use the uploadStory function from the useStories hook
      const result = await uploadStory({
        file,
        caption,
        onProgress: (percent) => setProgress(percent)
      });
      
      if (result) {
        toast.success("Story publiée avec succès !");
        onCancel(); // Close the publisher
      } else {
        toast.error("Échec de publication", {
          description: "Une erreur est survenue lors de la publication de votre story."
        });
      }
    } catch (error) {
      console.error("Error uploading story:", error);
      toast.error("Échec de publication", {
        description: "Une erreur est survenue lors de la publication de votre story."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFile = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
  };

  const isVideo = file?.type.startsWith('video/');

  return (
    <div className="bg-white rounded-lg p-4 shadow-lg max-w-md w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Créer une story</h2>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <form onSubmit={handleSubmit}>
        {!preview ? (
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => document.getElementById('story-file-input')?.click()}
          >
            <Upload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
            <p className="text-gray-500 mb-1">Cliquez pour sélectionner un fichier</p>
            <p className="text-xs text-gray-400">Images ou vidéos acceptées</p>
            <input 
              id="story-file-input"
              type="file" 
              accept="image/*, video/*" 
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        ) : (
          <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-4">
            {isVideo ? (
              <video 
                src={preview} 
                className="w-full h-64 object-contain" 
                controls 
              />
            ) : (
              <img 
                src={preview} 
                alt="Preview" 
                className="w-full h-64 object-contain" 
              />
            )}
            <Button 
              type="button"
              variant="destructive" 
              size="icon" 
              className="absolute top-2 right-2" 
              onClick={handleRemoveFile}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        <div className="space-y-4 mt-4">
          <div>
            <Label htmlFor="caption">Légende</Label>
            <Textarea 
              id="caption"
              placeholder="Ajouter une légende..." 
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="mt-1 resize-none"
              rows={3}
            />
          </div>
          
          {isLoading && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
          
          <div className="flex justify-end space-x-2">
            <Button 
              type="button"
              variant="outline" 
              onClick={onCancel}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button 
              type="submit"
              disabled={!file || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Publication...
                </>
              ) : 'Publier'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default StoryPublisher;
