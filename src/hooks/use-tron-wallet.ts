
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { getTronWalletData, verifyTronTransaction } from '@/services/tron.service';

// Update WalletData structure with all required properties
export interface WalletData {
  address: string;
  balance_usdt: number;
  isConnected: boolean;
  tron_address?: string;
  is_verified?: boolean;
  transactions?: any[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface WalletInfo {
  wallet: WalletData | null;
  transactions: any[];
}

export const useTronWallet = () => {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false); // Duplicate for compatibility with different components
  const [error, setError] = useState<string | null>(null);

  const getWalletInfo = async () => {
    setIsLoading(true);
    setLoading(true);
    setError(null);
    try {
      if (!user?.uid) {
        setError('User not authenticated');
        return;
      }
      const { address, balance, is_verified, transactions } = await getTronWalletData(user.uid);

      // Update the state object with all required properties
      const walletData: WalletData = {
        address: address || '',
        tron_address: address || '',
        balance_usdt: balance || 0,
        isConnected: !!address,
        is_verified: is_verified || false,
        transactions: transactions || [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      setWallet(walletData);
      setWalletInfo({
        wallet: walletData,
        transactions: transactions || []
      });
    } catch (err: any) {
      console.error('Failed to fetch wallet info:', err);
      setError(err.message || 'Failed to fetch wallet info');
      toast({
        title: "Erreur",
        description: "Impossible de charger les informations du portefeuille",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  // Add the missing methods required by components
  const createWallet = async () => {
    setIsLoading(true);
    setLoading(true);
    setError(null);
    try {
      if (!user?.uid) {
        setError('User not authenticated');
        return;
      }
      
      // In a real implementation, this would call an API to create a wallet
      const { address, balance } = await getTronWalletData(user.uid);
      
      const walletData: WalletData = {
        address: address || '',
        tron_address: address || '',
        balance_usdt: balance || 0,
        isConnected: true,
        is_verified: false,
        transactions: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      setWallet(walletData);
      setWalletInfo({
        wallet: walletData,
        transactions: []
      });
      
      toast({
        title: "Succès",
        description: "Portefeuille créé avec succès",
      });
    } catch (err: any) {
      console.error('Failed to create wallet:', err);
      setError(err.message || 'Failed to create wallet');
      toast({
        title: "Erreur",
        description: "Impossible de créer le portefeuille",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  const checkContentAccess = async (contentId: string): Promise<boolean> => {
    try {
      // In a real implementation, this would check if the user has access to the content
      return true;
    } catch (err) {
      return false;
    }
  };

  const verifyTransaction = async (options: {
    txHash: string;
    amount: number;
    purpose: string;
    contentId?: string;
  }) => {
    try {
      return await verifyTronTransaction(options);
    } catch (err: any) {
      throw new Error(err.message || 'Transaction verification failed');
    }
  };

  const requestWithdrawal = async (options: {
    amount: number;
    destinationAddress: string;
  }) => {
    try {
      // In a real implementation, this would call an API to request a withdrawal
      return { success: true };
    } catch (err: any) {
      throw new Error(err.message || 'Withdrawal request failed');
    }
  };

  useEffect(() => {
    if (user) {
      getWalletInfo();
    }
  }, [user]);

  return { 
    wallet, 
    walletInfo, 
    isLoading, 
    loading, 
    error, 
    getWalletInfo, 
    createWallet,
    checkContentAccess,
    verifyTransaction,
    requestWithdrawal
  };
};
