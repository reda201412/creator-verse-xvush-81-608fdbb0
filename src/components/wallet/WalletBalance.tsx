
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Wallet, PlusCircle, RefreshCw, Coins } from 'lucide-react';
import { useTronWallet } from '@/hooks/use-tron-wallet';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface WalletBalanceProps {
  walletInfo: any;
}

const WalletBalance: React.FC<WalletBalanceProps> = ({ walletInfo }) => {
  const { user } = useAuth();
  const { createWallet, getWalletInfo, loading } = useTronWallet();
  
  const handleRefresh = async () => {
    if (user) {
      await getWalletInfo();
      toast.success("Informations du portefeuille mises à jour");
    } else {
      toast.error("Vous devez être connecté pour accéder à votre portefeuille");
    }
  };
  
  const handleCreateWallet = async () => {
    if (user) {
      try {
        await createWallet();
        toast.success("Portefeuille créé avec succès");
        await getWalletInfo();
      } catch (err) {
        toast.error("Erreur lors de la création du portefeuille");
        console.error(err);
      }
    } else {
      toast.error("Vous devez être connecté pour créer un portefeuille");
    }
  };
  
  if (!user) {
    return (
      <Card className="bg-secondary/20">
        <CardContent className="p-6 text-center">
          <Wallet className="h-12 w-12 text-primary/40 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Connectez-vous</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Vous devez être connecté pour accéder à votre portefeuille.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  if (!walletInfo?.wallet) {
    return (
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
        <CardContent className="p-6 text-center">
          <Wallet className="h-12 w-12 text-primary mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Créer un portefeuille</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Vous n'avez pas encore de portefeuille sur la plateforme. Créez-en un pour acheter du contenu premium.
          </p>
          <Button 
            onClick={handleCreateWallet}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full" />
                Création en cours...
              </>
            ) : (
              <>
                <PlusCircle className="h-4 w-4 mr-2" />
                Créer un portefeuille
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  const { tron_address, balance_usdt, is_verified } = walletInfo.wallet;
  const shortAddress = tron_address ? `${tron_address.substring(0, 6)}...${tron_address.substring(tron_address.length - 6)}` : '';
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Wallet className="h-5 w-5 text-primary mr-2" />
            <h3 className="text-lg font-medium">Votre portefeuille</h3>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>
        
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Solde disponible</span>
            {is_verified ? (
              <span className="text-xs bg-green-500/20 text-green-600 px-2 py-1 rounded">Vérifié</span>
            ) : (
              <span className="text-xs bg-yellow-500/20 text-yellow-600 px-2 py-1 rounded">En attente</span>
            )}
          </div>
          <div className="flex items-center">
            <Coins className="h-6 w-6 text-primary mr-2" />
            <span className="text-3xl font-bold">{balance_usdt}</span>
            <span className="text-lg ml-2">USDT</span>
          </div>
          <div className="mt-4 text-xs text-muted-foreground">
            Adresse: {shortAddress}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Button 
            className="bg-gradient-to-r from-amber-500 to-amber-600" 
            onClick={() => toast.info("La fonctionnalité d'achat de jetons sera disponible prochainement")}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Acheter des tokens
          </Button>
          <Button 
            variant="outline" 
            onClick={() => toast.info("La fonctionnalité de transfert sera disponible prochainement")}
          >
            <Wallet className="h-4 w-4 mr-2" />
            Transférer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletBalance;
