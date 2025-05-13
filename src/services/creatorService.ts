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
import { UserProfile } from '@/types/auth'; // Changed from @/contexts/AuthContext';

// Étendre UserProfile pour inclure les métriques spécifiques au créateur si nécessaire
export interface CreatorProfileData extends UserProfile {
  metrics?: {
    followers?: number;
    following?: number; // Nombre de personnes que le créateur suit
    videos?: number;
    // revenue?: number; // Le revenu pourrait être plus complexe à calculer côté client
  };
  isOnline?: boolean; // Le statut en ligne est généralement géré par un système de présence (ex: Realtime Database)
}

// Interface pour les métadonnées vidéo stockées dans Firestore
export interface VideoFirestoreData {
  id?: string; // L'ID du document Firestore
  userId: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  muxUploadId?: string; // Added Mux Upload ID
  muxAssetId?: string; // Si vous stockez l'ID de l'asset MUX
  muxPlaybackId?: string; // Si vous stockez l'ID de playback MUX
  videoUrl?: string; // Ou une URL de streaming directe si gérée autrement
  status?: 'uploading' | 'processing' | 'completed' | 'failed' | 'ready'; // Added status field
  uploadedAt: any; // serverTimestamp
  type?: 'standard' | 'teaser' | 'premium' | 'vip'; // Added 'teaser'
  format?: '16:9' | '9:16' | '1:1' | 'other';
  isPremium?: boolean;
  tokenPrice?: number;
  // Champs pour les statistiques, à définir selon vos besoins pour MUX ou Firestore
  views?: number;
  likes?: number;
  revenueGenerated?: number;
  averageWatchTime?: number; // en secondes
  watchHours?: number;
  // ... autres champs pertinents
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

    // Compter les abonnés (followers)
    const followersQuery = query(collection(db, 'follows'), where('creatorId', '==', id));
    const followersSnap = await getCountFromServer(followersQuery);
    const followersCount = followersSnap.data().count;

    // Compter combien de personnes ce créateur suit (following)
    const followingQuery = query(collection(db, 'follows'), where('followerId', '==', id));
    const followingSnap = await getCountFromServer(followingQuery);
    const followingCount = followingSnap.data().count;
    
    // Compter les vidéos du créateur
    const videosQuery = query(collection(db, 'videos'), where('userId', '==', id));
    const videosSnap = await getCountFromServer(videosQuery);
    const videosCount = videosSnap.data().count;

    return {
      ...creatorData,
      metrics: {
        followers: followersCount,
        following: followingCount,
        videos: videosCount,
      },
      isOnline: Math.random() > 0.5, // Simuler le statut en ligne pour le moment
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
    querySnapshot.forEach((doc) => {
      creators.push({ 
        ...(doc.data() as UserProfile),
        isOnline: Math.random() > 0.5, // Simuler
      } as CreatorProfileData);
    });
    return creators;
  } catch (error) {
    console.error('Error in getAllCreators:', error);
    return [];
  }
};

export const getCreatorVideos = async (creatorId: string): Promise<VideoFirestoreData[]> => {
  try {
    const q = query(
      collection(db, 'videos'), 
      where('userId', '==', creatorId), 
      orderBy('uploadedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VideoFirestoreData));
  } catch (error) {
    console.error('Error in getCreatorVideos:', error);
    return [];
  }
};

// Récupère une vidéo spécifique par son ID depuis Firestore
export const getVideoByIdFromFirestore = async (videoId: string): Promise<VideoFirestoreData | null> => {
  if (!videoId) {
    console.warn("getVideoByIdFromFirestore: videoId is undefined or null");
    return null;
  }
  try {
    const videoRef = doc(db, 'videos', videoId);
    const videoSnap = await getDoc(videoRef);

    if (videoSnap.exists()) {
      return { id: videoSnap.id, ...videoSnap.data() } as VideoFirestoreData;
    } else {
      console.warn(`Video not found in Firestore with ID: ${videoId}`);
      return null;
    }
  } catch (error) {
    console.error('Error in getVideoByIdFromFirestore:', error);
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
