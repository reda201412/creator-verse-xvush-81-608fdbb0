
import { useState, useEffect } from 'react';
import { Story } from '@/types/stories';
import { useAuth } from '@/contexts/AuthContext';
import { getStoriesForUser, markStoryAsViewed } from '@/services/stories.service';

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
  const groupedStories = Object.values(
    state.allStories.reduce((groups: Record<string, Story[]>, story) => {
      const creatorId = story.creator_id;
      if (!groups[creatorId]) {
        groups[creatorId] = [];
      }
      groups[creatorId].push(story);
      return groups;
    }, {})
  );

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
    let stories;
    
    switch (category) {
      case 'user':
        stories = state.userStories;
        break;
      case 'highlights':
        stories = state.highlightedStories;
        break;
      case 'followed':
        stories = state.followedCreatorStories;
        break;
      case 'all':
      default:
        stories = state.allStories;
    }
    
    setActiveCategory(category);
    
    if (groupIndex < groupedStories.length) {
      setCurrentStoryGroup(groupedStories[groupIndex]);
      setCurrentGroupIndex(groupIndex);
    } else if (groupedStories.length > 0) {
      setCurrentStoryGroup(groupedStories[0]);
      setCurrentGroupIndex(0);
    }
    
    setViewerOpen(true);
  };

  // Mark a story as viewed
  const markAsViewed = async (storyId: string) => {
    if (!user) return;

    try {
      // Convert the storyId to a string if it's not already
      const storyIdString = String(storyId);
      await markStoryAsViewed(user.uid, storyIdString);
      
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
  const goToNextStory = () => {
    if (state.currentStoryIndex < currentStoryGroup.length - 1) {
      setState(prev => ({
        ...prev,
        currentStoryIndex: prev.currentStoryIndex + 1
      }));
    } else {
      // Move to next group or close if on last group
      if (currentGroupIndex < groupedStories.length - 1) {
        setCurrentGroupIndex(prev => prev + 1);
        setCurrentStoryGroup(groupedStories[currentGroupIndex + 1]);
        setState(prev => ({
          ...prev,
          currentStoryIndex: 0
        }));
      } else {
        closeViewer();
      }
    }
  };

  // Move to previous story
  const goToPrevStory = () => {
    if (state.currentStoryIndex > 0) {
      setState(prev => ({
        ...prev,
        currentStoryIndex: prev.currentStoryIndex - 1
      }));
    } else {
      // Move to previous group or stay at first if on first group
      if (currentGroupIndex > 0) {
        setCurrentGroupIndex(prev => prev - 1);
        setCurrentStoryGroup(groupedStories[currentGroupIndex - 1]);
        setState(prev => ({
          ...prev,
          currentStoryIndex: groupedStories[currentGroupIndex - 1].length - 1
        }));
      }
    }
  };

  // Open story publisher
  const openPublisher = () => {
    setPublisherOpen(true);
  };

  // Close story publisher
  const closePublisher = () => {
    setPublisherOpen(false);
  };

  return {
    ...state,
    groupedStories,
    viewerOpen,
    currentStoryGroup,
    currentGroupIndex,
    publisherOpen,
    openViewer,
    closeViewer,
    markAsViewed,
    goToNextStory,
    goToPrevStory,
    openPublisher,
    closePublisher,
    refreshStories: loadStories
  };
}
