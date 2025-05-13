
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
  viewed?: boolean;
  duration?: number;
  view_count?: number;
  is_highlighted?: boolean;
}

// Adapter function to convert FirestoreStory to Story
export function adaptFirestoreStoryToStory(firestoreStory: FirestoreStory): Story {
  return {
    id: firestoreStory.id,
    creator_id: firestoreStory.creatorId,
    media_url: firestoreStory.mediaUrl || '',
    created_at: firestoreStory.createdAt || new Date(),
    expires_at: firestoreStory.expiresAt || new Date(),
    format: convertFormat(firestoreStory.format || '9:16'),
    viewed: firestoreStory.viewed || false,
    duration: firestoreStory.duration || 10,
    view_count: firestoreStory.view_count || 0,
    is_highlighted: firestoreStory.is_highlighted || false,
    creator: {
      id: firestoreStory.creatorId,
      username: '',
      display_name: '',
      avatar_url: '',
      bio: '',
      role: 'fan'
    }
  };
}

// Helper function to convert format string to acceptable format type
function convertFormat(format: string): '16:9' | '9:16' | '1:1' {
  if (format === '16:9' || format === '9:16' || format === '1:1') {
    return format as '16:9' | '9:16' | '1:1';
  }
  // Default to 9:16 if format is invalid
  return '9:16';
}

export function adaptFirestoreStoriesToStories(firestoreStories: FirestoreStory[]): Story[] {
  return firestoreStories.map(adaptFirestoreStoryToStory);
}
