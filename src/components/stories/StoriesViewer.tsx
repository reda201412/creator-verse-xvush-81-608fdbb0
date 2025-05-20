import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import useStories from '@/hooks/use-stories';
import { useToast } from '@/hooks/use-toast';

const StoriesViewer = ({ isOpen, onClose, creatorId }) => {
  const { stories, markStoryAsViewed } = useStories();
  const { toast } = useToast();
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter stories by creator
  const creatorStories = React.useMemo(() => {
    return stories.filter(story => story.creator_id === creatorId);
  }, [stories, creatorId]);
  
  // Reset state when stories change
  useEffect(() => {
    if (creatorStories.length > 0) {
      setCurrentStoryIndex(0);
      setProgress(0);
      setIsPaused(false);
    }
  }, [creatorStories]);
  
  // Handle story progression
  useEffect(() => {
    if (!isOpen || creatorStories.length === 0 || isPaused) return;
    
    const currentStory = creatorStories[currentStoryIndex];
    if (!currentStory) return;
    
    // Mark story as viewed
    markStoryAsViewed(currentStory.id);
    
    // Set up progress timer
    const duration = currentStory.duration * 1000 || 5000; // Default to 5 seconds
    const interval = 100; // Update progress every 100ms
    const step = (interval / duration) * 100;
    
    let currentProgress = 0;
    const timer = setInterval(() => {
      currentProgress += step;
      setProgress(currentProgress);
      
      if (currentProgress >= 100) {
        clearInterval(timer);
        // Move to next story or close if last
        if (currentStoryIndex < creatorStories.length - 1) {
          setCurrentStoryIndex(prev => prev + 1);
          setProgress(0);
        } else {
          // End of stories
          setTimeout(() => onClose(), 300);
        }
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, [currentStoryIndex, creatorStories, isOpen, isPaused, markStoryAsViewed, onClose]);
  
  // Handle media loading
  const handleMediaLoaded = () => {
    setIsLoading(false);
  };
  
  // Navigate to previous story
  const handlePrevStory = (e) => {
    e.stopPropagation();
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
      setProgress(0);
    }
  };
  
  // Navigate to next story
  const handleNextStory = (e) => {
    e.stopPropagation();
    if (currentStoryIndex < creatorStories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };
  
  // Toggle pause on click
  const handleContentClick = () => {
    setIsPaused(prev => !prev);
  };
  
  // Current story being displayed
  const currentStory = creatorStories[currentStoryIndex];
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 bg-transparent border-0 h-[80vh]">
        <div className="bg-black rounded-lg overflow-hidden h-full flex items-center justify-center relative">
          {/* Close button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-2 right-2 z-10 text-white bg-black/20 hover:bg-black/40"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          
          {/* Progress bars */}
          <div className="absolute top-4 left-4 right-4 z-10 flex gap-1">
            {creatorStories.map((story, index) => (
              <div 
                key={story.id} 
                className="h-1 bg-white/30 rounded-full flex-1 overflow-hidden"
              >
                <div 
                  className="h-full bg-white"
                  style={{ 
                    width: index === currentStoryIndex ? `${progress}%` : 
                           index < currentStoryIndex ? '100%' : '0%'
                  }}
                />
              </div>
            ))}
          </div>
          
          {/* Creator info */}
          <div className="absolute top-8 left-4 z-10 flex items-center">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white">
              <img 
                src={currentStory?.creator_avatar || `https://i.pravatar.cc/150?u=${creatorId}`}
                alt="Creator"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="ml-2 text-white">
              <p className="font-medium">{currentStory?.creator_name || 'Creator'}</p>
              <p className="text-xs opacity-80">
                {currentStory ? new Date(currentStory.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
              </p>
            </div>
          </div>
          
          {/* Story content */}
          {currentStory && (
            <div 
              className="w-full h-full flex items-center justify-center"
              onClick={handleContentClick}
            >
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Skeleton className="w-12 h-12 rounded-full" />
                </div>
              )}
              
              {currentStory.format.includes('video') || currentStory.media_url.includes('.mp4') ? (
                <video
                  src={currentStory.media_url}
                  className="w-full h-full object-contain"
                  autoPlay
                  playsInline
                  muted={false}
                  controls={false}
                  onLoadedData={handleMediaLoaded}
                  onError={() => {
                    toast({
                      title: "Error",
                      description: "Failed to load video",
                      variant: "destructive"
                    });
                    setIsLoading(false);
                  }}
                  loop={false}
                  paused={isPaused}
                />
              ) : (
                <img
                  src={currentStory.media_url}
                  alt="Story"
                  className="w-full h-full object-contain"
                  onLoad={handleMediaLoaded}
                  onError={() => {
                    toast({
                      title: "Error",
                      description: "Failed to load image",
                      variant: "destructive"
                    });
                    setIsLoading(false);
                  }}
                />
              )}
              
              {/* Caption */}
              {currentStory.caption && (
                <div className="absolute bottom-8 left-4 right-4 text-white text-center bg-black/30 p-2 rounded">
                  {currentStory.caption}
                </div>
              )}
            </div>
          )}
          
          {/* Navigation buttons */}
          <button 
            className="absolute left-2 top-1/2 transform -translate-y-1/2 w-12 h-12 flex items-center justify-center text-white opacity-70 hover:opacity-100"
            onClick={handlePrevStory}
            disabled={currentStoryIndex === 0}
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          
          <button 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 w-12 h-12 flex items-center justify-center text-white opacity-70 hover:opacity-100"
            onClick={handleNextStory}
          >
            <ChevronRight className="h-8 w-8" />
          </button>
          
          {/* Pause indicator */}
          {isPaused && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="bg-white/20 rounded-full p-4">
                <div className="w-12 h-12 border-4 border-white rounded-full" />
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StoriesViewer;
