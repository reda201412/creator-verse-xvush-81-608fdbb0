
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Coins, QrCode, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { ContentPrice } from '@/types/monetization';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useNeuroAesthetic } from '@/hooks/use-neuro-aesthetic';

interface ContentPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentId: string;
  contentTitle: string;
  thumbnailUrl?: string;
  pricing: ContentPrice;
  userTokenBalance: number;
  userSubscriptionTier?: string;
  onPurchaseSuccess?: () => void;
}

const ContentPurchaseModal: React.FC<ContentPurchaseModalProps> = ({
  isOpen,
  onClose,
  contentId,
  contentTitle,
  thumbnailUrl,
  pricing,
  userTokenBalance,
  userSubscriptionTier,
  onPurchaseSuccess
}) => {
  const [purchaseMethod, setPurchaseMethod] = useState<'tokens' | 'card'>('tokens');
  const [purchaseStatus, setPurchaseStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const { user } = useAuth();
  const { triggerMicroReward } = useNeuroAesthetic();

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setPurchaseStatus('idle');
      setErrorMessage('');
    }
  }, [isOpen]);

  // Calculate token price with subscription discount if applicable
  const calculateFinalPrice = () => {
    if (!pricing.tokenPrice) return 0;
    
    // Check if user has subscription discount
    if (pricing.type === 'hybrid' && userSubscriptionTier && pricing.requiredTier === userSubscriptionTier && pricing.discountPercentage) {
      const discount = pricing.tokenPrice * (pricing.discountPercentage / 100);
      return Math.max(0, Math.floor(pricing.tokenPrice - discount));
    }
    
    return pricing.tokenPrice;
  };

  const finalPrice = calculateFinalPrice();
  const canAffordWithTokens = userTokenBalance >= finalPrice;
  
  const handlePurchaseWithTokens = async () => {
    if (!user) {
      toast.error("Vous devez être connecté pour effectuer cet achat");
      return;
    }
    
    if (!canAffordWithTokens) {
      toast.error("Solde de tokens insuffisant");
      setErrorMessage("Votre solde de tokens est insuffisant pour cet achat. Veuillez recharger votre compte.");
      setPurchaseStatus('error');
      return;
    }
    
    setPurchaseStatus('processing');
    
    try {
      // Simulate API call to process token purchase
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would call an API to process the token purchase
      // Here we just simulate a successful purchase
      toast.success(`Achat réussi : ${contentTitle}`);
      setPurchaseStatus('success');
      triggerMicroReward('purchase');
      
      // Wait a moment before closing modal to show success state
      setTimeout(() => {
        onClose();
        if (onPurchaseSuccess) onPurchaseSuccess();
      }, 1500);
      
    } catch (error) {
      console.error('Purchase error:', error);
      setPurchaseStatus('error');
      setErrorMessage("Une erreur est survenue lors de l'achat. Veuillez réessayer.");
    }
  };

  // Mock QR code data URL - this is properly formatted now
  const qrCodeDataUrl = "data:image/png;base64,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";

  return (
    <Dialog open={isOpen} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{contentTitle}</DialogTitle>
        </DialogHeader>
        
        {purchaseStatus === 'idle' && (
          <Tabs defaultValue={canAffordWithTokens ? 'tokens' : 'card'} onValueChange={(v) => setPurchaseMethod(v as 'tokens' | 'card')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="tokens" disabled={!canAffordWithTokens}>
                <div className="flex items-center gap-2">
                  <Coins className="h-4 w-4 text-amber-500" />
                  <span>Tokens</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="card">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  <span>Carte</span>
                </div>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="tokens" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Payer avec des tokens</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Prix</span>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Coins className="h-3 w-3 text-amber-500" />
                      <span>{finalPrice} tokens</span>
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Solde actuel</span>
                    <Badge variant={canAffordWithTokens ? "outline" : "destructive"} className="flex items-center gap-1">
                      <Coins className="h-3 w-3 text-amber-500" />
                      <span>{userTokenBalance} tokens</span>
                    </Badge>
                  </div>
                  
                  {pricing.type === 'hybrid' && pricing.discountPercentage && userSubscriptionTier === pricing.requiredTier && (
                    <div className="rounded-md bg-muted p-2 text-xs">
                      <p className="flex items-center gap-1 text-green-500">
                        <CheckCircle className="h-3 w-3" />
                        <span>Réduction abonné de {pricing.discountPercentage}% appliquée</span>
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handlePurchaseWithTokens} 
                    className="w-full" 
                    disabled={!canAffordWithTokens}
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    Acheter maintenant
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="card" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Paiement par carte bancaire</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">Scannez ce QR code avec votre smartphone pour finaliser le paiement</p>
                  
                  <div className="flex justify-center">
                    <div className="bg-white p-4 rounded-md">
                      <img src={qrCodeDataUrl} alt="QR Code de paiement" className="h-56 w-56" />
                    </div>
                  </div>
                  
                  <p className="text-xs text-center text-muted-foreground">
                    Le contenu sera déverrouillé automatiquement après le paiement
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
        
        {purchaseStatus === 'processing' && (
          <div className="py-8 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-t-transparent border-primary rounded-full animate-spin mb-4" />
            <p>Traitement de votre paiement...</p>
          </div>
        )}
        
        {purchaseStatus === 'success' && (
          <div className="py-8 flex flex-col items-center justify-center">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <p className="text-xl font-medium mb-2">Achat réussi !</p>
            <p className="text-sm text-muted-foreground text-center">
              Votre contenu exclusif est maintenant disponible.
            </p>
          </div>
        )}
        
        {purchaseStatus === 'error' && (
          <div className="py-8 flex flex-col items-center justify-center">
            <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
            <p className="text-xl font-medium mb-2">Une erreur est survenue</p>
            <p className="text-sm text-muted-foreground text-center mb-4">
              {errorMessage || "Impossible de finaliser votre achat. Veuillez réessayer."}
            </p>
            <Button onClick={() => setPurchaseStatus('idle')}>
              Réessayer
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ContentPurchaseModal;
