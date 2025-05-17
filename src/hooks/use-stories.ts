
import { useState, useCallback } from 'react';
import { StoryData, StoryUploadParams } from '@/types/stories';
import { toast } from 'sonner';

// Mock data for stories
const mockStories: StoryData[] = [
  {
    id: 'story1',
    creatorId: 'creator1',
    creatorName: 'John Creator',
    creatorAvatar: '/placeholder.svg',
    mediaUrl: 'https://example.com/story1.mp4',
    caption: 'My first story',
    filter: 'none',
    duration: 15,
    createdAt: Date.now() - 3600000,
    expiresAt: Date.now() + 86400000,
    viewCount: 245,
    tags: ['music', 'lifestyle'],
    isExpired: false
  },
  // ...more mock stories would go here
];

export function useStories() {
  const [stories, setStories] = useState<StoryData[]>(mockStories);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch stories - simulated
  const fetchStories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      // Data is already set with mock data
      setLoading(false);
    } catch (err) {
      setError('Failed to load stories');
      setLoading(false);
    }
  }, []);

  // Upload a story - simulated
  const uploadStory = useCallback(async (params: StoryUploadParams) => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create a new story with the provided parameters
      const newStory: StoryData = {
        id: `story_${Date.now()}`,
        creatorId: 'current_user_id', // In a real app, this would be from auth
        creatorName: 'Current User',
        creatorAvatar: '/placeholder.svg',
        mediaUrl: URL.createObjectURL(params.mediaFile),
        caption: params.caption || '',
        filter: params.filter || 'none',
        duration: params.duration,
        createdAt: Date.now(),
        expiresAt: Date.now() + (params.expiresIn * 1000), // Convert to ms
        viewCount: 0,
        tags: params.tags || [],
        isExpired: false
      };

      // In a real app, we would upload the file here
      console.log('Uploading media file:', params.mediaFile.name, 'size:', params.mediaFile.size);
      
      // Update the state with the new story
      setStories(prevStories => [newStory, ...prevStories]);
      setLoading(false);
      toast.success('Story uploaded successfully!');
      return newStory;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload story';
      setError(errorMessage);
      setLoading(false);
      toast.error(errorMessage);
      return null;
    }
  }, []);

  // View a story - simulated
  const viewStory = useCallback((storyId: string) => {
    setStories(prevStories => 
      prevStories.map(story => 
        story.id === storyId 
          ? { ...story, viewCount: story.viewCount + 1 }
          : story
      )
    );
  }, []);

  // Mark story as expired - simulated
  const expireStory = useCallback((storyId: string) => {
    setStories(prevStories => 
      prevStories.map(story => 
        story.id === storyId 
          ? { ...story, isExpired: true }
          : story
      )
    );
  }, []);

  // React to a story - simulated
  const reactToStory = useCallback((storyId: string, reaction: string) => {
    setStories(prevStories => 
      prevStories.map(story => {
        if (story.id === storyId) {
          const updatedReactions = { ...(story.reactions || {}) };
          updatedReactions[reaction] = (updatedReactions[reaction] || 0) + 1;
          return { ...story, reactions: updatedReactions };
        }
        return story;
      })
    );
    
    toast.success(`You reacted with ${reaction}`);
  }, []);

  return {
    stories,
    loading,
    error,
    fetchStories,
    uploadStory,
    viewStory,
    expireStory,
    reactToStory
  };
}
