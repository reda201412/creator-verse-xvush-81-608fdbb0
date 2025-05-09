
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { WalletResponse } from '@/types/messaging';

export function useTronWallet() {
  const { user } = useAuth();
  const [walletInfo, setWalletInfo] = useState<WalletResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getWalletInfo = useCallback(async () => {
    if (!user) {
      setError("Vous devez être connecté pour accéder à votre portefeuille");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('tron-wallet', {
        body: { operation: 'get_wallet_info' },
      });

      if (error) throw new Error(error.message);
      setWalletInfo(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de la récupération des informations du portefeuille";
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createWallet = async () => {
    if (!user) {
      setError("Vous devez être connecté pour créer un portefeuille");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('tron-wallet', {
        body: { operation: 'create_wallet' },
      });

      if (error) throw new Error(error.message);
      toast.success("Portefeuille créé avec succès");
      await getWalletInfo(); // Refresh wallet info
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de la création du portefeuille";
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const verifyTransaction = async (params: {
    txHash: string;
    amount: number;
    purpose: 'purchase' | 'subscription' | 'message_support';
    contentId?: string;
    tierId?: string;
    recipientId?: string;
    fromAddress?: string;
  }) => {
    if (!user) {
      setError("Vous devez être connecté pour vérifier une transaction");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      // Use the Edge Function to verify the transaction on the blockchain
      const { data, error } = await supabase.functions.invoke('tron-transaction-verify', {
        body: { 
          operation: 'verify_transaction',
          data: params
        },
      });

      if (error) throw new Error(error.message);
      toast.success("Transaction vérifiée avec succès");
      await getWalletInfo(); // Refresh wallet info
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de la vérification de la transaction";
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const decrementBalance = async (amount: number) => {
    if (!user) {
      setError("Vous devez être connecté pour effectuer cette opération");
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('decrement_balance', {
        body: { 
          userId: user.id,
          amount: amount
        }
      });

      if (error) throw new Error(error.message);
      toast.success(`Solde débité de ${amount} USDT`);
      await getWalletInfo(); // Refresh wallet info
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors du débit du solde";
      setError(message);
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const requestWithdrawal = async (params: {
    amount: number;
    destinationAddress: string;
  }) => {
    if (!user) {
      setError("Vous devez être connecté pour effectuer un retrait");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('tron-wallet', {
        body: { 
          operation: 'request_withdrawal',
          data: params
        },
      });

      if (error) throw new Error(error.message);
      toast.success("Demande de retrait soumise avec succès");
      await getWalletInfo(); // Refresh wallet info
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de la demande de retrait";
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const checkContentAccess = async (contentId: string | number) => {
    if (!user) {
      return { hasAccess: false, reason: 'not_authenticated' };
    }

    try {
      // Using our edge function instead of RPC
      const { data, error } = await supabase.functions.invoke('check-content-access', {
        body: { contentId }
      });

      if (error) throw new Error(error.message);
      return data || { hasAccess: false, reason: 'unknown' };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de la vérification de l'accès au contenu";
      toast.error(message);
      return { hasAccess: false, reason: 'error', message };
    }
  };

  // Function to get information about a transaction
  const getTransactionInfo = async (txHash: string) => {
    if (!user) {
      setError("Vous devez être connecté pour accéder aux informations de transaction");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('tron-transaction-verify', {
        body: { 
          operation: 'get_transaction',
          data: { txHash }
        },
      });

      if (error) throw new Error(error.message);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de la récupération des informations de transaction";
      setError(message);
      console.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Function to get information about a TRON account
  const getAccountInfo = async (address: string) => {
    if (!user) {
      setError("Vous devez être connecté pour accéder aux informations de compte");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('tron-transaction-verify', {
        body: { 
          operation: 'get_account',
          data: { address }
        },
      });

      if (error) throw new Error(error.message);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de la récupération des informations de compte";
      setError(message);
      console.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Function to get platform wallet
  const getPlatformWallet = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('tron-wallet', {
        body: { 
          operation: 'get_platform_wallet'
        },
      });

      if (error) throw new Error(error.message);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de la récupération des informations du portefeuille de la plateforme";
      setError(message);
      console.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    walletInfo,
    loading,
    error,
    getWalletInfo,
    createWallet,
    verifyTransaction,
    decrementBalance,
    requestWithdrawal,
    checkContentAccess,
    getTransactionInfo,
    getAccountInfo,
    getPlatformWallet
  };
}
