
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  Video, 
  Image as ImageIcon, 
  ChevronRight, 
  Check, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';
import { useNeuroAesthetic } from '@/hooks/use-neuro-aesthetic';
import { VideoFileUpload } from './VideoFileUpload';
import { ThumbnailUpload } from './ThumbnailUpload';
import VideoFormDetails from './VideoFormDetails';
import { useVideoUpload, VideoFormValues } from './useVideoUpload';

// Golden ratio constant (1:1.618)
const GOLDEN_RATIO = 1.618;

interface EnhancedVideoUploadProps {
  onClose: () => void;
  onUploadComplete: (metadata?: any) => void;
}

const EnhancedVideoUpload: React.FC<EnhancedVideoUploadProps> = ({
  onClose,
  onUploadComplete
}) => {
  const { toast } = useToast();
  const { triggerHaptic } = useHapticFeedback();
  const { triggerMicroReward } = useNeuroAesthetic();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Stage management
  const [activeStage, setActiveStage] = useState<number>(0);
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  const [stageProgress, setStageProgress] = useState<number[]>([0, 0, 0, 0, 0]);
  
  // Animation states
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  
  const {
    videoFile,
    thumbnailFile,
    videoPreviewUrl,
    thumbnailPreviewUrl,
    videoFormat,
    isUploading,
    uploadProgress,
    uploadError,
    uploadStage,
    handleVideoChange,
    handleThumbnailChange,
    generateThumbnail,
    resetForm,
    uploadVideoAndSaveMetadata,
    form
  } = useVideoUpload();

  // Stage definitions
  const stages = [
    { 
      id: 0, 
      title: 'Sélection de Vidéo', 
      icon: Video,
      completed: !!videoFile
    },
    { 
      id: 1, 
      title: 'Prévisualisation & Miniature', 
      icon: ImageIcon,
      completed: !!thumbnailPreviewUrl
    },
    { 
      id: 2, 
      title: 'Métadonnées & Options', 
      icon: Sparkles,
      completed: form.getValues('title') !== ''
    },
    { 
      id: 3, 
      title: 'Monétisation', 
      icon: ChevronRight,
      completed: activeStage > 3
    },
    { 
      id: 4, 
      title: 'Publication', 
      icon: Check,
      completed: false
    }
  ];
  
  // Video input and thumbnail input refs
  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  // Handle stage completion
  const completeCurrentStage = () => {
    if (!completedStages.includes(activeStage)) {
      setCompletedStages(prev => [...prev, activeStage]);
      triggerHaptic('medium');
      triggerMicroReward('achievement', { type: 'stage_completed', stageId: activeStage });
      
      // Update progress for the current stage
      const newProgress = [...stageProgress];
      newProgress[activeStage] = 100;
      setStageProgress(newProgress);
      
      // Animate progress to next stage
      setTimeout(() => {
        setActiveStage(prev => Math.min(prev + 1, stages.length - 1));
      }, 500);
    } else {
      setActiveStage(prev => Math.min(prev + 1, stages.length - 1));
    }
  };

  // Go back to previous stage
  const goToPreviousStage = () => {
    setActiveStage(prev => Math.max(prev - 1, 0));
    triggerHaptic('light');
  };
  
  // Handle video file removal
  const handleRemoveVideo = () => {
    if (videoInputRef.current) videoInputRef.current.value = '';
    resetForm();
    
    // Reset completion status for all subsequent stages
    const newCompletedStages = completedStages.filter(stage => stage < 1);
    setCompletedStages(newCompletedStages);
    
    // Reset progress for all subsequent stages
    const newProgress = [...stageProgress];
    for (let i = 0; i < newProgress.length; i++) {
      if (i >= 1) newProgress[i] = 0;
    }
    setStageProgress(newProgress);
    
    setActiveStage(0);
  };
  
  // Handle thumbnail removal
  const handleRemoveThumbnail = () => {
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
    if (thumbnailPreviewUrl) URL.revokeObjectURL(thumbnailPreviewUrl);
    
    // Don't reset stage, just update completion status
    const newCompletedStages = completedStages.filter(stage => stage !== 1);
    setCompletedStages(newCompletedStages);
    
    // Reset progress for this stage
    const newProgress = [...stageProgress];
    newProgress[1] = 0;
    setStageProgress(newProgress);
  };
  
  // Handle form submission
  const handleSubmit = async (values: VideoFormValues) => {
    if (!videoFile) {
      toast({
        title: "Information manquante",
        description: "Veuillez fournir une vidéo et un titre.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Add files to form values
      const formData = {
        ...values,
        videoFile,
        thumbnailFile
      };
      
      // Show confetti animation
      setShowConfetti(true);
      
      // Complete current stage
      if (!completedStages.includes(activeStage)) {
        setCompletedStages(prev => [...prev, activeStage]);
      }
      
      // Trigger haptic feedback and micro reward
      triggerHaptic('strong');
      triggerMicroReward('completion', { type: 'video_upload_complete' });
      
      // Upload video and save metadata
      await uploadVideoAndSaveMetadata(formData);
      
      // Notify parent component
      onUploadComplete(null);
      
      // Show success toast
      toast({
        title: "Vidéo téléversée avec succès",
        description: "Votre vidéo est en cours de traitement et sera disponible prochainement.",
      });
      
      // Close modal after delay
      setTimeout(() => {
        resetForm();
        onClose();
      }, 2000);
    } catch (error: any) {
      console.error('Upload process error:', error);
      toast({
        title: "Erreur de téléchargement",
        description: error.message || "Une erreur s'est produite lors du téléchargement de votre vidéo.",
        variant: "destructive"
      });
    }
  };
  
  // Auto-progress when a stage is completed
  useEffect(() => {
    // Auto-advance to next stage when video is selected
    if (videoFile && activeStage === 0 && !completedStages.includes(0)) {
      setCompletedStages(prev => [...prev, 0]);
      const newProgress = [...stageProgress];
      newProgress[0] = 100;
      setStageProgress(newProgress);
      
      setTimeout(() => {
        setActiveStage(1);
        triggerHaptic('light');
        triggerMicroReward('progress', { value: 20 });
      }, 800);
    }
    
    // Auto-advance when thumbnail is generated/uploaded
    if (thumbnailPreviewUrl && activeStage === 1 && !completedStages.includes(1)) {
      setCompletedStages(prev => [...prev, 1]);
      const newProgress = [...stageProgress];
      newProgress[1] = 100;
      setStageProgress(newProgress);
      
      setTimeout(() => {
        setActiveStage(2);
        triggerHaptic('light');
        triggerMicroReward('progress', { value: 40 });
      }, 800);
    }
  }, [videoFile, thumbnailPreviewUrl, activeStage, completedStages, stageProgress, triggerHaptic, triggerMicroReward]);
  
  // Calculate overall progress
  const overallProgress = stageProgress.reduce((sum, value) => sum + value, 0) / stages.length;
  
  // Golden ratio based layout
  useEffect(() => {
    // Apply golden ratio to container dimensions if needed
    if (containerRef.current) {
      // Just an example, actual implementation would depend on your layout needs
      const width = containerRef.current.clientWidth;
      // Height calculation based on golden ratio could be used here
    }
  }, []);
  
  return (
    <div 
      ref={containerRef} 
      className="flex flex-col min-h-[600px] max-h-[90vh] overflow-hidden relative"
    >
      {/* Progress Header */}
      <div className="mb-6 pt-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium">Upload de Contenu Premium</h3>
          <span className="text-sm text-muted-foreground">{Math.round(overallProgress)}%</span>
        </div>
        <div className="w-full bg-background relative h-2 rounded-full overflow-hidden">
          <Progress value={overallProgress} className="h-2" />
        </div>
        
        {/* Stage Indicators */}
        <div className="flex justify-between mt-2">
          {stages.map((stage) => (
            <button
              key={stage.id}
              onClick={() => {
                // Only allow navigation to completed stages or current stage
                if (completedStages.includes(stage.id) || stage.id === activeStage) {
                  setActiveStage(stage.id);
                  triggerHaptic('light');
                }
              }}
              className={`flex flex-col items-center group transition-opacity ${
                activeStage === stage.id 
                  ? "opacity-100" 
                  : completedStages.includes(stage.id)
                    ? "opacity-70 hover:opacity-100" 
                    : "opacity-40"
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                completedStages.includes(stage.id) 
                  ? "bg-green-100 text-green-600"
                  : activeStage === stage.id
                    ? "bg-primary/20 text-primary shadow-sm"
                    : "bg-muted text-muted-foreground"
              }`}>
                {completedStages.includes(stage.id) ? (
                  <Check size={16} className="text-green-600" />
                ) : (
                  <stage.icon size={16} />
                )}
              </div>
              <span className="text-xs mt-1 font-medium opacity-70 group-hover:opacity-100">
                {stage.title}
              </span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Content Area with Stage-based Rendering */}
      <div className="flex-1 overflow-y-auto px-1">
        <AnimatePresence mode="wait">
          {/* Stage 0: Video Selection */}
          {activeStage === 0 && (
            <motion.div
              key="stage-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <VideoFileUpload
                ref={videoInputRef}
                videoPreviewUrl={videoPreviewUrl}
                onVideoChange={handleVideoChange}
                onRemoveVideo={handleRemoveVideo}
              />
              
              {uploadError && (
                <div className="flex items-center p-3 mt-2 bg-red-50 text-red-700 rounded-md">
                  <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                  <p className="text-sm">{uploadError}</p>
                </div>
              )}
            </motion.div>
          )}
          
          {/* Stage 1: Video Preview & Thumbnail */}
          {activeStage === 1 && (
            <motion.div
              key="stage-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {videoPreviewUrl && (
                <>
                  <div className="bg-black rounded-lg overflow-hidden aspect-video">
                    <video 
                      src={videoPreviewUrl} 
                      controls 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  <div className="mt-4">
                    <ThumbnailUpload
                      ref={thumbnailInputRef}
                      thumbnailPreviewUrl={thumbnailPreviewUrl}
                      onThumbnailChange={handleThumbnailChange}
                      onRemoveThumbnail={handleRemoveThumbnail}
                      onGenerateThumbnail={generateThumbnail}
                      showGenerateButton={!!videoPreviewUrl}
                    />
                  </div>
                </>
              )}
            </motion.div>
          )}
          
          {/* Stage 2 & 3: Metadata & Monetization (Combined) */}
          {(activeStage === 2 || activeStage === 3) && (
            <motion.div
              key={`stage-${activeStage}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <VideoFormDetails form={form} />
              </form>
            </motion.div>
          )}
          
          {/* Stage 4: Publication */}
          {activeStage === 4 && (
            <motion.div
              key="stage-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-muted/30 rounded-lg p-6 text-center">
                <h3 className="text-xl font-semibold mb-2">Prêt à publier</h3>
                <p className="text-muted-foreground mb-6">
                  Votre vidéo est prête à être publiée. Cliquez sur le bouton ci-dessous pour finaliser.
                </p>
                
                {isUploading ? (
                  <div className="space-y-4">
                    <Progress value={uploadProgress} className="h-2" />
                    <p className="text-sm text-muted-foreground">{uploadStage} - {uploadProgress}%</p>
                  </div>
                ) : (
                  <Button 
                    type="submit" 
                    className="w-full"
                    onClick={() => form.handleSubmit(handleSubmit)()}
                  >
                    Publier la vidéo
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Footer Actions */}
      <div className="mt-6 flex justify-between pt-4 border-t">
        <Button 
          variant="outline" 
          onClick={activeStage === 0 ? onClose : goToPreviousStage}
        >
          {activeStage === 0 ? 'Annuler' : 'Précédent'}
        </Button>
        
        <Button
          onClick={
            activeStage === stages.length - 1 
              ? () => form.handleSubmit(handleSubmit)() 
              : completeCurrentStage
          }
          disabled={
            (activeStage === 0 && !videoFile) || 
            (activeStage === 1 && !thumbnailPreviewUrl) || 
            (activeStage === stages.length - 1 && (!form.getValues().title || isUploading))
          }
        >
          {activeStage === stages.length - 1 ? 'Publier' : 'Suivant'}
        </Button>
      </div>
      
      {/* Confetti Animation on Completion */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          {/* Simple confetti effect - in a real implementation you might use a library like react-confetti */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 20 }}
              transition={{ duration: 1.5 }}
              className="w-6 h-6 bg-primary opacity-10 rounded-full"
            />
          </div>
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                top: "50%", 
                left: "50%", 
                scale: 0,
                opacity: 1,
                backgroundColor: ['#FF6B6B', '#4ECDC4', '#FFD166', '#118AB2'][i % 4]  
              }}
              animate={{ 
                top: `${Math.random() * 100}%`, 
                left: `${Math.random() * 100}%`,
                scale: Math.random() * 1 + 0.5,
                opacity: 0,
              }}
              transition={{ duration: 1.5, delay: i * 0.05 }}
              className="absolute w-2 h-2 rounded-full"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default EnhancedVideoUpload;
