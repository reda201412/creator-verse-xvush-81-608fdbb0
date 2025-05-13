
import { useState, useEffect } from 'react';
import { Story } from '@/types/stories';
import { useAuth } from '@/contexts/AuthContext';
import { getStoriesForUser, markStoryAsViewed, createStory } from '@/services/stories.service';

type StoriesState = {
  allStories: Story[];
  userStories: Story[];
  highlightedStories: Story[];
  followedCreatorStories: Story[];
  currentStoryIndex: number;
  loading: boolean;
  error: string | null;
};

const initialState: StoriesState = {
  allStories: [],
  userStories: [],
  highlightedStories: [],
  followedCreatorStories: [],
  currentStoryIndex: 0,
  loading: true,
  error: null
};

// Constant for story duration in milliseconds
const DEFAULT_STORY_DURATION = 5000; // 5 seconds

export function useStories() {
  const { user } = useAuth();
  const [state, setState] = useState<StoriesState>(initialState);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [currentStoryGroup, setCurrentStoryGroup] = useState<Story[]>([]);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [publisherOpen, setPublisherOpen] = useState(false);
  const [storyGroups, setStoryGroups] = useState<any[]>([]);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);

  // Load stories on component mount
  useEffect(() => {
    loadStories();
  }, [user]);

  // Refresh stories at defined interval (e.g., every 5 minutes)
  useEffect(() => {
    const interval = setInterval(() => {
      loadStories();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  // Group stories by creator
  useEffect(() => {
    // Create story groups from the loaded stories
    const groups = Object.values(
      state.allStories.reduce((groups: Record<string, any>, story) => {
        const creatorId = story.creator_id;
        if (!groups[creatorId]) {
          groups[creatorId] = {
            creator: story.creator,
            stories: [],
            hasUnviewed: false
          };
        }
        
        groups[creatorId].stories.push(story);
        
        // Check if this group has any unviewed stories
        if (!story.viewed) {
          groups[creatorId].hasUnviewed = true;
        }
        
        return groups;
      }, {})
    );
    
    setStoryGroups(groups);
  }, [state.allStories]);

  // Load stories from API
  const loadStories = async () => {
    if (!user) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const storiesData = await getStoriesForUser(user.uid);
      
      // Categorize stories
      const userStories = storiesData.filter(
        story => story.creator_id === user.uid
      );
      
      const highlightedStories = storiesData.filter(
        story => story.is_highlighted
      );
      
      // For real implementation, you would check if creator is followed by the user
      // This is a mock implementation
      const followedCreatorStories = storiesData.filter(
        story => story.creator_id !== user.uid
      );
      
      setState(prev => ({
        ...prev,
        allStories: storiesData,
        userStories,
        highlightedStories,
        followedCreatorStories,
        loading: false
      }));
    } catch (error) {
      console.error('Error loading stories:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load stories'
      }));
    }
  };

  // Open story viewer with appropriate content
  const openViewer = (category: string, groupIndex: number = 0) => {
    setActiveCategory(category);
    
    if (groupIndex < storyGroups.length) {
      setCurrentStoryGroup(storyGroups[groupIndex].stories);
      setActiveGroupIndex(groupIndex);
    } else if (storyGroups.length > 0) {
      setCurrentStoryGroup(storyGroups[0].stories);
      setActiveGroupIndex(0);
    }
    
    setActiveStoryIndex(0); // Reset to first story
    setViewerOpen(true);
  };

  // Mark a story as viewed
  const markAsViewed = async (storyId: string, viewDuration?: number) => {
    if (!user) return;

    try {
      await markStoryAsViewed(user.uid, storyId, viewDuration);
      
      // Update local state
      setState(prev => ({
        ...prev,
        allStories: prev.allStories.map(story => 
          story.id === storyId ? { ...story, viewed: true } : story
        ),
        userStories: prev.userStories.map(story => 
          story.id === storyId ? { ...story, viewed: true } : story
        ),
        highlightedStories: prev.highlightedStories.map(story => 
          story.id === storyId ? { ...story, viewed: true } : story
        ),
        followedCreatorStories: prev.followedCreatorStories.map(story => 
          story.id === storyId ? { ...story, viewed: true } : story
        )
      }));
      
    } catch (error) {
      console.error('Error marking story as viewed:', error);
    }
  };

  // Close viewer
  const closeViewer = () => {
    setViewerOpen(false);
  };

  // Move to next story
  const nextStory = () => {
    if (activeStoryIndex < currentStoryGroup.length - 1) {
      setActiveStoryIndex(prev => prev + 1);
    } else {
      // Move to next group or close if on last group
      if (activeGroupIndex < storyGroups.length - 1) {
        setActiveGroupIndex(prev => prev + 1);
        setActiveStoryIndex(0);
      } else {
        closeViewer();
      }
    }
  };

  // Move to previous story
  const prevStory = () => {
    if (activeStoryIndex > 0) {
      setActiveStoryIndex(prev => prev - 1);
    } else {
      // Move to previous group or stay at first if on first group
      if (activeGroupIndex > 0) {
        setActiveGroupIndex(prev => prev - 1);
        setActiveStoryIndex(storyGroups[activeGroupIndex - 1].stories.length - 1);
      }
    }
  };

  // Create new story
  const handleCreateStory = async (storyData: Partial<Story>) => {
    if (!user) return null;
    
    try {
      // Add user data to story
      const storyWithUser = {
        ...storyData,
        creator_id: user.uid,
        creator: {
          id: user.uid,
          username: user.displayName || user.email?.split('@')[0] || 'user',
          display_name: user.displayName || user.email?.split('@')[0] || 'User',
          avatar_url: user.photoURL || 'https://i.pravatar.cc/150'
        }
      };
      
      // Create story
      const newStory = await createStory(storyWithUser);
      
      // Update local state
      setState(prev => ({
        ...prev,
        allStories: [newStory, ...prev.allStories],
        userStories: [newStory, ...prev.userStories]
      }));
      
      return newStory;
    } catch (error) {
      console.error('Error creating story:', error);
      return null;
    }
  };

  return {
    ...state,
    storyGroups,
    viewerOpen,
    activeStoryIndex,
    activeGroupIndex,
    currentStoryGroup,
    currentGroupIndex,
    publisherOpen,
    openViewer,
    closeViewer,
    markStoryAsViewed: markAsViewed,
    nextStory,
    prevStory,
    createStory: handleCreateStory,
    loadStories,
    setActiveGroupIndex,
    setActiveStoryIndex,
    openPublisher: () => setPublisherOpen(true),
    closePublisher: () => setPublisherOpen(false),
    refreshStories: loadStories
  };
}
