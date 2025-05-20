import { useState, useEffect, useContext } from 'react';
import { db, storage } from '@/integrations/firebase/firebase';
import { collection, query, where, getDocs, limit, orderBy, startAfter, doc, getDoc, addDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { AuthContext } from '@/contexts/AuthContext';
import { Story, StoryGroup, StoryUploadParams, UseStoriesHookReturn } from '@/types/stories';

const STORIES_PER_PAGE = 10;

export const useStories = (): UseStoriesHookReturn => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loadingStories, setLoadingStories] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const { user } = useContext(AuthContext);
  
  useEffect(() => {
    loadInitialStories();
  }, []);
  
  const loadInitialStories = async () => {
    setLoadingStories(true);
    try {
      const storiesQuery = query(
        collection(db, 'stories'),
        orderBy('created_at', 'desc'),
        limit(STORIES_PER_PAGE)
      );
      
      const snapshot = await getDocs(storiesQuery);
      if (!snapshot.empty) {
        const newStories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Story));
        setStories(newStories);
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      }
    } catch (error) {
      console.error("Error loading initial stories:", error);
      setError('Failed to load stories');
    } finally {
      setLoadingStories(false);
    }
  };
  
  const loadMoreStories = async () => {
    if (!lastVisible) return;
    setLoadingStories(true);
    
    try {
      const storiesQuery = query(
        collection(db, 'stories'),
        orderBy('created_at', 'desc'),
        startAfter(lastVisible),
        limit(STORIES_PER_PAGE)
      );
      
      const snapshot = await getDocs(storiesQuery);
      if (!snapshot.empty) {
        const newStories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Story));
        setStories(prev => [...prev, ...newStories]);
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      }
    } catch (error) {
      console.error("Error loading more stories:", error);
      setError('Failed to load more stories');
    } finally {
      setLoadingStories(false);
    }
  };
  
  const uploadStory = async ({ file, caption, onProgress = () => {} }: StoryUploadParams): Promise<boolean> => {
    setError(null);

    if (!user) {
      setError('You must be logged in to upload a story');
      return false;
    }

    try {
      setIsUploading(true);
      
      // Update in storage
      const storyId = `story_${Date.now()}`;
      
      // Generate fake upload response
      const mockUploadResponse = {
        url: URL.createObjectURL(file),
        storyId
      };
      
      // Create the story object
      const newStory: Story = {
        id: storyId,
        creator_id: user.uid, // Use uid as it's guaranteed to exist
        media_url: mockUploadResponse.url,
        caption: caption,
        format: '9:16', // Default vertical format for stories
        duration: 5, // Default duration in seconds
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
        view_count: 0,
        is_highlighted: false,
        creator_name: user.username || user.email || 'User',
        creator_avatar: user.profileImageUrl || `https://i.pravatar.cc/150?u=${user.username}`,
      };

      // Add to local stories array
      setStories(prev => [newStory, ...prev]);
      
      return true;
    } catch (error) {
      console.error("Error uploading story:", error);
      setError('Failed to upload story');
      return false;
    } finally {
      setIsUploading(false);
    }
  };
  
  const markStoryAsViewed = async (storyId: string) => {
    try {
      // Optimistically update the local state
      setStories(prevStories =>
        prevStories.map(story =>
          story.id === storyId ? { ...story, viewed: true } : story
        )
      );
      
      // Simulate updating the view count on the server
      // In a real application, you would make an API call to update the view count
      console.log(`Marked story ${storyId} as viewed`);
    } catch (error) {
      console.error("Error marking story as viewed:", error);
      setError('Failed to mark story as viewed');
    }
  };
  
  return { stories, loadingStories, uploadStory, markStoryAsViewed, error };
};
