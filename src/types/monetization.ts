
export type SubscriptionTier = 'free' | 'fan' | 'superfan' | 'vip' | 'exclusive';

export interface TokenTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'purchase' | 'gift' | 'reward' | 'tip' | 'content' | 'refund';
  description: string;
  timestamp: string;
  relatedContentId?: string;
  relatedUserId?: string;
}

export interface UserWallet {
  id: string;
  userId: string;
  tokenBalance: number;
  subscriptionTier: SubscriptionTier;
  subscriptionExpiresAt: string;
  lifetimeSpending: number;
  transactions: TokenTransaction[];
  rewardsLevel: number;
  loyaltyPoints: number;
}

export interface PurchaseOption {
  id: string;
  name: string;
  tokenAmount: number;
  price: number;
  currency: string;
  discount?: number;
  bonus?: number;
  isPopular?: boolean;
  limitedTime?: boolean;
  expiresAt?: string;
}

export interface ContentPrice {
  type: 'free' | 'subscription' | 'token' | 'hybrid';
  requiredTier?: SubscriptionTier;
  tokenPrice?: number;
  discountForSubscribers?: number;
}
