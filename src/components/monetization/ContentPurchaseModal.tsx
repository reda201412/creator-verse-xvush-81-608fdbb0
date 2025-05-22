
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Coins, AlertTriangle } from 'lucide-react';
import { ContentPrice } from '@/types/monetization';

export interface ContentPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchaseComplete: () => void;
  contentTitle: string;
  contentThumbnail: string;
  pricing: {
    price: number;
    currency: string;
  };
  userTokenBalance: number;
}

const ContentPurchaseModal: React.FC<ContentPurchaseModalProps> = ({
  isOpen,
  onClose,
  onPurchaseComplete,
  contentTitle,
  contentThumbnail,
  pricing,
  userTokenBalance,
}) => {
  const [isPurchasing, setIsPurchasing] = useState(false);
  
  const handlePurchase = async () => {
    try {
      setIsPurchasing(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onPurchaseComplete();
      onClose();
    } catch (error) {
      console.error('Error purchasing content:', error);
    } finally {
      setIsPurchasing(false);
    }
  };
  
  const hasSufficientBalance = userTokenBalance >= pricing.price;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Accéder au contenu premium</DialogTitle>
          <DialogDescription>
            Déverrouillez ce contenu premium pour y accéder immédiatement.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Content preview */}
          <div className="flex items-start space-x-4">
            <div className="rounded-md overflow-hidden w-20 h-20">
              <img 
                src={contentThumbnail || '/placeholder.svg'} 
                alt={contentTitle} 
                className="w-full h-full object-cover" 
              />
            </div>
            
            <div>
              <h3 className="font-medium">{contentTitle}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Contenu premium
              </p>
            </div>
          </div>
          
          <Separator />
          
          {/* Pricing info */}
          <div className="flex items-center justify-between">
            <div className="font-medium">Prix:</div>
            <div className="flex items-center">
              <Coins className="h-4 w-4 mr-1 text-amber-500" />
              <span>{pricing.price} tokens</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="font-medium">Votre solde:</div>
            <div className="flex items-center">
              <Coins className="h-4 w-4 mr-1 text-amber-500" />
              <span>{userTokenBalance} tokens</span>
            </div>
          </div>
          
          {!hasSufficientBalance && (
            <div className="bg-destructive/10 p-3 rounded-md flex items-start space-x-2">
              <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-destructive">Solde insuffisant</p>
                <p className="text-muted-foreground">Rechargez votre compte pour continuer.</p>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="gap-2">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isPurchasing}
          >
            Annuler
          </Button>
          
          {hasSufficientBalance ? (
            <Button 
              onClick={handlePurchase} 
              disabled={isPurchasing || !hasSufficientBalance}
            >
              {isPurchasing ? "En cours..." : "Acheter maintenant"}
            </Button>
          ) : (
            <Button variant="default">
              Recharger des tokens
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContentPurchaseModal;
