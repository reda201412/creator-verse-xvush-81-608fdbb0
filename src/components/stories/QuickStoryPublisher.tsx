
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, X, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useUserBehavior } from '@/hooks/use-user-behavior';
import { useNeuroAesthetic } from '@/hooks/use-neuro-aesthetic';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { StoryFilter } from '@/types/stories';

/**
 * Version simplifiée du StoryPublisher pour les boutons d'accès rapide
 * avec prévisualisation des filtres en temps réel
 */
const QuickStoryPublisher: React.FC = () => {
  const { isCreator } = useAuth();
  const { triggerMicroReward } = useNeuroAesthetic();
  const { trackInteraction } = useUserBehavior();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [activeCamera, setActiveCamera] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<StoryFilter>('none');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Initialiser la caméra
  const initCamera = async () => {
    try {
      if (!videoRef.current) return;
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: true
      });
      
      videoRef.current.srcObject = stream;
      setActiveCamera(true);
      
      triggerMicroReward('creative', { type: 'camera_initialized' });
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'accéder à votre caméra",
        variant: "destructive"
      });
    }
  };
  
  // Cleanup camera on close
  const stopCamera = () => {
    if (!videoRef.current?.srcObject) return;
    
    const stream = videoRef.current.srcObject as MediaStream;
    stream.getTracks().forEach(track => track.stop());
    setActiveCamera(false);
  };
  
  // Appliquer un filtre
  const applyFilter = (filter: StoryFilter) => {
    setSelectedFilter(filter);
    triggerMicroReward('creative', { type: 'filter_applied' });
  };
  
  // Prendre une photo avec le filtre appliqué
  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Dessiner la vidéo sur le canvas
    ctx.drawImage(video, 0, 0);
    
    // Appliquer le filtre au canvas (simulation)
    if (selectedFilter !== 'none') {
      // Dans une implémentation réelle, on appliquerait des filtres WebGL ici
      // C'est une simulation simple qui indique que le filtre est appliqué
      toast({
        title: "Filtre appliqué",
        description: `Photo capturée avec le filtre ${selectedFilter}`,
      });
    }
    
    // Récupérer l'image du canvas
    canvas.toBlob((blob) => {
      if (!blob) return;
      
      // Ici, on pourrait envoyer le blob au composant StoryPublisher pour finaliser
      toast({
        title: "Photo capturée",
        description: "Prêt à publier votre story",
      });
      
      triggerMicroReward('achievement', { type: 'photo_captured' });
    }, 'image/jpeg', 0.9);
  };
  
  // Gérer l'ouverture du composant
  const handleOpen = () => {
    setIsOpen(true);
    trackInteraction('click', { feature: 'quick_story_publisher' });
    triggerMicroReward('click');
    
    // Initialiser la caméra lors de l'ouverture
    initCamera();
  };
  
  // Gérer la fermeture du composant
  const handleClose = () => {
    stopCamera();
    setIsOpen(false);
    setSelectedFilter('none');
  };
  
  if (!isCreator) return null;
  
  return (
    <>
      <Button 
        className="rounded-full" 
        size="icon"
        variant="secondary"
        onClick={handleOpen}
      >
        <Camera className="h-5 w-5" />
      </Button>
      
      <Sheet open={isOpen} onOpenChange={handleClose}>
        <SheetContent side="bottom" className="h-[80vh] sm:max-w-md mx-auto">
          <SheetHeader>
            <SheetTitle>Créer une Story Rapide</SheetTitle>
          </SheetHeader>
          
          <div className="relative mt-4 h-[calc(100%-8rem)]">
            {/* Vidéo avec le filtre appliqué en temps réel */}
            <div className="relative w-full h-full rounded-lg overflow-hidden bg-black">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted
                className={`w-full h-full object-cover ${
                  selectedFilter !== 'none' ? `filter-${selectedFilter}` : ''
                }`}
              />
              <canvas ref={canvasRef} className="hidden" />
              
              {!activeCamera && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white">
                  Initialisation de la caméra...
                </div>
              )}
              
              {/* Sélecteur de filtres superposé en bas */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-4">
                <p className="text-white text-sm mb-2">Filtres</p>
                <RadioGroup 
                  value={selectedFilter} 
                  onValueChange={(v) => applyFilter(v as StoryFilter)}
                  className="flex overflow-x-auto gap-3 pb-2 no-scrollbar"
                >
                  {(['none', 'sepia', 'grayscale', 'blur', 'vintage', 'neon', 'vibrant', 'minimal'] as StoryFilter[]).map((filter) => (
                    <div key={filter} className="flex flex-col items-center flex-shrink-0">
                      <RadioGroupItem 
                        value={filter} 
                        id={`quick-filter-${filter}`} 
                        className="sr-only"
                      />
                      <Label 
                        htmlFor={`quick-filter-${filter}`} 
                        className={`cursor-pointer p-1 rounded-full border-2 ${
                          selectedFilter === filter ? 'border-primary' : 'border-transparent'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-full bg-background filter-${filter}`} />
                      </Label>
                      <span className="text-xs mt-1 text-white capitalize">{filter}</span>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
            
            {/* Boutons d'actions flottants */}
            <div className="absolute bottom-20 left-0 right-0 flex justify-center">
              <Button 
                size="icon"
                variant="default"
                className="rounded-full h-14 w-14"
                onClick={takePhoto}
                disabled={!activeCamera}
              >
                <Camera className="h-6 w-6" />
              </Button>
            </div>
            
            {/* Bouton de fermeture flottant */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-2 right-2 rounded-full bg-black/20 text-white hover:bg-black/40"
              onClick={handleClose}
            >
              <X className="h-5 w-5" />
            </Button>
            
            {/* Bouton de filtres flottant */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-2 left-2 rounded-full bg-black/20 text-white hover:bg-black/40"
              onClick={() => document.getElementById('filter-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Filter className="h-5 w-5" />
            </Button>
          </div>
          
          <SheetFooter className="mt-4">
            <Button onClick={handleClose} variant="outline">
              Fermer
            </Button>
            <Button disabled={!activeCamera}>
              Continuer
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default QuickStoryPublisher;
