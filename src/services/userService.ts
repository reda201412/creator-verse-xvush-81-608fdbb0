
import { doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '@/integrations/firebase/firebase';
import { UserProfile } from '@/types/auth';

/**
 * Updates a user profile in Firestore
 */
export async function updateProfile(userId: string, profileData: Partial<UserProfile>, avatarFile?: File | null): Promise<void> {
  try {
    const updateData = { ...profileData };
    
    // If avatar file is provided, upload it first
    if (avatarFile) {
      const storageRef = ref(storage, `users/${userId}/avatar/${Date.now()}_${avatarFile.name}`);
      const uploadResult = await uploadBytes(storageRef, avatarFile);
      const downloadURL = await getDownloadURL(uploadResult.ref);
      updateData.avatarUrl = downloadURL;
    }
    
    // Update the user profile in Firestore
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, updateData);
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
}

/**
 * Fetches a user profile from Firestore
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  // This is a placeholder - implement based on your actual data structure
  return null;
}
