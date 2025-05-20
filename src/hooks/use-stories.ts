
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/contexts/firebase-mock';
import { toast } from 'sonner';
import { FirestoreStory } from '@/vite-env';

// Define Story type
interface Story {
  id: string;
  creator_id: string;
  creator_name?: string;
  creator_avatar?: string;
  media_url: string;
  thumbnail_url?: string;
  caption?: string;
  filter_used?: string;
  format: '16:9' | '9:16' | '1:1';
  duration: number;
  created_at: string;
  expires_at: string;
  view_count: number;
  is_highlighted: boolean;
  metadata?: any;
  viewed?: boolean;
}

const useStories = () => {
  const { user } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);
  const [loadingStories, setLoadingStories] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to map Firestore stories to our app's Story format
  const mapFirestoreToStory = (firestoreStory: FirestoreStory): Story => {
    return {
      id: firestoreStory.id,
      creator_id: firestoreStory.creatorId,
      media_url: firestoreStory.mediaUrl,
      thumbnail_url: firestoreStory.thumbnailUrl,
      caption: firestoreStory.caption,
      filter_used: firestoreStory.filterUsed,
      format: firestoreStory.format as '16:9' | '9:16' | '1:1',
      duration: firestoreStory.duration,
      created_at: firestoreStory.createdAt,
      expires_at: firestoreStory.expiresAt,
      view_count: firestoreStory.viewCount,
      is_highlighted: firestoreStory.isHighlighted,
      metadata: firestoreStory.metadata,
      viewed: firestoreStory.viewed
    };
  };

  // Fetch stories from Firestore
  const fetchStories = async () => {
    setLoadingStories(true);
    setError(null);

    try {
      // Mock data for now
      const mockStoriesData: FirestoreStory[] = [
        {
          id: '1',
          creatorId: 'creator1',
          mediaUrl: 'https://example.com/video1.mp4',
          thumbnailUrl: 'https://example.com/thumb1.jpg',
          caption: 'My first story',
          format: '9:16',
          duration: 15,
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 86400000).toISOString(),
          viewCount: 120,
          isHighlighted: true,
        },
        {
          id: '2',
          creatorId: 'creator2',
          mediaUrl: 'https://example.com/video2.mp4',
          format: '16:9',
          duration: 20,
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 86400000).toISOString(),
          viewCount: 85,
          isHighlighted: false,
        }
      ];

      const mappedStories = mockStoriesData.map(mapFirestoreToStory);
      setStories(mappedStories);
    } catch (err) {
      console.error('Error fetching stories:', err);
      setError('Failed to load stories');
      toast.error('Failed to load stories');
    } finally {
      setLoadingStories(false);
    }
  };

  // Upload a new story
  const uploadStory = async (file: File, caption?: string) => {
    if (!user?.uid && !user?.id) {
      toast.error('You must be logged in to upload a story');
      return { success: false };
    }

    try {
      // Mock story upload
      const newStory: Story = {
        id: `story_${Date.now()}`,
        creator_id: user?.uid || user?.id || '',
        media_url: URL.createObjectURL(file),
        caption: caption || '',
        format: '9:16',
        duration: 15,
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 86400000).toISOString(),
        view_count: 0,
        is_highlighted: false,
      };

      setStories(prev => [newStory, ...prev]);
      toast.success('Story uploaded successfully');
      return { success: true };
    } catch (err) {
      console.error('Error uploading story:', err);
      toast.error('Failed to upload story');
      return { success: false, error: err };
    }
  };

  // Mark a story as viewed
  const markStoryAsViewed = async (storyId: string) => {
    try {
      setStories(prev => 
        prev.map(story => 
          story.id === storyId 
            ? { ...story, viewed: true, view_count: story.view_count + 1 } 
            : story
        )
      );
      
      // If user is logged in, record their view
      if (user?.uid || user?.id) {
        console.log(`User ${user?.uid || user?.id} viewed story ${storyId}`);
        // Mock API call to record view
      }
      
      return true;
    } catch (err) {
      console.error('Error marking story as viewed:', err);
      return false;
    }
  };

  // Highlight or unhighlight a story
  const toggleHighlight = async (storyId: string) => {
    try {
      setStories(prev => 
        prev.map(story => 
          story.id === storyId 
            ? { ...story, is_highlighted: !story.is_highlighted } 
            : story
        )
      );
      
      const story = stories.find(s => s.id === storyId);
      const action = story?.is_highlighted ? 'removed from' : 'added to';
      toast.success(`Story ${action} highlights`);
      return true;
    } catch (err) {
      console.error('Error toggling story highlight:', err);
      toast.error('Failed to update highlights');
      return false;
    }
  };

  // Load stories on mount or when user changes
  useEffect(() => {
    if (user) {
      fetchStories();
    }
  }, [user]);

  return {
    stories,
    loadingStories,
    error,
    uploadStory,
    markStoryAsViewed,
    toggleHighlight,
    fetchStories,
  };
};

export default useStories;
