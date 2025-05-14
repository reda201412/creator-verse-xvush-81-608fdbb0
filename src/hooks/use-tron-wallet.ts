import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { WalletData, WalletResponse } from '@/types/messaging';
import { toast } from '@/components/ui/sonner';

export const useTronWallet = () => {
  const { user } = useAuth();
  const [walletInfo, setWalletInfo] = useState<WalletResponse>({
    wallet: null,
    transactions: [],
    subscription: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchWalletInfo = useCallback(async () => {
    if (!user?.id) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tron/wallet?user_id=${user.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setWalletInfo({
        wallet: {
          balance_usdt: data.wallet?.balance_usdt || 0,
          is_verified: data.wallet?.is_verified || false,
          tron_address: data.wallet?.tron_address || null
        },
        transactions: data.transactions || [],
        subscription: data.subscription || null,
      });
    } catch (error: any) {
      console.error("Could not fetch wallet info:", error);
      toast.error(`Erreur de chargement du wallet: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, toast]);

  useEffect(() => {
    fetchWalletInfo();
  }, [fetchWalletInfo]);

  const getWalletInfo = () => {
    fetchWalletInfo();
  };

  return { walletInfo, isLoading, getWalletInfo };
};
