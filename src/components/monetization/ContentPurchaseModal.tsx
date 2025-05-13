
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ContentPrice } from '@/types/monetization';
import { Coins, CheckCircle2, AlertTriangle, QrCode } from 'lucide-react';
import { useTronWallet } from '@/hooks/use-tron-wallet';

export interface ContentPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchaseComplete: () => void;
  contentId: string;
  contentTitle: string;
  contentThumbnail: string;
  pricing: ContentPrice;
  userTokenBalance: number;
}

const ContentPurchaseModal: React.FC<ContentPurchaseModalProps> = ({
  isOpen,
  onClose,
  onPurchaseComplete,
  contentId,
  contentTitle,
  contentThumbnail,
  pricing,
  userTokenBalance
}) => {
  const [purchaseStep, setPurchaseStep] = useState<'confirm' | 'processing' | 'success' | 'error'>('confirm');
  const [txHash, setTxHash] = useState<string | null>(null);
  const { purchaseContent } = useTronWallet();

  // Calculate final price taking into account any subscription discounts
  const getFinalPrice = () => {
    if (!pricing.tokenPrice) return 0;
    
    if (pricing.discountForSubscribers) {
      return Math.floor(pricing.tokenPrice * (1 - (pricing.discountForSubscribers / 100)));
    }
    
    return pricing.tokenPrice;
  };

  const finalPrice = getFinalPrice();

  const handlePurchase = async () => {
    if (userTokenBalance < finalPrice) {
      toast.error("Solde de tokens insuffisant");
      return;
    }

    setPurchaseStep('processing');
    
    try {
      const result = await purchaseContent({
        contentId,
        tokenAmount: finalPrice
      });
      
      if (result && result.success) {
        setTxHash(result.txHash || null);
        setPurchaseStep('success');
        toast.success("Achat réussi!");
        setTimeout(() => {
          onPurchaseComplete();
          onClose();
        }, 2000);
      } else {
        setPurchaseStep('error');
        toast.error("Échec de la transaction");
      }
    } catch (error) {
      console.error("Purchase error:", error);
      setPurchaseStep('error');
      toast.error("Une erreur s'est produite lors de l'achat");
    }
  };

  const renderStepContent = () => {
    switch (purchaseStep) {
      case 'confirm':
        return (
          <div className="flex flex-col items-center space-y-4">
            <img 
              src={contentThumbnail} 
              alt={contentTitle}
              className="w-40 h-28 object-cover rounded-md"
            />
            <h3 className="text-lg font-medium">{contentTitle}</h3>
            
            <div className="flex items-center justify-center gap-2 font-bold text-xl">
              <Coins className="h-5 w-5 text-amber-500" />
              <span>{finalPrice} Tokens</span>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 w-full my-2" />
            
            <div className="flex items-center justify-between w-full text-sm">
              <span>Votre solde:</span>
              <span className="font-medium">{userTokenBalance} Tokens</span>
            </div>
            
            <div className="flex items-center justify-between w-full text-sm">
              <span>Après cet achat:</span>
              <span className="font-medium">{userTokenBalance - finalPrice} Tokens</span>
            </div>
          </div>
        );
        
      case 'processing':
        return (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="h-16 w-16 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
            <p className="text-lg font-medium">Traitement de votre achat...</p>
            <p className="text-sm text-muted-foreground max-w-xs text-center">
              La transaction est en cours d'enregistrement sur la blockchain. Veuillez ne pas fermer cette fenêtre.
            </p>
          </div>
        );
        
      case 'success':
        return (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
            <p className="text-lg font-medium">Achat réussi!</p>
            <p className="text-sm text-muted-foreground max-w-xs text-center">
              Votre achat a été confirmé. Vous pouvez maintenant accéder au contenu.
            </p>
            {txHash && (
              <div className="flex flex-col items-center mt-2">
                <p className="text-xs text-muted-foreground mb-1">Transaction ID:</p>
                <div className="bg-muted p-2 rounded-md flex items-center gap-2">
                  <code className="text-xs truncate max-w-[200px]">{txHash}</code>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-6 w-6"
                    onClick={() => {
                      navigator.clipboard.writeText(txHash);
                      toast.success("ID de transaction copié!");
                    }}
                  >
                    <QrCode className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        );
        
      case 'error':
        return (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <AlertTriangle className="h-16 w-16 text-destructive" />
            <p className="text-lg font-medium">Échec de la transaction</p>
            <p className="text-sm text-muted-foreground max-w-xs text-center">
              Une erreur s'est produite lors du traitement de votre achat. Veuillez réessayer ultérieurement.
            </p>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {purchaseStep === 'confirm' ? "Confirmer l'achat" : 
             purchaseStep === 'processing' ? "Traitement en cours" :
             purchaseStep === 'success' ? "Achat réussi" : "Échec de la transaction"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {renderStepContent()}
        </div>
        
        <div className="flex justify-end gap-2">
          {purchaseStep === 'confirm' && (
            <>
              <Button variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button 
                onClick={handlePurchase} 
                disabled={userTokenBalance < finalPrice}
              >
                <Coins className="mr-2 h-4 w-4" />
                Acheter maintenant
              </Button>
            </>
          )}
          
          {purchaseStep === 'processing' && (
            <Button variant="outline" disabled>
              Traitement en cours...
            </Button>
          )}
          
          {purchaseStep === 'success' && (
            <Button variant="default" onClick={onClose}>
              Fermer
            </Button>
          )}
          
          {purchaseStep === 'error' && (
            <>
              <Button variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button variant="default" onClick={() => setPurchaseStep('confirm')}>
                Réessayer
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContentPurchaseModal;
