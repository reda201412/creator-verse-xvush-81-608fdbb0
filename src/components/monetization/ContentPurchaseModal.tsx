
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useTronWallet } from '@/hooks/use-tron-wallet';

interface ContentPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  tokenPrice: number;
  onPurchase: () => void;
}

const ContentPurchaseModal: React.FC<ContentPurchaseModalProps> = ({
  isOpen,
  onClose,
  title,
  tokenPrice,
  onPurchase,
}) => {
  const { walletInfo } = useTronWallet();
  const [isPurchasing, setIsPurchasing] = useState(false);

  const handlePurchase = async () => {
    setIsPurchasing(true);
    
    try {
      // Here you would integrate with your token transaction system
      // For demonstration, we'll use a timeout to simulate transaction
      setTimeout(() => {
        onPurchase();
        setIsPurchasing(false);
        onClose();
      }, 1500);
    } catch (err) {
      setIsPurchasing(false);
      console.error("Purchase error:", err);
    }
  };

  // Get balance directly from wallet.balance_usdt instead of wallet.balance
  const tokenBalance = walletInfo?.wallet?.balance_usdt || 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Achat de contenu</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center p-4">
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <div className="text-2xl font-bold text-primary">
              {tokenPrice} tokens
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm">Solde actuel</span>
            <span className="font-medium">{tokenBalance} tokens</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm">Après achat</span>
            <span className="font-medium">
              {tokenBalance - tokenPrice} tokens
            </span>
          </div>
          
          <div className="pt-4 flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button 
              onClick={handlePurchase} 
              disabled={isPurchasing || tokenBalance < tokenPrice}
            >
              {isPurchasing ? "Traitement..." : "Confirmer l'achat"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContentPurchaseModal;
