
// Define types for wallet functionality

export interface WalletInfo {
  tron_address: string;
  balance_usdt: number;
  is_verified: boolean;
}

export interface SubscriptionInfo {
  status: 'active' | 'inactive' | 'expired' | 'pending';
  expiry: string;
  expires_at?: string;
  level: 'free' | 'basic' | 'fan' | 'premium' | 'vip' | 'exclusive';
  subscription_tiers?: Array<any>;
}

export interface WalletResponse {
  wallet?: WalletInfo;
  error?: string;
  transactions?: Array<any>;
  subscription?: SubscriptionInfo;
}

export interface TronWalletHook {
  walletInfo: WalletResponse;
  isLoading: boolean;
  loading: boolean; // Added for backward compatibility
  error?: string;
  getWalletInfo: () => void;
  createWallet: () => Promise<any>;
  requestWithdrawal: (amount: number | { amount: number; destinationAddress: string }) => Promise<boolean>;
  checkContentAccess: (contentId: string, requiredLevel: string) => Promise<boolean>;
  verifyTransaction: (txData: any) => Promise<any>;
}

export interface WithdrawalRequest {
  amount: number;
  destinationAddress?: string;
  currency?: string;
  memo?: string;
}
