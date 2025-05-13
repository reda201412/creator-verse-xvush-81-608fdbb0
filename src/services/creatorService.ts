
import { collection, query, where, getDocs, doc, deleteDoc, Timestamp, getDoc, setDoc, addDoc } from 'firebase/firestore';
import { db } from '@/integrations/firebase/firebase';
import { VideoData } from '@/types/video';

export interface VideoFirestoreData {
  id: string;
  title: string;
  description: string;  // Make description required 
  creatorId: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  isPremium?: boolean;
  tokenPrice?: number;
  tags?: string[];
  uploadStatus?: 'pending' | 'processing' | 'complete' | 'error';
  format?: string;
  duration?: number;
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
  createdAt?: Timestamp;
  publishedAt?: Timestamp;
  revenueGenerated?: number;
  type?: string;
  views?: number;
  watchHours?: number;
  likes?: number;
}

export interface CreatorProfile {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  followersCount?: number;
  isOnline?: boolean;
  role?: string;
}

export async function getCreatorVideos(creatorId: string): Promise<VideoFirestoreData[]> {
  try {
    const videosRef = collection(db, 'videos');
    const q = query(videosRef, where('creatorId', '==', creatorId));
    const querySnapshot = await getDocs(q);
    
    const videos: VideoFirestoreData[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as VideoFirestoreData;
      videos.push({
        ...data,
        id: doc.id,
        description: data.description || ''  // Ensure description is always provided
      });
    });
    
    return videos;
  } catch (error) {
    console.error('Error fetching creator videos:', error);
    throw error;
  }
}

export async function getAllVideos(): Promise<VideoData[]> {
  try {
    const videosRef = collection(db, 'videos');
    const querySnapshot = await getDocs(videosRef);
    
    const videos: VideoData[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      videos.push({
        ...data,
        id: doc.id,
        description: data.description || '',
        creatorId: data.creatorId || '',
        title: data.title || 'Untitled Video'
      } as VideoData);
    });
    
    return videos;
  } catch (error) {
    console.error('Error fetching all videos:', error);
    throw error;
  }
}

export async function getCreators(): Promise<CreatorProfile[]> {
  try {
    const creatorsRef = collection(db, 'users');
    const q = query(creatorsRef, where('role', '==', 'creator'));
    const querySnapshot = await getDocs(q);
    
    const creators: CreatorProfile[] = [];
    querySnapshot.forEach((doc) => {
      creators.push({
        ...doc.data(),
        id: doc.id
      } as CreatorProfile);
    });
    
    return creators;
  } catch (error) {
    console.error('Error fetching creators:', error);
    throw error;
  }
}

// Add missing functions for following/unfollowing creators
export async function followCreator(userId: string, creatorId: string): Promise<boolean> {
  try {
    const followRef = doc(db, `users/${userId}/following/${creatorId}`);
    const followerRef = doc(db, `users/${creatorId}/followers/${userId}`);
    
    // Add to user's following collection
    await setDoc(followRef, {
      creatorId,
      followedAt: Timestamp.now()
    });
    
    // Add to creator's followers collection
    await setDoc(followerRef, {
      userId,
      followedAt: Timestamp.now()
    });
    
    // Update creator's follower count
    const creatorRef = doc(db, 'users', creatorId);
    const creatorDoc = await getDoc(creatorRef);
    if (creatorDoc.exists()) {
      const creatorData = creatorDoc.data();
      const currentCount = creatorData.followersCount || 0;
      await setDoc(creatorRef, { ...creatorData, followersCount: currentCount + 1 }, { merge: true });
    }
    
    return true;
  } catch (error) {
    console.error('Error following creator:', error);
    return false;
  }
}

export async function unfollowCreator(userId: string, creatorId: string): Promise<boolean> {
  try {
    const followRef = doc(db, `users/${userId}/following/${creatorId}`);
    const followerRef = doc(db, `users/${creatorId}/followers/${userId}`);
    
    // Remove from user's following collection
    await deleteDoc(followRef);
    
    // Remove from creator's followers collection
    await deleteDoc(followerRef);
    
    // Update creator's follower count
    const creatorRef = doc(db, 'users', creatorId);
    const creatorDoc = await getDoc(creatorRef);
    if (creatorDoc.exists()) {
      const creatorData = creatorDoc.data();
      const currentCount = creatorData.followersCount || 0;
      if (currentCount > 0) {
        await setDoc(creatorRef, { ...creatorData, followersCount: currentCount - 1 }, { merge: true });
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error unfollowing creator:', error);
    return false;
  }
}

export async function checkUserFollowsCreator(userId: string, creatorId: string): Promise<boolean> {
  try {
    const followRef = doc(db, `users/${userId}/following/${creatorId}`);
    const followDoc = await getDoc(followRef);
    return followDoc.exists();
  } catch (error) {
    console.error('Error checking follow status:', error);
    return false;
  }
}

// Function to get a video by ID from Firestore
export async function getVideoByIdFromFirestore(videoId: string): Promise<VideoFirestoreData | null> {
  try {
    const videoRef = doc(db, 'videos', videoId);
    const videoDoc = await getDoc(videoRef);
    
    if (!videoDoc.exists()) {
      return null;
    }
    
    return {
      ...videoDoc.data(),
      id: videoDoc.id,
    } as VideoFirestoreData;
  } catch (error) {
    console.error('Error fetching video by ID:', error);
    throw error;
  }
}

// Function to convert VideoMetadata to VideoData
export function convertVideoMetadataToVideoData(metadata: any, userId: string): VideoData {
  return {
    id: metadata.id || '',
    title: metadata.title || '',
    description: metadata.description || '',
    creatorId: userId,
    thumbnailUrl: metadata.thumbnailUrl || '',
    videoUrl: metadata.videoUrl || metadata.video_url || metadata.url || '',
    isPremium: metadata.isPremium || false,
    tokenPrice: metadata.tokenPrice || 0,
    type: metadata.type || 'standard',
    format: metadata.format || '16:9',
    uploadStatus: 'complete',
    createdAt: new Date(),
    publishedAt: new Date(),
    viewCount: 0,
    likeCount: 0,
    commentCount: 0
  };
}

// Export VideoData from creatorService
export { VideoData };
