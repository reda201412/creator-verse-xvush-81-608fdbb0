
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ContentPrice {
  price: number;
  currency: 'tokens' | 'usd';
}

interface ContentPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchaseComplete: () => void;
  contentTitle: string;
  contentThumbnail: string;
  pricing: ContentPrice;
  userTokenBalance: number;
  contentId?: string;
}

const ContentPurchaseModal: React.FC<ContentPurchaseModalProps> = ({
  isOpen,
  onClose,
  onPurchaseComplete,
  contentTitle,
  contentThumbnail,
  pricing,
  userTokenBalance,
  contentId
}) => {
  const [purchaseState, setPurchaseState] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const hasEnoughTokens = userTokenBalance >= pricing.price;
  
  const handlePurchase = async () => {
    if (!hasEnoughTokens) {
      toast.error('Solde de tokens insuffisant');
      return;
    }
    
    setPurchaseState('processing');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (Math.random() > 0.1) { // 90% success rate for demo
        setPurchaseState('success');
        setTimeout(() => {
          onPurchaseComplete();
          setPurchaseState('idle');
        }, 1000);
      } else {
        setPurchaseState('error');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      setPurchaseState('error');
    }
  };
  
  const handleRetry = () => {
    setPurchaseState('idle');
  };
  
  const handleCancel = () => {
    setPurchaseState('idle');
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={purchaseState === 'idle' ? onClose : undefined}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {purchaseState === 'idle' && 'Acheter ce contenu'}
            {purchaseState === 'processing' && 'Traitement de votre achat...'}
            {purchaseState === 'success' && 'Achat réussi!'}
            {purchaseState === 'error' && 'Échec de l\'achat'}
          </DialogTitle>
        </DialogHeader>
        
        {purchaseState === 'idle' && (
          <div className="space-y-4">
            <div className="aspect-video rounded-md overflow-hidden">
              <img 
                src={contentThumbnail || '/placeholder.svg'} 
                alt={contentTitle} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="text-center">
              <h3 className="font-semibold text-lg">{contentTitle}</h3>
              <p className="text-sm text-muted-foreground">
                ID: {contentId || 'N/A'}
              </p>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span>Prix:</span>
                <span className="font-semibold">{pricing.price} tokens</span>
              </div>
              
              <div className="flex justify-between items-center mt-2">
                <span>Votre solde:</span>
                <span className={`font-semibold ${hasEnoughTokens ? 'text-green-500' : 'text-red-500'}`}>
                  {userTokenBalance} tokens
                </span>
              </div>
              
              {!hasEnoughTokens && (
                <div className="mt-2 text-sm text-red-500">
                  Solde insuffisant. Veuillez recharger votre compte.
                </div>
              )}
            </div>
          </div>
        )}
        
        {purchaseState === 'processing' && (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-center text-muted-foreground">
              Traitement de votre paiement...
            </p>
          </div>
        )}
        
        {purchaseState === 'success' && (
          <div className="flex flex-col items-center justify-center py-8">
            <CheckCircle className="h-12 w-12 text-green-500" />
            <p className="mt-4 text-center">
              Votre achat a été effectué avec succès!
            </p>
          </div>
        )}
        
        {purchaseState === 'error' && (
          <div className="flex flex-col items-center justify-center py-8">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <p className="mt-4 text-center">
              Une erreur est survenue lors du traitement de votre paiement.
            </p>
          </div>
        )}
        
        <DialogFooter>
          {purchaseState === 'idle' && (
            <>
              <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
                Annuler
              </Button>
              <Button 
                onClick={handlePurchase} 
                disabled={!hasEnoughTokens}
                className="w-full sm:w-auto"
              >
                Acheter maintenant
              </Button>
            </>
          )}
          
          {purchaseState === 'processing' && (
            <Button variant="outline" onClick={handleCancel} className="w-full">
              Annuler
            </Button>
          )}
          
          {purchaseState === 'success' && (
            <Button onClick={onClose} className="w-full">
              Fermer
            </Button>
          )}
          
          {purchaseState === 'error' && (
            <>
              <Button variant="outline" onClick={handleCancel} className="w-full sm:w-auto">
                Annuler
              </Button>
              <Button onClick={handleRetry} className="w-full sm:w-auto">
                Réessayer
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContentPurchaseModal;
