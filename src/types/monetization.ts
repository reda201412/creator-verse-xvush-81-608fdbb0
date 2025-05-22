export interface ContentPrice {
  price: number;
  currency: string;
  tokenPrice?: number;
  requiredTier?: string;
  discountForSubscribers?: number;
  type?: 'free' | 'subscription' | 'token' | 'hybrid';
}
