
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose, DrawerFooter } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Gift, Star, Diamond, Crown, Heart, CircleDollarSign, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Gift {
  id: string;
  name: string;
  price: number;
  icon: React.ReactNode;
  color: string;
  animation?: string;
}

interface GiftPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSendGift: (gift: Gift) => void;
}

export const GiftPanel: React.FC<GiftPanelProps> = ({
  isOpen,
  onClose,
  onSendGift
}) => {
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  
  const gifts: Gift[] = [
    {
      id: "gift-1",
      name: "Cœur",
      price: 0.99,
      icon: <Heart size={24} />,
      color: "text-red-400",
      animation: "animate-pulse"
    },
    {
      id: "gift-2",
      name: "Étoile",
      price: 2.99,
      icon: <Star size={24} />,
      color: "text-amber-400",
      animation: "animate-spin"
    },
    {
      id: "gift-3",
      name: "Trophée",
      price: 4.99,
      icon: <Trophy size={24} />,
      color: "text-yellow-400"
    },
    {
      id: "gift-4",
      name: "Diamant",
      price: 9.99,
      icon: <Diamond size={24} />,
      color: "text-blue-400",
      animation: "animate-pulse"
    },
    {
      id: "gift-5",
      name: "Couronne",
      price: 19.99,
      icon: <Crown size={24} />,
      color: "text-purple-400"
    },
    {
      id: "gift-6",
      name: "Superstar",
      price: 29.99,
      icon: <CircleDollarSign size={24} />,
      color: "text-green-400",
      animation: "animate-bounce"
    }
  ];
  
  const handleSendGift = () => {
    if (selectedGift) {
      onSendGift(selectedGift);
    }
  };
  
  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="bg-black text-white border-t border-white/10 max-h-[85vh]">
        <DrawerHeader className="border-b border-white/10">
          <DrawerTitle className="flex items-center gap-2">
            <Gift size={20} className="text-amber-400" />
            <span>Envoyer un cadeau</span>
          </DrawerTitle>
        </DrawerHeader>
        
        <div className="p-4">
          <p className="text-sm text-white/70 mb-4">
            Envoyez un cadeau pour montrer votre appréciation et soutenir votre créateur préféré.
          </p>
          
          <div className="grid grid-cols-3 gap-3">
            {gifts.map((gift) => (
              <motion.div
                key={gift.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "p-3 rounded-lg flex flex-col items-center justify-center cursor-pointer",
                  selectedGift?.id === gift.id 
                    ? "bg-white/20 border-2 border-amber-500" 
                    : "bg-white/5 border border-white/10",
                  "transition-all duration-200"
                )}
                onClick={() => setSelectedGift(gift)}
              >
                <div className={cn(
                  "w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-2",
                  gift.color,
                  gift.animation
                )}>
                  {gift.icon}
                </div>
                <span className="text-xs font-medium">{gift.name}</span>
                <span className="text-xs text-amber-400">{gift.price}€</span>
              </motion.div>
            ))}
          </div>
          
          {selectedGift && (
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-900/30 to-amber-900/30 rounded-lg border border-amber-500/30">
              <h4 className="text-center text-lg font-medium mb-2">Aperçu du cadeau</h4>
              
              <div className="flex flex-col items-center">
                <div className={cn(
                  "w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-3",
                  selectedGift.color,
                  selectedGift.animation
                )}>
                  {selectedGift.icon}
                </div>
                
                <div className="text-center">
                  <p className="font-medium">{selectedGift.name}</p>
                  <p className="text-sm text-amber-400">{selectedGift.price}€</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <DrawerFooter className="border-t border-white/10 pt-4">
          <Button 
            onClick={handleSendGift}
            className="bg-gradient-to-r from-purple-600 to-amber-500 hover:from-purple-700 hover:to-amber-600 text-white"
            disabled={!selectedGift}
          >
            {selectedGift 
              ? `Envoyer ${selectedGift.name} (${selectedGift.price}€)` 
              : "Sélectionnez un cadeau"}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" className="border-white/20 text-white">
              Annuler
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
