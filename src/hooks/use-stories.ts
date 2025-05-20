
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

// Mock firestore functions and DB
const collection = (db, path) => ({ path });
const query = (collectionRef, ...args) => ({ collectionRef, args });
const where = (field, operator, value) => ({ field, operator, value });
const orderBy = (field, direction) => ({ field, direction });
const limit = (n) => ({ limit: n });
const serverTimestamp = () => new Date().toISOString();

// Mock db
const db = {};

// Mock getDocs function
const getDocs = async (query) => {
  // Return mock data
  const docs = [
    {
      id: 'story1',
      data: () => ({
        creatorId: 'user1',
        mediaUrl: 'https://example.com/story1.mp4',
        thumbnailUrl: 'https://example.com/story1.jpg',
        caption: 'My first story',
        filterUsed: 'none',
        format: '16:9',
        duration: 15,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
        viewCount: 10,
        isHighlighted: false,
        metadata: {}
      })
    }
  ];
  return { 
    docs,
    empty: docs.length === 0
  };
};

// Mock addDoc function
const addDoc = async (collectionRef, data) => {
  console.log('Adding doc to collection', collectionRef.path, data);
  return { id: `story_${Date.now()}` };
};

const useStories = () => {
  const { user } = useAuth();
  const [stories, setStories] = useState<any[]>([]);
  const [storyGroups, setStoryGroups] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mapFirestoreStoryToStory = (firestoreStory: any): any => {
    return {
      id: firestoreStory.id,
      creator_id: firestoreStory.creatorId,
      media_url: firestoreStory.mediaUrl,
      thumbnail_url: firestoreStory.thumbnailUrl || '',
      caption: firestoreStory.caption || '',
      filter_used: firestoreStory.filterUsed || '',
      format: firestoreStory.format as '16:9' | '9:16' | '1:1',
      duration: firestoreStory.duration,
      created_at: firestoreStory.createdAt,
      expires_at: firestoreStory.expiresAt,
      view_count: firestoreStory.viewCount,
      is_highlighted: firestoreStory.isHighlighted || false,
      metadata: firestoreStory.metadata || {},
      viewed: firestoreStory.viewed || false,
    };
  };

  const fetchActiveStories = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const now = new Date();
      const storiesRef = collection(db, 'stories');
      const activeStoriesQuery = query(
        storiesRef,
        where('expiresAt', '>=', now.toISOString()),
        orderBy('createdAt', 'desc'),
        limit(50)
      );

      const querySnapshot = await getDocs(activeStoriesQuery);
      const responseData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      const mappedStories = responseData.map(firestoryStory => mapFirestoreStoryToStory(firestoryStory));
      setStories(mappedStories);
      
      // Group stories by creator
      const groups = mappedStories.reduce((acc, story) => {
        const creatorId = story.creator_id;
        if (!acc[creatorId]) {
          acc[creatorId] = {
            creator: {
              id: creatorId,
              username: `user_${creatorId}`,
              display_name: `User ${creatorId}`,
              avatar_url: `https://i.pravatar.cc/150?u=${creatorId}`
            },
            stories: [],
            hasUnviewed: false
          };
        }
        
        acc[creatorId].stories.push(story);
        if (!story.viewed) {
          acc[creatorId].hasUnviewed = true;
        }
        
        return acc;
      }, {});
      
      setStoryGroups(Object.values(groups));
      
    } catch (error: any) {
      console.error("Error fetching stories:", error);
      setError(error.message || "Failed to fetch stories");
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  const checkIfUserCreatedStoriesInLast24Hours = async () => {
    try {
      if (!user?.uid && !user?.id) return false;

      const now = new Date();
      const twentyFourHoursAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));

      const storiesRef = collection(db, 'stories');
      const userStoriesQuery = query(
        storiesRef,
        where('creatorId', '==', user.uid || user.id),
        where('createdAt', '>=', twentyFourHoursAgo.toISOString()),
        limit(1)
      );

      const querySnapshot = await getDocs(userStoriesQuery);
      return !querySnapshot.empty;
    } catch (error) {
      console.error("Error checking user stories:", error);
      setError("Failed to check user stories");
      return false;
    }
  };

  const createStory = async (storyData: any) => {
    try {
      setIsLoading(true);
      setError(null);

      const storiesRef = collection(db, 'stories');
      await addDoc(storiesRef, {
        creatorId: user?.uid || user?.id,
        mediaUrl: storyData.mediaUrl,
        thumbnailUrl: storyData.thumbnailUrl,
        caption: storyData.caption,
        filterUsed: storyData.filterUsed,
        format: storyData.format,
        duration: storyData.duration,
        createdAt: serverTimestamp(),
        expiresAt: storyData.expiresAt,
        viewCount: 0,
        isHighlighted: false,
        metadata: storyData.metadata,
      });

      try {
        const response = await fetch(`/api/stories`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(storyData),
        });

        if (!response.ok) {
          throw new Error(`Failed to create story: ${response.status}`);
        }
      } catch (err) {
        console.log("API error, but continuing with local story creation", err);
      }

      await fetchActiveStories();
    } catch (error: any) {
      console.error("Error creating story:", error);
      setError(error.message || "Failed to create story");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveStories();
  }, []);

  return {
    stories,
    storyGroups,
    isLoading,
    loading,
    error,
    fetchActiveStories,
    checkIfUserCreatedStoriesInLast24Hours,
    createStory,
  };
};

export default useStories;
