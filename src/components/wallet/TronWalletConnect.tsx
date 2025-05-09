
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Wallet, Send, ExternalLink, RefreshCw, Shield, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { useTronWeb } from '@/hooks/use-tronweb';

interface TronWalletConnectProps {
  onWalletConnect: (address: string) => void;
}

const TronWalletConnect: React.FC<TronWalletConnectProps> = ({ onWalletConnect }) => {
  const { 
    tronWeb, 
    walletState, 
    loading, 
    error, 
    connectWallet, 
    disconnectWallet, 
    refreshBalance, 
    checkNetwork 
  } = useTronWeb();
  
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    if (walletState.address && walletState.loggedIn) {
      onWalletConnect(walletState.address);
    }
  }, [walletState.address, walletState.loggedIn, onWalletConnect]);
  
  const handleConnect = async () => {
    try {
      const success = await connectWallet();
      if (success && walletState.address) {
        toast.success("Portefeuille TronLink connecté avec succès");
      }
    } catch (err) {
      console.error("Connection error:", err);
      toast.error("Erreur lors de la connexion à TronLink");
    }
  };
  
  const handleDisconnect = () => {
    disconnectWallet();
    toast.info("Portefeuille TronLink déconnecté");
  };
  
  const handleRefresh = async () => {
    const balance = await refreshBalance();
    if (balance !== null) {
      toast.success(`Solde mis à jour: ${balance} TRX`);
    } else {
      toast.error("Impossible de récupérer le solde");
    }
  };
  
  const handleCopyAddress = () => {
    if (walletState.address) {
      navigator.clipboard.writeText(walletState.address);
      setCopied(true);
      toast.success("Adresse copiée dans le presse-papier");
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  if (!walletState.installed) {
    return (
      <Card className="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-800">
        <CardContent className="p-6 text-center">
          <div className="flex flex-col items-center justify-center p-4">
            <Wallet className="h-12 w-12 text-amber-500 mb-4" />
            <h3 className="text-lg font-medium mb-2">TronLink n'est pas installé</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Pour connecter votre portefeuille TRON, vous devez d'abord installer l'extension TronLink.
            </p>
            <Button 
              className="bg-amber-500 hover:bg-amber-600"
              onClick={() => window.open('https://www.tronlink.org/', '_blank')}
            >
              <Shield className="h-4 w-4 mr-2" />
              Installer TronLink
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-destructive/20 text-destructive p-4 rounded-lg">
        <p className="font-medium">Erreur de connexion:</p>
        <p className="text-sm">{error}</p>
        <Button variant="destructive" className="mt-2" size="sm" onClick={handleConnect}>
          Réessayer
        </Button>
      </div>
    );
  }
  
  if (!walletState.loggedIn) {
    return (
      <Card className="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-800">
        <CardContent className="p-6 text-center">
          <div className="flex flex-col items-center justify-center p-4">
            <Wallet className="h-12 w-12 text-amber-500 mb-4" />
            <h3 className="text-lg font-medium mb-2">Connecter TronLink</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Connectez votre portefeuille TronLink pour interagir avec la blockchain TRON.
            </p>
            <Button 
              className="bg-amber-500 hover:bg-amber-600"
              onClick={handleConnect}
            >
              Connecter TronLink
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const isMainnet = walletState.network === 'Mainnet';
  const networkColor = isMainnet ? 'text-green-500' : 'text-amber-500';
  
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-4">Portefeuille TronLink connecté</h3>
        
        <div className="space-y-4">
          <div className="bg-secondary/30 p-4 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Adresse</span>
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6" 
                  onClick={handleCopyAddress}
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6"
                  asChild
                >
                  <a 
                    href={`https://tronscan.org/#/address/${walletState.address}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </Button>
              </div>
            </div>
            
            <div className="font-mono text-xs bg-primary/10 p-2 rounded break-all">
              {walletState.address}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-muted-foreground">Réseau</div>
                <div className={`font-medium ${networkColor}`}>{walletState.network}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Solde TRX</div>
                <div className="font-medium">{walletState.balance} TRX</div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh} className="flex-1">
              <RefreshCw className="h-4 w-4 mr-1" />
              Actualiser
            </Button>
            <Button variant="outline" size="sm" onClick={handleDisconnect} className="flex-1">
              Déconnecter
            </Button>
          </div>
          
          <div className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/20 p-3 rounded">
            <p className="font-medium mb-1">Note importante:</p>
            <p>
              Utilisez cette connexion TronLink pour vérifier votre portefeuille de la plateforme ou effectuer des paiements directs vers le portefeuille de la plateforme.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TronWalletConnect;
