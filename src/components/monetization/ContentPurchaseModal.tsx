import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useTronWallet } from '@/hooks/use-tron-wallet';
import { ContentPrice } from '@/types/monetization';
import { Coins, Lock, CheckCircle2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ContentPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentId: string;
  contentTitle: string;
  contentThumbnail: string;
  pricing: ContentPrice;
  userTokenBalance: number;
}

const ContentPurchaseModal = ({ 
  isOpen, 
  onClose, 
  contentId, 
  contentTitle,
  contentThumbnail,
  pricing,
  userTokenBalance
}: ContentPurchaseModalProps) => {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const { wallet, loading } = useTronWallet();
  
  // Add a custom purchaseContent function since it's not in the hook
  const purchaseContent = async () => {
    setIsPurchasing(true);
    
    try {
      // Simulate purchase process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsPurchased(true);
      toast("Contenu déverrouillé", {
        description: "Vous avez accès au contenu premium"
      });
      
      setTimeout(() => {
        onClose();
      }, 1500);
      
      return true;
    } catch (error) {
      console.error("Purchase error:", error);
      toast("Erreur d'achat", {
        description: "Impossible de compléter l'achat",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsPurchasing(false);
    }
  };
  
  const handlePurchase = async () => {
    if (userTokenBalance < pricing.tokenPrice!) {
      toast("Solde insuffisant", {
        description: "Vous n'avez pas assez de tokens pour cet achat",
        variant: "destructive"
      });
      return;
    }
    
    await purchaseContent();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Acheter du contenu</DialogTitle>
          <DialogDescription>
            Débloquez ce contenu exclusif avec vos tokens
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center space-x-4 py-4">
          <img 
            src={contentThumbnail} 
            alt={contentTitle} 
            className="w-24 h-24 rounded-md object-cover" 
          />
          <div>
            <h3 className="text-lg font-semibold">{contentTitle}</h3>
            <p className="text-sm text-muted-foreground">
              {pricing.tokenPrice} Tokens
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            Annuler
          </Button>
          <Button 
            type="button" 
            onClick={handlePurchase}
            disabled={isPurchasing || isPurchased}
          >
            {isPurchasing ? (
              <>
                <Lock className="mr-2 h-4 w-4 animate-spin" />
                Achat en cours...
              </>
            ) : isPurchased ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Acheté
              </>
            ) : (
              <>
                <Coins className="mr-2 h-4 w-4" />
                Acheter
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContentPurchaseModal;
