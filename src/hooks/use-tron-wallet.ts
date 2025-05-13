
import { useState } from 'react';
import { getTronWalletData, TronWalletResponse } from '@/services/tron.service';

// Define extended wallet types with subscription property
export interface WalletData extends TronWalletResponse {
  // Keep all original properties from TronWalletResponse
}

export interface WalletInfo {
  balance_usdt: number;
  tron_address?: string;
  balance_trx?: number;
  is_verified: boolean;
  transactions?: any[];
  createdAt?: Date | string;
  wallet?: {
    balance_usdt: number;
    tron_address?: string;
    is_verified: boolean;
    balance_trx?: number;
  };
  subscription?: {
    id: string;
    is_active: boolean;
    expires_at: string;
    subscription_tiers: {
      name: string;
      price_usdt: number;
    };
  } | null;
}

export const useTronWallet = () => {
  const [wallet, setWallet] = useState<WalletData>({
    address: '',
    balance: 0,
    is_verified: false,
    transactions: [],
    createdAt: new Date()
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Mock wallet info for components that require this property
  const walletInfo: WalletInfo = {
    balance_usdt: wallet.balance,
    tron_address: wallet.address,
    is_verified: wallet.is_verified || false,
    createdAt: wallet.createdAt,
    wallet: {
      balance_usdt: wallet.balance,
      tron_address: wallet.address,
      is_verified: wallet.is_verified || false,
    },
    subscription: {
      id: 'sub_123',
      is_active: true,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      subscription_tiers: {
        name: 'Premium',
        price_usdt: 9.99
      }
    }
  };

  const getWalletInfo = async () => {
    if (!localStorage.getItem('userId')) return;
    
    setIsLoading(true);
    try {
      const userId = localStorage.getItem('userId') || 'default-user';
      const walletData = await getTronWalletData(userId);
      setWallet({
        ...walletData,
        createdAt: new Date()
      });
    } catch (err) {
      setError('Failed to load wallet information');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock implementations of other wallet methods
  const createWallet = async () => {
    console.log('Creating wallet...');
    setWallet({
      address: 'T' + Math.random().toString(36).substring(2, 15),
      balance: 100,
      is_verified: true,
      transactions: [],
      createdAt: new Date()
    });
    return true;
  };

  const checkContentAccess = async () => {
    console.log('Checking content access...');
    return true;
  };

  const verifyTransaction = async () => {
    console.log('Verifying transaction...');
    return true;
  };

  const requestWithdrawal = async () => {
    console.log('Requesting withdrawal...');
    return true;
  };

  return { 
    wallet, 
    isLoading, 
    error, 
    getWalletInfo,
    walletInfo,
    createWallet,
    checkContentAccess,
    verifyTransaction,
    requestWithdrawal,
    loading: isLoading
  };
};
