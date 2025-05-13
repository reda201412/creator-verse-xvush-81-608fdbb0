
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Coins, CreditCard, QrCode, ArrowRight, Check, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useTronWallet } from '@/hooks/use-tron-wallet';
import { toast } from 'sonner';
import { ContentPrice } from '@/types/monetization';
import { useNeuroAesthetic } from '@/hooks/use-neuro-aesthetic';

interface ContentPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchaseComplete: () => void;
  contentId: string | number;
  contentTitle: string;
  contentThumbnail: string;
  pricing: ContentPrice;
  userTokenBalance?: number;
}

const ContentPurchaseModal: React.FC<ContentPurchaseModalProps> = ({
  isOpen,
  onClose,
  onPurchaseComplete,
  contentId,
  contentTitle,
  contentThumbnail,
  pricing,
  userTokenBalance = 0
}) => {
  const [activeTab, setActiveTab] = useState('wallet');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const { verifyTransaction } = useTronWallet();
  const { triggerMicroReward } = useNeuroAesthetic();
  
  const mockQRCodeUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAACECAYAAABRRIOnAAAAAklEQVR4AewaftIAAAOPSURBVO3BQY4kRxIEQdNA/f/Lug0eCmRm9YwWZu7+IcaYcowp15hyjSnXmHKNKdeYco0p15hyjSnXmHKNKdeYco0p15hyjSnXmHKNKdeY8uFLSv5SSjolpVNS+klK/pKSb4wp15hyjSnXmPLhZSnvSskTJZ2SZ0qeKXlHyjtS3jSmXGPKNaZcY8qHX1byRMk3SnpKOik9Jb8p5YmS3zSmXGPKNaZcY8qHvyYlT5T0lPSUdFL+z8aUa0y5xpRrTPlwGSU/SfmdlHeU/E3GlGtMucaUa0z58MtK/k9JT0knpZPyL1PyjZRvjCnXmHKNKdeY8uFLKX9TSk9JT0lPSU9JJ+VNJZ2SZ0p+0phyjSnXmHKNKR++lPKTlGdKnilJSp4p6ZQ8UdJT8kzJT1K+MaZcY8o1plxjSvpDfyjpKTlJT0kn5YmSTso7Uv5LY8o1plxjyjWmfLilpJPSU9JJeUdKJ+UdJT0lPSWdlJ6Sv2lMucaUa0y5xpQPL0t5R8kTJZ2Sn5R0Ujoln5R0SnpKOik9Jd8YU64x5RpTrjHlwy9L6aR0Sp4o6SnppDyTklPyREkn5YmSb4wp15hyjSnXmPLhZSU9JZ2SZ1I6KZ2SntJTcpL0lHRKTkoz5V8ypnx0jCnXmHKNKemHX5TSSekp6aR0UjopnZJnUjopnZRnUp4p+UnKN8aUa0y5xpRrTPnwpZRnSjopPSXPlHRK3pHSTOmk9JScpJnyjpSfjCnXmHKNKdeY8uFLKU+UdEqeKXmmpJPyTkknpZPyRMkzKZ2UnpRvjCnXmHKNKdeY8uFLKU+UdEqeKXmmpJPyTkknpZPSU9JT8kxKJ6WTkmmpTyTlTfMeUeDVZKdl7Y0PPNsG8TkrSXnXmHKNKdeYco0p6Yc3pPSUnKRnSjolph7lHSU9JY+kdJQ8kdJJ6aT8pJV3jSnXmHKNKdeY8uFLSn4pJU+UdEo6KU+U9JQ8U9JJ+ZPGlGtMucaUa0xJP/xBKU+UdFI6KT0lnZSeXjb/kpVOSk9JJ6WT0lPyjZQfGVOuMeUaU64x5cMvlbwjpVPyjpJnUjolp5Sekk5KT8k7Ur4xplxjyjWmXGPKhy+l/FJKnknpKTlJ+VrKT0o6KZ2UXjZ/kvKNMeUaU64x5RpTxh9ijCnHmHKNKdeYco0p15hyjSnXmHKNKdeYco0p15hyjSnXmHKNKdeYco0p15hyjSn/A1lCo8/xLDdPAAAAAElFTkSuQmCC";
  
  const hasEnoughTokens = userTokenBalance >= (pricing.tokenPrice || 0);
  
  const handlePurchaseWithWallet = async () => {
    if (!hasEnoughTokens) {
      toast.error("Solde insuffisant");
      return;
    }
    
    setPaymentStatus('pending');
    triggerMicroReward('action');
    
    // Simulate transaction verification
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        completePurchase();
      }
    }, 300);
  };
  
  const handlePurchaseWithQR = async () => {
    setPaymentStatus('pending');
    triggerMicroReward('action');
    
    // Simulate waiting for blockchain confirmation
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        completePurchase();
      }
    }, 500);
  };
  
  const completePurchase = async () => {
    try {
      // Mock transaction hash
      const mockTxHash = "TRXabcdef1234567890";
      
      await verifyTransaction({
        txHash: mockTxHash,
        amount: pricing.tokenPrice || 0,
        purpose: 'purchase',
        contentId: contentId.toString()
      });
      
      setPaymentStatus('success');
      triggerMicroReward('action');
      setTimeout(() => {
        onPurchaseComplete();
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Purchase error:', err);
      setPaymentStatus('error');
    }
  };
  
  const resetState = () => {
    setPaymentStatus('idle');
    setProgress(0);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        resetState();
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Achat de contenu premium</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex gap-4 items-center">
            <div className="w-24 h-16 rounded-md overflow-hidden">
              <img src={contentThumbnail} alt={contentTitle} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{contentTitle}</h3>
              <Badge className="mt-2 bg-gradient-to-r from-xvush-pink to-xvush-orange">
                <Coins className="mr-1 h-3 w-3" />
                {pricing.tokenPrice} tokens
              </Badge>
            </div>
          </div>
          
          {paymentStatus === 'idle' ? (
            <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="wallet" disabled={!hasEnoughTokens}>
                  <Coins className="h-4 w-4 mr-2" />
                  Portefeuille
                </TabsTrigger>
                <TabsTrigger value="qr">
                  <QrCode className="h-4 w-4 mr-2" />
                  QR Code
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="wallet" className="mt-0">
                <div className="space-y-4">
                  <div className="bg-secondary p-4 rounded-md">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">Votre solde</div>
                      <div className="font-medium">{userTokenBalance} tokens</div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="text-sm text-muted-foreground">Prix</div>
                      <div className="font-medium text-primary">{pricing.tokenPrice} tokens</div>
                    </div>
                    <div className="flex justify-between items-center mt-2 pt-2 border-t">
                      <div className="text-sm font-medium">Après achat</div>
                      <div className="font-medium">{userTokenBalance - (pricing.tokenPrice || 0)} tokens</div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="qr" className="mt-0">
                <div className="space-y-4">
                  <div className="bg-white mx-auto w-48 h-48 p-2 rounded-md">
                    <img src={mockQRCodeUrl} alt="QR Code de paiement" className="w-full h-full" />
                  </div>
                  <div className="text-sm text-center text-muted-foreground">
                    Scannez ce code avec votre application TRON pour effectuer le paiement de {pricing.tokenPrice} USDT
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="space-y-4 py-6">
              {paymentStatus === 'pending' && (
                <div className="text-center">
                  <Loader2 className="animate-spin h-8 w-8 mx-auto mb-4 text-primary" />
                  <h3 className="font-medium">Traitement en cours...</h3>
                  <div className="mt-4">
                    <Progress value={progress} />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {activeTab === 'wallet' 
                      ? "Vérification de la transaction..." 
                      : "En attente de confirmation sur la blockchain..."}
                  </p>
                </div>
              )}
              
              {paymentStatus === 'success' && (
                <div className="text-center">
                  <div className="bg-green-500/20 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Check className="h-8 w-8 text-green-500" />
                  </div>
                  <h3 className="font-medium text-xl">Achat réussi!</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Vous avez maintenant accès à ce contenu premium
                  </p>
                </div>
              )}
              
              {paymentStatus === 'error' && (
                <div className="text-center">
                  <div className="bg-red-500/20 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-xl">Erreur de paiement</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Une erreur s'est produite lors du traitement de votre paiement. Veuillez réessayer.
                  </p>
                  <Button variant="outline" className="mt-4" onClick={resetState}>
                    Réessayer
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
        
        <DialogFooter>
          {paymentStatus === 'idle' && (
            <>
              <Button variant="outline" onClick={onClose}>
                Annuler
              </Button>
              {activeTab === 'wallet' ? (
                <Button 
                  onClick={handlePurchaseWithWallet} 
                  disabled={!hasEnoughTokens}
                  className="bg-gradient-to-r from-xvush-pink to-xvush-purple"
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Payer avec mon portefeuille
                </Button>
              ) : (
                <Button 
                  onClick={handlePurchaseWithQR}
                  className="bg-gradient-to-r from-xvush-blue to-xvush-teal"
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  J'ai payé avec le QR code
                </Button>
              )}
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContentPurchaseModal;
