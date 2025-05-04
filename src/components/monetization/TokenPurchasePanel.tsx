
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Coins, CreditCard, Gift, Info, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from '@/components/ui/sonner';
import { useNeuroAesthetic } from '@/hooks/use-neuro-aesthetic';
import { PurchaseOption } from '@/types/monetization';

interface TokenPurchaseProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: (optionId: string) => Promise<boolean>;
}

const TokenPurchasePanel = ({ isOpen, onClose, onPurchase }: TokenPurchaseProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { triggerMicroReward } = useNeuroAesthetic();
  
  // Mock purchase options
  const purchaseOptions: PurchaseOption[] = [
    {
      id: 'basic',
      name: 'Pack Découverte',
      tokenAmount: 100,
      price: 4.99,
      currency: 'EUR',
    },
    {
      id: 'standard',
      name: 'Pack Standard',
      tokenAmount: 500,
      price: 19.99,
      currency: 'EUR',
      bonus: 50,
      isPopular: true,
    },
    {
      id: 'premium',
      name: 'Pack Premium',
      tokenAmount: 1200,
      price: 39.99,
      currency: 'EUR',
      bonus: 200,
      discount: 15,
    },
    {
      id: 'ultimate',
      name: 'Pack Ultimate',
      tokenAmount: 3000,
      price: 89.99,
      currency: 'EUR',
      bonus: 750,
      discount: 25,
    },
    {
      id: 'limited',
      name: 'Offre Spéciale',
      tokenAmount: 800,
      price: 24.99,
      currency: 'EUR',
      bonus: 200,
      limitedTime: true,
      expiresAt: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days
    }
  ];

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
    triggerMicroReward('select');
  };

  const handlePurchase = async () => {
    if (!selectedOption) return;
    
    setIsProcessing(true);
    try {
      const success = await onPurchase(selectedOption);
      if (success) {
        toast.success("Achat réussi! Vos tokens ont été ajoutés à votre portefeuille.");
        triggerMicroReward('like');
        onClose();
      } else {
        toast.error("L'achat n'a pas pu être complété. Veuillez réessayer.");
      }
    } catch (error) {
      toast.error("Une erreur est survenue. Veuillez réessayer plus tard.");
    } finally {
      setIsProcessing(false);
    }
  };

  const getBestValue = () => {
    let bestOption = purchaseOptions[0];
    let bestValue = bestOption.tokenAmount / bestOption.price;
    
    purchaseOptions.forEach(option => {
      const totalTokens = option.tokenAmount + (option.bonus || 0);
      const effectivePrice = option.discount ? option.price * (1 - option.discount / 100) : option.price;
      const value = totalTokens / effectivePrice;
      
      if (value > bestValue) {
        bestValue = value;
        bestOption = option;
      }
    });
    
    return bestOption.id;
  };

  const bestValueOption = getBestValue();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-amber-500" />
            Achetez des XVush Tokens
          </DialogTitle>
          <DialogDescription>
            Les tokens vous permettent d'accéder à du contenu exclusif et d'interagir avec vos créateurs préférés
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-center mb-2">
            <div className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 text-xs flex items-center gap-1.5">
              <Info size={14} />
              <span>1€ ≈ 20 tokens</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {purchaseOptions.map((option) => {
              const totalTokens = option.tokenAmount + (option.bonus || 0);
              return (
                <motion.div
                  key={option.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`cursor-pointer p-4 rounded-lg relative ${
                    selectedOption === option.id 
                      ? 'ring-2 ring-amber-500 bg-amber-50/10' 
                      : 'bg-muted/30 hover:bg-muted/50'
                  }`}
                  onClick={() => handleOptionSelect(option.id)}
                >
                  {option.isPopular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-xvush-pink text-white text-xs font-bold px-3 py-1 rounded-full">
                      POPULAIRE
                    </div>
                  )}
                  
                  {option.limitedTime && option.expiresAt && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <AlertCircle size={12} />
                      LIMITÉ
                    </div>
                  )}
                  
                  {option.id === bestValueOption && !option.isPopular && !option.limitedTime && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      MEILLEUR PRIX
                    </div>
                  )}

                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{option.name}</div>
                      <div className="flex items-center mt-1">
                        <Coins size={16} className="text-amber-500 mr-1" />
                        <span className="text-2xl font-bold">{option.tokenAmount}</span>
                        {option.bonus && (
                          <span className="ml-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-0.5 rounded-full">
                            +{option.bonus}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      {option.discount && (
                        <div className="text-xs line-through text-muted-foreground">
                          {(option.price / (1 - option.discount / 100)).toFixed(2)}{option.currency}
                        </div>
                      )}
                      <div className="text-lg font-bold">
                        {option.price}{option.currency}
                      </div>
                    </div>
                  </div>
                  
                  {(option.bonus || option.discount) && (
                    <div className="mt-2 text-xs">
                      {option.discount && (
                        <span className="text-green-600 dark:text-green-400">
                          -{option.discount}% 
                        </span>
                      )}
                      {option.discount && option.bonus && " • "}
                      {option.bonus && (
                        <span className="text-amber-600 dark:text-amber-400">
                          Bonus: +{option.bonus} tokens
                        </span>
                      )}
                    </div>
                  )}
                  
                  {option.limitedTime && option.expiresAt && (
                    <div className="mt-2 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle size={12} />
                      Expire dans {Math.ceil((new Date(option.expiresAt).getTime() - Date.now()) / 86400000)} jours
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
          
          <div className="bg-muted/20 p-3 rounded-lg mt-2">
            <div className="flex items-center gap-2 mb-2">
              <Gift size={16} className="text-purple-500" />
              <span className="text-sm font-medium">Offrez des tokens à vos créateurs préférés</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Vous pouvez maintenant offrir des tokens directement aux créateurs pour les soutenir ou 
              débloquer des expériences exclusives.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button 
            onClick={handlePurchase} 
            disabled={!selectedOption || isProcessing}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
          >
            {isProcessing ? (
              <>
                <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                Traitement...
              </>
            ) : (
              <>
                <CreditCard size={16} />
                Acheter
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TokenPurchasePanel;
