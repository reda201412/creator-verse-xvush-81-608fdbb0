
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

// Helper function to convert format string to acceptable format type
function convertFormat(format: string): '16:9' | '9:16' | '1:1' {
  if (format === '16:9' || format === '9:16' || format === '1:1') {
    return format as '16:9' | '9:16' | '1:1';
  }
  // Default to 9:16 if format is invalid
  return '9:16';
}

// Adapter function to convert FirestoreStory to Story
export function adaptFirestoreStoryToStory(firestoreStory: FirestoreStory): Story {
  return {
    id: firestoreStory.id,
    creator_id: firestoreStory.creatorId,
    media_url: firestoreStory.mediaUrl || '',
    thumbnail_url: firestoreStory.thumbnailUrl,
    created_at: firestoreStory.createdAt ? 
      (typeof firestoreStory.createdAt.toDate === 'function' ? 
        firestoreStory.createdAt.toDate().toISOString() : 
        new Date(firestoreStory.createdAt).toISOString()) : 
      new Date().toISOString(),
    duration: firestoreStory.duration || 10,
    viewed: firestoreStory.viewed || false,
    view_count: firestoreStory.view_count || 0,
    caption: firestoreStory.title,
    filter_used: '',
    is_highlighted: firestoreStory.is_highlighted || false,
    format: firestoreStory.format || '9:16',
    creator: {
      id: firestoreStory.creatorId,
      username: '',
      display_name: '',
      avatar_url: '',
    }
  };
}

export function adaptFirestoreStoriesToStories(firestoreStories: FirestoreStory[]): Story[] {
  return firestoreStories.map(adaptFirestoreStoryToStory);
}
