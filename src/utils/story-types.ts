
import { Timestamp } from 'firebase/firestore';

export interface Story {
  id: string;
  creator_id: string;
  caption?: string;
  media_url: string;
  thumbnail_url?: string;
  format: 'image' | 'video';
  created_at: Timestamp;
  expire_at: Timestamp;
  view_count: number;
  // Add compatibility properties
  mediaUrl?: string; // alias for media_url
  createdAt?: Timestamp | Date; // alias for created_at
  text?: string; // alias for caption
}

export interface StoryGroup {
  id: string;
  username?: string;
  avatarUrl?: string;
  userId: string;
  hasUnviewed: boolean;
  stories: Story[];
  createdAt?: Timestamp | Date;
}
