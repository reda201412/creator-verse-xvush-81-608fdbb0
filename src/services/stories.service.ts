import { db } from '@/integrations/firebase/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  addDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
  updateDoc
} from 'firebase/firestore';
import { StoryFilter } from '@/types/stories';

export interface Story {
  id: string;
  creatorId: string;
  content: string;
  type: 'image' | 'video' | 'text';
  createdAt: Timestamp;
  expiresAt: Timestamp;
  views: number;
  metadata?: {
    duration?: number;
    thumbnailUrl?: string;
    filterUsed?: StoryFilter;
    location?: {
      latitude: number;
      longitude: number;
      name?: string;
    };
    mentions?: string[];
    hashtags?: string[];
    music?: {
      title: string;
      artist: string;
      url?: string;
    };
    interactive?: {
      poll?: {
        question: string;
        options: string[];
        votes: Record<string, number>;
      };
      quiz?: {
        question: string;
        options: string[];
        correct_option: number;
      };
    };
  };
}

export const getStories = async (creatorId: string): Promise<Story[]> => {
  try {
    const q = query(
      collection(db, 'stories'),
      where('creatorId', '==', creatorId),
      where('expiresAt', '>', serverTimestamp()),
      orderBy('expiresAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Story[];
  } catch (error) {
    console.error('Error fetching stories:', error);
    return [];
  }
};

export const createStory = async (storyData: Omit<Story, 'id' | 'createdAt' | 'views'>): Promise<Story | null> => {
  try {
    const storyRef = await addDoc(collection(db, 'stories'), {
      ...storyData,
      createdAt: serverTimestamp(),
      views: 0
    });
    const storyDoc = await getDoc(storyRef);
    return {
      id: storyRef.id,
      ...storyDoc.data()
    } as Story;
  } catch (error) {
    console.error('Error creating story:', error);
    return null;
  }
};

export const deleteStory = async (storyId: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'stories', storyId));
    return true;
  } catch (error) {
    console.error('Error deleting story:', error);
    return false;
  }
};

export const incrementStoryViews = async (storyId: string): Promise<boolean> => {
  try {
    const storyRef = doc(db, 'stories', storyId);
    const storyDoc = await getDoc(storyRef);
    if (!storyDoc.exists()) {
      return false;
    }
    const currentViews = storyDoc.data().views || 0;
    await updateDoc(storyRef, {
      views: currentViews + 1
    });
    return true;
  } catch (error) {
    console.error('Error incrementing story views:', error);
    return false;
  }
};
