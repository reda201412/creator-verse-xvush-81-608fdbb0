
import { collection, query, where, getDocs, doc, deleteDoc, Timestamp } from 'firebase/firestore';
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
