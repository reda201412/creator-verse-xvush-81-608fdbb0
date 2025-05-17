
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Coins, Check, AlertCircle, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { PurchaseOption } from '@/types/monetization';

// Mock purchase options
const purchaseOptions: PurchaseOption[] = [
  {
    id: "option1",
    name: "Pack Débutant",
    tokenAmount: 100,
    price: 4.99,
    currency: "EUR",
    bonus: 0
  },
  {
    id: "option2",
    name: "Pack Standard",
    tokenAmount: 500,
    price: 19.99,
    currency: "EUR",
    bonus: 50,
    isPopular: true
  },
  {
    id: "option3",
    name: "Pack Premium",
    tokenAmount: 1000,
    price: 34.99,
    currency: "EUR",
    bonus: 150
  },
  {
    id: "option4",
    name: "Pack Ultime",
    tokenAmount: 2500,
    price: 74.99,
    currency: "EUR",
    bonus: 500,
    discount: 10
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
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseStatus, setPurchaseStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  
  const handleSelectOption = (optionId: string) => {
    setSelectedOption(optionId);
  };
  
  const handlePurchase = async () => {
    if (!selectedOption) return;
    
    setIsPurchasing(true);
    setPurchaseStatus('processing');
    
    try {
      const result = await onPurchase();
      
      if (result) {
        setPurchaseStatus('success');
        setTimeout(() => {
          setIsPurchasing(false);
          setPurchaseStatus('idle');
          setSelectedOption(null);
          onClose();
        }, 2000);
      } else {
        setPurchaseStatus('error');
        setTimeout(() => {
          setIsPurchasing(false);
          setPurchaseStatus('idle');
        }, 2000);
      }
    } catch (err) {
      console.error("Purchase error:", err);
      setPurchaseStatus('error');
      setTimeout(() => {
        setIsPurchasing(false);
        setPurchaseStatus('idle');
      }, 2000);
    }
  };

  const renderStatusMessage = () => {
    switch (purchaseStatus) {
      case 'processing':
        return (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mt-4">
            <div className="flex items-center gap-2 text-yellow-800">
              <Info size={16} />
              <span className="text-sm font-medium">Traitement en cours...</span>
            </div>
          </div>
        );
      case 'success':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 rounded-md p-3 mt-4"
          >
            <div className="flex items-center gap-2 text-green-800">
              <Check size={16} />
              <span className="text-sm font-medium">Achat complété avec succès!</span>
            </div>
          </motion.div>
        );
      case 'error':
        return (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 mt-4">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle size={16} />
              <span className="text-sm font-medium">Erreur lors du traitement. Veuillez réessayer.</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  
  const getSelectedOption = () => {
    return purchaseOptions.find(option => option.id === selectedOption);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isPurchasing && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-amber-500" />
            <span>Acheter des tokens</span>
          </DialogTitle>
          <DialogDescription>
            Les tokens vous permettent d'accéder à du contenu exclusif et d'interagir avec les créateurs.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 py-4">
          {purchaseOptions.map((option) => (
            <div
              key={option.id}
              className={cn(
                "border rounded-lg p-3 cursor-pointer transition-all",
                selectedOption === option.id ? "border-primary bg-primary/5" : "hover:border-primary/50",
                option.isPopular ? "ring-1 ring-amber-500" : ""
              )}
              onClick={() => handleSelectOption(option.id)}
            >
              {option.isPopular && (
                <motion.div 
                  className="bg-amber-500 text-white text-xs font-medium px-2 py-0.5 rounded-full mb-2 inline-block"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
                >
                  Populaire
                </motion.div>
              )}
              
              <div className="font-medium mb-1">{option.name}</div>
              
              <div className="flex items-end justify-between">
                <div className="text-2xl font-bold text-primary">
                  {option.tokenAmount}
                  {option.bonus > 0 && (
                    <span className="text-xs font-normal text-green-600 ml-1">
                      +{option.bonus} offerts
                    </span>
                  )}
                </div>
                
                <div className="text-gray-500">
                  {option.discount ? (
                    <div>
                      <span className="line-through text-xs">{(option.price * (1 + option.discount/100)).toFixed(2)}</span>
                      <span className="text-primary font-bold ml-1">{option.price} {option.currency}</span>
                    </div>
                  ) : (
                    <span>{option.price} {option.currency}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {renderStatusMessage()}
        
        <DialogFooter>
          <div className="w-full flex flex-col sm:flex-row sm:justify-between gap-2">
            {getSelectedOption() && (
              <div className="text-sm">
                Total: <span className="font-medium">{getSelectedOption()?.price} {getSelectedOption()?.currency}</span>
              </div>
            )}
            <div className="flex gap-2 sm:ml-auto">
              <Button variant="outline" onClick={onClose} disabled={isPurchasing}>
                Annuler
              </Button>
              <Button 
                onClick={handlePurchase}
                disabled={!selectedOption || isPurchasing}
              >
                {isPurchasing ? 'Traitement...' : 'Acheter des tokens'}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TokenPurchasePanel;
