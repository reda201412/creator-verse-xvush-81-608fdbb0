
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
  
  const mockQRCodeUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAACECAYAAABRRIOnAAAAAklEQVR4AewaftIAAAOPSURBVO3BQY4kRxIEQdNA/f/Lug0eCmRm9YwWZu7+IcaYcowp15hyjSnXmHKNKdeYco0p15hyjSnXmHKNKdeYco0p15hyjSnXmHKNKdeY8uFLSv5SSjolpVNS+klK/pKSb4wp15hyjSnXmPLhZSnvSskTJZ2SZ0qeKXlHyjtS3jSmXGPKNaZcY8qHX1byRMk3SnpKOik9Jb8p5YmS3zSmXGPKNaZcY8qHvyYlT5T0lPSUdFL+z8aUa0y5xpRrTPlwGSU/SfmdlHeU/E3GlGtMucaUa0y5xpRrTPlwGSU/SfmdlHeU/E3GlGtMucaUa0z5cBklP0n5nZR3lPxNxpRrTLnGlGtMucaUa0z5cBklP0n5nZR3lPxNxpRrTLnGlGtM+XAZJd9IeUfJ32RMucaUa0y5xpRrTLnGlA+XUfI3GVOuMeUaU64x5RpTrjHlw2WU/CTld1LeUfI3GVOuMeUaU64x5RpTrjHlw2WU/CTld1LeUfI3GVOuMeUaU64x5RpTrjHlw2WU/CTld1LeUfI3GVOuMeUaU64x5RpTrjHlw2WU/CTld1LeUfI3GVOuMeUaU64x5RpTrjHlw2WU/CTld1LeUfI3GVOuMeUaU64x5RpTrjHlw2WU/CTld1LeUfI3GVOuMeUaU64x5RpTrjHlw2WU/CTld1LeUfI3GVOuMeUaU64x5RpTrjHlw2WU/CTld1LeUfI3GVOuMeUaU64x5RpTrjHlw2WU/CTld1LeUfI3GVOuMeUaU64x5RpTrjHlw2WU/CTld1LeUfI3GVOuMeUaU64x5RpTrjHlw2WU/CTld1LeUfI3GVOuMeUaU64x5RpTrjHlw2WU/CTld1LeUfI3GVOuMeUaU64x5RpTrjHlw2WU/CTld1LeUfI3GVOuMeUaU64x5RpTrjHlw2WU/CTld1LeUfI3GVOuMeUaU64x5RpTrjHlw2WU/CTld1LeUfI3GVOuMeUaU64x5cNllPxJKe9IeUdJT0lPyZ9kTLnGlGtMucaUa0y5xpQPl1Hyk5R3pLwj5SflJyk/SflJyjtS3jSmXGPKNaZcY8qHyygp+WdS+ptS/iZjyjWmXGPKNaZ8+MtS/r+MKdeYco0p15jy4S9LyTtSelLeUdJT0lPSU9JT0kt5R8o7Ut4x5RpTrjHlGlM+/GVKfiflJynvKHlHyjtKeko+GVOuMeUaU64x5cNfpuQdJT0lPSU9Jf9Jyjv+JmPKNaZcY8o1pnz4ZSXvSPmTUt5R0lPSU/KOkn+SMeUaU64x5RpTPnxJyZ+U8o6Sd6S8o+QnJT9J+cTfZEy5xpRrTLnGlGtMucaUf/wDkY9eBJFIn3kAAAAASUVORK5CYII=";
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Purchase Content</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col space-y-4 py-4">
          <div className="flex items-center space-x-4">
            <img 
              src={contentThumbnail} 
              alt={contentTitle}
              className="w-16 h-16 rounded-md object-cover"
            />
            <div>
              <h3 className="font-medium">{contentTitle}</h3>
              <div className="flex items-center mt-1">
                <Coins className="w-4 h-4 text-amber-500 mr-1" />
                <span className="text-sm font-medium">{pricing.tokenPrice} tokens</span>
                {pricing.discountPercentage > 0 && (
                  <Badge variant="outline" className="ml-2 text-xs bg-green-50 text-green-700 border-green-200">
                    {pricing.discountPercentage}% off
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="wallet">Token Wallet</TabsTrigger>
              <TabsTrigger value="qr">QR Payment</TabsTrigger>
            </TabsList>
            
            <TabsContent value="wallet" className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Your balance:</span>
                <span className="font-medium flex items-center">
                  <Coins className="w-4 h-4 text-amber-500 mr-1" />
                  {userTokenBalance} tokens
                </span>
              </div>
              
              {userTokenBalance < pricing.tokenPrice ? (
                <div className="text-center space-y-3 py-3">
                  <p className="text-sm text-red-500">Insufficient token balance</p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setActiveTab('qr')}
                  >
                    Purchase Tokens <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button 
                  className="w-full"
                  onClick={() => {
                    setPaymentStatus('pending');
                    
                    // Simulate processing
                    let progress = 0;
                    const interval = setInterval(() => {
                      progress += 10;
                      setProgress(progress);
                      
                      if (progress >= 100) {
                        clearInterval(interval);
                        setPaymentStatus('success');
                        triggerMicroReward();
                        toast.success('Purchase successful!');
                        setTimeout(() => {
                          onPurchaseComplete();
                        }, 1000);
                      }
                    }, 300);
                  }}
                  disabled={paymentStatus !== 'idle'}
                >
                  {paymentStatus === 'idle' && (
                    <>Confirm Purchase <ArrowRight className="ml-2 w-4 h-4" /></>
                  )}
                  {paymentStatus === 'pending' && (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  )}
                  {paymentStatus === 'success' && (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Purchase Complete
                    </>
                  )}
                </Button>
              )}
              
              {paymentStatus === 'pending' && (
                <Progress value={progress} className="h-2" />
              )}
            </TabsContent>
            
            <TabsContent value="qr" className="pt-4 text-center space-y-4">
              <div className="bg-white p-4 mx-auto w-48 h-48 flex items-center justify-center">
                <img src={mockQRCodeUrl} alt="Payment QR Code" className="w-full h-full" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Scan with your wallet app to pay</p>
                <p className="text-xs mt-1 text-muted-foreground">Purchase will be confirmed automatically</p>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  verifyTransaction();
                  setPaymentStatus('pending');
                  
                  // Simulate processing
                  let progress = 0;
                  const interval = setInterval(() => {
                    progress += 5;
                    setProgress(progress);
                    
                    if (progress >= 100) {
                      clearInterval(interval);
                      setPaymentStatus('success');
                      toast.success('Payment confirmed!');
                      setTimeout(() => {
                        onPurchaseComplete();
                      }, 1000);
                    }
                  }, 300);
                }}
              >
                I've completed payment
              </Button>
              
              {paymentStatus === 'pending' && (
                <div className="space-y-2">
                  <p className="text-sm">Verifying payment...</p>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={paymentStatus === 'pending'}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContentPurchaseModal;
