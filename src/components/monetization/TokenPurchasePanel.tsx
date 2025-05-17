import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, CreditCard, Check } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useWalletTransactions } from '@/hooks/use-wallet-transactions';
import { PurchaseOption } from '@/types/monetization';

// Mock data for token purchase options
const purchaseOptions: PurchaseOption[] = [
  { id: 'basic', name: 'Starter', tokenAmount: 100, price: 9.99, currency: 'USD', isPopular: false },
  { id: 'standard', name: 'Standard', tokenAmount: 250, price: 19.99, currency: 'USD', discount: 10, isPopular: true },
  { id: 'premium', name: 'Premium', tokenAmount: 500, price: 34.99, currency: 'USD', discount: 15, isPopular: false },
  { id: 'elite', name: 'Elite', tokenAmount: 1000, price: 59.99, currency: 'USD', discount: 25, bonus: 100, isPopular: false },
];

interface TokenPurchasePanelProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: () => Promise<boolean>;
}

const TokenPurchasePanel: React.FC<TokenPurchasePanelProps> = ({ 
  isOpen,
  onClose,
  onPurchase
}) => {
  const [selectedOption, setSelectedOption] = useState<PurchaseOption | null>(
    purchaseOptions.find(option => option.isPopular) || purchaseOptions[0]
  );
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'crypto'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { isProcessing: isWalletProcessing } = useWalletTransactions();
  
  const handlePurchase = async () => {
    if (!selectedOption) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      // Simulate payment process
      const result = await onPurchase();
      
      if (result) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 2000);
      } else {
        setError("Payment failed. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again later.");
      console.error("Token purchase error:", err);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleOptionSelect = (option: PurchaseOption) => {
    setSelectedOption(option);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={() => {
      if (!isProcessing && !isWalletProcessing) {
        onClose();
      }
    }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Achetez des Tokens</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            {purchaseOptions.map((option) => (
              <Card 
                key={option.id}
                className={`p-4 cursor-pointer border hover:border-primary transition-colors ${
                  selectedOption?.id === option.id ? 'border-primary bg-primary/5' : ''
                } ${option.isPopular ? 'relative' : ''}`}
                onClick={() => handleOptionSelect(option)}
              >
                {option.isPopular && (
                  <div className="absolute -top-2 -right-2 bg-primary text-white text-xs px-2 py-1 rounded">
                    Popular
                  </div>
                )}
                
                <h3 className="font-medium">{option.name}</h3>
                <div className="text-2xl font-bold mt-2">{option.tokenAmount} <span className="text-sm font-normal">tokens</span></div>
                
                <div className="mt-2">
                  {option.discount ? (
                    <div className="flex items-baseline gap-2">
                      <span className="line-through text-muted-foreground text-sm">${(option.price / (1 - option.discount/100)).toFixed(2)}</span>
                      <span className="text-green-600 font-medium">${option.price}</span>
                    </div>
                  ) : (
                    <span>${option.price}</span>
                  )}
                </div>
                
                {option.bonus && (
                  <div className="mt-1 text-xs text-green-600">+{option.bonus} tokens bonus</div>
                )}
              </Card>
            ))}
          </div>
          
          <div className="flex flex-col gap-4 mt-6">
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <h3 className="font-medium">Payment Method</h3>
                <p className="text-muted-foreground text-sm">Choose how to pay</p>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant={paymentMethod === 'card' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPaymentMethod('card')}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Card
                </Button>
                <Button 
                  variant={paymentMethod === 'crypto' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPaymentMethod('crypto')}
                >
                  <span className="mr-2">₿</span>
                  Crypto
                </Button>
              </div>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-md">
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Price</span>
                <span>${selectedOption?.price.toFixed(2)}</span>
              </div>
              
              {selectedOption?.discount && (
                <div className="flex justify-between mb-2 text-green-600">
                  <span>Discount</span>
                  <span>-{selectedOption.discount}%</span>
                </div>
              )}
              
              <div className="flex justify-between font-medium text-lg pt-2 border-t">
                <span>Total</span>
                <span>${selectedOption?.price.toFixed(2)}</span>
              </div>
            </div>
            
            <Button 
              className="mt-2" 
              size="lg"
              onClick={handlePurchase} 
              disabled={isProcessing || success || !selectedOption}
            >
              {isProcessing ? (
                "Processing..."
              ) : success ? (
                <span className="flex items-center gap-2">
                  <Check className="h-5 w-5" />
                  Purchase Complete!
                </span>
              ) : (
                `Buy ${selectedOption?.tokenAmount} Tokens`
              )}
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground text-center mt-4">
            By purchasing tokens, you agree to our Terms of Service.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TokenPurchasePanel;
