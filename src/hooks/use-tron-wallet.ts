
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { toast } from 'sonner';
import type { WalletResponse, TronWalletHook } from '@/vite-env';

export const useTronWallet = (): TronWalletHook => {
  const { user } = useAuth();
  const [walletInfo, setWalletInfo] = useState<WalletResponse>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  
  // Get wallet info
  const getWalletInfo = useCallback(async () => {
    if (!user?.uid && !user?.id) {
      setError("You must be logged in to view your wallet");
      return;
    }
    
    setIsLoading(true);
    setError(undefined);
    
    try {
      // Mocking API call
      const mockWalletInfo: WalletResponse = {
        wallet: {
          tron_address: 'TMyrjQV5CVuNsoGJ9gVS3K8TJ7SHiaqpSJ',
          balance_usdt: 125.5,
          is_verified: true
        },
        transactions: [
          {
            id: 'tx1',
            amount: 50,
            type: 'deposit',
            status: 'completed',
            date: new Date().toISOString()
          },
          {
            id: 'tx2',
            amount: 25,
            type: 'withdrawal',
            status: 'pending',
            date: new Date(Date.now() - 86400000).toISOString()
          }
        ],
        subscription: {
          status: 'active',
          expiry: new Date(Date.now() + 30 * 86400000).toISOString(),
          expires_at: new Date(Date.now() + 30 * 86400000).toISOString(),
          level: 'premium',
          subscription_tiers: [
            { id: 'basic', name: 'Basic', price: 9.99 },
            { id: 'premium', name: 'Premium', price: 19.99 },
            { id: 'vip', name: 'VIP', price: 49.99 }
          ]
        }
      };
      
      // Simulate API delay
      setTimeout(() => {
        setWalletInfo(mockWalletInfo);
        setIsLoading(false);
      }, 1000);
    } catch (err: any) {
      console.error('Failed to fetch wallet info:', err);
      setError(err.message || 'Failed to load wallet information');
      setIsLoading(false);
    }
  }, [user]);

  // Create a new wallet
  const createWallet = async (): Promise<any> => {
    if (!user?.uid && !user?.id) {
      setError("You must be logged in to create a wallet");
      toast.error("You must be logged in to create a wallet");
      return { success: false, error: "Authentication required" };
    }
    
    setIsLoading(true);
    setError(undefined);
    
    try {
      // Mock wallet creation
      const mockResponse = {
        success: true,
        wallet: {
          tron_address: 'TMyrjQV5CVuNsoGJ9gVS3K8TJ7SHiaqpSJ',
          balance_usdt: 0,
          is_verified: false
        }
      };
      
      // Update wallet info with the new wallet
      setTimeout(() => {
        setWalletInfo(prev => ({ 
          ...prev, 
          wallet: mockResponse.wallet 
        }));
        setIsLoading(false);
        toast.success("Wallet created successfully");
      }, 1500);
      
      return mockResponse;
    } catch (err: any) {
      console.error('Failed to create wallet:', err);
      const errorMsg = err.message || 'Failed to create wallet';
      setError(errorMsg);
      toast.error(errorMsg);
      setIsLoading(false);
      return { success: false, error: errorMsg };
    }
  };
  
  // Request withdrawal
  const requestWithdrawal = async (amount: number | { amount: number; destinationAddress: string }): Promise<boolean> => {
    if (!user?.uid && !user?.id) {
      setError("You must be logged in to request a withdrawal");
      toast.error("You must be logged in to request a withdrawal");
      return false;
    }
    
    if (!walletInfo.wallet) {
      setError("No wallet found");
      toast.error("No wallet found");
      return false;
    }
    
    const withdrawalAmount = typeof amount === 'number' ? amount : amount.amount;
    const destinationAddress = typeof amount === 'object' ? amount.destinationAddress : walletInfo.wallet.tron_address;
    
    if (withdrawalAmount <= 0) {
      setError("Withdrawal amount must be greater than 0");
      toast.error("Withdrawal amount must be greater than 0");
      return false;
    }
    
    if (withdrawalAmount > (walletInfo.wallet.balance_usdt || 0)) {
      setError("Insufficient balance");
      toast.error("Insufficient balance");
      return false;
    }
    
    setIsLoading(true);
    setError(undefined);
    
    try {
      // Mock withdrawal request
      setTimeout(() => {
        // Update wallet balance
        setWalletInfo(prev => ({
          ...prev,
          wallet: {
            ...prev.wallet!,
            balance_usdt: prev.wallet!.balance_usdt - withdrawalAmount
          },
          transactions: [
            {
              id: `tx_${Date.now()}`,
              amount: withdrawalAmount,
              type: 'withdrawal',
              status: 'pending',
              date: new Date().toISOString(),
              destination: destinationAddress
            },
            ...(prev.transactions || [])
          ]
        }));
        setIsLoading(false);
        toast.success(`Withdrawal of ${withdrawalAmount} USDT requested`);
      }, 2000);
      
      return true;
    } catch (err: any) {
      console.error('Failed to request withdrawal:', err);
      const errorMsg = err.message || 'Failed to request withdrawal';
      setError(errorMsg);
      toast.error(errorMsg);
      setIsLoading(false);
      return false;
    }
  };
  
  // Check if user has access to particular content
  const checkContentAccess = async (contentId: string, requiredLevel: string): Promise<boolean> => {
    if (!walletInfo.subscription) {
      return false;
    }
    
    const levels = ['free', 'basic', 'premium', 'vip'];
    const userLevel = walletInfo.subscription.level;
    const userLevelIndex = levels.indexOf(userLevel);
    const requiredLevelIndex = levels.indexOf(requiredLevel);
    
    if (userLevelIndex === -1 || requiredLevelIndex === -1) {
      return false;
    }
    
    return userLevelIndex >= requiredLevelIndex;
  };
  
  // Verify transaction
  const verifyTransaction = async (txData: any): Promise<any> => {
    // Mock implementation
    return { success: true, verified: true };
  };
  
  // Load wallet info when user changes
  useEffect(() => {
    if (user) {
      getWalletInfo();
    } else {
      setWalletInfo({});
    }
  }, [user, getWalletInfo]);
  
  return {
    walletInfo,
    isLoading,
    loading: isLoading, // Added for backward compatibility
    error,
    getWalletInfo,
    createWallet,
    requestWithdrawal,
    checkContentAccess,
    verifyTransaction
  };
};
