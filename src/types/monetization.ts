
export interface ContentPrice {
  price: number;
  currency: string;
  tokenPrice?: number;
  requiredTier?: string;
  discountForSubscribers?: number;
  type?: 'free' | 'subscription' | 'token' | 'hybrid';
}

export interface PurchaseOption {
  id: string;
  name: string;
  tokenAmount: number;
  price: number;
  currency: string;
  bonus?: number;
  discount?: number;
  isPopular?: boolean;
  limitedTime?: boolean;
  expiresAt?: string;
}

export interface TokenTransaction {
  id: string;
  amount: number;
  type: 'purchase' | 'gift' | 'reward' | 'tip' | 'content' | 'refund';
  description: string;
  timestamp: string;
}

export interface UserWallet {
  tokenBalance: number;
  subscriptionTier: 'free' | 'basic' | 'fan' | 'premium' | 'vip';
  subscriptionExpiresAt: string;
  rewardsLevel: number;
  loyaltyPoints: number;
  transactions: TokenTransaction[];
}
