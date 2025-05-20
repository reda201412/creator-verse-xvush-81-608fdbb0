import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp, orderBy, limit } from 'firebase/firestore';

const useStories = () => {
  const { user } = useAuth();
  const [stories, setStories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mapFirestoreStoryToStory = (firestoreStory: FirestoreStory): any => {
    return {
      id: firestoreStory.id,
      creator_id: firestoreStory.creatorId, // Changed from creator to creatorId
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
      const responseData: FirestoreStory[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as FirestoreStory[];

      setStories(responseData.map((firestoryStory: any) => mapFirestoreStoryToStory(firestoryStory)));
    } catch (error: any) {
      console.error("Error fetching stories:", error);
      setError(error.message || "Failed to fetch stories");
    } finally {
      setIsLoading(false);
    }
  };

  const checkIfUserCreatedStoriesInLast24Hours = async () => {
    try {
      if (!user?.id) return false;

      const now = new Date();
      const twentyFourHoursAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));

      const storiesRef = collection(db, 'stories');
      const userStoriesQuery = query(
        storiesRef,
        where('creatorId', '==', user.id),
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
        creatorId: user?.id,
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

      const response = await fetch(`/api/stories/${storyData.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(storyData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create story: ${response.status}`);
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
    isLoading,
    error,
    fetchActiveStories,
    checkIfUserCreatedStoriesInLast24Hours,
    createStory,
  };
};

export default useStories;
