
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Story, StoryUploadParams, UseStoriesHookReturn } from '@/types/stories';

// Mocked stories data for development
const mockStories: Story[] = [
  {
    id: "story1",
    creator_id: "user1",
    media_url: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131",
    caption: "My first story!",
    format: "16:9",
    duration: 5,
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    view_count: 0,
    is_highlighted: false,
    creator_name: "John Doe",
    creator_avatar: "https://i.pravatar.cc/150?img=1"
  },
  {
    id: "story2",
    creator_id: "user2",
    media_url: "https://images.unsplash.com/photo-1569569970363-df7b6160d111",
    caption: "Beautiful sunset!",
    format: "9:16",
    duration: 5,
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    view_count: 12,
    is_highlighted: true,
    creator_name: "Jane Smith",
    creator_avatar: "https://i.pravatar.cc/150?img=2"
  },
  {
    id: "story3",
    creator_id: "user3",
    media_url: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
    caption: "Check out this video!",
    format: "16:9",
    duration: 15,
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    view_count: 28,
    is_highlighted: false,
    creator_name: "Alex Johnson",
    creator_avatar: "https://i.pravatar.cc/150?img=3"
  }
];

/**
 * Hook to manage stories functionality
 */
export const useStories = (): UseStoriesHookReturn => {
  const { user } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);
  const [loadingStories, setLoadingStories] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch stories from API or use mock data
  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoadingStories(true);
        
        // In a real app, this would be an API call
        // const response = await api.getStories();
        // setStories(response.data);
        
        // Using mock data for now
        setStories(mockStories);
        setError(null);
      } catch (err) {
        console.error("Error fetching stories:", err);
        setError("Failed to load stories");
      } finally {
        setLoadingStories(false);
      }
    };
    
    fetchStories();
  }, []);
  
  // Upload a story
  const uploadStory = useCallback(async (params: StoryUploadParams): Promise<boolean> => {
    if (!user?.uid) {
      toast.error("You must be logged in to upload stories");
      return false;
    }
    
    try {
      const { file, caption, onProgress } = params;
      
      // Simulate upload progress
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += 10;
        if (progress <= 100 && onProgress) {
          onProgress(progress);
        }
        if (progress > 100) {
          clearInterval(progressInterval);
        }
      }, 300);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Create a new story object
      const newStory: Story = {
        id: `story_${Date.now()}`,
        creator_id: user?.uid || '',
        media_url: URL.createObjectURL(file),
        caption: caption,
        format: "16:9",
        duration: 5,
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        view_count: 0,
        is_highlighted: false,
        creator_name: user?.username || user?.displayName || 'User',
        creator_avatar: user?.profileImageUrl || `https://i.pravatar.cc/150?u=${user?.username}`
      };
      
      // Add the new story to the state
      setStories(prev => [newStory, ...prev]);
      
      return true;
    } catch (err) {
      console.error("Error uploading story:", err);
      setError("Failed to upload story");
      return false;
    }
  }, [user]);
  
  // Mark a story as viewed
  const markStoryAsViewed = useCallback(async (storyId: string): Promise<void> => {
    try {
      // In a real app, this would call an API
      // await api.markStoryAsViewed(storyId);
      
      // Update the local state
      setStories(prev => 
        prev.map(story => 
          story.id === storyId ? { ...story, viewed: true } : story
        )
      );
    } catch (err) {
      console.error("Error marking story as viewed:", err);
      setError("Failed to mark story as viewed");
    }
  }, []);
  
  return {
    stories,
    loadingStories,
    uploadStory,
    markStoryAsViewed,
    error
  };
};
