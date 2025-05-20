
import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import useStories, { Story } from '@/hooks/use-stories';

interface StoriesViewerProps {
  stories: Story[];
  initialStoryIndex: number;
  onClose: () => void;
  onNextUser?: () => void;
  onPrevUser?: () => void;
}

const StoriesViewer: React.FC<StoriesViewerProps> = ({
  stories,
  initialStoryIndex,
  onClose,
  onNextUser,
  onPrevUser
}) => {
  const { markStoryAsViewed } = useStories();
  const [currentIndex, setCurrentIndex] = useState(initialStoryIndex);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isMediaError, setIsMediaError] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  
  const currentStory = stories[currentIndex];
  const isVideo = currentStory?.media_url?.includes('.mp4') || currentStory?.media_url?.includes('.mov');
  
  // Default duration for stories
  const defaultDuration = 5000; // 5 seconds for images
  const storyDuration = currentStory?.duration ? currentStory.duration * 1000 : defaultDuration;
  
  useEffect(() => {
    if (!currentStory) return;
    
    // Mark story as viewed
    markStoryAsViewed(currentStory.id);
    
    // Reset state for new story
    setProgress(0);
    setIsVideoLoaded(false);
    setIsMediaError(false);
    
    // Clear any existing interval
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    
    // Start progress tracking for images immediately, for videos wait until loaded
    if (!isVideo) {
      startProgressTracking();
    }
    
    // Auto-pause when switching to a new story
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(err => {
          console.error("Failed to play video:", err);
        });
      } else {
        videoRef.current.pause();
      }
    }
    
    // Return cleanup function
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [currentStory, currentIndex, isVideo, isPlaying, markStoryAsViewed]);
  
  const startProgressTracking = () => {
    // Don't start if there's already an interval
    if (progressIntervalRef.current) return;
    
    const duration = isVideo && videoRef.current 
      ? videoRef.current.duration * 1000 
      : storyDuration;
    
    const startTime = Date.now();
    const endTime = startTime + duration;
    
    progressIntervalRef.current = setInterval(() => {
      const now = Date.now();
      const elapsed = now - startTime;
      const newProgress = Math.min(100, (elapsed / duration) * 100);
      setProgress(newProgress);
      
      if (now >= endTime) {
        handleNext();
      }
    }, 100);
  };
  
  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
    } else {
      onNextUser?.();
    }
  };
  
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prevIndex => prevIndex - 1);
    } else {
      onPrevUser?.();
    }
  };
  
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    
    if (isVideo && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(err => {
          console.error("Failed to play video:", err);
          toast({
            title: "Erreur",
            description: "Impossible de lire la vidéo",
            variant: "destructive"
          });
        });
      }
    }
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };
  
  const handleVideoLoaded = () => {
    setIsVideoLoaded(true);
    startProgressTracking();
  };
  
  const handleMediaError = () => {
    setIsMediaError(true);
    toast({
      title: "Erreur",
      description: "Impossible de charger le média",
      variant: "destructive"
    });
  };
  
  if (!currentStory) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
      {/* Close button */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-white z-10 p-2"
        aria-label="Close"
      >
        <X size={24} />
      </button>
      
      {/* Navigation buttons */}
      <button 
        onClick={handlePrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white z-10 p-2"
        aria-label="Previous"
      >
        <ChevronLeft size={24} />
      </button>
      
      <button 
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white z-10 p-2"
        aria-label="Next"
      >
        <ChevronRight size={24} />
      </button>
      
      {/* Story content container */}
      <div className="w-full max-w-md max-h-[80vh] relative">
        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 z-10">
          <div 
            className="h-full bg-white"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Creator info */}
        <div className="absolute top-4 left-4 flex items-center z-10">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white">
            <img 
              src={currentStory.creator_avatar || `https://i.pravatar.cc/150?u=${currentStory.creator_id}`} 
              alt={currentStory.creator_name || "Creator"}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="ml-2 text-white">
            <div className="font-semibold text-sm">
              {currentStory.creator_name || "Creator"}
            </div>
            <div className="text-xs text-white/70">
              {new Date(currentStory.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
        
        {/* Media content */}
        <div className="flex items-center justify-center h-full">
          {isVideo ? (
            <div className="relative w-full h-full flex items-center justify-center">
              {!isVideoLoaded && !isMediaError && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                </div>
              )}
              
              {isMediaError && (
                <div className="text-white bg-black/50 p-4 rounded">
                  Erreur de chargement de la vidéo
                </div>
              )}
              
              <video 
                src={currentStory.media_url}
                className="max-h-[80vh] max-w-full object-contain"
                autoPlay={true}
                playsInline={true}
                muted={isMuted}
                controls={false}
                onLoadedData={handleVideoLoaded}
                onError={handleMediaError}
                loop={false}
                ref={videoRef}
              />
              
              {/* Video controls */}
              <div className="absolute bottom-4 right-4 flex items-center space-x-4">
                <button onClick={togglePlayPause} className="text-white p-2">
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <button onClick={toggleMute} className="text-white p-2">
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
              </div>
            </div>
          ) : (
            <img 
              src={currentStory.media_url}
              alt={currentStory.caption || "Story"}
              className="max-h-[80vh] max-w-full object-contain"
              onError={handleMediaError}
            />
          )}
        </div>
        
        {/* Caption */}
        {currentStory.caption && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
            <p className="text-white text-sm">{currentStory.caption}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoriesViewer;
