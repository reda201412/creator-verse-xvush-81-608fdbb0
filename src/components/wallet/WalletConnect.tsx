
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, ExternalLink, Send } from 'lucide-react';
import { toast } from 'sonner';
import { useTronWallet } from '@/hooks/use-tron-wallet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TronWalletConnect from './TronWalletConnect';

interface WalletConnectProps {
  walletInfo: any;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ walletInfo }) => {
  const [withdrawAmount, setWithdrawAmount] = React.useState('');
  const [destinationAddress, setDestinationAddress] = React.useState('');
  const [isWithdrawing, setIsWithdrawing] = React.useState(false);
  const { requestWithdrawal } = useTronWallet();
  const [activeTab, setActiveTab] = React.useState('wallet');
  
  const tronAddress = walletInfo?.wallet?.tron_address || '';
  const balance = walletInfo?.wallet?.balance_usdt || 0;
  
  const handleCopyAddress = () => {
    if (tronAddress) {
      navigator.clipboard.writeText(tronAddress);
      toast.success("Adresse TRON copiée dans le presse-papier");
    }
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
        destinationAddress,
        currency: "USDT"  // Add the missing second argument
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
  
  const handleWalletConnect = (address: string) => {
    toast.success(`Connecté au portefeuille: ${address.substring(0, 8)}...${address.substring(address.length - 8)}`);
  };
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="wallet">Portefeuille Plateforme</TabsTrigger>
          <TabsTrigger value="tronwallet">TronLink</TabsTrigger>
        </TabsList>
        
        <TabsContent value="wallet" className="space-y-6 mt-4">
          <div>
            <h3 className="text-lg font-medium mb-4">Adresse TRON</h3>
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
        </TabsContent>
        
        <TabsContent value="tronwallet" className="space-y-6 mt-4">
          <TronWalletConnect onWalletConnect={handleWalletConnect} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WalletConnect;
