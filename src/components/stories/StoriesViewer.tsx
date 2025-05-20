import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { XCircle, Heart, MessageCircle, Share, MoreVertical } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useStories } from '@/hooks/use-stories';
import { Story } from '@/types/stories';

interface StoriesViewerProps {
  stories: Story[];
  initialStoryId?: string;
  onClose: () => void;
}

const StoriesViewer: React.FC<StoriesViewerProps> = ({ stories, initialStoryId, onClose }) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    // Find the initial story index based on the initialStoryId
    if (initialStoryId) {
      const initialIndex = stories.findIndex(story => story.id === initialStoryId);
      if (initialIndex !== -1) {
        setCurrentStoryIndex(initialIndex);
      }
    }
  }, [initialStoryId, stories]);
  
  useEffect(() => {
    // Reset progress when the story changes
    setCurrentProgress(0);
    
    // Start the progress bar when the component mounts or the story changes
    startProgress();
    
    // Pause the progress bar if isPaused is true
    if (isPaused) {
      pauseProgress();
    }
    
    // Cleanup the interval when the component unmounts
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [currentStoryIndex, isPaused]);
  
  const startProgress = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    
    progressInterval.current = setInterval(() => {
      setCurrentProgress(prevProgress => {
        if (prevProgress < 100) {
          return prevProgress + 1;
        } else {
          clearInterval(progressInterval.current);
          handleNextStory();
          return 0;
        }
      });
    }, 50);
  };
  
  const pauseProgress = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
  };
  
  const handleNextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else {
      onClose();
    }
  };
  
  const handlePreviousStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    } else {
      onClose();
    }
  };
  
  const currentStory = stories[currentStoryIndex];

  // Fix story property access by adapting to the Story interface
  const renderStory = (story: Story) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    
    return (
      <div className="relative h-full w-full">
        {/* Make sure to use the correct property names from Story type */}
        {story.media_url.endsWith('.mp4') ? (
          <video 
            ref={videoRef}
            src={story.media_url}
            className="h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          <img 
            src={story.media_url} 
            alt="Story" 
            className="h-full w-full object-cover" 
          />
        )}
        
        {/* Creator info */}
        <div className="absolute top-4 left-4 flex items-center space-x-2">
          <img
            src={story.creator_avatar || `https://i.pravatar.cc/150?u=${story.creator_id}`}
            alt="Creator"
            className="h-10 w-10 rounded-full border-2 border-white"
          />
          <div className="text-white">
            <p className="font-medium">{story.creator_name || `User_${story.creator_id.substring(0, 5)}`}</p>
            <p className="text-xs opacity-80">
              {new Date(story.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        {/* Caption */}
        {story.caption && (
          <div className="absolute bottom-20 left-4 right-4 bg-black/30 backdrop-blur-sm p-3 rounded-lg">
            <p className="text-white">{story.caption}</p>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
    >
      {/* Close button */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 z-10 text-white"
      >
        <XCircle className="h-8 w-8" />
      </button>
      
      {/* Story progress bar */}
      <div className="absolute top-0 left-0 right-0 px-4 py-2 z-10">
        <Progress 
          value={currentProgress} 
          className="h-1 bg-gray-500/50" 
          indicatorClassName="bg-white"
        />
      </div>
      
      {/* Main story content */}
      <div className="w-full h-full max-w-md mx-auto">
        {currentStory && renderStory(currentStory)}
      </div>
      
      {/* Controls for next/previous */}
      <div className="absolute inset-0 flex">
        <div className="w-1/2 h-full" onClick={handlePreviousStory} />
        <div className="w-1/2 h-full" onClick={handleNextStory} />
      </div>
      
      {/* Action buttons */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-6">
        <button className="text-white p-2 rounded-full bg-white/10">
          <Heart className="h-6 w-6" />
        </button>
        <button className="text-white p-2 rounded-full bg-white/10">
          <MessageCircle className="h-6 w-6" />
        </button>
        <button className="text-white p-2 rounded-full bg-white/10">
          <Share className="h-6 w-6" />
        </button>
        <button className="text-white p-2 rounded-full bg-white/10">
          <MoreVertical className="h-6 w-6" />
        </button>
      </div>
    </motion.div>
  );
};

export default StoriesViewer;
