
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import EnhancedVideoPlayer from '@/components/video/EnhancedVideoPlayer';
import { useVideoMetrics } from '@/hooks/use-video-metrics';
import { useNeuroAesthetic } from '@/hooks/use-neuro-aesthetic';
import { useMediaQuery } from '@/hooks/use-media-query';

interface ImmersiveViewProps {
  isOpen: boolean;
  onClose: () => void;
  content: any[];
  initialIndex: number;
}

const ImmersiveView = ({ isOpen, onClose, content, initialIndex = 0 }: ImmersiveViewProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isInfoVisible, setIsInfoVisible] = useState(true);
  const [isScrollLocked, setIsScrollLocked] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSwipeActive, setIsSwipeActive] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<null | 'left' | 'right'>(null);
  
  const { trackEvent, updateProgress } = useVideoMetrics(content[currentIndex]?.id || 'unknown');
  const { triggerMicroReward } = useNeuroAesthetic();
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  useEffect(() => {
    if (isOpen) {
      // Add a small delay before locking scroll to ensure smooth transition
      const scrollTimer = setTimeout(() => {
        document.body.style.overflow = 'hidden';
        setIsScrollLocked(true);
      }, 50);
      
      // Add keyboard navigation
      const handleKeydown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
        if (e.key === 'ArrowLeft') goToPrevious();
        if (e.key === 'ArrowRight') goToNext();
        if (e.key === 'i') setIsInfoVisible(prev => !prev);
        if (e.key === 'm') setIsMuted(prev => !prev);
      };
      
      window.addEventListener('keydown', handleKeydown);
      
      // Track opening event
      trackEvent('play');
      
      return () => {
        clearTimeout(scrollTimer);
        document.body.style.overflow = 'auto';
        setIsScrollLocked(false);
        window.removeEventListener('keydown', handleKeydown);
        
        // Track closing event
        trackEvent('pause');
      };
    }
  }, [isOpen, trackEvent]);

  useEffect(() => {
    if (!isOpen && isScrollLocked) {
      // Ensure scroll is restored when closing
      document.body.style.overflow = 'auto';
      setIsScrollLocked(false);
    }
  }, [isOpen, isScrollLocked]);

  if (!isOpen) return null;
  
  const currentContent = content[currentIndex];
  
  const goToNext = () => {
    // Track seek event
    trackEvent('seek', { direction: 'next' });
    
    setSwipeDirection('left');
    setIsSwipeActive(true);
    
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % content.length);
      
      setTimeout(() => {
        setIsSwipeActive(false);
        setSwipeDirection(null);
      }, 50);
    }, 300);
    
    triggerMicroReward('navigate');
  };
  
  const goToPrevious = () => {
    // Track seek event
    trackEvent('seek', { direction: 'previous' });
    
    setSwipeDirection('right');
    setIsSwipeActive(true);
    
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + content.length) % content.length);
      
      setTimeout(() => {
        setIsSwipeActive(false);
        setSwipeDirection(null);
      }, 50);
    }, 300);
    
    triggerMicroReward('navigate');
  };

  const handleVideoTimeUpdate = (currentTime: number, duration: number) => {
    updateProgress(currentTime, duration);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          style={{ willChange: 'opacity' }}
        >
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10 text-white hover:bg-white/10 rounded-full"
            onClick={() => {
              // Restore scroll before animation completes
              document.body.style.overflow = 'auto';
              setIsScrollLocked(false);
              onClose();
            }}
          >
            <X size={24} />
          </Button>
          
          {/* Mute button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-16 z-10 text-white hover:bg-white/10 rounded-full"
            onClick={() => setIsMuted(prev => !prev)}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </Button>
          
          {/* Content display with swipe animations */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentIndex}
              className="w-full h-full flex items-center justify-center"
              initial={{ 
                x: swipeDirection === 'left' ? 300 : swipeDirection === 'right' ? -300 : 0,
                opacity: 0 
              }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ 
                x: swipeDirection === 'left' ? -300 : swipeDirection === 'right' ? 300 : 0,
                opacity: 0 
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{ willChange: 'transform, opacity' }}
            >
              {currentContent.format === 'video' ? (
                <div className="w-full max-w-4xl aspect-video relative">
                  <EnhancedVideoPlayer
                    src={currentContent.videoUrl || 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4'} 
                    thumbnailUrl={currentContent.thumbnailUrl}
                    title={currentContent.title}
                    autoPlay={true}
                    muted={isMuted}
                    onTimeUpdate={handleVideoTimeUpdate}
                    onPlay={() => trackEvent('play')}
                    onPause={() => trackEvent('pause')}
                    onError={(error) => trackEvent('error', { message: error?.message || 'Unknown error' })}
                    className="max-h-[85vh] max-w-[85vw]"
                  />
                </div>
              ) : (
                <img 
                  src={currentContent.imageUrl} 
                  alt={currentContent.title || 'Content'} 
                  className="max-h-[85vh] max-w-[85vw] object-contain"
                  loading="eager"
                />
              )}
            </motion.div>
          </AnimatePresence>
          
          {/* Navigation controls */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 rounded-full h-12 w-12"
            onClick={goToPrevious}
            disabled={isSwipeActive}
          >
            <ChevronLeft size={36} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 rounded-full h-12 w-12"
            onClick={goToNext}
            disabled={isSwipeActive}
          >
            <ChevronRight size={36} />
          </Button>
          
          {/* Info panel - use ScrollArea for smooth scrolling when needed */}
          <AnimatePresence>
            {isInfoVisible && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 pb-16"
              >
                <ScrollArea className="max-h-32">
                  <h2 className="text-xl font-medium mb-2 text-white">{currentContent.title}</h2>
                  {currentContent.metrics && (
                    <div className="flex items-center gap-4 text-sm text-white/80">
                      {currentContent.metrics.views && (
                        <span>{currentContent.metrics.views.toLocaleString()} vues</span>
                      )}
                      {currentContent.metrics.likes && (
                        <span>{currentContent.metrics.likes.toLocaleString()} likes</span>
                      )}
                      {currentContent.metrics.comments && (
                        <span>{currentContent.metrics.comments.toLocaleString()} commentaires</span>
                      )}
                      {currentContent.metrics.revenue && (
                        <span className="text-green-400">${currentContent.metrics.revenue} générés</span>
                      )}
                    </div>
                  )}
                </ScrollArea>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Page indicator */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1">
            {content.map((_, index) => (
              <motion.div 
                key={index}
                className={cn(
                  "h-1 rounded-full transition-all",
                  index === currentIndex 
                    ? "w-8 bg-white" 
                    : "w-2 bg-white/50"
                )}
                initial={{ scale: 0.8, opacity: 0.6 }}
                animate={{ 
                  scale: index === currentIndex ? 1 : 0.8,
                  opacity: index === currentIndex ? 1 : 0.6
                }}
                transition={{ duration: 0.2 }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImmersiveView;
