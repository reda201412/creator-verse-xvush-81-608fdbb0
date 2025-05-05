
import React, { useState, useEffect, useRef } from 'react';
import { Story } from '@/types/stories';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, X, MessageCircle, Heart, Share2 } from 'lucide-react';
import { useStories } from '@/hooks/use-stories';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useNeuroAesthetic } from '@/hooks/use-neuro-aesthetic';
import { useAuth } from '@/contexts/AuthContext';
import EnhancedVideoPlayer from '@/components/video/EnhancedVideoPlayer';
import { MediaCacheService } from '@/services/media-cache.service';

interface StoriesViewerProps {
  isOpen: boolean;
  onClose: () => void;
  initialGroupIndex?: number;
}

const StoriesViewer: React.FC<StoriesViewerProps> = ({
  isOpen,
  onClose,
  initialGroupIndex = 0
}) => {
  const {
    storyGroups,
    activeStoryIndex,
    activeGroupIndex,
    loadStories,
    nextStory,
    prevStory,
    markStoryAsViewed,
    setActiveGroupIndex,
    setActiveStoryIndex
  } = useStories();
  
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeStartX, setSwipeStartX] = useState(0);
  const timerRef = useRef<number | null>(null);
  const viewStartTimeRef = useRef<number>(Date.now());
  
  const { triggerMicroReward } = useNeuroAesthetic();
  const { user } = useAuth();
  
  // Initialize with the initial group if provided
  useEffect(() => {
    if (isOpen && initialGroupIndex !== undefined && storyGroups.length > 0) {
      const validIndex = Math.min(initialGroupIndex, storyGroups.length - 1);
      setActiveGroupIndex(validIndex);
      setActiveStoryIndex(0);
    }
  }, [isOpen, initialGroupIndex, storyGroups.length, setActiveGroupIndex, setActiveStoryIndex]);
  
  // Current story
  const currentGroup = storyGroups[activeGroupIndex] || null;
  const currentStory = currentGroup?.stories[activeStoryIndex] || null;
  
  // Handle the timer to progress to the next story
  useEffect(() => {
    if (!isOpen || !currentStory || isPaused || isVideoPlaying) return;
    
    const duration = currentStory.duration * 1000; // Convert to milliseconds
    
    // Reset the progress
    setProgress(0);
    
    // Record when the user started viewing the story
    viewStartTimeRef.current = Date.now();
    
    // Mark the story as viewed
    markStoryAsViewed(currentStory.id);
    
    // Pre-cache next stories for smoother viewing
    const preloadNextStories = async () => {
      // Find the next 2 stories to preload
      const storiesQueue = [];
      
      // Add the next story in current group
      if (currentGroup && activeStoryIndex < currentGroup.stories.length - 1) {
        storiesQueue.push(currentGroup.stories[activeStoryIndex + 1]);
      }
      
      // Add the first story of the next group
      if (activeGroupIndex < storyGroups.length - 1) {
        const nextGroup = storyGroups[activeGroupIndex + 1];
        if (nextGroup && nextGroup.stories.length > 0) {
          storiesQueue.push(nextGroup.stories[0]);
        }
      }
      
      // Preload media
      storiesQueue.forEach(story => {
        if (story) {
          const isVideo = story.media_url.includes('.mp4') || 
                        story.media_url.includes('.webm');
                        
          // For videos, just prefetch
          if (isVideo) {
            fetch(story.media_url, { method: 'HEAD' }).catch(() => {});
          } 
          // For images, actually preload
          else {
            const img = new Image();
            img.src = story.media_url;
          }
          
          // Preload thumbnail if available
          if (story.thumbnail_url) {
            const thumbImg = new Image();
            thumbImg.src = story.thumbnail_url;
          }
        }
      });
    };
    
    preloadNextStories();
    
    // Progress animation
    const startTime = Date.now();
    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const progressValue = Math.min((elapsed / duration) * 100, 100);
      setProgress(progressValue);
      
      if (progressValue < 100) {
        timerRef.current = window.requestAnimationFrame(updateProgress);
      } else {
        // Move to the next story
        nextStory();
      }
    };
    
    timerRef.current = window.requestAnimationFrame(updateProgress);
    
    return () => {
      if (timerRef.current !== null) {
        window.cancelAnimationFrame(timerRef.current);
      }
    };
  }, [isOpen, currentStory, isPaused, isVideoPlaying, nextStory, markStoryAsViewed, currentGroup, activeStoryIndex, activeGroupIndex, storyGroups]);
  
  // Clean up when closing
  const handleClose = () => {
    if (timerRef.current !== null) {
      window.cancelAnimationFrame(timerRef.current);
    }
    
    // Record the viewing duration if a story is active
    if (currentStory) {
      const viewDuration = Math.round((Date.now() - viewStartTimeRef.current) / 1000);
      markStoryAsViewed(currentStory.id, viewDuration);
    }
    
    onClose();
  };
  
  // Navigate between stories
  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    nextStory();
    triggerMicroReward('navigate');
  };
  
  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    prevStory();
    triggerMicroReward('navigate');
  };
  
  // Handle touch interactions
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    setIsSwiping(true);
    setSwipeStartX(e.touches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return;
    
    const currentX = e.touches[0].clientX;
    const diff = currentX - swipeStartX;
    
    // You could add some visual feedback here based on the swipe distance
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isSwiping) return;
    
    const endX = e.changedTouches[0].clientX;
    const diff = endX - swipeStartX;
    
    // If swiped far enough
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swiped right
        prevStory();
      } else {
        // Swiped left
        nextStory();
      }
      triggerMicroReward('gesture');
    }
    
    setIsSwiping(false);
    setIsPaused(false);
  };
  
  // Handle content clicks
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Determine if the click is on the left or right side
    const clickX = e.clientX;
    const elementWidth = (e.currentTarget as HTMLElement).offsetWidth;
    
    if (clickX < elementWidth / 2) {
      prevStory();
    } else {
      nextStory();
    }
  };
  
  const handleInteraction = (type: 'like' | 'comment' | 'share') => {
    switch (type) {
      case 'like':
        triggerMicroReward('like', { type: 'story_liked' });
        break;
      case 'comment':
        triggerMicroReward('message', { type: 'story_comment' });
        break;
      case 'share':
        // Update to use a valid MicroRewardType
        triggerMicroReward('action', { type: 'story_shared' });
        break;
    }
  };
  
  // Handle video specific events
  const handleVideoPlay = () => {
    setIsVideoPlaying(true);
    setIsPaused(true); // Pause the story timer while video is playing
  };
  
  const handleVideoPause = () => {
    setIsVideoPlaying(false);
    setIsPaused(false); // Resume the story timer
  };
  
  const handleVideoEnded = () => {
    setIsVideoPlaying(false);
    setIsPaused(false); // Resume the story timer
    nextStory(); // Automatically move to next story when video ends
  };
  
  // Load stories when opened
  useEffect(() => {
    if (isOpen) {
      loadStories();
    }
  }, [isOpen, loadStories]);
  
  if (!isOpen) return null;
  
  const isVideoStory = currentStory?.media_url.includes('.mp4') || 
                       currentStory?.media_url.includes('.webm');
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="p-0 max-w-md h-[90vh] max-h-[90vh] bg-black relative overflow-hidden">
        {currentStory ? (
          <>
            {/* Progress bar */}
            <div className="absolute top-0 left-0 right-0 z-10 flex space-x-1 p-2 bg-gradient-to-b from-black/80 to-transparent">
              {currentGroup?.stories.map((_, index) => (
                <Progress 
                  key={index} 
                  value={index === activeStoryIndex ? progress : (index < activeStoryIndex ? 100 : 0)} 
                  className="h-1 flex-1"
                />
              ))}
            </div>
            
            {/* Creator info */}
            <div className="absolute top-6 left-0 right-0 z-10 flex items-center justify-between px-4">
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8 border border-white">
                  <AvatarImage src={currentGroup?.creator.avatar_url || undefined} />
                  <AvatarFallback>
                    {currentGroup?.creator.display_name?.charAt(0) || currentGroup?.creator.username.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-white text-sm font-medium">
                    {currentGroup?.creator.display_name || currentGroup?.creator.username}
                  </p>
                  <p className="text-gray-300 text-xs">
                    {currentStory.created_at && formatDistanceToNow(new Date(currentStory.created_at), {
                      addSuffix: true,
                      locale: fr
                    })}
                  </p>
                </div>
              </div>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-white/20"
                onClick={handleClose}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Main content */}
            <div 
              className="h-full w-full flex items-center justify-center bg-gray-900"
              onClick={handleContentClick}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {isVideoStory ? (
                <EnhancedVideoPlayer
                  src={currentStory.media_url}
                  thumbnailUrl={currentStory.thumbnail_url || undefined}
                  autoPlay={isPlaying}
                  className={`max-h-full max-w-full ${
                    currentStory.filter_used && currentStory.filter_used !== 'none' 
                      ? `filter-${currentStory.filter_used}` 
                      : ''
                  }`}
                  onPlay={handleVideoPlay}
                  onPause={handleVideoPause}
                  onEnded={handleVideoEnded}
                />
              ) : (
                <img 
                  src={currentStory.media_url}
                  alt="Story"
                  className={`max-h-full max-w-full object-contain ${
                    currentStory.filter_used && currentStory.filter_used !== 'none' 
                      ? `filter-${currentStory.filter_used}` 
                      : ''
                  }`}
                />
              )}
            </div>
            
            {/* Caption and tags */}
            {(currentStory.caption || currentStory.tags?.length) && (
              <div className="absolute bottom-16 left-0 right-0 z-10 p-4 bg-gradient-to-t from-black/80 to-transparent">
                {currentStory.caption && (
                  <p className="text-white text-sm mb-2">{currentStory.caption}</p>
                )}
                
                {currentStory.tags && currentStory.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {currentStory.tags.map((tag) => (
                      <Badge 
                        key={tag.id} 
                        variant="secondary" 
                        className="bg-white/20 hover:bg-white/30"
                      >
                        #{tag.tag_name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Interaction buttons */}
            <div className="absolute bottom-0 left-0 right-0 z-10 flex justify-between items-center p-4 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex space-x-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white hover:bg-white/20"
                  onClick={() => handleInteraction('like')}
                >
                  <Heart className="h-5 w-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white hover:bg-white/20"
                  onClick={() => handleInteraction('comment')}
                >
                  <MessageCircle className="h-5 w-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white hover:bg-white/20"
                  onClick={() => handleInteraction('share')}
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {/* Navigation buttons */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white/70 hover:bg-black/30 z-20"
              onClick={handlePrev}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/70 hover:bg-black/30 z-20"
              onClick={handleNext}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center">
            <p className="text-white text-center p-8">
              {storyGroups.length === 0
                ? "Aucune story disponible. Soyez le premier à partager une story !"
                : "Chargement..."}
            </p>
            <Button variant="outline" onClick={handleClose}>
              Fermer
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StoriesViewer;
