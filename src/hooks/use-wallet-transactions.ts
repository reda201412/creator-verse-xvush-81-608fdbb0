
import { useState } from 'react';
import { useTronWallet } from './use-tron-wallet';
import { useTronWeb } from './use-tronweb';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function useWalletTransactions() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();
  const { walletInfo, getWalletInfo } = useTronWallet();
  const { walletState, checkNetwork } = useTronWeb();
  
  /**
   * Process a payment from the integrated platform wallet (simulated)
   */
  const processWalletPayment = async (options: {
    amount: number;
    purpose: 'purchase' | 'subscription' | 'message_support';
    contentId?: string | number;
    tierId?: string;
    recipientId?: string;
  }) => {
    if (!user) {
      toast.error("Authentification requise pour effectuer un paiement");
      return null;
    }
    
    const { amount, purpose, contentId, tierId, recipientId } = options;
    
    if (isProcessing) {
      toast.error("Une transaction est déjà en cours");
      return null;
    }
    
    try {
      setIsProcessing(true);
      
      // Check if user has a wallet
      if (!walletInfo?.wallet) {
        toast.error("Vous n'avez pas encore de portefeuille");
        return null;
      }
      
      // Check if user has enough balance
      if (walletInfo.wallet.balance_usdt < amount) {
        toast.error(`Solde insuffisant: ${walletInfo.wallet.balance_usdt} USDT disponible, ${amount} USDT requis`);
        return null;
      }
      
      // Simulate a transaction using the Edge Function
      const { data, error } = await supabase.functions.invoke('tron-transaction-verify', {
        body: {
          operation: 'simulate_transaction',
          data: {
            amount,
            purpose,
            contentId: contentId?.toString(),
            tierId,
            recipientId,
            fromAddress: walletInfo.wallet.tron_address,
          }
        }
      });
      
      if (error) throw new Error(error.message || "Transaction failed");
      
      toast.success(`Paiement de ${amount} USDT effectué avec succès`);
      await getWalletInfo(); // Refresh wallet info
      
      return data;
    } catch (err: any) {
      const message = err instanceof Error ? err.message : "Erreur lors du traitement du paiement";
      toast.error(message);
      console.error("Payment error:", err);
      return null;
    } finally {
      setIsProcessing(false);
    }
  };
  
  /**
   * Process a TronLink payment (with real TronLink wallet)
   */
  const processTronLinkPayment = async (options: {
    amount: number;
    purpose: 'purchase' | 'subscription' | 'message_support';
    contentId?: string | number;
    tierId?: string;
    recipientId?: string;
    platformAddress: string;
  }) => {
    if (!user) {
      toast.error("Authentification requise pour effectuer un paiement");
      return null;
    }
    
    const { amount, purpose, contentId, tierId, recipientId, platformAddress } = options;
    
    if (isProcessing) {
      toast.error("Une transaction est déjà en cours");
      return null;
    }
    
    try {
      setIsProcessing(true);
      
      // Check if TronLink is connected
      if (!walletState.loggedIn || !walletState.address) {
        toast.error("Vous devez connecter TronLink pour effectuer ce paiement");
        return null;
      }
      
      // Check if on the right network
      if (!checkNetwork()) {
        toast.error("Veuillez vous connecter au réseau TRON correct");
        return null;
      }
      
      // For this implementation, we'll simulate the TronLink transaction
      toast.loading("Traitement du paiement via TronLink...");
      
      // Simulate a short delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a fake transaction hash
      const txHash = `tronlink_tx_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
      
      // Verify transaction with our backend
      const { data, error } = await supabase.functions.invoke('tron-transaction-verify', {
        body: {
          operation: 'verify_transaction',
          data: {
            txHash,
            amount,
            purpose,
            contentId: contentId?.toString(),
            tierId,
            recipientId,
            fromAddress: walletState.address,
            toAddress: platformAddress
          }
        }
      });
      
      if (error) throw new Error(error.message || "Transaction failed");
      
      toast.dismiss();
      toast.success(`Paiement de ${amount} USDT effectué avec succès via TronLink`);
      await getWalletInfo(); // Refresh wallet info
      
      return data;
    } catch (err: any) {
      toast.dismiss();
      const message = err instanceof Error ? err.message : "Erreur lors du traitement du paiement";
      toast.error(message);
      console.error("TronLink payment error:", err);
      return null;
    } finally {
      setIsProcessing(false);
    }
  };
  
  return {
    isProcessing,
    processWalletPayment,
    processTronLinkPayment
  };
}
