
import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Plus, ChevronLeft, Loader2, Camera, Upload, Clock, Clock12 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import StoriesViewer from '@/components/stories/StoriesViewer';
import StoryPublisher from '@/components/stories/StoryPublisher';
import useStories from '@/hooks/use-stories';
import { toast } from 'sonner';
import useHapticFeedback from '@/hooks/use-haptic-feedback';

// Helper to parse query params
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const StoriesPage: React.FC = () => {
  const { creatorId } = useParams<{ creatorId: string }>();
  const query = useQuery();
  const initialStoryId = query.get('story');
  const { user } = useAuth();
  const navigate = useNavigate();
  const { triggerHaptic } = useHapticFeedback();
  const { stories: allStories, userStories, isLoading } = useStories();
  
  const [isCreating, setIsCreating] = useState(false);
  const [selectedCreatorIndex, setSelectedCreatorIndex] = useState(0);
  
  // Organize stories by creator
  const storiesByCreator = React.useMemo(() => {
    const result = new Map();
    
    // Add user's own stories first if they exist
    if (userStories.length > 0) {
      result.set(userStories[0].creator_id, {
        creator_id: userStories[0].creator_id,
        creator_name: 'You',
        creator_avatar: userStories[0].creator_avatar,
        stories: userStories,
        is_mine: true
      });
    }
    
    // Add others' stories
    allStories.forEach(story => {
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
  }, [allStories, userStories]);
  
  // If creatorId is provided, find matching creator's stories
  const selectedCreatorStories = React.useMemo(() => {
    if (creatorId) {
      const creator = storiesByCreator.find(c => c.creator_id === creatorId);
      return creator ? creator.stories : [];
    }
    
    // If no creatorId, default to first creator in list
    if (storiesByCreator.length > 0) {
      return storiesByCreator[selectedCreatorIndex]?.stories || [];
    }
    
    return [];
  }, [creatorId, storiesByCreator, selectedCreatorIndex]);
  
  // Find the initial story index if storyId is provided
  const initialStoryIndex = React.useMemo(() => {
    if (initialStoryId) {
      const index = selectedCreatorStories.findIndex(s => s.id === initialStoryId);
      return index >= 0 ? index : 0;
    }
    return 0;
  }, [initialStoryId, selectedCreatorStories]);
  
  const handleNextUser = () => {
    let nextIndex = selectedCreatorIndex + 1;
    if (nextIndex >= storiesByCreator.length) {
      // Loop back to first
      nextIndex = 0;
    }
    
    setSelectedCreatorIndex(nextIndex);
    navigate(`/stories/${storiesByCreator[nextIndex].creator_id}`);
  };
  
  const handlePrevUser = () => {
    let prevIndex = selectedCreatorIndex - 1;
    if (prevIndex < 0) {
      // Loop to last
      prevIndex = storiesByCreator.length - 1;
    }
    
    setSelectedCreatorIndex(prevIndex);
    navigate(`/stories/${storiesByCreator[prevIndex].creator_id}`);
  };
  
  const handleClose = () => {
    triggerHaptic('light');
    navigate('/');
  };
  
  const handleCreateStory = () => {
    if (!user) {
      toast.error("Please sign in to create a story");
      return;
    }
    
    setIsCreating(true);
  };
  
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // Show empty state if no stories
  if (!isCreating && storiesByCreator.length === 0) {
    return (
      <div className="fixed inset-0 bg-background flex flex-col items-center justify-center p-4">
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <Clock className="h-12 w-12 text-primary/60" />
        </div>
        
        <h1 className="text-2xl font-bold mb-2">No Stories Yet</h1>
        <p className="text-center text-muted-foreground mb-8 max-w-md">
          Be the first of your friends to share a story. Stories disappear after 24 hours.
        </p>
        
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Button
            size="lg"
            className="w-full flex items-center gap-2"
            onClick={handleCreateStory}
          >
            <Camera className="h-5 w-5" />
            Create a Story
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={handleClose}
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <AnimatePresence mode="wait">
      {isCreating ? (
        <motion.div
          key="create"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50"
        >
          <StoryPublisher onCancel={() => setIsCreating(false)} />
        </motion.div>
      ) : selectedCreatorStories.length > 0 ? (
        <motion.div
          key="view"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50"
        >
          <StoriesViewer 
            stories={selectedCreatorStories}
            initialStoryIndex={initialStoryIndex}
            onClose={handleClose}
            onNextUser={handleNextUser}
            onPrevUser={handlePrevUser}
          />
        </motion.div>
      ) : (
        <motion.div
          key="empty-creator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex flex-col items-center justify-center p-4 bg-background"
        >
          <Button 
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4"
            onClick={handleClose}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <Clock12 className="h-12 w-12 text-primary/60" />
          </div>
          
          <h1 className="text-2xl font-bold mb-2">No Stories Available</h1>
          <p className="text-center text-muted-foreground mb-8 max-w-md">
            This creator hasn't posted any stories yet.
          </p>
          
          <Button
            variant="outline"
            size="lg"
            onClick={handleClose}
          >
            Go Back
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StoriesPage;
