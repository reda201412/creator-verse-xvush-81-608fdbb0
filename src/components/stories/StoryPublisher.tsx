
import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Camera, Image, Clock, Tag, Send, X, Video } from 'lucide-react';
import { useStories } from '@/hooks/use-stories';
import { StoryFilter, StoryUploadParams } from '@/types/stories';
import { useNeuroAesthetic } from '@/hooks/use-neuro-aesthetic';
import { useAuth } from '@/contexts/AuthContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetTrigger } from '@/components/ui/sheet';
import { useUserBehavior } from '@/hooks/use-user-behavior';

const StoryPublisher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'camera' | 'gallery'>('camera');
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<StoryFilter>('none');
  const [duration, setDuration] = useState(10);
  const [expiresIn, setExpiresIn] = useState(24);
  const [tags, setTags] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  
  const { createStory } = useStories();
  const { triggerMicroReward } = useNeuroAesthetic();
  const { isCreator } = useAuth();
  const { toast } = useToast();
  const { trackInteraction } = useUserBehavior();
  
  // Initialiser la caméra
  const initCamera = useCallback(async () => {
    try {
      if (!videoRef.current) return;
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: true
      });
      
      videoRef.current.srcObject = stream;
      
      // Préparer l'enregistreur
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, {
          type: 'video/webm'
        });
        
        const file = new File([blob], `video-${Date.now()}.webm`, {
          type: 'video/webm'
        });
        
        setSelectedFile(file);
        setMediaPreview(URL.createObjectURL(blob));
        recordedChunksRef.current = [];
      };
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'accéder à votre caméra",
        variant: "destructive"
      });
      setActiveTab('gallery');
    }
  }, [toast]);
  
  // Enregistrer un média
  const startRecording = () => {
    if (!mediaRecorderRef.current) return;
    
    recordedChunksRef.current = [];
    mediaRecorderRef.current.start();
    setIsRecording(true);
    
    // Arrêter automatiquement après la durée sélectionnée
    setTimeout(() => {
      if (mediaRecorderRef.current?.state === 'recording') {
        stopRecording();
      }
    }, duration * 1000);
  };
  
  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;
    
    if (mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    
    setIsRecording(false);
  };
  
  // Prendre une photo
  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0);
    
    canvas.toBlob((blob) => {
      if (!blob) return;
      
      const file = new File([blob], `photo-${Date.now()}.jpg`, {
        type: 'image/jpeg'
      });
      
      setSelectedFile(file);
      setMediaPreview(URL.createObjectURL(blob));
    }, 'image/jpeg', 0.9);
  };
  
  // Sélectionner un fichier de la galerie
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setSelectedFile(file);
    setMediaPreview(URL.createObjectURL(file));
    trackInteraction('select', { feature: 'story_media' });
  };
  
  // Appliquer un filtre
  const applyFilter = (filter: StoryFilter) => {
    if (!canvasRef.current || !mediaPreview) return;
    
    setSelectedFilter(filter);
    
    // Logique d'application du filtre visuel ici
    // (dans un vrai produit, ceci utiliserait WebGL/Canvas pour appliquer
    // des filtres en temps réel)
    
    triggerMicroReward('creative', { type: 'filter_applied' });
  };
  
  // Publier la story
  const publishStory = async () => {
    if (!selectedFile) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un média à publier",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsUploading(true);
      
      const params: StoryUploadParams = {
        mediaFile: selectedFile,
        caption,
        filter: selectedFilter,
        duration,
        expiresIn,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        metadata: {}
      };
      
      // Ajouter la localisation si activée
      if (showLocation) {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        
        params.metadata = {
          location: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
        };
      }
      
      const result = await createStory(params);
      
      if (result) {
        // Réinitialiser le formulaire
        setSelectedFile(null);
        setMediaPreview(null);
        setCaption('');
        setSelectedFilter('none');
        setDuration(10);
        setTags('');
        setIsOpen(false);
        
        triggerMicroReward('achievement', { type: 'story_published' });
      }
    } catch (error) {
      console.error('Error publishing story:', error);
      toast({
        title: "Erreur",
        description: "Impossible de publier votre story",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  // Fermer et nettoyer
  const handleClose = () => {
    // Arrêter la caméra si active
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    
    setIsOpen(false);
    setActiveTab('camera');
    setSelectedFile(null);
    setMediaPreview(null);
    setCaption('');
    setSelectedFilter('none');
    setDuration(10);
    setExpiresIn(24);
    setTags('');
  };
  
  // Initialiser la caméra lorsque l'onglet caméra est actif
  React.useEffect(() => {
    if (isOpen && activeTab === 'camera') {
      initCamera();
    }
    
    return () => {
      // Nettoyer
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isOpen, activeTab, initCamera]);
  
  // Seulement les créateurs peuvent publier des stories
  if (!isCreator) return null;
  
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          className="rounded-full" 
          variant="outline" 
          size="icon"
          onClick={() => {
            setIsOpen(true);
            trackInteraction('click', { feature: 'open_story_publisher' });
          }}
        >
          <Camera className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md" side="bottom">
        <SheetHeader>
          <SheetTitle>Créer une Story</SheetTitle>
          <div className="flex space-x-2 pt-2">
            <Button 
              variant={activeTab === 'camera' ? 'default' : 'outline'} 
              onClick={() => setActiveTab('camera')}
            >
              <Camera className="mr-2 h-4 w-4" />
              Caméra
            </Button>
            <Button 
              variant={activeTab === 'gallery' ? 'default' : 'outline'} 
              onClick={() => setActiveTab('gallery')}
            >
              <Image className="mr-2 h-4 w-4" />
              Galerie
            </Button>
          </div>
        </SheetHeader>
        
        <div className="space-y-4 py-4">
          {activeTab === 'camera' && (
            <div className="relative">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted
                className={`w-full h-[60vh] object-cover rounded-lg ${
                  selectedFilter !== 'none' ? `filter-${selectedFilter}` : ''
                }`}
              />
              <canvas ref={canvasRef} className="hidden" />
              
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
                {isRecording ? (
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="rounded-full w-12 h-12"
                    onClick={stopRecording}
                  >
                    <X className="h-6 w-6" />
                  </Button>
                ) : (
                  <>
                    <Button 
                      variant="secondary" 
                      size="icon" 
                      className="rounded-full w-12 h-12"
                      onClick={takePhoto}
                    >
                      <Camera className="h-6 w-6" />
                    </Button>
                    <Button 
                      variant="default" 
                      size="icon" 
                      className="rounded-full w-12 h-12"
                      onClick={startRecording}
                    >
                      <Video className="h-6 w-6" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'gallery' && (
            <div className="flex flex-col items-center justify-center h-[60vh] border-2 border-dashed rounded-lg p-12">
              {mediaPreview ? (
                <div className="relative w-full h-full">
                  {selectedFile?.type.startsWith('video') ? (
                    <video 
                      src={mediaPreview} 
                      controls 
                      className="w-full h-full object-contain rounded-lg"
                    />
                  ) : (
                    <img 
                      src={mediaPreview} 
                      alt="Preview" 
                      className={`w-full h-full object-contain rounded-lg ${
                        selectedFilter !== 'none' ? `filter-${selectedFilter}` : ''
                      }`}
                    />
                  )}
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="absolute top-2 right-2 rounded-full"
                    onClick={() => {
                      setSelectedFile(null);
                      setMediaPreview(null);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Image className="mr-2 h-4 w-4" />
                    Sélectionner un média
                  </Button>
                </>
              )}
            </div>
          )}
          
          {mediaPreview && (
            <div className="space-y-4">
              <div>
                <Label>Filtres</Label>
                <RadioGroup 
                  value={selectedFilter} 
                  onValueChange={(v) => applyFilter(v as StoryFilter)}
                  className="flex flex-wrap gap-2 mt-2"
                >
                  {(['none', 'sepia', 'grayscale', 'blur', 'vintage', 'neon', 'vibrant', 'minimal'] as StoryFilter[]).map((filter) => (
                    <div key={filter} className="flex flex-col items-center">
                      <RadioGroupItem 
                        value={filter} 
                        id={`filter-${filter}`} 
                        className="sr-only"
                      />
                      <Label 
                        htmlFor={`filter-${filter}`} 
                        className={`cursor-pointer p-2 rounded-full border-2 ${
                          selectedFilter === filter ? 'border-primary' : 'border-transparent'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-full bg-background filter-${filter}`} />
                      </Label>
                      <span className="text-xs mt-1 capitalize">{filter}</span>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              <div>
                <Label htmlFor="caption">Légende</Label>
                <Input 
                  id="caption" 
                  placeholder="Ajouter une légende..." 
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
                <Input 
                  id="tags" 
                  placeholder="tag1, tag2, tag3" 
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>
              
              <div>
                <div className="flex justify-between">
                  <Label htmlFor="duration">Durée (secondes)</Label>
                  <span>{duration}s</span>
                </div>
                <Slider 
                  id="duration"
                  min={5} 
                  max={60} 
                  step={5}
                  value={[duration]}
                  onValueChange={(values) => setDuration(values[0])}
                  className="mt-2"
                />
              </div>
              
              <div>
                <div className="flex justify-between">
                  <Label htmlFor="expires">Expire après (heures)</Label>
                  <span>{expiresIn}h</span>
                </div>
                <Slider 
                  id="expires"
                  min={1} 
                  max={48} 
                  step={1}
                  value={[expiresIn]}
                  onValueChange={(values) => setExpiresIn(values[0])}
                  className="mt-2"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="location" 
                  checked={showLocation}
                  onCheckedChange={setShowLocation}
                />
                <Label htmlFor="location">Ajouter ma localisation</Label>
              </div>
            </div>
          )}
        </div>
        
        <SheetFooter>
          <Button variant="outline" onClick={handleClose}>
            Annuler
          </Button>
          <Button 
            onClick={publishStory} 
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? 'Publication...' : 'Publier'}
            {!isUploading && <Send className="ml-2 h-4 w-4" />}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default StoryPublisher;
