import { useState, useEffect, useCallback } from 'react';
import { Story } from '@/types/stories';
import { FirestoreStory, adaptFirestoreStoryToStory, adaptFirestoreStoriesToStories } from '@/utils/story-types';

export interface UseStoriesOptions {
  groupByCreator?: boolean;
  filterByCreator?: string;
  includeExpired?: boolean;
  limit?: number;
}

export const useStories = (options: UseStoriesOptions = {}) => {
  const { groupByCreator = false, filterByCreator, includeExpired = false, limit } = options;
  
  const [stories, setStories] = useState<Story[]>([]);
  const [storyGroups, setStoryGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);
  
  // Mock function to fetch stories from Firestore
  const fetchStoriesFromFirestore = async (): Promise<FirestoreStory[]> => {
    // In a real implementation, this would fetch from Firestore
    return [
      {
        id: '1',
        creatorId: 'creator1',
        createdAt: new Date(),
        mediaUrl: 'https://example.com/story1.mp4',
        format: '9:16',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        viewed: false,
        duration: 15,
        view_count: 120,
        is_highlighted: true
      },
      {
        id: '2',
        creatorId: 'creator2',
        createdAt: new Date(),
        mediaUrl: 'https://example.com/story2.mp4',
        format: '9:16',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        viewed: true,
        duration: 10,
        view_count: 85,
        is_highlighted: false
      }
    ];
  };
  
  // Mock function to mark a story as viewed in Firestore
  const markStoryAsViewedInFirestore = async (storyId: string): Promise<void> => {
    // In a real implementation, this would update Firestore
    console.log(`Marking story ${storyId} as viewed`);
  };
  
  // Mock function to get story views count
  const getStoryViewsCount = async (storyId: string): Promise<number> => {
    // In a real implementation, this would fetch from Firestore
    return Promise.resolve(Math.floor(Math.random() * 1000));
  };
  
  const fetchStories = async () => {
    try {
      setLoading(true);
      const storiesData = await fetchStoriesFromFirestore();
      setStories(adaptFirestoreStoriesToStories(storiesData));

      // If grouping is required, also convert types
      if (groupByCreator) {
        const storyGroups = {};
        storiesData.forEach(story => {
          const creatorId = story.creatorId;
          if (!storyGroups[creatorId]) {
            storyGroups[creatorId] = {
              creator: {
                id: creatorId,
                username: '',
                display_name: '',
                avatar_url: '',
                bio: '',
                role: 'fan'
              },
              stories: [],
              lastUpdated: story.createdAt ? 
                (typeof story.createdAt.toDate === 'function' ? 
                  story.createdAt.toDate().toISOString() : 
                  new Date(story.createdAt).toISOString()) : 
                new Date().toISOString(),
              hasUnviewed: !story.viewed
            };
          }
          storyGroups[creatorId].stories.push(adaptFirestoreStoryToStory(story));
          // Update lastUpdated if this story is more recent
          const storyDate = story.createdAt ? 
            (typeof story.createdAt.toDate === 'function' ? 
              story.createdAt.toDate() : 
              new Date(story.createdAt)) : 
            new Date();
            
          const groupDate = new Date(storyGroups[creatorId].lastUpdated);
          if (storyDate > groupDate) {
            storyGroups[creatorId].lastUpdated = storyDate.toISOString();
          }
          // Check if any story is unviewed
          if (!story.viewed) {
            storyGroups[creatorId].hasUnviewed = true;
          }
        });
        setStoryGroups(Object.values(storyGroups));
      }
    } catch (error) {
      console.error('Failed to fetch stories:', error);
      setError('Failed to load stories. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const markStoryAsViewed = useCallback(async (storyId: string) => {
    try {
      await markStoryAsViewedInFirestore(storyId);
      setStories(prev => 
        prev.map(story => 
          story.id === storyId ? { ...story, viewed: true } : story
        )
      );
    } catch (error) {
      console.error('Failed to mark story as viewed:', error);
    }
  }, []);
  
  const nextStory = useCallback(() => {
    if (groupByCreator) {
      const currentGroup = storyGroups[activeGroupIndex];
      if (activeStoryIndex < currentGroup.stories.length - 1) {
        setActiveStoryIndex(prev => prev + 1);
      } else {
        // Move to next group if available
        if (activeGroupIndex < storyGroups.length - 1) {
          setActiveGroupIndex(prev => prev + 1);
          setActiveStoryIndex(0);
        }
      }
    } else {
      if (activeStoryIndex < stories.length - 1) {
        setActiveStoryIndex(prev => prev + 1);
      }
    }
  }, [activeGroupIndex, activeStoryIndex, groupByCreator, stories.length, storyGroups]);
  
  const previousStory = useCallback(() => {
    if (groupByCreator) {
      if (activeStoryIndex > 0) {
        setActiveStoryIndex(prev => prev - 1);
      } else {
        // Move to previous group if available
        if (activeGroupIndex > 0) {
          setActiveGroupIndex(prev => prev - 1);
          const prevGroupStories = storyGroups[activeGroupIndex - 1].stories;
          setActiveStoryIndex(prevGroupStories.length - 1);
        }
      }
    } else {
      if (activeStoryIndex > 0) {
        setActiveStoryIndex(prev => prev - 1);
      }
    }
  }, [activeGroupIndex, activeStoryIndex, groupByCreator, storyGroups]);
  
  const loadStoryViewsCount = useCallback(async (storyId: string) => {
    try {
      const viewsCount = await getStoryViewsCount(storyId); // Make sure this expects a string parameter
      return viewsCount.toString();
    } catch (error) {
      console.error('Failed to load story views count:', error);
      return '0';
    }
  }, []);
  
  const getCurrentStory = useCallback(() => {
    if (groupByCreator && storyGroups.length > 0) {
      const currentGroup = storyGroups[activeGroupIndex];
      return currentGroup.stories[activeStoryIndex];
    } else if (stories.length > 0) {
      return stories[activeStoryIndex];
    }
    return null;
  }, [activeGroupIndex, activeStoryIndex, groupByCreator, stories, storyGroups]);
  
  const getCurrentGroup = useCallback(() => {
    if (groupByCreator && storyGroups.length > 0) {
      return storyGroups[activeGroupIndex];
    }
    return null;
  }, [activeGroupIndex, groupByCreator, storyGroups]);
  
  useEffect(() => {
    fetchStories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterByCreator, includeExpired, limit]);
  
  return {
    stories,
    storyGroups,
    loading,
    error,
    activeStoryIndex,
    activeGroupIndex,
    setActiveStoryIndex,
    setActiveGroupIndex,
    markStoryAsViewed,
    nextStory,
    previousStory,
    loadStoryViewsCount,
    getCurrentStory,
    getCurrentGroup,
    refreshStories: fetchStories
  };
};

export default useStories;
