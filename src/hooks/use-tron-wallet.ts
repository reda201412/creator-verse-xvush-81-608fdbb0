import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast"
import { useAuth } from '@/contexts/AuthContext';
import { getTronWalletData } from '@/services/tron.service';

// Fix the WalletData structure and created_at property
interface WalletData {
  address: string;
  balance_usdt: number;
  isConnected: boolean;
  transactions?: any[];
  createdAt?: Date | string; // Using createdAt instead of created_at
  updatedAt?: Date | string;
}

export const useTronWallet = () => {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getWalletInfo = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!user?.uid) {
        setError('User not authenticated');
        return;
      }
      const { address, balance } = await getTronWalletData(user.uid);

      // Update the state object to use createdAt property
      const walletData: WalletData = {
        address: address || '',
        balance_usdt: balance || 0,
        isConnected: !!address,
        transactions: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      setWallet(walletData);
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
    }
  };

  useEffect(() => {
    if (user) {
      getWalletInfo();
    }
  }, [user]);

  return { wallet, isLoading, error, getWalletInfo };
};
