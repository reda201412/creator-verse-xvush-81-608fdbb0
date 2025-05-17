
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useTronWallet } from '@/hooks/use-tron-wallet';
import { ContentPrice } from '@/types/monetization';

interface ContentPurchaseModalProps {
  contentId: string;
  contentTitle: string;
  contentPrice: ContentPrice;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const ContentPurchaseModal: React.FC<ContentPurchaseModalProps> = ({
  contentId,
  contentTitle,
  contentPrice,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { isLoading } = useTronWallet();
  const [purchaseState, setPurchaseState] = useState<'initial' | 'processing' | 'success' | 'error'>('initial');
  
  const handlePurchase = async () => {
    setPurchaseState('processing');
    
    try {
      // Simulate transaction processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      setPurchaseState('success');
      onSuccess?.();
    } catch (error) {
      console.error('Purchase error:', error);
      setPurchaseState('error');
    }
  };
  
  const handleClose = () => {
    if (purchaseState !== 'processing') {
      setPurchaseState('initial');
      onClose();
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Acheter du contenu</DialogTitle>
          <DialogDescription>
            Vous êtes sur le point d'acheter "{contentTitle}"
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex justify-between">
            <span>Prix</span>
            <span className="font-medium">
              {contentPrice.type === 'token' && `${contentPrice.tokenPrice} tokens`}
              {contentPrice.type === 'hybrid' && `${contentPrice.tokenPrice} tokens`}
              {contentPrice.type === 'subscription' && 'Inclus dans votre abonnement'}
              {contentPrice.type === 'free' && 'Gratuit'}
            </span>
          </div>
          
          {contentPrice.type === 'hybrid' && contentPrice.discountForSubscribers && (
            <div className="flex justify-between text-sm">
              <span>Réduction abonnés</span>
              <span className="text-green-600">-{contentPrice.discountForSubscribers}%</span>
            </div>
          )}
          
          {purchaseState === 'success' ? (
            <div className="bg-green-50 border border-green-200 rounded-md p-3 text-center">
              <p className="text-green-800 font-medium">Achat réussi!</p>
              <p className="text-sm text-green-700">Vous avez maintenant accès à ce contenu.</p>
            </div>
          ) : purchaseState === 'error' ? (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 text-center">
              <p className="text-red-800 font-medium">Échec de l'achat</p>
              <p className="text-sm text-red-700">Veuillez réessayer ou contacter le support.</p>
            </div>
          ) : null}
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose} disabled={purchaseState === 'processing'}>
            Annuler
          </Button>
          
          <Button 
            onClick={handlePurchase} 
            disabled={purchaseState === 'processing' || purchaseState === 'success' || isLoading}
          >
            {purchaseState === 'processing' && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {purchaseState === 'initial' && 'Confirmer l\'achat'}
            {purchaseState === 'processing' && 'Traitement...'}
            {purchaseState === 'success' && 'Acheté'}
            {purchaseState === 'error' && 'Réessayer'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContentPurchaseModal;
