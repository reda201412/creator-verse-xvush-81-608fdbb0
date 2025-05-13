
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTronWallet } from '@/hooks/use-tron-wallet';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface WalletConnectProps {
  onSuccess?: () => void;
  showBalance?: boolean;
  type?: 'icon' | 'button' | 'full';
  size?: 'sm' | 'default' | 'lg';
  redirect?: string;
}

const WalletConnect: React.FC<WalletConnectProps> = ({
  onSuccess,
  showBalance = false,
  type = 'full',
  size = 'default',
  redirect
}) => {
  const { user } = useAuth();
  const {
    walletInfo,
    loading,
    createWallet,
    getWalletInfo
  } = useTronWallet();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user && !walletInfo?.wallet) {
      getWalletInfo();
    }
  }, [user, walletInfo, getWalletInfo]);
  
  const handleConnect = async () => {
    try {
      if (!user) {
        toast.error("Vous devez être connecté pour accéder à votre portefeuille");
        if (redirect) {
          navigate(redirect);
        }
        return;
      }
      
      if (!walletInfo?.wallet) {
        await createWallet();
        toast.success("Votre portefeuille a été créé avec succès");
      }
      
      if (onSuccess) onSuccess();
      
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error("Une erreur est survenue lors de la connexion du portefeuille");
    }
  };
  
  if (loading) {
    return (
      <Button 
        variant="outline"
        size={size}
        disabled
      >
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        Chargement...
      </Button>
    );
  }
  
  if (walletInfo?.wallet) {
    return (
      <Button
        variant="outline"
        size={size}
        onClick={() => navigate('/wallet')}
      >
        {type !== 'icon' && (
          <>
            {showBalance ? (
              <span className="truncate max-w-[180px]">
                {walletInfo.wallet.balance_usdt.toFixed(2)} USDT
              </span>
            ) : (
              <span className="truncate max-w-[180px]">
                {walletInfo.wallet.tron_address?.substring(0, 4)}...
                {walletInfo.wallet.tron_address?.substring(walletInfo.wallet.tron_address.length - 4)}
              </span>
            )}
          </>
        )}
      </Button>
    );
  }
  
  return (
    <Button
      variant="outline"
      size={size}
      onClick={handleConnect}
    >
      {type !== 'icon' && "Connecter un portefeuille"}
    </Button>
  );
};

export default WalletConnect;
