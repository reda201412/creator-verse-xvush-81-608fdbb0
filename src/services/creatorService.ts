import { db } from '@/integrations/firebase/firebase';
import { collection, query, where, getDocs, doc, getDoc, addDoc, Timestamp, updateDoc, deleteDoc } from 'firebase/firestore';
import { VideoData } from '@/types/video';

// Add missing functions for creator following
export const followCreator = async (userId: string, creatorId: string): Promise<boolean> => {
  try {
    await addDoc(collection(db, 'follows'), {
      followerId: userId,
      followingId: creatorId,
      createdAt: Timestamp.now()
    });
    return true;
  } catch (error) {
    console.error('Error following creator:', error);
    return false;
  }
};

export const unfollowCreator = async (userId: string, creatorId: string): Promise<boolean> => {
  try {
    const followsRef = collection(db, 'follows');
    const q = query(followsRef, 
      where('followerId', '==', userId),
      where('followingId', '==', creatorId)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const followDoc = querySnapshot.docs[0];
      await deleteDoc(doc(db, 'follows', followDoc.id));
    }
    
    return true;
  } catch (error) {
    console.error('Error unfollowing creator:', error);
    return false;
  }
};

export const checkUserFollowsCreator = async (userId: string, creatorId: string): Promise<boolean> => {
  try {
    const followsRef = collection(db, 'follows');
    const q = query(followsRef, 
      where('followerId', '==', userId),
      where('followingId', '==', creatorId)
    );
    
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking if user follows creator:', error);
    return false;
  }
};

export const getUserFollowedCreatorIds = async (userId: string): Promise<string[]> => {
  try {
    const followsRef = collection(db, 'follows');
    const q = query(followsRef, where('followerId', '==', userId));
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data().followingId);
  } catch (error) {
    console.error('Error getting user followed creators:', error);
    return [];
  }
};

export const getVideoByIdFromFirestore = async (videoId: string) => {
  try {
    const videoDoc = await getDoc(doc(db, 'videos', videoId));
    if (videoDoc.exists()) {
      return { id: videoDoc.id, ...videoDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting video from Firestore:', error);
    return null;
  }
};

export const convertVideoMetadataToVideoData = (metadata: any): VideoData => {
  return {
    id: metadata.id || '',
    title: metadata.title || '',
    description: metadata.description || '',
    creatorId: metadata.userId || metadata.creatorId || '',
    thumbnailUrl: metadata.thumbnailUrl || '',
    videoUrl: metadata.videoUrl || metadata.url || metadata.video_url || '',
    isPremium: metadata.isPremium || false,
    tokenPrice: metadata.tokenPrice || 0,
    tags: metadata.tags || [],
    type: metadata.type || 'standard',
    // Other fields with default values
  };
};

// Define a CreatorProfile type for use in the app
export interface CreatorProfile {
  id: string;
  userId: string;
  username: string;
  name: string;
  bio?: string;
  avatarUrl?: string;
  coverUrl?: string;
  socialLinks?: Record<string, string>;
  followers?: number;
  following?: number;
  createdAt?: Timestamp | Date;
  premiumPrice?: number;
  categories?: string[];
}

// Rename getAllCreators to getCreators to match usage
export const getCreators = async (): Promise<CreatorProfile[]> => {
  try {
    const creatorsRef = collection(db, 'creators');
    const querySnapshot = await getDocs(creatorsRef);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      userId: doc.data().user_id || doc.data().userId,
      username: doc.data().username,
      name: doc.data().name,
      bio: doc.data().bio,
      avatarUrl: doc.data().avatarUrl || doc.data().avatar_url,
      coverUrl: doc.data().coverUrl || doc.data().cover_url,
      followers: doc.data().followers || 0,
      following: doc.data().following || 0,
      premiumPrice: doc.data().premiumPrice || 9.99,
      categories: doc.data().categories || [],
      createdAt: doc.data().createdAt || doc.data().created_at || Timestamp.now()
    }));
  } catch (error) {
    console.error('Error getting creators:', error);
    return [];
  }
};
