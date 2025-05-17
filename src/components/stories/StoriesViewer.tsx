
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { StoryData } from '@/types/stories';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { X, Heart, MessageCircle, Share2 } from 'lucide-react';

interface StoriesViewerProps {
  stories: StoryData[];
  onClose: () => void;
  onReaction?: (storyId: string, reaction: string) => void;
}

const StoriesViewer: React.FC<StoriesViewerProps> = ({ 
  stories, 
  onClose,
  onReaction
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const intervalRef = useRef<number | null>(null);
  
  const currentStory = stories[currentIndex];
  const storyDuration = currentStory?.duration || 5; // default to 5 seconds
  
  useEffect(() => {
    // Reset progress when story changes
    setProgress(0);
    setIsLoaded(false);
    
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    if (isPlaying) {
      // Set up a new interval for the current story
      const interval = setInterval(() => {
        setProgress(prev => {
          // Calculate increments to reach 100% over the story duration
          const increment = 100 / (storyDuration * 10); // 10 updates per second
          const newValue = prev + increment;
          
          // Move to next story when done
          if (newValue >= 100) {
            clearInterval(interval);
            
            // Go to next story or close if at the end
            if (currentIndex < stories.length - 1) {
              setCurrentIndex(prev => prev + 1);
            } else {
              onClose();
            }
            
            return 0;
          }
          
          return newValue;
        });
      }, 100); // Update every 100ms for smoother progress
      
      intervalRef.current = interval as unknown as number;
      
      // Clean up on unmount
      return () => clearInterval(interval);
    }
  }, [currentIndex, isPlaying, storyDuration, stories.length, onClose]);
  
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };
  
  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onClose();
    }
  };
  
  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  };
  
  const handleMediaLoad = () => {
    setIsLoaded(true);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
      <Card className="relative max-w-md w-full h-[80vh] overflow-hidden rounded-lg bg-black">
        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 z-10 p-2">
          <Progress value={progress} className="h-1" />
        </div>
        
        {/* Close button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-2 right-2 z-10 text-white bg-black bg-opacity-50 rounded-full h-8 w-8"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        
        {/* Story content */}
        <div 
          className="relative h-full w-full"
          onClick={togglePlay}
        >
          {currentStory?.mediaUrl.endsWith('.mp4') ? (
            <video 
              src={currentStory.mediaUrl} 
              className="h-full w-full object-cover"
              autoPlay={isPlaying}
              loop={false}
              muted={false}
              onLoadedData={handleMediaLoad}
              onEnded={handleNext}
            />
          ) : (
            <img 
              src={currentStory?.mediaUrl} 
              className="h-full w-full object-cover"
              alt={currentStory?.caption || "Story image"}
              onLoad={handleMediaLoad}
            />
          )}
          
          {/* Story info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent text-white">
            <div className="flex items-center mb-2">
              <img 
                src={currentStory?.creatorAvatar} 
                alt={currentStory?.creatorName}
                className="h-8 w-8 rounded-full mr-2" 
              />
              <div>
                <p className="font-semibold">{currentStory?.creatorName}</p>
                <p className="text-xs opacity-70">
                  {typeof currentStory?.createdAt === 'number' 
                    ? new Date(currentStory.createdAt).toLocaleString() 
                    : currentStory?.createdAt}
                </p>
              </div>
            </div>
            
            <p className="mb-4">{currentStory?.caption}</p>
            
            {/* Action buttons */}
            <div className="flex space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                className="flex items-center text-white"
                onClick={() => onReaction?.(currentStory.id, 'like')}
              >
                <Heart className="h-4 w-4 mr-1" />
                <span className="text-xs">{(currentStory?.reactions?.like || 0)}</span>
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm"
                className="flex items-center text-white"
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                <span className="text-xs">Comment</span>
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm"
                className="flex items-center text-white"
              >
                <Share2 className="h-4 w-4 mr-1" />
                <span className="text-xs">Share</span>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Navigation areas */}
        <div className="absolute left-0 top-0 bottom-0 w-1/3" onClick={handlePrevious} />
        <div className="absolute right-0 top-0 bottom-0 w-1/3" onClick={handleNext} />
      </Card>
    </div>
  );
};

export default StoriesViewer;
