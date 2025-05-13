
import { useState, useCallback, useEffect } from 'react';
import { Story, StoryGroup } from '@/types/stories';
import { getStoriesForUser, markStoryAsViewed, createStory } from '@/services/stories.service';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Group stories by creator
const groupStoriesByCreator = (stories: Story[]): StoryGroup[] => {
  const groupsMap = new Map<string, Story[]>();
  
  stories.forEach(story => {
    const creatorId = story.creator_id;
    if (!groupsMap.has(creatorId)) {
      groupsMap.set(creatorId, []);
    }
    groupsMap.get(creatorId)?.push(story);
  });
  
  const result: StoryGroup[] = [];
  
  groupsMap.forEach((stories, creatorId) => {
    // Sort stories by created_at date (newest first)
    const sortedStories = [...stories].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    
    const hasUnviewed = sortedStories.some(story => !story.viewed);
    const creator = sortedStories[0].creator; // Use the creator from the first story
    
    result.push({
      creator,
      stories: sortedStories,
      hasUnviewed
    });
  });
  
  // Sort groups with unviewed stories first, then by most recent story
  return result.sort((a, b) => {
    if (a.hasUnviewed && !b.hasUnviewed) return -1;
    if (!a.hasUnviewed && b.hasUnviewed) return 1;
    
    const aLatestStory = a.stories[0];
    const bLatestStory = b.stories[0];
    
    return new Date(bLatestStory.created_at).getTime() - 
           new Date(aLatestStory.created_at).getTime();
  });
};

export const useStories = () => {
  const [storyGroups, setStoryGroups] = useState<StoryGroup[]>([]);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [publisherOpen, setPublisherOpen] = useState(false);
  const { user } = useAuth();
  
  // Get the currently displayed stories based on active indices
  const currentStoryGroup = storyGroups[activeGroupIndex]?.stories || [];
  const currentGroupIndex = activeGroupIndex;
  
  // Load stories from the API
  const loadStories = useCallback(async () => {
    setLoading(true);
    try {
      if (!user) {
        setStoryGroups([]);
        return;
      }
      
      const stories = await getStoriesForUser(user.id);
      const grouped = groupStoriesByCreator(stories);
      setStoryGroups(grouped);
      setError('');
    } catch (err) {
      console.error('Error loading stories:', err);
      setError('Failed to load stories');
      toast.error('Failed to load stories');
    } finally {
      setLoading(false);
    }
  }, [user]);
  
  // Mark a story as viewed
  const markAsViewed = async (storyId: string, viewDuration?: number) => {
    try {
      if (!user) return;
      
      await markStoryAsViewed(user.id, storyId, viewDuration);
      
      // Update local state to mark the story as viewed
      setStoryGroups(prevGroups => {
        return prevGroups.map(group => {
          const updatedStories = group.stories.map(story => {
            if (story.id === storyId) {
              return { ...story, viewed: true };
            }
            return story;
          });
          
          return {
            ...group,
            stories: updatedStories,
            hasUnviewed: updatedStories.some(story => !story.viewed)
          };
        });
      });
    } catch (err) {
      console.error('Error marking story as viewed:', err);
    }
  };
  
  // Delete a story
  const deleteStory = async (storyId: string): Promise<boolean> => {
    try {
      // In a real implementation, this would make an API call to delete the story
      // For now, we'll just update the local state
      
      setStoryGroups(prevGroups => {
        const newGroups = prevGroups.map(group => {
          const filteredStories = group.stories.filter(story => story.id !== storyId);
          if (filteredStories.length === 0) {
            return null; // Mark the group for removal
          }
          return {
            ...group,
            stories: filteredStories,
            hasUnviewed: filteredStories.some(story => !story.viewed)
          };
        }).filter(Boolean) as StoryGroup[]; // Remove empty groups
        
        return newGroups;
      });
      
      toast.success('Story deleted successfully');
      return true;
    } catch (err) {
      console.error('Error deleting story:', err);
      toast.error('Failed to delete story');
      return false;
    }
  };
  
  // Open the story viewer
  const openViewer = (category: string, groupIndex: number = 0) => {
    setActiveGroupIndex(groupIndex);
    setActiveStoryIndex(0);
    setViewerOpen(true);
  };
  
  // Close the story viewer
  const closeViewer = () => {
    setViewerOpen(false);
  };
  
  // Navigate to the next story
  const goToNextStory = () => {
    if (activeStoryIndex < currentStoryGroup.length - 1) {
      // Move to the next story in the current group
      setActiveStoryIndex(prevIndex => prevIndex + 1);
    } else {
      // Move to the first story of the next group
      if (activeGroupIndex < storyGroups.length - 1) {
        setActiveGroupIndex(prevIndex => prevIndex + 1);
        setActiveStoryIndex(0);
      } else {
        // We've reached the end, close the viewer
        closeViewer();
      }
    }
  };
  
  // Navigate to the previous story
  const goToPrevStory = () => {
    if (activeStoryIndex > 0) {
      // Move to the previous story in the current group
      setActiveStoryIndex(prevIndex => prevIndex - 1);
    } else {
      // Move to the last story of the previous group
      if (activeGroupIndex > 0) {
        const prevGroupIndex = activeGroupIndex - 1;
        const prevGroupStories = storyGroups[prevGroupIndex].stories;
        setActiveGroupIndex(prevGroupIndex);
        setActiveStoryIndex(prevGroupStories.length - 1);
      }
      // If we're at the first story of the first group, do nothing
    }
  };
  
  // Open the story publisher
  const openPublisher = () => {
    setPublisherOpen(true);
  };
  
  // Close the story publisher
  const closePublisher = () => {
    setPublisherOpen(false);
  };
  
  // Create a new story
  const publishStory = async (data: FormData) => {
    try {
      if (!user) {
        toast.error('You must be logged in to publish a story');
        return null;
      }
      
      // Create a base story object
      const storyData: Partial<Story> = {
        creator_id: user.id,
        media_url: URL.createObjectURL(data.get('mediaFile') as File),
        thumbnail_url: URL.createObjectURL(data.get('thumbnailFile') as File || data.get('mediaFile') as File),
        caption: (data.get('caption') as string) || '',
        creator: {
          id: user.id,
          username: user.email || '',
          display_name: user.email?.split('@')[0] || '',
          avatar_url: ''
        }
      };
      
      const newStory = await createStory(storyData);
      
      // Update local state to include the new story
      setStoryGroups(prevGroups => {
        // Check if there's already a group for this creator
        const creatorGroupIndex = prevGroups.findIndex(group => 
          group.creator.id === user.id
        );
        
        if (creatorGroupIndex >= 0) {
          // Add to existing group
          const updatedGroups = [...prevGroups];
          updatedGroups[creatorGroupIndex] = {
            ...updatedGroups[creatorGroupIndex],
            stories: [newStory, ...updatedGroups[creatorGroupIndex].stories],
            hasUnviewed: true
          };
          return updatedGroups;
        } else {
          // Create new group
          return [{
            creator: newStory.creator,
            stories: [newStory],
            hasUnviewed: true
          }, ...prevGroups];
        }
      });
      
      closePublisher();
      toast.success('Story published successfully');
      return newStory;
    } catch (err) {
      console.error('Error publishing story:', err);
      toast.error('Failed to publish story');
      return null;
    }
  };
  
  // Load stories on mount and when user changes
  useEffect(() => {
    loadStories();
  }, [loadStories]);
  
  return {
    storyGroups,
    viewerOpen,
    activeStoryIndex,
    activeGroupIndex,
    currentStoryGroup,
    currentGroupIndex,
    publisherOpen,
    openViewer,
    closeViewer,
    goToNextStory,
    goToPrevStory,
    markAsViewed,
    openPublisher,
    closePublisher,
    publishStory,
    loading,
    loadStories,
    deleteStory,
    error
  };
};
