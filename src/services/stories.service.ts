
// import { supabase } from '@/integrations/supabase/client'; // Supprimé
import { db } from '@/integrations/firebase/firebase'; // Ajout Firebase db
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp, 
  Timestamp, 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  arrayUnion 
} from 'firebase/firestore';
import { 
  getStorage, 
  ref, 
  uploadBytesResumable, 
  getDownloadURL 
} from "firebase/storage"; // Ajout Firebase Storage

import { Story, StoryTag, StoryView, StoryUploadParams, StoryFilter } from '@/types/stories';
// import { useNeuroAesthetic } from '@/hooks/use-neuro-aesthetic'; // Non utilisé directement ici
import { MediaCacheService } from '@/services/media-cache.service';
import { getFunctions, httpsCallable } from 'firebase/functions'; // Pour appeler des fonctions Firebase

const functions = getFunctions();
// TODO: Définir le nom de votre Firebase Function pour incrémenter les vues de story
const incrementStoryViewsFunction = httpsCallable(functions, 'incrementStoryViews');

// Définir une interface pour les documents Story dans Firestore
export interface FirestoreStory {
  id?: string; // ID du document Firestore
  creatorId: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  caption?: string;
  filterUsed?: StoryFilter; // filter_used dans Supabase
  duration?: number; // en secondes
  createdAt: Timestamp; // serverTimestamp()
  expiresAt: Timestamp;
  tags?: string[]; // Tableau de noms de tags en minuscules
  format: 'image' | 'video';
  // Ajouter d'autres champs si nécessaire (metadata, viewCount initial, etc.)
  viewCount?: number; // Pourrait être géré par une Firebase Function
  // creator?: any; // Les données du créateur seraient récupérées séparément si besoin de détails
}

export const StoriesService = {
  // Télécharger un fichier média pour une story vers Firebase Storage
  async uploadStoryMediaToFirebase(file: File, userId: string, type: 'media' | 'thumbnail'): Promise<string> {
    const storage = getStorage();
    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}/stories/${type}_${Date.now()}.${fileExt}`;
    const storageRef = ref(storage, filePath);

    // Compression (placeholder, comme avant)
    let fileToUpload = file;
    if (file.type.includes('video/') && file.size > 10 * 1024 * 1024) {
      console.log('Large video file detected, compression placeholder');
    }

    try {
      const snapshot = await uploadBytesResumable(storageRef, fileToUpload);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading story media to Firebase Storage:', error);
      throw error;
    }
  },

  // Créer une nouvelle story avec Firestore et Firebase Storage
  async createStory(params: StoryUploadParams, userId: string): Promise<FirestoreStory> {
    const mediaUrl = await this.uploadStoryMediaToFirebase(params.mediaFile, userId, 'media');
    let thumbnailUrl: string | undefined = undefined;
    if (params.thumbnailFile) {
      thumbnailUrl = await this.uploadStoryMediaToFirebase(params.thumbnailFile, userId, 'thumbnail');
    }

    const expiresAtDate = new Date();
    expiresAtDate.setHours(expiresAtDate.getHours() + (params.expiresIn || 24));

    const storyData: Omit<FirestoreStory, 'id'> = {
      creatorId: userId,
      mediaUrl,
      thumbnailUrl,
      caption: params.caption,
      filterUsed: params.filter || 'none',
      duration: params.duration || 10,
      createdAt: serverTimestamp() as Timestamp,
      expiresAt: Timestamp.fromDate(expiresAtDate),
      tags: params.tags ? params.tags.map(tag => tag.toLowerCase()) : [],
      format: params.mediaFile.type.includes('video/') ? 'video' : 'image',
      viewCount: 0,
    };

    try {
      const docRef = await addDoc(collection(db, 'stories'), storyData);
      return { id: docRef.id, ...storyData } as FirestoreStory; // Retourne avec l'ID généré
    } catch (error) {
      console.error('Error creating story in Firestore:', error);
      throw error;
    }
  },

  // Récupérer les stories actives
  async getActiveStories(): Promise<FirestoreStory[]> {
    try {
      const now = Timestamp.now();
      const q = query(
        collection(db, 'stories'),
        where('expiresAt', '>', now),
        orderBy('expiresAt', 'asc'), // Ou orderBy('createdAt', 'desc') selon le tri souhaité
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const stories = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirestoreStory));
      this.preCacheStoryMedia(stories.map(s => ({...s, media_url: s.mediaUrl, thumbnail_url: s.thumbnailUrl } as any))); // Adapter pour preCache
      return stories;
    } catch (error) {
      console.error('Error fetching active stories from Firestore:', error);
      throw error;
    }
  },

  // Récupérer les stories d'un créateur spécifique
  async getCreatorStories(creatorId: string): Promise<FirestoreStory[]> {
    try {
      const q = query(
        collection(db, 'stories'),
        where('creatorId', '==', creatorId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const stories = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirestoreStory));
      this.preCacheStoryMedia(stories.map(s => ({...s, media_url: s.mediaUrl, thumbnail_url: s.thumbnailUrl } as any)));
      return stories;
    } catch (error) {
      console.error('Error fetching creator stories from Firestore:', error);
      throw error;
    }
  },

  // Récupérer les stories par tag
  async getStoriesByTag(tagName: string): Promise<FirestoreStory[]> {
    try {
      const now = Timestamp.now();
      const q = query(
        collection(db, 'stories'),
        where('tags', 'array-contains', tagName.toLowerCase()),
        where('expiresAt', '>', now),
        orderBy('expiresAt', 'asc'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const stories = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirestoreStory));
      this.preCacheStoryMedia(stories.map(s => ({...s, media_url: s.mediaUrl, thumbnail_url: s.thumbnailUrl } as any)));
      return stories;
    } catch (error) {
      console.error('Error fetching stories by tag from Firestore:', error);
      throw error;
    }
  },

  async preCacheStoryMedia(stories: Pick<Story, 'media_url' | 'thumbnail_url'>[]): Promise<void> {
    if (!MediaCacheService.isCacheAvailable()) return;
    const thumbnailUrls = stories.filter(s => s.thumbnail_url).map(s => s.thumbnail_url as string);
    if (thumbnailUrls.length > 0) {
      MediaCacheService.preCacheVideos(thumbnailUrls).catch(err => {
        console.warn('Failed to pre-cache some thumbnails:', err);
      });
    }
    const videoStories = stories
      .filter(s => s.media_url && (s.media_url.includes('.mp4') || s.media_url.includes('.webm')))
      .slice(0, 3); 
    if (videoStories.length > 0) {
      videoStories.forEach(story => {
        if(story.media_url) fetch(story.media_url, { method: 'HEAD' }).catch(() => {});
      });
    }
  },
  
  // Marquer une story comme vue et incrémenter le compteur via Firebase Function
  async markStoryAsViewed(storyId: string, userId: string, viewDuration: number = 0): Promise<void> {
    if (!userId) {
      console.error('markStoryAsViewed: No authenticated user (userId) found');
      return;
    }
    try {
      // Option 1: Stocker chaque vue (plus de détails, plus d'écritures)
      // const storyViewRef = collection(db, 'stories', storyId, 'views');
      // await addDoc(storyViewRef, {
      //   viewerId: userId,
      //   viewedAt: serverTimestamp(),
      //   viewDuration
      // });

      // Option 2: Juste appeler la fonction pour incrémenter le compteur global
      // La fonction Firebase `incrementStoryViews` devrait aussi gérer la logique pour ne pas compter plusieurs vues du même utilisateur si nécessaire.
      await incrementStoryViewsFunction({ storyId: storyId, userId: userId });
      console.log(`Story ${storyId} view increment attempted by ${userId}`);

    } catch (error) {
      console.error('Error marking story as viewed / incrementing views:', error);
      // Ne pas nécessairement propager l'erreur pour ne pas bloquer l'UI pour une simple vue.
    }
  },

  // Supprimer une story (document Firestore et média sur Firebase Storage)
  async deleteStory(storyId: string, mediaUrl?: string, thumbnailUrl?: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'stories', storyId));
      
      // Supprimer les fichiers de Firebase Storage
      const storage = getStorage();
      if (mediaUrl) {
        try {
          const mediaRef = ref(storage, mediaUrl); // mediaUrl doit être l'URL complète de Firebase Storage
          await deleteDoc(mediaRef as any); // deleteObject de firebase/storage
        } catch (storageError) {
            console.warn(`Failed to delete story media ${mediaUrl} from Firebase Storage:`, storageError);
        }
      }
      if (thumbnailUrl) {
         try {
          const thumbRef = ref(storage, thumbnailUrl);
          await deleteDoc(thumbRef as any); // deleteObject de firebase/storage
        } catch (storageError) {
            console.warn(`Failed to delete story thumbnail ${thumbnailUrl} from Firebase Storage:`, storageError);
        }
      }
    } catch (error) {
      console.error('Error deleting story from Firestore:', error);
      throw error;
    }
  },

  // Récupérer les vues d'une story (si vous stockez les vues individuelles)
  async getStoryViews(storyId: string): Promise<any[]> { // Adapter le type de retour
    try {
      const viewsCollectionRef = collection(db, 'stories', storyId, 'views');
      const q = query(viewsCollectionRef, orderBy('viewedAt', 'desc'));
      const querySnapshot = await getDocs(q);
      // Ici, vous pourriez vouloir récupérer les profils des viewers si besoin
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching story views from Firestore:', error);
      throw error;
    }
  }
};
