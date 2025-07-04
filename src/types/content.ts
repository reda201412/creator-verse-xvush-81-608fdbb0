


export type ContentType = 'standard' | 'premium' | 'vip' | 'teaser';

export interface Content {
  id: string;
  title: string;
  description: string;
  type: ContentType;
  createdAt: string;
  updatedAt: string;
  creatorId: string;
  isPremium: boolean;
  isPublished: boolean;
  isGated: boolean;
  isFeatured: boolean;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  earnings: number;
  tags?: string[];
  monetization?: ContentMonetization;
}

export interface ContentMonetization {
  type: 'subscription' | 'one-time' | 'token';
  price?: number;
  currency?: string;
  tokenPrice?: number;
  accessControl?: {
    tier?: string;
    expiresAfter?: string;
    viewLimit?: number;
  };
}

// Restrict the ContentItem type to only allow certain content types
export type RestrictedContentType = 'standard' | 'premium' | 'vip';

export interface ContentItem {
  id: string;
  title: string;
  type: RestrictedContentType; // Changed from ContentType to RestrictedContentType
  category?: string;
  views?: number;
  thumbnail?: string;
  format?: string;
  duration?: number;
  isPremium?: boolean;
}

export type FeedbackType = 'comment' | 'request' | 'appreciation';

export interface FeedbackMessage {
  id: string;
  username: string;
  avatar?: string;
  message: string;
  timestamp: string;
  type: FeedbackType;
}

