import React, { useState, useEffect, useRef } from 'react';
// Remove unused import
// import { Story } from '@/types/stories';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { AnimatePresence, motion } from 'framer-motion';
// Remove unused import
// import { MediaCacheService } from '@/services/media-cache';

interface Story {
  id: string;
  imageUrl: string;
  duration?: number;
}

interface StoriesViewerProps {
  stories: Story[];
  onClose: () => void;
  startIndex?: number;
  creatorName?: string;
  creatorAvatar?: string;
}

const StoriesViewer = ({ stories = [], onClose, startIndex = 0, creatorName = '', creatorAvatar = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const storyDuration = 5000; // 5 seconds per story
  
  // Remove unused variable from destructuring
  const [isLoaded, /*setIsPlaying*/] = useState(false);

  useEffect(() => {
    const startProgress = () => {
      intervalRef.current = window.setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress >= 100) {
            clearInterval(intervalRef.current!);
            return 100;
          }
          return oldProgress + (100 / (storyDuration / 100));
        });
      }, 100);
    };

    const resetProgress = () => {
      clearInterval(intervalRef.current!);
      setProgress(0);
      startProgress();
    };

    startProgress();

    return () => {
      clearInterval(intervalRef.current!);
    };
  }, [currentIndex, storyDuration]);

  useEffect(() => {
    if (progress >= 100) {
      if (currentIndex < stories.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        onClose();
      }
    }
  }, [progress, currentIndex, stories.length, onClose]);

  const handlePause = () => {
    setIsPaused(true);
    clearInterval(intervalRef.current!);
  };

  const handleResume = () => {
    setIsPaused(false);
    
    intervalRef.current = window.setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(intervalRef.current!);
          return 100;
        }
        return oldProgress + (100 / (storyDuration / 100));
      });
    }, 100);
  };

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div 
      className="fixed top-0 left-0 w-full h-full bg-black/90 z-50 flex flex-col"
      onClick={isPaused ? handleResume : handlePause}
    >
      <div className="absolute top-4 left-4 w-full flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
            <img 
              src={creatorAvatar} 
              alt={creatorName} 
              className="w-full h-full object-cover" 
              onLoad={() => setIsLoaded(true)}
            />
          </div>
          <span className="text-sm text-white font-medium">{creatorName}</span>
        </div>
        <button onClick={onClose} className="text-white">
          <X size={20} />
        </button>
      </div>

      <div className="mt-16 px-4">
        <Progress value={progress} className="h-1 bg-white/20" />
      </div>

      <div className="relative flex-1 flex items-center justify-center">
        <AnimatePresence>
          {stories[currentIndex] && (
            <motion.img
              key={stories[currentIndex].id}
              src={stories[currentIndex].imageUrl}
              alt={`Story ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </AnimatePresence>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className={cn(
            "absolute left-0 top-0 h-full w-1/4 bg-black/0 hover:bg-black/20 transition-colors duration-200",
            currentIndex === 0 && "hidden"
          )}
        >
        </button>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className={cn(
            "absolute right-0 top-0 h-full w-1/4 bg-black/0 hover:bg-black/20 transition-colors duration-200",
            currentIndex === stories.length - 1 && "hidden"
          )}
        >
        </button>
      </div>
    </div>
  );
};

export default StoriesViewer;
