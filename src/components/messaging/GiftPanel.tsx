import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Gift, Diamond, Crown, Gem, Heart, Star, Trophy, Sparkles } from 'lucide-react';

interface Gift {
  id: string;
  name: string;
  icon: React.ReactNode;
  price: number;
  description: string;
  color: string;
}

interface GiftPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSendGift: (gift: Gift) => void;
}

export const GiftPanel: React.FC<GiftPanelProps> = ({ isOpen, onClose, onSendGift }) => {
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const { toast } = useToast();
  
  const gifts: Gift[] = [
    {
      id: 'heart',
      name: 'Cœur',
      icon: <Heart className="h-6 w-6 text-red-500" />,
      price: 1.99,
      description: "Montrez votre appréciation",
      color: "bg-red-100 dark:bg-red-900/30 text-red-500 border-red-300"
    },
    {
      id: 'star',
      name: 'Étoile',
      icon: <Star className="h-6 w-6 text-amber-500" />,
      price: 4.99,
      description: "Pour les contenus qui brillent",
      color: "bg-amber-100 dark:bg-amber-900/30 text-amber-500 border-amber-300"
    },
    {
      id: 'gem',
      name: 'Gemme',
      icon: <Gem className="h-6 w-6 text-blue-500" />,
      price: 9.99,
      description: "Un contenu de grande valeur",
      color: "bg-blue-100 dark:bg-blue-900/30 text-blue-500 border-blue-300"
    },
    {
      id: 'diamond',
      name: 'Diamant',
      icon: <Diamond className="h-6 w-6 text-cyan-500" />,
      price: 19.99,
      description: "Pour les créations exceptionnelles",
      color: "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-500 border-cyan-300"
    },
    {
      id: 'crown',
      name: 'Couronne',
      icon: <Crown className="h-6 w-6 text-purple-500" />,
      price: 29.99,
      description: "Récompensez la royauté du contenu",
      color: "bg-purple-100 dark:bg-purple-900/30 text-purple-500 border-purple-300"
    },
    {
      id: 'sparkles',
      name: 'Étincelles',
      icon: <Sparkles className="h-6 w-6 text-yellow-500" />,
      price: 49.99,
      description: "Pour les moments magiques",
      color: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-500 border-yellow-300"
    },
    {
      id: 'trophy',
      name: 'Trophée',
      icon: <Trophy className="h-6 w-6 text-emerald-500" />,
      price: 99.99,
      description: "Pour les plus grands achievements",
      color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 border-emerald-300"
    }
  ];
  
  const handleSendGift = () => {
    if (!selectedGift) {
      toast("Aucun cadeau sélectionné", {
        description: "Veuillez sélectionner un cadeau à envoyer",
        variant: "destructive",
      });
      return;
    }
    
    onSendGift(selectedGift);
    
    toast("Cadeau envoyé", {
      description: `Vous avez envoyé un(e) ${selectedGift.name} (${selectedGift.price} USDT)`,
    });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Envoyer un cadeau</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <ScrollArea className="h-80">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {gifts.map((gift) => (
                <div 
                  key={gift.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all flex flex-col items-center ${
                    selectedGift?.id === gift.id 
                      ? `${gift.color} border-2` 
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => setSelectedGift(gift)}
                >
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white dark:bg-gray-800 mb-2 shadow-md">
                    {gift.icon}
                  </div>
                  <h3 className="font-medium text-center">{gift.name}</h3>
                  <p className="text-sm text-muted-foreground mb-1 text-center">{gift.description}</p>
                  <span className="font-bold">{gift.price} USDT</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Annuler
          </Button>
          <Button 
            onClick={handleSendGift} 
            disabled={!selectedGift}
            className="w-full sm:w-auto"
          >
            <Gift className="mr-2 h-4 w-4" />
            Envoyer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
