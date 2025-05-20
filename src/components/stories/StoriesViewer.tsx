import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Heart, MessageCircle, Share2, X } from 'lucide-react';
import { useStories } from '@/hooks/use-stories';
import { cn } from '@/lib/utils';
import { Story } from '@/types/stories';

interface StoriesViewerProps {
  stories: Story[];
  onClose: () => void;
  initialStoryId?: string;
}

const StoriesViewer: React.FC<StoriesViewerProps> = ({ stories, onClose, initialStoryId }) => {
  const { markStoryAsViewed } = useStories();
  const [currentIndex, setCurrentIndex] = useState(initialStoryId ? stories.findIndex(s => s.id === initialStoryId) : 0);
  const [isPaused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const currentStory = stories[currentIndex];
  const isVideo = currentStory?.media_url?.endsWith('.mp4') || currentStory?.media_url?.endsWith('.mov');
  const storyDuration = isVideo ? 0 : (currentStory?.duration || 5) * 1000; // Use 5 seconds as default duration for images
  
  const clearStoryTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };
  
  const markCurrentStoryAsViewed = async () => {
    if (currentStory?.id) {
      try {
        await markStoryAsViewed(currentStory.id);
      } catch (error) {
        console.error("Error marking story as viewed:", error);
      }
    }
  };
  
  useEffect(() => {
    // Mark story as viewed when it changes
    markCurrentStoryAsViewed();
    
    // Reset progress and timer when story changes
    setProgress(0);
    clearStoryTimer();
    setPaused(false);
    
    if (!isVideo) {
      startImageTimer();
    }
    
    return () => {
      clearStoryTimer();
    };
  }, [currentIndex, stories]);
  
  const startImageTimer = () => {
    let startTime = Date.now();
    const animationFrame = requestAnimationFrame(function animate() {
      if (isPaused) {
        startTime = Date.now() - (progress / 100) * storyDuration;
        requestAnimationFrame(animate);
        return;
      }
      
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(100, (elapsed / storyDuration) * 100);
      setProgress(newProgress);
      
      if (newProgress < 100) {
        requestAnimationFrame(animate);
      } else {
        goToNextStory();
      }
    });
    
    return () => cancelAnimationFrame(animationFrame);
  };
  
  const handleVideoEnded = () => {
    goToNextStory();
  };
  
  const handleVideoProgress = () => {
    if (videoRef.current) {
      const duration = videoRef.current.duration;
      const currentTime = videoRef.current.currentTime;
      setProgress((currentTime / duration) * 100);
    }
  };
  
  const togglePause = () => {
    setPaused(!isPaused);
    if (isVideo && videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };
  
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };
  
  const goToNextStory = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };
  
  const goToPrevStory = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  
  const handleTouchStart = () => {
    setPaused(true);
    if (isVideo && videoRef.current) {
      videoRef.current.pause();
    }
  };
  
  const handleTouchEnd = () => {
    setPaused(false);
    if (isVideo && videoRef.current) {
      videoRef.current.play();
    }
  };
  
  if (!currentStory) {
    return null;
  }
  
  return (
    <motion.div 
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black",
        isFullScreen ? "pb-0" : "pb-20"
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Button 
        className="absolute top-4 right-4 z-10" 
        size="icon" 
        variant="ghost"
        onClick={onClose}
      >
        <X className="h-6 w-6 text-white" />
      </Button>
      
      <div className="absolute top-4 left-4 right-4 flex space-x-2 z-10">
        {stories.map((story, index) => (
          <Progress 
            key={story.id} 
            value={index === currentIndex ? progress : index < currentIndex ? 100 : 0}
            className={cn(
              "h-1 flex-1 bg-white/20",
              index === currentIndex ? "bg-white/20" : "bg-white/40"
            )}
            indicatorClassName="bg-white"
          />
        ))}
      </div>
      
      {/* Story content */}
      <div 
        className="relative w-full max-w-sm md:max-w-md h-full max-h-screen overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={togglePause}
      >
        {/* Story header */}
        <div className="absolute top-12 left-0 right-0 px-4 z-10 flex items-center">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 p-0.5">
              <img 
                src={currentStory.creator_avatar || `https://i.pravatar.cc/150?u=${currentStory.creator_id}`} 
                className="h-full w-full rounded-full object-cover border-2 border-black" 
                alt="Profile"
              />
            </div>
            <div className="ml-2">
              <p className="text-white font-medium text-sm">{currentStory.creator_name || 'Creator'}</p>
              <p className="text-white/70 text-xs">
                {new Date(currentStory.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
        
        {/* Media content */}
        <div className="h-full flex items-center justify-center bg-black">
          {isVideo ? (
            <video
              ref={videoRef}
              src={currentStory.media_url}
              className="max-h-full max-w-full object-contain"
              autoPlay
              playsInline
              muted={false}
              controls={false}
              onLoadedData={() => setProgress(0)}
              onTimeUpdate={handleVideoProgress}
              onEnded={handleVideoEnded}
              onError={() => console.error("Video error")}
              loop={false}
            />
          ) : (
            <img 
              src={currentStory.media_url} 
              className="max-h-full max-w-full object-contain"
              alt={currentStory.caption || "Story"} 
            />
          )}
        </div>
        
        {/* Caption */}
        {currentStory.caption && (
          <div className="absolute bottom-16 left-0 right-0 p-4">
            <p className="text-white text-center bg-black/30 backdrop-blur-sm p-2 rounded-lg">
              {currentStory.caption}
            </p>
          </div>
        )}
      </div>
      
      {/* Navigation controls */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/20 hover:bg-black/40"
        onClick={goToPrevStory}
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/20 hover:bg-black/40"
        onClick={goToNextStory}
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </Button>
      
      {/* Actions */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-8">
        <Button 
          variant="ghost" 
          size="icon"
          className="text-white hover:text-pink-500 transition-colors"
          onClick={() => setIsLiked(!isLiked)}
        >
          <Heart className={cn("h-6 w-6", isLiked && "fill-pink-500 text-pink-500")} />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon"
          className="text-white hover:text-blue-500 transition-colors"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon"
          className="text-white hover:text-green-500 transition-colors"
        >
          <Share2 className="h-6 w-6" />
        </Button>
      </div>
    </motion.div>
  );
};

export default StoriesViewer;
