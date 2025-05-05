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
  shareable?: boolean;
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
  type: RestrictedContentType;
  category?: string;
  views?: number;
  thumbnail?: string;
  format?: string;
  duration?: number;
  isPremium?: boolean;
  shareable?: boolean;
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

// API response type for free videos endpoint
export interface FreeVideoResponse {
  id: string;
  performerId: string;
  author: string;
  performerImage?: string;
  thumbnail?: string;
  title: string;
  description: string;
  publishDate: string;
  metrics: {
    likes: number;
    views: number;
  };
  type: 'standard' | 'teaser';
  shareable: boolean;
}
