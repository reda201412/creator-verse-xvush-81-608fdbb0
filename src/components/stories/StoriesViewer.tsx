
import React, { useEffect, useState, useRef } from 'react';
import { useStories } from '@/hooks/use-stories';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { XCircle, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import StoryPublisher from './StoryPublisher';
import { toast } from '@/hooks/use-toast';
import { loadStories, markAsViewed } from '@/services/stories.service';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useNeuroAesthetic } from '@/hooks/use-neuro-aesthetic';
import { Story } from '@/utils/story-types';

const StoriesViewer = () => {
  const storiesContext = useStories();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { triggerMicroReward } = useNeuroAesthetic();
  const { 
    storyGroups, 
    viewerOpen, 
    currentStoryGroup, 
    currentGroupIndex, 
    activeStoryIndex, 
    activeGroupIndex, 
    publisherOpen, 
    closeViewer,
    openPublisher,
    closePublisher,
    setNextStory,
    setPreviousStory
  } = storiesContext;
  const [progress, setProgress] = useState(0);
  const storyTimer = useRef<NodeJS.Timeout | null>(null);
  
  // Add missing functions from context
  const goToNext = () => setNextStory();
  const goToPrevious = () => setPreviousStory();
  
  // Handle story timer and progression
  useEffect(() => {
    if (viewerOpen && currentStoryGroup?.length > 0) {
      setProgress(0);
      
      const storyDuration = 5000; // 5 seconds per story
      let startTime = Date.now();
      
      const timer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const calculatedProgress = Math.min((elapsed / storyDuration) * 100, 100);
        setProgress(calculatedProgress);
        
        if (calculatedProgress >= 100) {
          clearInterval(timer);
          // Navigate to next story
          goToNext();
        }
      }, 100);
      
      storyTimer.current = timer;
      
      // Mark the current story as viewed
      if (activeStoryIndex !== undefined && 
          activeGroupIndex !== undefined && 
          currentStoryGroup[activeStoryIndex]) {
        markAsViewed(currentStoryGroup[activeStoryIndex].id);
      }
      
      return () => {
        if (storyTimer.current) {
          clearInterval(storyTimer.current);
        }
      };
    }
  }, [viewerOpen, activeStoryIndex, activeGroupIndex, currentStoryGroup, goToNext]);
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!viewerOpen) return;
      
      if (e.key === 'ArrowRight') {
        if (storyTimer.current) {
          clearInterval(storyTimer.current);
        }
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        if (storyTimer.current) {
          clearInterval(storyTimer.current);
        }
        goToPrevious();
      } else if (e.key === 'Escape') {
        closeViewer();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [viewerOpen, goToNext, goToPrevious, closeViewer]);
  
  // Reload stories when viewer is opened
  useEffect(() => {
    if (viewerOpen) {
      loadStories().catch(error => {
        console.error('Error loading stories:', error);
      });
    }
  }, [viewerOpen]);
  
  // Get current story
  const currentStory = activeStoryIndex !== undefined && 
                       currentStoryGroup?.length > 0 && 
                       activeStoryIndex < currentStoryGroup.length
                         ? currentStoryGroup[activeStoryIndex]
                         : null;
  
  const currentGroupInfo = storyGroups[currentGroupIndex];
  
  // Handle story click to pause/resume
  const handleStoryClick = () => {
    if (storyTimer.current) {
      clearInterval(storyTimer.current);
      goToNext();
    }
  };
  
  // Handle profile click
  const handleProfileClick = () => {
    if (!currentGroupInfo) return;
    
    closeViewer();
    
    const username = currentGroupInfo.username;
    if (username) {
      navigate(`/creator/${username}`);
    }
  };
  
  // Handle publisher toggle
  const handlePublisherToggle = (open: boolean) => {
    if (open) {
      openPublisher();
    } else {
      closePublisher();
    }
  };
  
  // Render progress indicators for stories in the group
  const renderProgressIndicators = () => {
    if (!currentStoryGroup) return null;
    
    return (
      <div className="flex gap-1 absolute top-4 left-4 right-4 z-10">
        {currentStoryGroup.map((story, index) => (
          <Progress 
            key={story.id} 
            value={index === activeStoryIndex ? progress : index < activeStoryIndex ? 100 : 0} 
            className="h-1 flex-1"
          />
        ))}
      </div>
    );
  };
  
  if (publisherOpen) {
    return (
      <StoryPublisher 
        isOpen={publisherOpen} 
        onOpenChange={handlePublisherToggle}
        onClose={closePublisher}
        onPublish={async () => null} // Stub implementation
      />
    );
  }

  // Format date handling with safety checks
  const formatDate = (date: any) => {
    if (!date) return '';
    
    try {
      if (typeof date === 'object' && date.toDate && typeof date.toDate === 'function') {
        return date.toDate().toLocaleString();
      }
      
      return new Date(date).toLocaleString();
    } catch (err) {
      console.error('Error formatting date:', err);
      return '';
    }
  };
  
  // Get media URL with fallback
  const getMediaUrl = (story: Story | null) => {
    if (!story) return '';
    return story.media_url || story.mediaUrl || '';
  };
  
  return (
    <Dialog open={viewerOpen} onOpenChange={closeViewer}>
      <DialogContent className="max-w-md p-0 h-[80vh] max-h-[700px] rounded-xl overflow-hidden">
        {currentStory ? (
          <div className="relative h-full flex flex-col bg-black">
            {/* Progress indicators */}
            {renderProgressIndicators()}
            
            {/* Navigation arrows */}
            <button
              onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
              className={cn(
                "absolute left-2 top-1/2 transform -translate-y-1/2 z-20 bg-black/20 rounded-full p-1",
                activeStoryIndex === 0 && currentGroupIndex === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-black/30"
              )}
              disabled={activeStoryIndex === 0 && currentGroupIndex === 0}
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </button>
            
            <button
              onClick={(e) => { e.stopPropagation(); goToNext(); }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20 bg-black/20 rounded-full p-1 hover:bg-black/30"
            >
              <ChevronRight className="h-6 w-6 text-white" />
            </button>
            
            {/* Close button */}
            <button
              onClick={closeViewer}
              className="absolute top-4 right-4 z-30 text-white"
            >
              <XCircle className="h-8 w-8 drop-shadow-md" />
            </button>
            
            {/* Story content */}
            <div 
              className="flex-1 w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${getMediaUrl(currentStory)})` }}
              onClick={handleStoryClick}
            >
              {/* Add dark gradient at bottom for better text visibility */}
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 to-transparent" />
            </div>
            
            {/* User info */}
            <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
              <div className="flex items-center">
                <Avatar className="h-12 w-12 border-2 border-white cursor-pointer" onClick={handleProfileClick}>
                  <AvatarImage src={currentGroupInfo?.avatarUrl} />
                  <AvatarFallback>{currentGroupInfo?.username?.substring(0, 2)?.toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
                
                <div className="ml-3 flex-1 min-w-0">
                  <h3 className="text-white font-medium cursor-pointer" onClick={handleProfileClick}>
                    {currentGroupInfo?.username || 'Unknown User'}
                  </h3>
                  <p className="text-xs text-white/70">
                    {formatDate(currentStory.created_at || currentStory.createdAt)}
                  </p>
                </div>
                
                {user && (
                  <Button 
                    size="sm"
                    variant="outline" 
                    className="bg-white/10 border-white/20 hover:bg-white/20 text-white"
                    onClick={() => {
                      triggerMicroReward('interaction');
                      openPublisher();
                    }}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Créer
                  </Button>
                )}
              </div>
              
              {(currentStory.caption || currentStory.text) && (
                <p className="mt-2 text-white text-sm">{currentStory.caption || currentStory.text}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full bg-black">
            <p className="text-white">Loading...</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StoriesViewer;
