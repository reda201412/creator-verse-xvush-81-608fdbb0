import React, { useCallback, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useUploader } from './UploaderContext';
import { UploadDropzone } from './UploadDropzone';
import { UploadProgress } from './UploadProgress';
import { MetadataForm } from './MetadataForm';
import { ShieldStatus } from './ShieldStatus';
import { toast } from 'sonner';
import { useNeuroAesthetic } from '@/hooks/use-neuro-aesthetic';

export const VideoUploader: React.FC<{
  onUploadComplete: (metadata?: any) => void;
  isCreator: boolean;
  className?: string;
}> = ({ onUploadComplete, isCreator, className }) => {
  const { user } = useAuth();
  const { triggerMicroReward } = useNeuroAesthetic();
  const {
    stage,
    file,
    progress,
    error,
    metadata,
    shieldStatus,
    setStage,
    setError,
    reset,
  } = useUploader();

  const [isOpen, setIsOpen] = React.useState(false);

  // Check for authentication when dialog opens
  useEffect(() => {
    if (isOpen && !user) {
      toast.error("Authentification requise", {
        description: "Vous devez être connecté pour téléverser des vidéos."
      });
      setIsOpen(false);
    }
  }, [isOpen, user]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Reset form when closing
      reset();
    }
    setIsOpen(open);
  };

  const handleUploadComplete = useCallback((metadata?: any) => {
    onUploadComplete(metadata);
    
    if (metadata?.id) {
      triggerMicroReward('interaction');
      toast.success("Vidéo initiée", {
        description: "Votre vidéo est en cours de téléchargement et de traitement."
      });
      
      // Close the dialog after a short delay
      setTimeout(() => {
        setIsOpen(false);
        reset();
      }, 1500);
    } else {
      toast.error("Échec de l'initiation de l'upload", {
        description: "Une erreur s'est produite pendant l'upload."
      });
    }
  }, [onUploadComplete, reset, triggerMicroReward]);

  const renderContent = () => {
    switch (stage) {
      case 'idle':
      case 'selecting':
        return <UploadDropzone onComplete={() => setStage('uploading')} />;
      
      case 'uploading':
        return (
          <div className="space-y-4">
            <UploadProgress progress={progress} />
            <ShieldStatus status={shieldStatus} />
          </div>
        );
      
      case 'processing':
        return (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h3 className="text-lg font-medium">Traitement en cours</h3>
            <p className="text-muted-foreground text-sm">Votre vidéo est en cours de traitement...</p>
          </div>
        );
      
      case 'metadata':
        return (
          <div className="space-y-6">
            <MetadataForm 
              onComplete={handleUploadComplete} 
              onBack={() => setStage('uploading')} 
            />
            <ShieldStatus status={shieldStatus} />
          </div>
        );
      
      case 'complete':
        return (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium">Téléversement réussi !</h3>
            <p className="text-muted-foreground text-sm mb-6">Votre vidéo a été téléversée avec succès.</p>
            <Button onClick={() => {
              setIsOpen(false);
              reset();
            }}>
              Fermer
            </Button>
          </div>
        );
      
      case 'error':
        return (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-lg font-medium">Erreur lors du téléversement</h3>
            <p className="text-muted-foreground text-sm mb-6">{error || 'Une erreur est survenue'}</p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => setStage('selecting')}>
                Réessayer
              </Button>
              <Button onClick={() => {
                setIsOpen(false);
                reset();
              }}>
                Annuler
              </Button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (!isCreator) return null;

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)} 
        className={className}
        size="sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Uploader une vidéo
      </Button>
      
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {stage === 'metadata' ? 'Métadonnées de la vidéo' : 'Téléverser une vidéo'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            {renderContent()}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
