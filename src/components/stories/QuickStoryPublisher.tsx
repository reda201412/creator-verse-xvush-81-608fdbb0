
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, X, Filter, Download, Video, Image, Check } from 'lucide-react';
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
import { useMediaQuery } from '@/hooks/use-media-query';

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
  const [isInitializingCamera, setIsInitializingCamera] = useState(false);
  const [activeCamera, setActiveCamera] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<StoryFilter>('none');
  const [captureMode, setCaptureMode] = useState<'photo' | 'video'>('photo');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [capturedMedia, setCapturedMedia] = useState<File | null>(null);
  const [mediaCaptured, setMediaCaptured] = useState(false);
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  
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
    createThumbnail,
    optimizeVideoDimensions
  } = useMediaProcessor();

  // Memoize des contraintes vidéo en fonction de l'appareil
  const videoConstraints = useMemo(() => {
    const constraints: MediaTrackConstraints = { 
      facingMode: 'user'
    };
    
    // Optimiser les dimensions pour mobile/desktop
    if (isMobile) {
      constraints.width = { ideal: 720 };
      constraints.height = { ideal: 1280 };  // Mode portrait pour mobile
    } else {
      constraints.width = { ideal: 1280 };
      constraints.height = { ideal: 720 };
    }
    
    // Privilégier la fluidité sur mobile
    constraints.frameRate = isMobile 
      ? { ideal: 24, min: 15 } 
      : { ideal: 30, min: 24 };
    
    return constraints;
  }, [isMobile]);
  
  // Préchargement de la caméra quand l'utilisateur survole le bouton
  const preloadCamera = async () => {
    try {
      // Vérifier si les API sont disponibles
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.warn('getUserMedia not supported');
        return;
      }
      
      // Vérifier les permissions sans vraiment activer la caméra
      const permissions = await navigator.permissions.query({ name: 'camera' as PermissionName });
      
      if (permissions.state === 'granted' || permissions.state === 'prompt') {
        // Précharger seulement la vérification des permissions
        console.log('Camera permissions pre-check completed');
      }
    } catch (error) {
      // Ignorer silencieusement - ce n'est qu'un préchargement
      console.log('Camera preload check failed, will retry when needed');
    }
  };
  
  // Initialiser la caméra avec optimisation
  const initCamera = async () => {
    try {
      if (!videoRef.current) return;
      
      setIsInitializingCamera(true);
      
      // Arrêter le flux actuel s'il existe
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      // Configuration optimisée pour la caméra
      const constraints = {
        video: videoConstraints,
        audio: true
      };
      
      // Récupérer et configurer le flux
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        // Optimisations pour la vidéo
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        videoRef.current.playsInline = true; // Important pour iOS
        
        // Précharger la vidéo
        videoRef.current.preload = 'auto';
        
        // Attendre que la vidéo soit chargée avant d'activer les filtres
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            // Dimensionnement dynamique du canvas de filtre
            if (filterCanvasRef.current) {
              filterCanvasRef.current.width = videoRef.current.videoWidth;
              filterCanvasRef.current.height = videoRef.current.videoHeight;
            }
            
            setActiveCamera(true);
            setIsInitializingCamera(false);
            startFilterPreview();
            
            // Configurer l'enregistreur média
            setupMediaRecorder(stream);
            
            triggerMicroReward('creative', { type: 'camera_initialized' });
          }
        };
        
        // Gérer les erreurs de lecture
        videoRef.current.onerror = () => {
          console.error('Video playback error');
          setIsInitializingCamera(false);
          toast({
            title: "Erreur",
            description: "Impossible de démarrer la caméra. Veuillez réessayer.",
            variant: "destructive"
          });
        };
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setIsInitializingCamera(false);
      toast({
        title: "Erreur",
        description: "Impossible d'accéder à votre caméra. Vérifiez vos permissions.",
        variant: "destructive"
      });
      
      // Passer automatiquement en mode galerie en cas d'erreur
      setCaptureMode('photo');
    }
  };
  
  // Configurer l'enregistreur média avec options optimisées
  const setupMediaRecorder = (stream: MediaStream) => {
    try {
      // Déterminer le meilleur format pris en charge
      const mimeTypes = [
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm;codecs=h264,opus',
        'video/webm',
        'video/mp4'
      ];
      
      let mimeType = '';
      for (const type of mimeTypes) {
        if (MediaRecorder.isTypeSupported(type)) {
          mimeType = type;
          break;
        }
      }
      
      // Options pour le recorder
      const options: MediaRecorderOptions = {};
      if (mimeType) {
        options.mimeType = mimeType;
      }
      
      // Optimiser le bitrate pour un bon équilibre qualité/taille
      options.videoBitsPerSecond = isMobile ? 1500000 : 2500000;
      options.audioBitsPerSecond = 128000;
      
      // Créer le MediaRecorder
      mediaRecorderRef.current = new MediaRecorder(stream, options);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = async () => {
        if (recordedChunksRef.current.length === 0) {
          toast({
            title: "Erreur",
            description: "Aucune donnée n'a été enregistrée. Veuillez réessayer.",
            variant: "destructive"
          });
          return;
        }
        
        // Créer un blob avec les données enregistrées
        const blob = new Blob(recordedChunksRef.current, { 
          type: mediaRecorderRef.current?.mimeType || 'video/webm' 
        });
        
        // Notification de compression
        toast({
          description: "Traitement de la vidéo en cours...",
        });
        
        // Compression côté client
        const compressedBlob = await compressVideo(blob);
        
        // Créer un fichier à partir du blob compressé
        const file = new File([compressedBlob], `story-video-${Date.now()}.webm`, {
          type: compressedBlob.type
        });
        
        setCapturedMedia(file);
        setMediaCaptured(true);
        recordedChunksRef.current = [];
        
        toast({
          title: "Vidéo capturée",
          description: "Votre vidéo est prête à être publiée",
        });
      };
    } catch (error) {
      console.error('Error setting up media recorder:', error);
      toast({
        title: "Erreur",
        description: "Problème avec l'enregistreur vidéo. Essayez en mode photo.",
        variant: "destructive"
      });
    }
  };
  
  // Animation fluide des filtres en temps réel
  const startFilterPreview = () => {
    if (!videoRef.current || !filterCanvasRef.current) return;
    
    const renderFrame = () => {
      if (videoRef.current && filterCanvasRef.current && activeCamera) {
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
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
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
    if (!videoRef.current || !canvasRef.current) return;
    
    try {
      toast({
        description: "Capture en cours...",
      });
      
      // Si on a le canvas de filtre, l'utiliser directement
      if (filterCanvasRef.current && selectedFilter !== 'none') {
        const canvas = canvasRef.current;
        canvas.width = filterCanvasRef.current.width;
        canvas.height = filterCanvasRef.current.height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        // Capturer le canvas filtré pour conserver les effets
        ctx.drawImage(filterCanvasRef.current, 0, 0);
        
        canvas.toBlob(async (blob) => {
          if (!blob) return;
          
          const file = new File([blob], `story-photo-${Date.now()}.jpg`, {
            type: 'image/jpeg'
          });
          
          setCapturedMedia(file);
          setMediaCaptured(true);
          
          toast({
            title: "Photo capturée",
            description: "Votre photo est prête à être publiée",
          });
          
          triggerMicroReward('achievement', { type: 'photo_captured' });
        }, 'image/jpeg', 0.9);
      } else {
        // Fallback: dessiner directement la vidéo
        const video = videoRef.current;
        const canvas = canvasRef.current;
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        ctx.drawImage(video, 0, 0);
        
        // Appliquer les filtres CSS en fallback (moins bien qu'avec WebGL)
        if (selectedFilter !== 'none') {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          // Appliquer le filtre sélectionné
          switch (selectedFilter) {
            case 'sepia':
              for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                
                data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
                data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
                data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
              }
              break;
              
            case 'grayscale':
              for (let i = 0; i < data.length; i += 4) {
                const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                data[i] = avg;
                data[i + 1] = avg;
                data[i + 2] = avg;
              }
              break;
              
            // Les autres filtres seraient appliqués de manière similaire
          }
          
          ctx.putImageData(imageData, 0, 0);
        }
        
        canvas.toBlob(async (blob) => {
          if (!blob) return;
          
          const file = new File([blob], `story-photo-${Date.now()}.jpg`, {
            type: 'image/jpeg'
          });
          
          setCapturedMedia(file);
          setMediaCaptured(true);
          
          toast({
            title: "Photo capturée",
            description: "Votre photo est prête à être publiée",
          });
          
          triggerMicroReward('achievement', { type: 'photo_captured' });
        }, 'image/jpeg', 0.9);
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
      toast({
        title: "Erreur",
        description: "Impossible de prendre la photo. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };
  
  // Démarrer l'enregistrement vidéo avec optimisations
  const startRecording = () => {
    if (!mediaRecorderRef.current) {
      toast({
        title: "Erreur",
        description: "Caméra non initialisée. Veuillez réessayer.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Vider les chunks précédents
      recordedChunksRef.current = [];
      
      // Configuration pour enregistrement en chunks fréquents (meilleure récupération)
      mediaRecorderRef.current.start(500); // Chunks de 500ms pour une meilleure récupération d'erreur
      setIsRecording(true);
      startTimeRef.current = Date.now();
      
      // Notification
      toast({
        description: "Enregistrement démarré",
      });
      
      // Démarrer le compteur de durée avec requestAnimationFrame pour meilleure performance
      let lastTimestamp = Date.now();
      
      const updateTimer = () => {
        if (!isRecording || !startTimeRef.current) return;
        
        const now = Date.now();
        
        // Mettre à jour seulement à intervalle raisonnable (30fps ~= 33ms)
        if (now - lastTimestamp >= 33) {
          const elapsed = Math.floor((now - startTimeRef.current) / 1000);
          setRecordingDuration(elapsed);
          lastTimestamp = now;
          
          // Arrêter automatiquement après 15 secondes
          if (elapsed >= 15) {
            stopRecording();
            return;
          }
        }
        
        requestAnimationFrame(updateTimer);
      };
      
      requestAnimationFrame(updateTimer);
      
      // Feedback visuel
      triggerMicroReward('interaction', { type: 'recording_started' });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Erreur",
        description: "Impossible de démarrer l'enregistrement",
        variant: "destructive"
      });
      setIsRecording(false);
    }
  };
  
  // Arrêter l'enregistrement vidéo
  const stopRecording = () => {
    if (!mediaRecorderRef.current || mediaRecorderRef.current.state !== 'recording') {
      return;
    }
    
    try {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingDuration(0);
      startTimeRef.current = null;
      
      toast({
        description: "Enregistrement terminé",
      });
    } catch (error) {
      console.error('Error stopping recording:', error);
      toast({
        title: "Erreur",
        description: "Problème lors de l'arrêt de l'enregistrement",
        variant: "destructive"
      });
    }
  };
  
  // Publier la story capturée avec gestion optimisée des erreurs
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
      // Notification de publication
      toast({
        description: "Publication en cours...",
      });
      
      // Générer une miniature pour les vidéos
      let thumbnailFile = null;
      if (capturedMedia.type.includes('video')) {
        thumbnailFile = await createThumbnail(capturedMedia);
        
        if (!thumbnailFile) {
          console.warn('Could not create thumbnail, will use default');
        }
      }
      
      // Créer la story
      await createStory({
        mediaFile: capturedMedia,
        thumbnailFile: thumbnailFile,
        caption: "",
        filter: selectedFilter,
        duration: capturedMedia.type.includes('video') ? 0 : 10, // Durée auto pour les vidéos
        expiresIn: 24,
        tags: [],
        metadata: {}
      });
      
      toast({
        title: "Succès",
        description: "Votre story a été publiée",
        variant: "success",
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
        description: "Impossible de publier votre story. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };
  
  // Précharger la caméra quand l'utilisateur survole le bouton
  const handleButtonHover = () => {
    preloadCamera();
  };
  
  // Gérer l'ouverture du composant avec optimisations
  const handleOpen = () => {
    setIsSheetVisible(true);
    trackInteraction('click', { feature: 'quick_story_publisher' });
    triggerMicroReward('click');
    
    // Réinitialiser l'état
    setCapturedMedia(null);
    setMediaCaptured(false);
    setSelectedFilter('none');
    setCaptureMode('photo');
    
    // Initialiser la caméra en différé pour permettre l'animation d'ouverture
    // et éviter les blocages d'interface
    setTimeout(() => {
      setIsOpen(true);
      initCamera();
    }, 100);
  };
  
  // Gérer la fermeture du composant et le nettoyage
  const handleClose = () => {
    stopCamera();
    setIsOpen(false);
    
    // Attendre la fin de l'animation de fermeture avant de masquer complètement
    setTimeout(() => {
      setIsSheetVisible(false);
      setSelectedFilter('none');
      setMediaCaptured(false);
      setCapturedMedia(null);
    }, 300);
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
    
    // Réinitialiser la caméra
    setTimeout(() => {
      if (!activeCamera) {
        initCamera();
      }
    }, 100);
  };
  
  // Nettoyage lors du démontage du composant
  useEffect(() => {
    return () => {
      stopCamera();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);
  
  // Arrêter l'aperçu quand on ferme le composant
  useEffect(() => {
    if (!isOpen) {
      stopFilterPreview();
    }
  }, [isOpen]);
  
  // Redémarrer le preview des filtres quand on change de filtre
  useEffect(() => {
    if (activeCamera && isOpen) {
      startFilterPreview();
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [selectedFilter, activeCamera, isOpen]);
  
  if (!isCreator) return null;
  
  // Télécharger le média capturé (fonctionnalité de débogage/développement)
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
        className="rounded-full hardware-accelerated" 
        size="icon"
        variant="secondary"
        onClick={handleOpen}
        onMouseEnter={handleButtonHover}
      >
        <Camera className="h-5 w-5" />
      </Button>
      
      <Sheet 
        open={isSheetVisible} 
        onOpenChange={(open) => {
          if (!open) handleClose();
          else handleOpen();
        }}
      >
        <SheetContent side="bottom" className={`h-[90vh] sm:max-w-md mx-auto p-0 transition-transform duration-300 ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>
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
                <div className="relative w-full h-full overflow-hidden hardware-accelerated">
                  {/* Vidéo avec canvas de filtre superposé */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black transform-gpu">
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      muted
                      className="w-full h-full object-cover invisible hardware-accelerated"
                    />
                    <canvas 
                      ref={filterCanvasRef}
                      className="absolute inset-0 w-full h-full object-cover transform-gpu"
                    />
                    <canvas ref={canvasRef} className="hidden" />
                  </div>
                  
                  {/* État d'initialisation */}
                  {isInitializingCamera && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white z-10">
                      <div className="flex flex-col items-center">
                        <div className="loading-spinner h-8 w-8 border-2 border-white border-t-transparent rounded-full mb-2"></div>
                        <div>Initialisation de la caméra...</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Vérifier si la caméra est active */}
                  {!activeCamera && !isInitializingCamera && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white z-10">
                      <Button 
                        onClick={initCamera}
                        variant="outline"
                      >
                        <Camera className="mr-2 h-4 w-4" />
                        Activer la caméra
                      </Button>
                    </div>
                  )}
                  
                  {/* Sélecteur de mode capture */}
                  <div className="absolute top-4 left-0 right-0 flex justify-center z-10">
                    <div className="bg-black/50 backdrop-blur-sm rounded-full p-1 flex">
                      <Button
                        variant={captureMode === 'photo' ? 'default' : 'ghost'}
                        size="sm"
                        className="rounded-full text-xs"
                        onClick={() => setCaptureMode('photo')}
                      >
                        <Image className="mr-1 h-3 w-3" />
                        Photo
                      </Button>
                      <Button
                        variant={captureMode === 'video' ? 'default' : 'ghost'}
                        size="sm"
                        className="rounded-full text-xs"
                        onClick={() => setCaptureMode('video')}
                      >
                        <Video className="mr-1 h-3 w-3" />
                        Vidéo
                      </Button>
                    </div>
                  </div>
                  
                  {/* Boutons de capture */}
                  <div className="absolute bottom-28 left-0 right-0 flex justify-center z-10">
                    {captureMode === 'photo' ? (
                      <Button 
                        size="icon"
                        variant="default"
                        className="rounded-full h-16 w-16 bg-white hover:bg-gray-200 shadow-lg hardware-accelerated transition-transform hover:scale-110"
                        onClick={takePhoto}
                        disabled={!activeCamera || isInitializingCamera}
                      >
                        <div className="rounded-full h-14 w-14 border-2 border-gray-300" />
                      </Button>
                    ) : (
                      isRecording ? (
                        <Button 
                          size="icon"
                          variant="destructive"
                          className="rounded-full h-16 w-16 shadow-lg flex items-center justify-center hardware-accelerated"
                          onClick={stopRecording}
                        >
                          <div className="h-8 w-8 rounded bg-white flex items-center justify-center">
                            <div className="h-6 w-6 rounded bg-red-500 animate-pulse">
                              <span className="absolute top-[-25px] left-0 right-0 text-white text-xs font-bold">
                                {recordingDuration}s
                              </span>
                            </div>
                          </div>
                        </Button>
                      ) : (
                        <Button 
                          size="icon"
                          variant="default"
                          className="rounded-full h-16 w-16 bg-red-500 hover:bg-red-600 shadow-lg transition-transform hover:scale-110 hardware-accelerated"
                          onClick={startRecording}
                          disabled={!activeCamera || isInitializingCamera}
                        >
                          <div className="rounded-full h-14 w-14 border-2 border-white flex items-center justify-center">
                            <div className="rounded-full h-8 w-8 bg-red-600" />
                          </div>
                        </Button>
                      )
                    )}
                  </div>
                  
                  {/* Sélecteur de filtres optimisé */}
                  <div className="absolute bottom-0 left-0 right-0 py-3 px-4 bg-gradient-to-t from-black/80 to-transparent z-10">
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
                            className={`cursor-pointer p-1 rounded-full transition-all duration-200 hardware-accelerated ${
                              selectedFilter === filter 
                                ? 'bg-white scale-110' 
                                : 'border-2 border-white/40'
                            }`}
                          >
                            <div className={`w-12 h-12 rounded-full overflow-hidden hardware-accelerated`}>
                              <div className="w-full h-full" style={{
                                background: `${filter === 'none' ? 'black' : `hsl(${Math.random() * 360}, 70%, 60%)`}`
                              }} />
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
              <div className="relative w-full h-full flex items-center justify-center bg-black hardware-accelerated">
                {capturedMedia?.type.includes('image') ? (
                  <img 
                    src={URL.createObjectURL(capturedMedia)} 
                    alt="Captured media" 
                    className={`max-h-full max-w-full object-contain filter-${selectedFilter} hardware-accelerated`}
                  />
                ) : (
                  <video 
                    src={URL.createObjectURL(capturedMedia)}
                    className={`max-h-full max-w-full object-contain filter-${selectedFilter} hardware-accelerated`}
                    autoPlay
                    loop
                    controls
                  />
                )}
                
                <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-3 z-10">
                  <Button 
                    variant="secondary"
                    onClick={resetCapture}
                    className="rounded-full"
                  >
                    Reprendre
                  </Button>
                  <Button
                    onClick={publishCapturedMedia}
                    className="rounded-full bg-green-500 hover:bg-green-600"
                  >
                    <Check className="mr-2 h-4 w-4" />
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
