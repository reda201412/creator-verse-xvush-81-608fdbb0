
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Pause, Play } from 'lucide-react';

// Types for story content
interface Story {
  id: string;
  url: string;
  type: 'image' | 'video';
  duration?: number;
}

interface StoriesViewerProps {
  stories: Story[];
  onClose: () => void;
  autoPlayInterval?: number;
  allowSkip?: boolean;
}

const StoriesViewer = ({
  stories,
  onClose,
  autoPlayInterval = 5000,
  allowSkip = true
}: StoriesViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  
  const currentStory = stories[currentIndex];
  const storyDuration = currentStory?.duration || autoPlayInterval;
  
  const goToNextStory = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };
  
  const goToPreviousStory = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
    }
  };
  
  const togglePause = () => {
    setIsPaused(!isPaused);
  };
  
  // Progress timer effect
  useEffect(() => {
    if (!isPaused && loaded) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (100 / storyDuration) * 100;
          
          if (newProgress >= 100) {
            clearInterval(interval);
            goToNextStory();
            return 0;
          }
          
          return newProgress;
        });
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [currentIndex, isPaused, loaded, storyDuration]);
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && allowSkip) {
        goToNextStory();
      } else if (e.key === 'ArrowLeft' && allowSkip) {
        goToPreviousStory();
      } else if (e.key === 'Escape') {
        onClose();
      } else if (e.key === ' ') { // Space bar
        togglePause();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, allowSkip]);
  
  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <Button 
        variant="ghost" 
        size="icon"
        className="absolute top-4 right-4 z-50 text-white"
        onClick={onClose}
      >
        <X size={24} />
      </Button>
      
      <div className="relative w-full max-w-3xl aspect-[9/16] overflow-hidden">
        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 flex gap-1 p-2 z-30">
          {stories.map((_, idx) => (
            <div key={idx} className="h-1 bg-gray-500/50 rounded-full flex-1">
              {idx === currentIndex && (
                <div 
                  className="h-full bg-white rounded-full"
                  style={{ width: `${progress}%` }}
                />
              )}
              {idx < currentIndex && (
                <div className="h-full bg-white rounded-full w-full" />
              )}
            </div>
          ))}
        </div>
        
        {/* Story content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full"
          >
            {currentStory.type === 'image' ? (
              <img 
                src={currentStory.url} 
                className="w-full h-full object-contain"
                onLoad={() => setLoaded(true)} 
                alt="Story content"
              />
            ) : (
              <video 
                src={currentStory.url}
                className="w-full h-full object-contain"
                autoPlay
                muted={isPaused}
                onLoadedData={() => setLoaded(true)}
              />
            )}
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation controls */}
        {allowSkip && (
          <>
            <button
              className="absolute left-0 top-0 w-1/4 h-full z-20"
              onClick={goToPreviousStory}
            />
            <button
              className="absolute right-0 top-0 w-1/4 h-full z-20"
              onClick={goToNextStory}
            />
          </>
        )}
        
        {/* Play/Pause button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute bottom-4 right-4 rounded-full bg-black/30 text-white z-30"
          onClick={togglePause}
        >
          {isPaused ? <Play size={20} /> : <Pause size={20} />}
        </Button>
      </div>
    </div>
  );
};

export default StoriesViewer;
