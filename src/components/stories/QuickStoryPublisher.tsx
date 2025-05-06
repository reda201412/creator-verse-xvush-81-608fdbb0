
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, X, Filter, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useUserBehavior } from '@/hooks/use-user-behavior';
import { useNeuroAesthetic } from '@/hooks/use-neuro-aesthetic';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { StoryFilter } from '@/types/stories';
import { useStories } from '@/hooks/use-stories';
import { useMediaProcessor } from '@/hooks/use-media-processor';

/**
 * Version optimisée du StoryPublisher avec prévisualisation des filtres en temps réel
 * utilisant WebGL pour une meilleure performance
 */
const QuickStoryPublisher: React.FC = () => {
  const { isCreator } = useAuth();
  const { triggerMicroReward } = useNeuroAesthetic();
  const { trackInteraction } = useUserBehavior();
  const { toast } = useToast();
  const { createStory } = useStories();
  const [isOpen, setIsOpen] = useState(false);
  const [activeCamera, setActiveCamera] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<StoryFilter>('none');
  const [captureMode, setCaptureMode] = useState<'photo' | 'video'>('photo');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [capturedMedia, setCapturedMedia] = useState<File | null>(null);
  const [mediaCaptured, setMediaCaptured] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const filterCanvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const { 
    applyWebGLFilter, 
    drawVideoToCanvas, 
    compressVideo,
    createThumbnail
  } = useMediaProcessor();
  
  // Initialiser la caméra avec optimisation
  const initCamera = async () => {
    try {
      if (!videoRef.current) return;
      
      // Arrêter le flux actuel s'il existe
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      // Configuration optimisée pour la caméra
      const constraints = {
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        },
        audio: true
      };
      
      // Utilisation de navigator.mediaDevices.getUserMedia avec préchargement
      toast({ description: "Initialisation de la caméra..." });
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      // Définir le flux sur l'élément vidéo et activer la mise en cache
      videoRef.current.srcObject = stream;
      videoRef.current.muted = true;
      
      // Attendre que la vidéo soit chargée avant d'activer les filtres
      videoRef.current.onloadedmetadata = () => {
        setActiveCamera(true);
        startFilterPreview();
        toast({ description: "Caméra prête" });
        triggerMicroReward('creative', { type: 'camera_initialized' });
      };
      
      // Configurer l'enregistreur média pour la vidéo
      setupMediaRecorder(stream);
      
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'accéder à votre caméra",
        variant: "destructive"
      });
    }
  };
  
  // Configurer l'enregistreur média
  const setupMediaRecorder = (stream: MediaStream) => {
    try {
      // Optimisation: utiliser des options pour une meilleure qualité/compression
      const options = { mimeType: 'video/webm;codecs=vp9' };
      mediaRecorderRef.current = new MediaRecorder(stream, options);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        
        // Compression côté client
        const compressedBlob = await compressVideo(blob);
        
        // Créer un fichier à partir du blob compressé
        const file = new File([compressedBlob], `story-video-${Date.now()}.webm`, {
          type: 'video/webm'
        });
        
        setCapturedMedia(file);
        setMediaCaptured(true);
        recordedChunksRef.current = [];
      };
    } catch (error) {
      console.error('Error setting up media recorder:', error);
      toast({
        title: "Erreur",
        description: "Problème avec l'enregistreur vidéo",
        variant: "destructive"
      });
    }
  };
  
  // Animation fluide des filtres en temps réel
  const startFilterPreview = () => {
    if (!videoRef.current || !filterCanvasRef.current) return;
    
    const renderFrame = () => {
      if (videoRef.current && filterCanvasRef.current) {
        // Appliquer le filtre WebGL en temps réel
        applyWebGLFilter(
          videoRef.current, 
          filterCanvasRef.current, 
          selectedFilter
        );
      }
      
      // Animation frame loop pour une mise à jour fluide
      animationFrameRef.current = requestAnimationFrame(renderFrame);
    };
    
    // Démarrer la boucle de rendu
    animationFrameRef.current = requestAnimationFrame(renderFrame);
  };
  
  // Arrêter les previews
  const stopFilterPreview = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };
  
  // Cleanup caméra et ressources
  const stopCamera = () => {
    stopFilterPreview();
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setActiveCamera(false);
  };
  
  // Appliquer un filtre en temps réel
  const applyFilter = (filter: StoryFilter) => {
    setSelectedFilter(filter);
    triggerMicroReward('creative', { type: 'filter_applied' });
  };
  
  // Prendre une photo avec le filtre appliqué
  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current || !filterCanvasRef.current) return;
    
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Utiliser les dimensions de la vidéo pour une meilleure qualité
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Utiliser le canvas filtré comme source
      if (selectedFilter !== 'none') {
        ctx.drawImage(filterCanvasRef.current, 0, 0, canvas.width, canvas.height);
      } else {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }
      
      // Convertir le canvas en blob
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        
        // Créer un fichier à partir du blob
        const file = new File([blob], `story-photo-${Date.now()}.jpg`, {
          type: 'image/jpeg'
        });
        
        setCapturedMedia(file);
        setMediaCaptured(true);
        
        toast({
          title: "Photo capturée",
          description: `Photo capturée avec le filtre ${selectedFilter}`,
        });
        
        triggerMicroReward('achievement', { type: 'photo_captured' });
      }, 'image/jpeg', 0.9);
    } catch (error) {
      console.error('Error capturing photo:', error);
      toast({
        title: "Erreur",
        description: "Impossible de prendre la photo",
        variant: "destructive"
      });
    }
  };
  
  // Démarrer l'enregistrement vidéo
  const startRecording = () => {
    if (!mediaRecorderRef.current) return;
    
    try {
      recordedChunksRef.current = [];
      mediaRecorderRef.current.start(1000); // Enregistrer par chunks de 1 seconde
      setIsRecording(true);
      startTimeRef.current = Date.now();
      
      // Démarrer le compteur de durée
      const timerInterval = setInterval(() => {
        if (startTimeRef.current) {
          const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
          setRecordingDuration(elapsed);
          
          // Arrêter automatiquement après 15 secondes
          if (elapsed >= 15) {
            clearInterval(timerInterval);
            stopRecording();
          }
        }
      }, 1000);
      
      // Nettoyer l'intervalle lors de l'arrêt
      mediaRecorderRef.current.onstop = () => {
        clearInterval(timerInterval);
        // Le reste du code onstop est défini dans setupMediaRecorder
      };
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Erreur",
        description: "Impossible de démarrer l'enregistrement",
        variant: "destructive"
      });
    }
  };
  
  // Arrêter l'enregistrement vidéo
  const stopRecording = () => {
    if (!mediaRecorderRef.current || mediaRecorderRef.current.state !== 'recording') return;
    
    try {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingDuration(0);
      startTimeRef.current = null;
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  };
  
  // Publier la story capturée
  const publishCapturedMedia = async () => {
    if (!capturedMedia) {
      toast({
        title: "Erreur",
        description: "Aucun média à publier",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Générer une miniature pour les vidéos
      let thumbnailFile = null;
      if (capturedMedia.type.includes('video')) {
        thumbnailFile = await createThumbnail(capturedMedia);
      }
      
      // Créer la story
      await createStory({
        mediaFile: capturedMedia,
        thumbnailFile: thumbnailFile,
        caption: "",
        filter: selectedFilter,
        duration: 10,
        expiresIn: 24,
        tags: [],
        metadata: {}
      });
      
      toast({
        title: "Succès",
        description: "Votre story a été publiée",
      });
      
      // Réinitialiser l'état
      setCapturedMedia(null);
      setMediaCaptured(false);
      handleClose();
      
      triggerMicroReward('achievement', { type: 'story_published' });
    } catch (error) {
      console.error('Error publishing story:', error);
      toast({
        title: "Erreur",
        description: "Impossible de publier votre story",
        variant: "destructive"
      });
    }
  };
  
  // Gérer l'ouverture du composant
  const handleOpen = async () => {
    setIsOpen(true);
    trackInteraction('click', { feature: 'quick_story_publisher' });
    triggerMicroReward('click');
    
    // Réinitialiser l'état
    setCapturedMedia(null);
    setMediaCaptured(false);
    setSelectedFilter('none');
    setCaptureMode('photo');
    
    // Initialiser la caméra en différé
    setTimeout(() => {
      initCamera();
    }, 100);
  };
  
  // Gérer la fermeture du composant et le nettoyage
  const handleClose = () => {
    stopCamera();
    setIsOpen(false);
    setSelectedFilter('none');
    setMediaCaptured(false);
    setCapturedMedia(null);
  };
  
  // Basculer entre les modes photo et vidéo
  const toggleCaptureMode = () => {
    setCaptureMode(prev => prev === 'photo' ? 'video' : 'photo');
    if (isRecording) {
      stopRecording();
    }
  };
  
  // Retourner à la caméra
  const resetCapture = () => {
    setMediaCaptured(false);
    setCapturedMedia(null);
  };
  
  // Nettoyage lors du démontage du composant
  useEffect(() => {
    return () => {
      stopCamera();
      if (startTimeRef.current !== null) {
        startTimeRef.current = null;
      }
    };
  }, []);
  
  if (!isCreator) return null;
  
  // Télécharger le média capturé (fonctionnalité de débogage)
  const handleDownload = () => {
    if (!capturedMedia) return;
    
    const url = URL.createObjectURL(capturedMedia);
    const a = document.createElement('a');
    a.href = url;
    a.download = capturedMedia.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
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
      
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="bottom" className="h-[90vh] sm:max-w-md mx-auto p-0">
          <SheetHeader className="p-4 flex-row justify-between items-center">
            <SheetTitle>Story Rapide</SheetTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full"
              onClick={handleClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </SheetHeader>
          
          <div className="relative h-[calc(100%-8rem)] bg-black">
            {!mediaCaptured ? (
              <>
                {/* Interface de capture */}
                <div className="relative w-full h-full overflow-hidden">
                  {/* Vidéo avec canvas de filtre superposé */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black">
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      muted
                      className="w-full h-full object-cover invisible"
                    />
                    <canvas 
                      ref={filterCanvasRef}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <canvas ref={canvasRef} className="hidden" />
                  </div>
                  
                  {!activeCamera && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white">
                      <div className="animate-pulse">Initialisation de la caméra...</div>
                    </div>
                  )}
                  
                  {/* Sélecteur de mode capture */}
                  <div className="absolute top-4 left-0 right-0 flex justify-center">
                    <div className="bg-black/50 rounded-full p-1 flex">
                      <Button
                        variant={captureMode === 'photo' ? 'default' : 'ghost'}
                        size="sm"
                        className="rounded-full text-xs"
                        onClick={() => setCaptureMode('photo')}
                      >
                        Photo
                      </Button>
                      <Button
                        variant={captureMode === 'video' ? 'default' : 'ghost'}
                        size="sm"
                        className="rounded-full text-xs"
                        onClick={() => setCaptureMode('video')}
                      >
                        Vidéo
                      </Button>
                    </div>
                  </div>
                  
                  {/* Boutons de capture */}
                  <div className="absolute bottom-28 left-0 right-0 flex justify-center">
                    {captureMode === 'photo' ? (
                      <Button 
                        size="icon"
                        variant="default"
                        className="rounded-full h-16 w-16 bg-white hover:bg-gray-200 shadow-lg"
                        onClick={takePhoto}
                        disabled={!activeCamera}
                      >
                        <div className="rounded-full h-14 w-14 border-2 border-gray-300" />
                      </Button>
                    ) : (
                      isRecording ? (
                        <Button 
                          size="icon"
                          variant="destructive"
                          className="rounded-full h-16 w-16 shadow-lg flex items-center justify-center"
                          onClick={stopRecording}
                        >
                          <div className="h-8 w-8 rounded bg-white flex items-center justify-center">
                            <div className="h-6 w-6 rounded bg-red-500 animate-pulse">
                              <span className="absolute top-[-25px] left-[18px] text-white text-xs font-bold">
                                {recordingDuration}s
                              </span>
                            </div>
                          </div>
                        </Button>
                      ) : (
                        <Button 
                          size="icon"
                          variant="default"
                          className="rounded-full h-16 w-16 bg-red-500 hover:bg-red-600 shadow-lg"
                          onClick={startRecording}
                          disabled={!activeCamera}
                        >
                          <div className="rounded-full h-14 w-14 border-2 border-white flex items-center justify-center">
                            <div className="rounded-full h-8 w-8 bg-red-600" />
                          </div>
                        </Button>
                      )
                    )}
                  </div>
                  
                  {/* Sélecteur de filtres optimisé */}
                  <div className="absolute bottom-0 left-0 right-0 py-3 px-4 bg-gradient-to-t from-black/80 to-transparent">
                    <RadioGroup 
                      value={selectedFilter} 
                      onValueChange={(v) => applyFilter(v as StoryFilter)}
                      className="flex overflow-x-auto gap-3 pb-2 no-scrollbar justify-center"
                    >
                      {(['none', 'sepia', 'grayscale', 'vintage', 'neon', 'vibrant', 'minimal'] as StoryFilter[]).map((filter) => (
                        <div key={filter} className="flex flex-col items-center flex-shrink-0">
                          <RadioGroupItem 
                            value={filter} 
                            id={`quick-filter-${filter}`} 
                            className="sr-only"
                          />
                          <Label 
                            htmlFor={`quick-filter-${filter}`} 
                            className={`cursor-pointer p-1 rounded-full ${
                              selectedFilter === filter 
                                ? 'bg-white' 
                                : 'border-2 border-white/40'
                            }`}
                          >
                            <div className={`w-12 h-12 rounded-full filter-${filter} bg-gray-300 overflow-hidden`}>
                              {activeCamera && (
                                <div className="w-full h-full" style={{
                                  background: `${filter === 'none' ? 'black' : `hsl(${Math.random() * 360}, 70%, 60%)`}`
                                }} />
                              )}
                            </div>
                          </Label>
                          <span className="text-xs mt-1 text-white capitalize">{filter}</span>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              </>
            ) : (
              /* Interface de prévisualisation du média capturé */
              <div className="relative w-full h-full flex items-center justify-center bg-black">
                {capturedMedia?.type.includes('image') ? (
                  <img 
                    src={URL.createObjectURL(capturedMedia)} 
                    alt="Captured media" 
                    className={`max-h-full max-w-full object-contain filter-${selectedFilter}`}
                  />
                ) : (
                  <video 
                    src={URL.createObjectURL(capturedMedia)}
                    className={`max-h-full max-w-full object-contain filter-${selectedFilter}`}
                    autoPlay
                    loop
                    controls
                  />
                )}
                
                <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-3">
                  <Button 
                    variant="secondary"
                    onClick={resetCapture}
                    className="rounded-full"
                  >
                    Reprendre
                  </Button>
                  <Button
                    onClick={publishCapturedMedia}
                    className="rounded-full bg-xvush-pink hover:bg-xvush-pink-dark"
                  >
                    Publier
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    onClick={handleDownload}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default QuickStoryPublisher;
