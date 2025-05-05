
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
