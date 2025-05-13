import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { StoryGroup, Story } from '@/utils/story-types';
import { toast } from './use-toast';

interface StoriesContextProps {
  storyGroups: StoryGroup[];
  viewerOpen: boolean;
  publisherOpen: boolean;
  activeStoryIndex: number;
  activeGroupIndex: number;
  currentStoryGroup: Story[];
  currentGroupIndex: number;
  isLoading: boolean;
  error: string;
  loadStories: () => Promise<void>;
  openViewer: (groupIndex: number) => void;
  closeViewer: () => void;
  openPublisher: () => void;
  closePublisher: () => void;
  deleteStory: (storyId: string) => Promise<boolean>;
  setNextStory: () => void;
  setPreviousStory: () => void;
}

const StoriesContext = createContext<StoriesContextProps>({
  storyGroups: [],
  viewerOpen: false,
  publisherOpen: false,
  activeStoryIndex: 0,
  activeGroupIndex: 0,
  currentStoryGroup: [],
  currentGroupIndex: 0,
  isLoading: false,
  error: '',
  loadStories: async () => {},
  openViewer: () => {},
  closeViewer: () => {},
  openPublisher: () => {},
  closePublisher: () => {},
  deleteStory: async () => false,
  setNextStory: () => {},
  setPreviousStory: () => {},
});

export const StoriesProvider = ({ children }: { children: React.ReactNode }) => {
  const [storyGroups, setStoryGroups] = useState<StoryGroup[]>([]);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [publisherOpen, setPublisherOpen] = useState(false);
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const currentStoryGroup = useMemo(() => {
    return storyGroups[activeGroupIndex]?.stories || [];
  }, [storyGroups, activeGroupIndex]);

  const loadStories = useCallback(async () => {
    setIsLoading(true);
    try {
      // Mock data for demo purposes
      const mockStoryGroups: StoryGroup[] = [
        {
          id: '1',
          userId: 'user1',
          username: 'john_doe',
          avatar: 'https://placehold.co/150x150 ',
          stories: [
            {
              id: 's1',
              mediaUrl: 'https://placehold.co/800x600 ',
              type: 'image',
              timestamp: Date.now(),
            },
          ],
        },
      ];
      setStoryGroups(mockStoryGroups);
    } catch (err) {
      setError('Failed to load stories');
      toast({
        title: 'Error',
        description: 'Failed to load stories',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const openViewer = useCallback((groupIndex: number) => {
    setActiveGroupIndex(groupIndex);
    setActiveStoryIndex(0);
    setViewerOpen(true);
  }, []);

  const closeViewer = useCallback(() => {
    setViewerOpen(false);
  }, []);

  const openPublisher = useCallback(() => {
    setPublisherOpen(true);
  }, []);

  const closePublisher = useCallback(() => {
    setPublisherOpen(false);
  }, []);

  const deleteStory = useCallback(async (storyId: string) => {
    try {
      setStoryGroups(prevGroups =>
        prevGroups
          .map(group => ({
            ...group,
            stories: group.stories.filter(story => story.id !== storyId),
          }))
          .filter(group => group.stories.length > 0)
      );
      return true;
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to delete story',
        variant: 'destructive',
      });
      return false;
    }
  }, []);

  const setNextStory = useCallback(() => {
    if (activeStoryIndex < currentStoryGroup.length - 1) {
      setActiveStoryIndex(activeStoryIndex + 1);
    } else if (activeGroupIndex < storyGroups.length - 1) {
      setActiveGroupIndex(activeGroupIndex + 1);
      setActiveStoryIndex(0);
    } else {
      closeViewer();
    }
  }, [activeStoryIndex, currentStoryGroup.length, activeGroupIndex, storyGroups.length, closeViewer]);

  const setPreviousStory = useCallback(() => {
    if (activeStoryIndex > 0) {
      setActiveStoryIndex(activeStoryIndex - 1);
    } else if (activeGroupIndex > 0) {
      setActiveGroupIndex(activeGroupIndex - 1);
      const prevGroupStories = storyGroups[activeGroupIndex - 1]?.stories || [];
      setActiveStoryIndex(Math.max(0, prevGroupStories.length - 1));
    }
  }, [activeStoryIndex, activeGroupIndex, storyGroups]);

  const value = {
    storyGroups,
    viewerOpen,
    publisherOpen,
    activeStoryIndex,
    activeGroupIndex,
    currentStoryGroup,
    currentGroupIndex: activeGroupIndex,
    isLoading,
    error,
    loadStories,
    openViewer,
    closeViewer,
    openPublisher,
    closePublisher,
    deleteStory,
    setNextStory,
    setPreviousStory,
  };

  return (
    <StoriesContext.Provider value={value}>
      {children}
    </StoriesContext.Provider>
  );
};

export const useStories = () => useContext(StoriesContext);