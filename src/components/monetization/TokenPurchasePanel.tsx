
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { motion } from 'framer-motion';
import { AlertCircle, Info } from 'lucide-react';
import { toast } from 'sonner';

interface TokenPurchaseOption {
  tokens: number;
  price: number;
  discounted?: boolean;
  popular?: boolean;
}

interface TokenPurchasePanelProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: () => Promise<boolean>;
  className?: string;
}

const TokenPurchasePanel: React.FC<TokenPurchasePanelProps> = ({
  isOpen,
  onClose,
  onPurchase,
}) => {
  const [selectedOption, setSelectedOption] = useState<TokenPurchaseOption | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'select' | 'payment' | 'success'>('select');
  
  const options: TokenPurchaseOption[] = [
    { tokens: 100, price: 4.99 },
    { tokens: 250, price: 9.99, popular: true },
    { tokens: 500, price: 19.99 },
    { tokens: 1000, price: 29.99, discounted: true },
    { tokens: 5000, price: 99.99, discounted: true },
  ];
  
  const handleSelect = (option: TokenPurchaseOption) => {
    setSelectedOption(option);
  };
  
  const handlePurchase = async () => {
    if (!selectedOption) {
      setError("Veuillez sélectionner une option d'achat");
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const result = await onPurchase();
      if (result) {
        setStep('success');
      } else {
        setError("L'achat n'a pas pu être complété");
      }
    } catch (err) {
      setError("Une erreur s'est produite lors de l'achat");
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleClose = () => {
    // Reset panel state
    setSelectedOption(null);
    setError(null);
    setStep('select');
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Acheter des tokens
          </DialogTitle>
          <DialogDescription>
            Les tokens vous permettent d'accéder à du contenu exclusif
          </DialogDescription>
        </DialogHeader>
        
        {step === 'select' && (
          <div className="space-y-4 pt-2">
            {error && (
              <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md flex items-start gap-2">
                <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 gap-3">
              {options.map((option) => (
                <motion.div
                  key={option.tokens}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`
                    border rounded-lg p-3 cursor-pointer relative
                    ${selectedOption === option ? 'border-primary ring-1 ring-primary' : 'border-border'}
                    ${option.popular ? 'bg-muted/30' : ''}
                  `}
                  onClick={() => handleSelect(option)}
                >
                  {option.popular && (
                    <div className="absolute -top-2 -right-2 bg-primary text-white px-2 py-0.5 text-xs rounded-full">
                      Populaire
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold">{option.tokens} tokens</div>
                      {option.discounted && (
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <span className="line-through">{(option.price * 1.2).toFixed(2)}€</span>
                          <span className="text-primary ml-1">-20%</span>
                        </div>
                      )}
                    </div>
                    <div className="text-lg font-medium">{option.price}€</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
        
        {step === 'payment' && (
          <div className="space-y-4 py-4">
            {error && (
              <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}
            
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">Résumé de votre achat</h3>
              <div className="flex justify-between">
                <span>{selectedOption?.tokens} tokens</span>
                <span>{selectedOption?.price}€</span>
              </div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border rounded-lg p-3"
            >
              <h3 className="font-medium mb-2">Méthode de paiement</h3>
              <div className="text-sm text-muted-foreground">
                Méthode de paiement simulée pour cette démo
              </div>
            </motion.div>
          </div>
        )}
        
        {step === 'success' && (
          <div className="py-6 text-center">
            <div className="mx-auto w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h3 className="font-semibold text-xl mb-1">Achat réussi!</h3>
            <p className="text-muted-foreground mb-6">
              {selectedOption?.tokens} tokens ont été ajoutés à votre compte
            </p>
          </div>
        )}
        
        <DialogFooter>
          {step === 'select' && (
            <>
              <Button variant="outline" onClick={handleClose}>Annuler</Button>
              <Button onClick={() => setStep('payment')} disabled={!selectedOption || isProcessing}>
                Continuer
              </Button>
            </>
          )}
          
          {step === 'payment' && (
            <>
              <Button variant="outline" onClick={() => setStep('select')}>Retour</Button>
              <Button onClick={handlePurchase} disabled={isProcessing}>
                {isProcessing ? 'Traitement...' : 'Payer maintenant'}
              </Button>
            </>
          )}
          
          {step === 'success' && (
            <Button onClick={handleClose}>Fermer</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TokenPurchasePanel;
