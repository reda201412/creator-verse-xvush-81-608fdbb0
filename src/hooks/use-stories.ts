
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FirestoreStory } from '@/vite-env';

// Mock story data
const mockStories = [
  {
    id: '1',
    creatorId: 'creator-1',
    mediaUrl: 'https://picsum.photos/1080/1920',
    thumbnailUrl: 'https://picsum.photos/400/800',
    caption: 'Beautiful day!',
    format: '9:16',
    duration: 0,
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    expiresAt: new Date(Date.now() + 86400000).toISOString(), // 24 hours from now
    viewCount: 127,
    isHighlighted: false
  },
  {
    id: '2',
    creatorId: 'creator-2',
    mediaUrl: 'https://picsum.photos/1080/1920?random=2',
    thumbnailUrl: 'https://picsum.photos/400/800?random=2',
    caption: 'Check out my new content!',
    format: '9:16',
    duration: 0,
    createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    expiresAt: new Date(Date.now() + 86400000).toISOString(), // 24 hours from now
    viewCount: 89,
    isHighlighted: true
  },
  {
    id: '3',
    creatorId: 'creator-3',
    mediaUrl: 'https://picsum.photos/1080/1920?random=3',
    thumbnailUrl: 'https://picsum.photos/400/800?random=3',
    caption: 'Behind the scenes!',
    format: '9:16',
    duration: 0,
    createdAt: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
    expiresAt: new Date(Date.now() + 86400000).toISOString(), // 24 hours from now
    viewCount: 205,
    isHighlighted: false
  }
];

// Dummy creator data
const creators = {
  'creator-1': {
    id: 'creator-1',
    name: 'Jane Smith',
    username: 'janesmith',
    avatarUrl: 'https://i.pravatar.cc/150?img=5'
  },
  'creator-2': {
    id: 'creator-2',
    name: 'Robert Johnson',
    username: 'rob_j',
    avatarUrl: 'https://i.pravatar.cc/150?img=8'
  },
  'creator-3': {
    id: 'creator-3',
    name: 'Alice Wonder',
    username: 'alice_wonder',
    avatarUrl: 'https://i.pravatar.cc/150?img=9'
  }
};

// Types
export interface StoryUploadOptions {
  file: File;
  caption?: string;
  onProgress?: (progress: number) => void;
}

export interface Story extends FirestoreStory {
  creator: {
    id: string;
    name: string;
    username: string;
    avatarUrl: string;
  };
  timeAgo: string;
}

export interface UseStoriesHookReturn {
  stories: Story[];
  userStories: Story[];
  featuredStories: Story[];
  uploadStory: (options: StoryUploadOptions) => Promise<boolean>;
  loadingStories: boolean;
  refreshStories: () => Promise<void>;
  markStoryAsViewed: (storyId: string) => Promise<void>;
}

export function useStories(): UseStoriesHookReturn {
  const { user } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);
  const [userStories, setUserStories] = useState<Story[]>([]);
  const [featuredStories, setFeaturedStories] = useState<Story[]>([]);
  const [loadingStories, setLoadingStories] = useState(false);

  // Load stories
  const fetchStories = async () => {
    setLoadingStories(true);
    try {
      // In a real app, fetch stories from your backend
      const fetchedStories = mockStories.map((story) => ({
        ...story,
        creator: creators[story.creatorId as keyof typeof creators],
        timeAgo: formatDistanceToNow(new Date(story.createdAt), { addSuffix: true, locale: fr })
      }));
      
      setStories(fetchedStories);
      
      // Filter user's own stories
      if (user) {
        const ownStories = fetchedStories.filter(
          story => story.creatorId === user.uid
        );
        setUserStories(ownStories);
      }
      
      // Filter featured/highlighted stories
      const featured = fetchedStories.filter(story => story.isHighlighted);
      setFeaturedStories(featured);
    } catch (error) {
      console.error('Error fetching stories:', error);
      toast.error('Impossible de charger les stories');
    }
    setLoadingStories(false);
  };

  useEffect(() => {
    fetchStories();
  }, [user]);

  // Upload story function
  const uploadStory = async (options: StoryUploadOptions): Promise<boolean> => {
    if (!user) {
      toast.error('Vous devez être connecté pour publier une story');
      return false;
    }

    const { file, caption, onProgress } = options;
    
    // Simulate upload progress
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 10;
      if (progress <= 100) {
        onProgress?.(progress);
      } else {
        clearInterval(progressInterval);
      }
    }, 300);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // In a real app, upload the file to storage and save metadata to database
      const newStoryId = `story-${Date.now()}`;
      const newStory: Story = {
        id: newStoryId,
        creatorId: user.uid,
        mediaUrl: URL.createObjectURL(file),
        thumbnailUrl: URL.createObjectURL(file),
        caption: caption || '',
        format: '9:16',
        duration: file.type.startsWith('video/') ? 15 : 0, // Assume videos are 15 seconds
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 86400000).toISOString(), // 24 hours from now
        viewCount: 0,
        isHighlighted: false,
        creator: {
          id: user.uid,
          name: user.displayName || user.username || user.email?.split('@')[0] || 'User',
          username: user.username || user.email?.split('@')[0] || 'user',
          avatarUrl: user.profileImageUrl || 'https://i.pravatar.cc/150'
        },
        timeAgo: 'à l\'instant'
      };
      
      // Update state with the new story
      setStories(prev => [newStory, ...prev]);
      setUserStories(prev => [newStory, ...prev]);
      
      clearInterval(progressInterval);
      onProgress?.(100);
      
      return true;
    } catch (error) {
      console.error('Error uploading story:', error);
      clearInterval(progressInterval);
      return false;
    }
  };

  // Mark story as viewed
  const markStoryAsViewed = async (storyId: string): Promise<void> => {
    // In a real app, update the view status in the backend
    setStories(prev => 
      prev.map(story => 
        story.id === storyId ? { ...story, viewed: true } : story
      )
    );
  };

  // Refresh stories
  const refreshStories = async (): Promise<void> => {
    return fetchStories();
  };

  return {
    stories,
    userStories,
    featuredStories,
    uploadStory,
    loadingStories,
    refreshStories,
    markStoryAsViewed
  };
}
