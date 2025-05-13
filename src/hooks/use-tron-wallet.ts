
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { WalletResponse } from '@/types/messaging';
// import { getFunctions, httpsCallable } from 'firebase/functions'; // Commenté

// const functions = getFunctions(); // Commenté
// const callTronWalletFunction = httpsCallable(functions, 'tronWallet'); // Commenté
// const callTronTransactionVerifyFunction = httpsCallable(functions, 'tronTransactionVerify'); // Commenté
// const callDecrementBalanceFunction = httpsCallable(functions, 'decrementBalance'); // Commenté
// const callCheckContentAccessFunction = httpsCallable(functions, 'checkContentAccess'); // Commenté

export function useTronWallet() {
  const { user } = useAuth();
  const [walletInfo, setWalletInfo] = useState<WalletResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getWalletInfo = useCallback(async () => {
    if (!user) {
      setError("Connectez-vous pour voir le portefeuille.");
      return null;
    }
    console.warn("TRON Wallet: getWalletInfo called, but TRON integration is being replaced. Returning mock data.");
    setLoading(true);
    // MOCK IMPLEMENTATION
    await new Promise(resolve => setTimeout(resolve, 500));
    const mockData: WalletResponse = {
        wallet: {
            tron_address: "TRON_ADDRESS_MOCK",
            balance_trx: 100,
            balance_usdt: 50,
            created_at: new Date().toISOString(),
            user_id: user.uid
        }
    };
    setWalletInfo(mockData);
    setLoading(false);
    return mockData;
    // setLoading(true);
    // setError(null);
    // try {
    //   const result = await callTronWalletFunction({ operation: 'get_wallet_info' });
    //   const data = result.data as WalletResponse;
    //   setWalletInfo(data);
    //   return data;
    // } catch (err) { /* ... */ }
    // finally { setLoading(false); }
  }, [user]);

  const createWallet = async () => {
    if (!user) {
      setError("Connectez-vous pour créer un portefeuille.");
      return null;
    }
    console.warn("TRON Wallet: createWallet called, but TRON integration is being replaced.");
    toast.info("La création de portefeuille TRON est temporairement désactivée.");
    return null;
  };

  const verifyTransaction = async (params: any) => {
    if (!user) {
      setError("Connectez-vous pour vérifier une transaction.");
      return null;
    }
    console.warn("TRON Wallet: verifyTransaction called, but TRON integration is being replaced.");
    toast.info("La vérification de transaction TRON est temporairement désactivée.");
    return { success: true, message: "Mock verification" }; // Mock success
  };

  const decrementBalance = async (amount: number) => {
    if (!user) {
      setError("Connectez-vous pour cette opération.");
      return false;
    }
    console.warn("TRON Wallet: decrementBalance called, but TRON integration is being replaced.");
    toast.info("La fonction de décrémentation de solde TRON est temporairement désactivée.");
    // Simuler une décrémentation locale pour l'UI si nécessaire, mais sans appel backend
    if (walletInfo && walletInfo.wallet) {
        // setWalletInfo(prev => prev ? ({...prev, wallet: {...prev.wallet, balance_usdt: prev.wallet.balance_usdt - amount }}) : null);
    }
    return true; // Mock success
  };

  const requestWithdrawal = async (params: any) => {
    if (!user) {
      setError("Connectez-vous pour un retrait.");
      return null;
    }
    console.warn("TRON Wallet: requestWithdrawal called, but TRON integration is being replaced.");
    toast.info("Les retraits TRON sont temporairement désactivés.");
    return null;
  };

  const checkContentAccess = async (contentId: string | number): Promise<{ hasAccess: boolean; reason?: string; message?: string }> => {
    if (!user) {
      return { hasAccess: false, reason: 'not_authenticated' };
    }
    console.warn("TRON Wallet: checkContentAccess called, TRON logic removed. Returning mock access.");
    // Simuler l'accès pour ne pas bloquer l'UI, à remplacer par la logique NowPayments ou autre.
    return { hasAccess: true, reason: 'mock_access_granted' }; 
  };
  
  // Les fonctions getTransactionInfo, getAccountInfo, getPlatformWallet peuvent aussi retourner des mocks ou null
  const getTransactionInfo = async (txHash: string) => {
    console.warn("TRON Wallet: getTransactionInfo disabled."); return null;
  };
  const getAccountInfo = async (address: string) => {
    console.warn("TRON Wallet: getAccountInfo disabled."); return null;
  };
  const getPlatformWallet = async () => {
    console.warn("TRON Wallet: getPlatformWallet disabled."); return null;
  };

  return {
    walletInfo, loading, error, getWalletInfo, createWallet, verifyTransaction, 
    decrementBalance, requestWithdrawal, checkContentAccess, getTransactionInfo, 
    getAccountInfo, getPlatformWallet
  };
}
