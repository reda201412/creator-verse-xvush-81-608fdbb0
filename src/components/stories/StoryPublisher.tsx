import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import useStories from '@/hooks/use-stories';
import { useAuth } from '@/contexts/AuthContext';
import { PlusCircle, Loader2 } from 'lucide-react';

const StoryPublisher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const { uploadStory } = useStories();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };
  
  const handleCaptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCaption(e.target.value);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier à uploader.",
        variant: "destructive"
      });
      return;
    }
    
    setUploading(true);
    
    try {
      const result = await uploadStory(file, caption);
      if (result.success) {
        toast({
          title: "Succès",
          description: "Votre story a été uploadée avec succès."
        });
        setIsOpen(false);
        setFile(null);
        setCaption('');
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Impossible d'uploader la story.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error uploading story:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'upload de la story.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <Button variant="ghost" size="sm" className="flex gap-2 items-center" onClick={() => setIsOpen(true)}>
      <PlusCircle className="w-4 h-4" />
      Add Story
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload une Story</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="hidden"
              id="story-upload"
            />
            <label htmlFor="story-upload" className="bg-secondary text-secondary-foreground rounded-md p-2 text-center cursor-pointer hover:bg-secondary/80 transition">
              {file ? `Fichier sélectionné: ${file.name}` : "Sélectionner un fichier"}
            </label>
            
            <textarea
              placeholder="Ajouter une légende..."
              value={caption}
              onChange={handleCaptionChange}
              className="border rounded-md p-2 resize-none"
            />
            
            <Button type="submit" disabled={uploading} className="w-full">
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload Story"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </Button>
  );
};

export default StoryPublisher;
