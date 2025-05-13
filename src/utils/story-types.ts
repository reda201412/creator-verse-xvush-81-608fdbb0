
import { Story } from '@/types/stories';

// Define FirestoreStory type based on error messages
export interface FirestoreStory {
  id: string;
  creatorId: string;
  createdAt: Date | any;
  title?: string;
  description?: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  format?: string;
  expiresAt?: Date | any;
  isPrivate?: boolean;
  tags?: string[];
}

// Adapter function to convert FirestoreStory to Story
export function adaptFirestoreStoryToStory(firestoreStory: FirestoreStory): Story {
  return {
    id: firestoreStory.id,
    creator_id: firestoreStory.creatorId,
    media_url: firestoreStory.mediaUrl || '',
    created_at: firestoreStory.createdAt || new Date(),
    expires_at: firestoreStory.expiresAt || new Date(),
    format: firestoreStory.format || '9:16',
    viewed: false, // Default value
    creator: {
      id: firestoreStory.creatorId,
      username: '',
      displayName: '',
      avatar: '',
      // Add other required creator fields
    }
  };
}

export function adaptFirestoreStoriesToStories(firestoreStories: FirestoreStory[]): Story[] {
  return firestoreStories.map(adaptFirestoreStoryToStory);
}
