
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db, storage } from '@/contexts/firebase-mock';

export interface Story {
  id: string;
  creator_id: string;
  creator_name?: string;
  creator_avatar?: string;
  media_url: string;
  thumbnail_url?: string;
  format: '16:9' | '9:16' | '1:1';
  caption?: string;
  created_at: string;
  expires_at: string;
  viewed: boolean;
  is_highlighted: boolean;
  is_mine?: boolean;
}

interface UseStoriesHookReturn {
  stories: Story[];
  userStories: Story[];
  isLoading: boolean;
  error: string | null;
  createStory: (file: File, caption?: string, format?: string) => Promise<boolean>;
  deleteStory: (storyId: string) => Promise<boolean>;
  markAsViewed: (storyId: string) => Promise<void>;
  highlightStory: (storyId: string, highlight: boolean) => Promise<boolean>;
  getStoryCreatorInfo: (creatorId: string) => Promise<{ name: string; avatar: string } | null>;
}

const useStories = (): UseStoriesHookReturn => {
  const { user } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);
  const [userStories, setUserStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStories = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Mock data for stories
      const mockStories: Story[] = [
        {
          id: '1',
          creator_id: 'creator1',
          creator_name: 'Creator One',
          creator_avatar: 'https://i.pravatar.cc/150?img=1',
          media_url: 'https://example.com/story1.mp4',
          thumbnail_url: 'https://example.com/thumbnail1.jpg',
          format: '9:16',
          caption: 'This is story 1',
          created_at: new Date(Date.now() - 3600000).toISOString(),
          expires_at: new Date(Date.now() + 86400000).toISOString(),
          viewed: false,
          is_highlighted: false
        },
        {
          id: '2',
          creator_id: 'creator2',
          creator_name: 'Creator Two',
          creator_avatar: 'https://i.pravatar.cc/150?img=2',
          media_url: 'https://example.com/story2.mp4',
          thumbnail_url: 'https://example.com/thumbnail2.jpg',
          format: '9:16',
          caption: 'This is story 2',
          created_at: new Date(Date.now() - 7200000).toISOString(),
          expires_at: new Date(Date.now() + 86400000).toISOString(),
          viewed: true,
          is_highlighted: true
        }
      ];

      // Add a mock user story
      const mockUserStories: Story[] = [
        {
          id: '3',
          creator_id: user.uid || user.id || '',
          creator_name: user.displayName || 'You',
          creator_avatar: user.photoURL || 'https://i.pravatar.cc/150?img=3',
          media_url: 'https://example.com/story3.mp4',
          thumbnail_url: 'https://example.com/thumbnail3.jpg',
          format: '9:16',
          caption: 'Your story',
          created_at: new Date(Date.now() - 1800000).toISOString(),
          expires_at: new Date(Date.now() + 86400000).toISOString(),
          viewed: false,
          is_highlighted: false,
          is_mine: true
        }
      ];

      setStories(mockStories);
      setUserStories(mockUserStories);
    } catch (err) {
      console.error('Error fetching stories:', err);
      setError('Failed to load stories');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  const createStory = async (file: File, caption = '', format = '9:16'): Promise<boolean> => {
    if (!user) return false;
    
    try {
      // Mock file upload
      const mediaUrl = URL.createObjectURL(file);
      const thumbnailUrl = mediaUrl; // In a real app, generate a thumbnail
      
      // Create a new story
      const newStory: Story = {
        id: `story_${Date.now()}`,
        creator_id: user.uid || user.id || '',
        creator_name: user.displayName || 'You',
        creator_avatar: user.photoURL || 'https://i.pravatar.cc/150?img=3',
        media_url: mediaUrl,
        thumbnail_url: thumbnailUrl,
        format: '9:16',
        caption,
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 86400000).toISOString(),
        viewed: false,
        is_highlighted: false,
        is_mine: true
      };
      
      // Add to user stories
      setUserStories(prev => [newStory, ...prev]);
      return true;
    } catch (err) {
      console.error('Error creating story:', err);
      setError('Failed to create story');
      return false;
    }
  };

  const deleteStory = async (storyId: string): Promise<boolean> => {
    try {
      setUserStories(prev => prev.filter(story => story.id !== storyId));
      return true;
    } catch (err) {
      console.error('Error deleting story:', err);
      setError('Failed to delete story');
      return false;
    }
  };

  const markAsViewed = async (storyId: string): Promise<void> => {
    setStories(prev => 
      prev.map(story => 
        story.id === storyId ? { ...story, viewed: true } : story
      )
    );
  };

  const highlightStory = async (storyId: string, highlight: boolean): Promise<boolean> => {
    try {
      setUserStories(prev => 
        prev.map(story => 
          story.id === storyId ? { ...story, is_highlighted: highlight } : story
        )
      );
      return true;
    } catch (err) {
      console.error('Error highlighting story:', err);
      setError('Failed to highlight story');
      return false;
    }
  };

  const getStoryCreatorInfo = async (creatorId: string): Promise<{ name: string; avatar: string } | null> => {
    try {
      // Mock creator info retrieval
      return {
        name: `Creator ${creatorId}`,
        avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`
      };
    } catch (err) {
      console.error('Error getting creator info:', err);
      return null;
    }
  };

  return {
    stories,
    userStories,
    isLoading,
    error,
    createStory,
    deleteStory,
    markAsViewed,
    highlightStory,
    getStoryCreatorInfo
  };
};

export default useStories;
