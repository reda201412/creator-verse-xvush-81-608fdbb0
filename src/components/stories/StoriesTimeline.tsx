
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import useStories from '@/hooks/use-stories';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import useHapticFeedback from '@/hooks/use-haptic-feedback';
import { toast } from 'sonner';

interface StoriesTimelineProps {
  onViewStory?: (userId: string, storyId: string) => void;
  onCreateStory?: () => void;
  compact?: boolean;
}

const StoriesTimeline: React.FC<StoriesTimelineProps> = ({ onViewStory, onCreateStory, compact = false }) => {
  const { user } = useAuth();
  const { stories, userStories, isLoading: loadingStories } = useStories();
  const navigate = useNavigate();
  const { triggerHaptic } = useHapticFeedback();
  
  const [isUploading, setIsUploading] = useState(false);
  
  // Organize stories by creator
  const storiesByCreator = React.useMemo(() => {
    const result = new Map();
    
    // Add user's own stories first
    if (userStories.length > 0) {
      result.set(userStories[0].creator_id, {
        creator_id: userStories[0].creator_id,
        creator_name: 'You',
        creator_avatar: userStories[0].creator_avatar,
        stories: userStories,
        is_mine: true
      });
    }
    
    // Then add others' stories
    stories.forEach(story => {
      if (!result.has(story.creator_id)) {
        result.set(story.creator_id, {
          creator_id: story.creator_id,
          creator_name: story.creator_name || `Creator ${story.creator_id.substring(0, 4)}`,
          creator_avatar: story.creator_avatar,
          stories: [story],
          is_mine: false
        });
      } else {
        const existingEntry = result.get(story.creator_id);
        existingEntry.stories.push(story);
      }
    });
    
    return Array.from(result.values());
  }, [stories, userStories]);
  
  const handleStoryClick = (creatorId: string, storyId: string) => {
    triggerHaptic('light');
    
    if (onViewStory) {
      onViewStory(creatorId, storyId);
    } else {
      navigate(`/stories/${creatorId}?story=${storyId}`);
    }
  };
  
  const handleCreateClick = () => {
    triggerHaptic('medium');
    
    if (!user) {
      toast.error("Please sign in to create a story");
      return;
    }
    
    if (onCreateStory) {
      onCreateStory();
    } else {
      navigate('/stories/create');
    }
  };
  
  const getInitials = (name: string) => {
    if (!name) return '?';
    return name.substring(0, 2).toUpperCase();
  };
  
  if (loadingStories) {
    return (
      <div className={`flex justify-center p-4 ${compact ? 'max-w-md' : 'w-full'}`}>
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  return (
    <div className={`px-1 ${compact ? 'max-w-md' : 'w-full'}`}>
      <div className="flex gap-2 overflow-x-auto py-2 px-1 scrollbar-hide">
        {/* Create story button */}
        <div className="flex flex-col items-center min-w-[72px]">
          <button
            onClick={handleCreateClick}
            disabled={isUploading}
            className="w-16 h-16 rounded-full border-2 border-dashed border-primary/50 flex items-center justify-center bg-primary/10 hover:bg-primary/20 transition-colors relative"
          >
            {isUploading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <Plus className="h-6 w-6 text-primary" />
            )}
          </button>
          <span className="text-xs mt-1 text-center">Create</span>
        </div>
        
        {/* Stories */}
        {storiesByCreator.map((creatorStories) => {
          const hasUnviewed = creatorStories.stories.some(story => !story.viewed);
          const latestStory = creatorStories.stories[creatorStories.stories.length - 1];
          
          return (
            <div
              key={creatorStories.creator_id}
              className="flex flex-col items-center min-w-[72px] cursor-pointer"
              onClick={() => handleStoryClick(creatorStories.creator_id, latestStory.id)}
            >
              <div className="relative">
                <div className={`p-[2px] rounded-full ${hasUnviewed ? 'bg-gradient-to-tr from-pink-500 via-purple-500 to-blue-500' : 'bg-muted'}`}>
                  <Avatar className="w-16 h-16 border-2 border-background">
                    <AvatarImage 
                      src={creatorStories.creator_avatar || `https://i.pravatar.cc/150?u=${creatorStories.creator_id}`}
                      alt={creatorStories.creator_name}
                    />
                    <AvatarFallback>
                      {getInitials(creatorStories.creator_name)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                {creatorStories.is_mine && creatorStories.stories.some(s => s.is_highlighted) && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full border-2 border-background flex items-center justify-center">
                    <span className="text-[8px] font-bold">⭐</span>
                  </span>
                )}
              </div>
              
              <span className="text-xs mt-1 truncate max-w-[72px] text-center">
                {creatorStories.is_mine ? 'Your Story' : creatorStories.creator_name}
              </span>
            </div>
          );
        })}
        
        {storiesByCreator.length === 0 && !userStories.length && (
          <div className="flex flex-col items-center justify-center px-4 py-2">
            <p className="text-sm text-muted-foreground">No stories yet</p>
            <Button
              variant="link"
              size="sm"
              onClick={handleCreateClick}
              className="text-xs px-0"
            >
              Be the first to create one
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoriesTimeline;
