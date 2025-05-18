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
import { UserProfile } from '@/contexts/AuthContext'; // Keep UserProfile type

// Extend UserProfile to include creator specific metrics if needed
export interface CreatorProfileData extends UserProfile {
  metrics?: {
    followers?: number;
    following?: number; // Number of people the creator follows
    videos?: number;
    // revenue?: number; // Revenue might be more complex to calculate client-side
  };
  isOnline?: boolean; // Online status is usually managed by a presence system (ex: Realtime Database)
}

// Interface for video metadata stored in Firestore (MATCHING YOUR SCHEMA + MUX FIELDS)
export interface VideoFirestoreData {
  id: number; // Matches your 'id' serial primary key
  creatorId?: number | null; // Matches your 'creatorId' integer
  videoUrl?: string | null; // Matches your 'videoUrl' varchar (camelCase)
  isFree?: boolean | null; // Matches your 'isFree' boolean (camelCase)
  uploadedat?: string | null; // Matches your 'uploadedat' timestamp (camelCase)
  title?: string | null;
  description?: string | null;
  thumbnail_url?: string | null; // Matches your 'thumbnail_url' text
  video_url?: string | null; // Matches your 'video_url' text (snake_case, likely for Mux playback)
  user_id?: string | null; // Matches your 'user_id' uuid (stored as text in JS)
  type?: string | null;
  format?: string | null;
  is_premium?: boolean | null; // Matches your 'is_premium' boolean
  token_price?: number | null; // Matches your 'token_price' integer
  restrictions?: any | null; // Matches your 'restrictions' jsonb

  // *** Columns needed for Mux Integration (ADD THESE TO YOUR FIRESTORE DB) ***
  upload_id?: string | null; // Mux upload ID
  mux_asset_id?: string | null; // Mux asset ID
  mux_playback_id?: string | null; // Mux playback ID
  status?: 'created' | 'processing' | 'ready' | 'error' | null; // Processing status
  error_details?: any | null; // Mux error details
}

// Keep Firebase fetching for user profiles and follows for now, as the request didn't specify changing these.
// You might want to migrate these to Firestore later for full consistency.

// NOTE: getCreatorById still fetches creator profile and follow counts from Firebase
export const getCreatorById = async (id: string): Promise<CreatorProfileData | null> => {
  try {
    // NOTE: This still fetches from Firebase 'users' collection.
    // You might need to adjust this if you migrate users to Firestore auth/db.
    // Assuming Firebase user id is compatible with Firestore user_id uuid string representation
    const userRef = doc(db, 'users', id);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists() || userSnap.data()?.role !== 'creator') {
      console.warn(`Creator profile not found for id: ${id} or user is not a creator.`);
      return null;
    }

    const creatorData = userSnap.data() as UserProfile;

    // Count followers (still Firebase)
    // You might need to adjust this if you migrate follow relationships to Firestore.
    const followersQuery = query(collection(db, 'follows'), where('creatorId', '==', id));
    const followersSnap = await getCountFromServer(followersQuery);
    const followersCount = followersSnap.data().count;

    // Count who this creator follows (still Firebase)
    // You might need to adjust this if you migrate follow relationships to Firestore.
    const followingQuery = query(collection(db, 'follows'), where('followerId', '==', id));
    const followingSnap = await getCountFromServer(followingQuery);
    const followingCount = followingSnap.data().count;
    
    // TODO: Implement Firestore query to count videos
    console.log('Counting videos from Firestore for user ID:', id);
    const videosCount = 0; // Placeholder for Firestore implementation

    return {
      ...creatorData,
      metrics: {
        followers: followersCount,
        following: followingCount,
        videos: videosCount, // Use the count from Firestore, default to 0
      },
      isOnline: Math.random() > 0.5, // Simulate online status for now
    };
  } catch (error) {
    console.error('Error in getCreatorById:', error);
    return null;
  }
};

// NOTE: getAllCreators still fetches from Firebase 'users' collection
export const getAllCreators = async (): Promise<CreatorProfileData[]> => {
  try {
    const q = query(collection(db, 'users'), where('role', '==', 'creator'));
    const querySnapshot = await getDocs(q);
    
    const creators: CreatorProfileData[] = [];
    querySnapshot.forEach((doc) => {
      creators.push({ 
        ...(doc.data() as UserProfile),
        isOnline: Math.random() > 0.5, // Simulate
      } as CreatorProfileData);
    });
    return creators;
  } catch (error) {
    console.error('Error in getAllCreators:', error);
    return [];
  }
};

// Get creator videos from Firestore
export const getCreatorVideos = async (creatorId: string): Promise<VideoFirestoreData[]> => {
  try {
    // TODO: Implement Firestore query to get creator videos
    console.log('Fetching videos from Firestore for creator ID:', creatorId);
    
    // For now, return an empty array
    return [];
  } catch (error) {
    console.error('Error in getCreatorVideos (Firestore):', error);
    return [];
  }
};

// Get a single video by ID from Firestore
export const getVideoById = async (videoId: string): Promise<VideoFirestoreData | null> => {
  try {
    if (!videoId) {
      throw new Error('Video ID is required');
    }

    // TODO: Implement Firestore query to get video by ID
    console.log('Fetching video from Firestore with ID:', videoId);
    
    // For now, return null
    return null;
  } catch (error) {
    console.error('Error in getVideoById (Firestore):', error);
    return null;
  }
};

// The follow/unfollow/getUserFollowedCreatorIds functions still use Firebase
// You might need to adjust these if you migrate follow relationships to Supabase.

export const checkUserFollowsCreator = async (userId: string, creatorId: string): Promise<boolean> => {
  try {
    const q = query(
      collection(db, 'follows'),
      where('followerId', '==', userId),
      where('creatorId', '==', creatorId),
      limit(1)
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
    const q = query(collection(db, 'follows'), where('followerId', '==', userId));
    const querySnapshot = await getDocs(q);
    const creatorIds: string[] = [];
    querySnapshot.forEach((doc) => {
      const followData = doc.data();
      if (followData.creatorId) {
        creatorIds.push(followData.creatorId);
      }
    });
    return creatorIds;
  } catch (error) {
    console.error('Error in getUserFollowedCreatorIds:', error);
    return []; 
  }
};
