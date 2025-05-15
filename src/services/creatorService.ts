import { db } from '@/integrations/firebase/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  deleteDoc,
  serverTimestamp,
  writeBatch,
  getCountFromServer
} from 'firebase/firestore';
import { UserProfile } from '@/contexts/AuthContext';

// Extend UserProfile to include creator specific metrics
export interface CreatorProfileData extends UserProfile {
  metrics?: {
    followers?: number;
    following?: number;
    videos?: number;
  };
  isOnline?: boolean;
}

// Interface for video metadata stored in Firestore
export interface VideoData {
  id: string;
  creatorId: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  type: 'standard' | 'teaser' | 'premium' | 'vip';
  format: '16:9' | '9:16' | '1:1';
  isPremium: boolean;
  tokenPrice?: number;
  restrictions?: any;
  status: 'created' | 'processing' | 'ready' | 'error';
  errorDetails?: any;
  createdAt: string;
  updatedAt: string;
  // Mux fields
  muxUploadId?: string;
  muxAssetId?: string;
  muxPlaybackId?: string;
}

export const getCreatorById = async (id: string): Promise<CreatorProfileData | null> => {
  try {
    const userRef = doc(db, 'users', id);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists() || userSnap.data()?.role !== 'creator') {
      console.warn(`Creator profile not found for id: ${id} or user is not a creator.`);
      return null;
    }

    const creatorData = userSnap.data() as UserProfile;

    // Count followers
    const followersQuery = query(collection(db, 'follows'), where('creatorId', '==', id));
    const followersSnap = await getCountFromServer(followersQuery);
    const followersCount = followersSnap.data().count;

    // Count following
    const followingQuery = query(collection(db, 'follows'), where('followerId', '==', id));
    const followingSnap = await getCountFromServer(followingQuery);
    const followingCount = followingSnap.data().count;
    
    // Count videos
    const videosQuery = query(collection(db, 'videos'), where('creatorId', '==', id));
    const videosSnap = await getCountFromServer(videosQuery);
    const videosCount = videosSnap.data().count;

    return {
      ...creatorData,
      metrics: {
        followers: followersCount,
        following: followingCount,
        videos: videosCount,
      },
      isOnline: Math.random() > 0.5, // Simulate online status for now
    };
  } catch (error) {
    console.error('Error in getCreatorById:', error);
    return null;
  }
};

export const getAllCreators = async (): Promise<CreatorProfileData[]> => {
  try {
    const q = query(collection(db, 'users'), where('role', '==', 'creator'));
    const querySnapshot = await getDocs(q);
    
    const creators: CreatorProfileData[] = [];
    for (const doc of querySnapshot.docs) {
      const creatorData = doc.data() as UserProfile;
      const metrics = await getCreatorMetrics(doc.id);
      creators.push({ 
        ...creatorData,
        metrics,
        isOnline: Math.random() > 0.5, // Simulate
      } as CreatorProfileData);
    }
    return creators;
  } catch (error) {
    console.error('Error in getAllCreators:', error);
    return [];
  }
};

const getCreatorMetrics = async (creatorId: string) => {
  try {
    const [followersSnap, followingSnap, videosSnap] = await Promise.all([
      getCountFromServer(query(collection(db, 'follows'), where('creatorId', '==', creatorId))),
      getCountFromServer(query(collection(db, 'follows'), where('followerId', '==', creatorId))),
      getCountFromServer(query(collection(db, 'videos'), where('creatorId', '==', creatorId)))
    ]);

    return {
      followers: followersSnap.data().count,
      following: followingSnap.data().count,
      videos: videosSnap.data().count,
    };
  } catch (error) {
    console.error('Error getting creator metrics:', error);
    return {
      followers: 0,
      following: 0,
      videos: 0,
    };
  }
};

export const getCreatorVideos = async (creatorId: string): Promise<VideoData[]> => {
  try {
    const q = query(
      collection(db, 'videos'),
      where('creatorId', '==', creatorId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as VideoData[];
  } catch (error) {
    console.error('Error in getCreatorVideos:', error);
    return [];
  }
};

export const getVideoById = async (videoId: string): Promise<VideoData | null> => {
  try {
    const videoRef = doc(db, 'videos', videoId);
    const videoSnap = await getDoc(videoRef);

    if (!videoSnap.exists()) {
      return null;
    }

    return {
      id: videoSnap.id,
      ...videoSnap.data()
    } as VideoData;
  } catch (error) {
    console.error('Error in getVideoById:', error);
    return null;
  }
};

export const checkUserFollowsCreator = async (userId: string, creatorId: string): Promise<boolean> => {
  try {
    const q = query(
      collection(db, 'follows'),
      where('followerId', '==', userId),
      where('creatorId', '==', creatorId),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error in checkUserFollowsCreator:', error);
    return false;
  }
};

export const followCreator = async (userId: string, creatorId: string): Promise<boolean> => {
  if (userId === creatorId) {
    console.warn("User cannot follow themselves.");
    return false;
  }
  try {
    const alreadyFollowing = await checkUserFollowsCreator(userId, creatorId);
    if (alreadyFollowing) {
      console.log("User already follows this creator.");
      return true; 
    }

    await addDoc(collection(db, 'follows'), {
      followerId: userId,
      creatorId: creatorId,
      followedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error in followCreator:', error);
    return false;
  }
};

export const unfollowCreator = async (userId: string, creatorId: string): Promise<boolean> => {
  try {
    const q = query(
      collection(db, 'follows'),
      where('followerId', '==', userId),
      where('creatorId', '==', creatorId)
    );
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log("Follow relationship not found.");
      return false;
    }

    const batch = writeBatch(db);
    querySnapshot.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    return true;
  } catch (error) {
    console.error('Error in unfollowCreator:', error);
    return false;
  }
};

export const getUserFollowedCreatorIds = async (userId: string): Promise<string[]> => {
  try {
    const q = query(
      collection(db, 'follows'),
      where('followerId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => doc.data().creatorId);
  } catch (error) {
    console.error('Error in getUserFollowedCreatorIds:', error);
    return [];
  }
};
