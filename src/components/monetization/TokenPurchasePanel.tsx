
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, Check, Info } from 'lucide-react';

interface TokenPurchaseOption {
  id: string;
  tokenAmount: number;
  price: number;
  isPopular?: boolean;
  bonus?: number;
  description?: string;
}

const purchaseOptions: TokenPurchaseOption[] = [
  {
    id: 'basic',
    tokenAmount: 100,
    price: 9.99,
    description: 'Pour les débutants'
  },
  {
    id: 'standard',
    tokenAmount: 300,
    price: 19.99,
    isPopular: true,
    bonus: 30,
    description: 'Le plus choisi'
  },
  {
    id: 'pro',
    tokenAmount: 800,
    price: 39.99,
    bonus: 100,
    description: 'Pour les pros'
  }
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
  const [selectedOption, setSelectedOption] = useState<string>('standard');
  const [purchaseState, setPurchaseState] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'crypto'>('card');
  
  const handlePurchase = async () => {
    if (purchaseState === 'processing') return;
    
    setPurchaseState('processing');
    try {
      const result = await onPurchase();
      setPurchaseState(result ? 'success' : 'error');
      
      if (result) {
        setTimeout(() => {
          onClose();
          setPurchaseState('idle');
        }, 1500);
      }
    } catch (error) {
      console.error('Error during purchase:', error);
      setPurchaseState('error');
    }
  };
  
  const selectedOptionData = purchaseOptions.find(opt => opt.id === selectedOption);
  
  return (
    <Dialog open={isOpen} onOpenChange={state => {
      if (!state && purchaseState !== 'processing') {
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Acheter des tokens</DialogTitle>
          <DialogDescription>
            Les tokens vous permettent d'accéder à du contenu premium et de soutenir vos créateurs préférés.
          </DialogDescription>
        </DialogHeader>
        
        {purchaseState === 'success' ? (
          <div className="py-6 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium mb-1">Achat réussi!</h3>
            <p className="text-sm text-muted-foreground">
              Vos tokens ont été ajoutés à votre portefeuille.
            </p>
          </div>
        ) : purchaseState === 'error' ? (
          <div className="py-6 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <Info className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-medium mb-1">Une erreur est survenue</h3>
            <p className="text-sm text-muted-foreground">
              Votre transaction n'a pas pu être traitée. Veuillez réessayer.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-3 gap-3">
              {purchaseOptions.map((option) => (
                <Card 
                  key={option.id}
                  className={`p-3 cursor-pointer relative ${
                    selectedOption === option.id 
                      ? 'border-primary ring-1 ring-primary' 
                      : ''
                  }`}
                  onClick={() => setSelectedOption(option.id)}
                >
                  {option.isPopular && (
                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                      Populaire
                    </span>
                  )}
                  <div className="text-center">
                    <h3 className="font-medium">{option.tokenAmount} tokens</h3>
                    {option.bonus && (
                      <p className="text-xs text-green-600">+{option.bonus} bonus</p>
                    )}
                    <p className="font-bold mt-2">€{option.price.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground mt-1">{option.description}</p>
                  </div>
                </Card>
              ))}
            </div>
            
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Mode de paiement</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant={paymentMethod === 'card' ? 'default' : 'outline'}
                  className="justify-center"
                  onClick={() => setPaymentMethod('card')}
                >
                  Carte bancaire
                </Button>
                <Button 
                  variant={paymentMethod === 'crypto' ? 'default' : 'outline'}
                  className="justify-center"
                  onClick={() => setPaymentMethod('crypto')}
                >
                  Crypto
                </Button>
              </div>
            </div>
          </div>
        )}
        
        <DialogFooter>
          {purchaseState === 'error' ? (
            <Button onClick={() => setPurchaseState('idle')}>
              Réessayer
            </Button>
          ) : purchaseState === 'idle' && (
            <Button onClick={handlePurchase} disabled={!selectedOptionData}>
              {`Acheter pour €${selectedOptionData?.price.toFixed(2) || '0.00'}`}
            </Button>
          )}
          
          {purchaseState === 'processing' && (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Traitement...
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TokenPurchasePanel;
