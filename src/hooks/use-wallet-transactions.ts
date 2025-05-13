import { useState } from 'react';
import { useTronWallet } from './use-tron-wallet';
import { useTronWeb } from './use-tronweb';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { getFunctions, httpsCallable } from 'firebase/functions'; 

const functions = getFunctions();
const callTronTransactionVerifyFunction = httpsCallable(functions, 'tronTransactionVerify');

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
      
      if (!walletInfo?.wallet) {
        toast.error("Vous n'avez pas encore de portefeuille");
        return null;
      }
      
      if (walletInfo.wallet.balance_usdt < amount) {
        toast.error(`Solde insuffisant: ${walletInfo.wallet.balance_usdt} USDT disponible, ${amount} USDT requis`);
        return null;
      }
      
      // Remplacer par l'appel à la Firebase Function
      const result = await callTronTransactionVerifyFunction({
        operation: 'simulate_transaction', 
        data: {
          amount,
          purpose,
          contentId: contentId?.toString(),
          tierId,
          recipientId,
          fromAddress: walletInfo.wallet.tron_address,
        }
      });
      
      const data = result.data; 
      
      toast.success(`Paiement de ${amount} USDT effectué avec succès`);
      await getWalletInfo(); 
      
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
      
      if (!walletState.loggedIn || !walletState.address) {
        toast.error("Vous devez connecter TronLink pour effectuer ce paiement");
        return null;
      }
      
      if (!checkNetwork()) {
        toast.error("Veuillez vous connecter au réseau TRON correct");
        return null;
      }
      
      toast.loading("Traitement du paiement via TronLink...");
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate delay
      const txHash = `tronlink_tx_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
      
      // Remplacer par l'appel à la Firebase Function
      const result = await callTronTransactionVerifyFunction({
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
      });
      
      const data = result.data; // Adapter le type de retour
      
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
