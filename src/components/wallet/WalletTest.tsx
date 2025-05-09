
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTronWallet } from '@/hooks/use-tron-wallet';
import { useWalletTransactions } from '@/hooks/use-wallet-transactions';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const WalletTest: React.FC = () => {
  const { user } = useAuth();
  const { walletInfo, loading, getWalletInfo, createWallet } = useTronWallet();
  const { processWalletPayment, isProcessing } = useWalletTransactions();
  const [platformAddress, setPlatformAddress] = useState<string | null>(null);
  
  useEffect(() => {
    if (user) {
      getWalletInfo();
    }
  }, [user, getWalletInfo]);
  
  const handleTestPayment = async () => {
    if (!user || !walletInfo?.wallet) {
      toast.error("Vous devez être connecté et avoir un portefeuille pour effectuer un paiement");
      return;
    }
    
    const result = await processWalletPayment({
      amount: 5,
      purpose: 'purchase',
      contentId: '1'
    });
    
    if (result) {
      toast.success("Test de paiement réussi!");
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Test des fonctionnalités du portefeuille</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm mb-2">Status du portefeuille:</p>
          <div className="p-3 bg-secondary/30 rounded-md">
            {walletInfo?.wallet ? (
              <div>
                <p>Adresse: {walletInfo.wallet.tron_address}</p>
                <p>Solde: {walletInfo.wallet.balance_usdt} USDT</p>
                <p>Vérifié: {walletInfo.wallet.is_verified ? 'Oui' : 'Non'}</p>
              </div>
            ) : (
              <p>Pas de portefeuille détecté</p>
            )}
          </div>
        </div>
        
        <div className="flex flex-col gap-3">
          {!walletInfo?.wallet ? (
            <Button onClick={() => createWallet()}>
              Créer un portefeuille de test
            </Button>
          ) : (
            <>
              <Button 
                onClick={() => getWalletInfo()}
                variant="outline"
              >
                Actualiser les informations
              </Button>
              
              <Button 
                onClick={handleTestPayment}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Traitement...
                  </>
                ) : (
                  'Tester un paiement (5 USDT)'
                )}
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletTest;
