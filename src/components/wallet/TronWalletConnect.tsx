
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wallet, Copy, ExternalLink, Send, ShieldAlert, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useTronWeb, TronWalletState } from '@/hooks/use-tronweb';
import { useTronWallet } from '@/hooks/use-tron-wallet';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface TronWalletConnectProps {
  onWalletConnect?: (address: string) => void;
}

const TronWalletConnect: React.FC<TronWalletConnectProps> = ({ onWalletConnect }) => {
  const { 
    tronWeb, 
    walletState, 
    loading, 
    error, 
    connectWallet, 
    refreshBalance,
    checkNetwork 
  } = useTronWeb();
  
  const { walletInfo, getWalletInfo, createWallet } = useTronWallet();
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const { requestWithdrawal } = useTronWallet();
  
  const tronAddress = walletInfo?.wallet?.tron_address || '';
  const balance = walletInfo?.wallet?.balance_usdt || 0;
  
  useEffect(() => {
    if (walletState.address && onWalletConnect) {
      onWalletConnect(walletState.address);
    }
  }, [walletState.address, onWalletConnect]);

  const handleConnectWallet = async () => {
    const success = await connectWallet();
    if (success) {
      toast.success("Portefeuille TRON connecté avec succès");
      if (checkNetwork()) {
        getWalletInfo();
      }
    }
  };
  
  const handleCopyAddress = () => {
    if (tronAddress) {
      navigator.clipboard.writeText(tronAddress);
      toast.success("Adresse TRON copiée dans le presse-papier");
    } else if (walletState.address) {
      navigator.clipboard.writeText(walletState.address);
      toast.success("Adresse TRON copiée dans le presse-papier");
    }
  };
  
  const handleRefreshBalance = async () => {
    if (walletState.address) {
      const newBalance = await refreshBalance();
      if (newBalance !== null) {
        toast.success(`Solde rafraîchi: ${newBalance} TRX`);
      } else {
        toast.error("Impossible de rafraîchir le solde");
      }
    }
    
    // Rafraîchir également le solde USDT via l'API
    getWalletInfo();
  };
  
  const handleWithdraw = async () => {
    if (!destinationAddress) {
      toast.error("Veuillez entrer une adresse de destination");
      return;
    }
    
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Veuillez entrer un montant valide");
      return;
    }
    
    if (amount > balance) {
      toast.error("Solde insuffisant pour effectuer ce retrait");
      return;
    }
    
    setIsWithdrawing(true);
    try {
      await requestWithdrawal({
        amount,
        destinationAddress
      });
      
      setWithdrawAmount('');
      setDestinationAddress('');
      toast.success("Demande de retrait soumise avec succès");
    } catch (err) {
      toast.error("Erreur lors de la demande de retrait");
      console.error(err);
    } finally {
      setIsWithdrawing(false);
    }
  };

  // Afficher l'état de connexion du portefeuille
  const renderWalletStatus = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full mr-2" />
          <span>Chargement du portefeuille...</span>
        </div>
      );
    }

    if (error) {
      return (
        <Alert variant="destructive" className="mb-4">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      );
    }

    if (!walletState.installed) {
      return (
        <Alert className="mb-4">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>TronLink non détecté</AlertTitle>
          <AlertDescription>
            <p className="mb-2">Pour utiliser toutes les fonctionnalités du portefeuille TRON, veuillez installer l'extension TronLink.</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.open('https://www.tronlink.org/', '_blank')}
            >
              Installer TronLink
            </Button>
          </AlertDescription>
        </Alert>
      );
    }

    if (!walletState.loggedIn) {
      return (
        <div className="flex flex-col items-center justify-center p-4">
          <Button onClick={handleConnectWallet} className="mb-2">
            <Wallet className="h-4 w-4 mr-2" />
            Connecter TronLink
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            Connectez votre portefeuille TRON pour accéder à toutes les fonctionnalités.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">Portefeuille connecté</div>
          <Button variant="ghost" size="sm" onClick={handleRefreshBalance}>
            <RefreshCw className="h-3 w-3 mr-1" />
            Actualiser
          </Button>
        </div>
        
        <div className="bg-muted p-3 rounded-lg flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Adresse:</span>
            <div className="flex items-center">
              <span className="font-mono text-xs truncate max-w-[150px]">
                {walletState.address}
              </span>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopyAddress}>
                <Copy className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
                <a
                  href={`https://tronscan.org/#/address/${walletState.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Réseau:</span>
            <span className="text-sm">{walletState.network}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Solde TRX:</span>
            <span className="text-sm font-medium">{walletState.balance?.toFixed(6)} TRX</span>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      {renderWalletStatus()}
      
      <div>
        <h3 className="text-lg font-medium mb-4">Adresse TRON plateforme</h3>
        <div className="flex items-center gap-2">
          <div className="bg-secondary p-3 rounded-md flex-1 font-mono text-sm overflow-hidden">
            {tronAddress || 'Non disponible'}
          </div>
          <Button variant="outline" size="icon" onClick={handleCopyAddress} disabled={!tronAddress}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            asChild
            disabled={!tronAddress}
          >
            <a href={`https://tronscan.org/#/address/${tronAddress}`} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Retrait</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="withdrawAmount">Montant (USDT)</Label>
              <Input
                id="withdrawAmount"
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxAmount">Solde disponible</Label>
              <div className="bg-secondary p-2 rounded-md h-10 flex items-center">
                {balance} USDT
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="destinationAddress">Adresse de destination</Label>
            <Input
              id="destinationAddress"
              value={destinationAddress}
              onChange={(e) => setDestinationAddress(e.target.value)}
              placeholder="Adresse TRON (commence par T)"
            />
          </div>
          
          <Button 
            onClick={handleWithdraw} 
            disabled={isWithdrawing || !destinationAddress || !withdrawAmount || parseFloat(withdrawAmount) <= 0}
            className="w-full"
          >
            {isWithdrawing ? (
              <>
                <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full" />
                Traitement en cours...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Retirer les tokens
              </>
            )}
          </Button>
          
          <div className="text-xs text-muted-foreground">
            Note: Les retraits sont généralement traités dans un délai de 24 heures. Des frais de réseau peuvent s'appliquer.
          </div>
        </div>
      </div>
    </div>
  );
};

export default TronWalletConnect;
