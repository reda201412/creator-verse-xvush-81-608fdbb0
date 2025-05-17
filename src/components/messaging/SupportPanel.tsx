
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Heart, Zap, Star, Trophy } from 'lucide-react';
import { MonetizationTier } from '@/types/messaging';

interface SupportPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (data: any) => void;
}

export const SupportPanel: React.FC<SupportPanelProps> = ({ isOpen, onClose, onApply }) => {
  const [selectedTier, setSelectedTier] = useState<MonetizationTier>('basic');
  const [amount, setAmount] = useState(1.99);
  const { toast } = useToast();
  
  const tiers = [
    { 
      id: 'basic', 
      name: 'Basic', 
      icon: <Heart className="h-5 w-5 text-red-500" />,
      minAmount: 1.99,
      description: "Un petit soutien pour encourager" 
    },
    { 
      id: 'premium', 
      name: 'Premium', 
      icon: <Zap className="h-5 w-5 text-yellow-500" />,
      minAmount: 4.99,
      description: "Soutenez le contenu que vous aimez" 
    },
    { 
      id: 'vip', 
      name: 'VIP', 
      icon: <Star className="h-5 w-5 text-purple-500" />,
      minAmount: 9.99,
      description: "Montrez que vous êtes un super fan" 
    },
    { 
      id: 'exclusive', 
      name: 'Exclusive', 
      icon: <Trophy className="h-5 w-5 text-amber-500" />,
      minAmount: 19.99,
      description: "Soutien exceptionnel avec accès VIP" 
    }
  ];
  
  const currentTier = tiers.find(tier => tier.id === selectedTier) || tiers[0];
  
  const handleTierChange = (tier: string) => {
    const selected = tier as MonetizationTier;
    setSelectedTier(selected);
    
    // Adjust amount based on minimum for tier
    const tierData = tiers.find(t => t.id === selected);
    if (tierData && amount < tierData.minAmount) {
      setAmount(tierData.minAmount);
    }
  };
  
  const handleApply = () => {
    // Validate wallet balance here in a real app
    
    onApply({
      tier: selectedTier,
      price: amount,
      currency: 'USDT',
    });
    
    toast({
      title: "Message de soutien",
      description: `Vous avez ajouté un soutien de ${amount} USDT (${selectedTier})`,
    });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Soutenir le créateur</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <Tabs defaultValue="basic" value={selectedTier} onValueChange={handleTierChange}>
            <TabsList className="grid grid-cols-4 mb-4">
              {tiers.map(tier => (
                <TabsTrigger 
                  key={tier.id} 
                  value={tier.id}
                  className="flex flex-col items-center py-2 px-1"
                >
                  {tier.icon}
                  <span className="text-xs mt-1">{tier.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            
            {tiers.map(tier => (
              <TabsContent key={tier.id} value={tier.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium flex items-center">
                      {tier.icon}
                      <span className="ml-2">{tier.name}</span>
                    </h3>
                    <p className="text-sm text-muted-foreground">{tier.description}</p>
                  </div>
                  <div className="text-lg font-bold">
                    ${tier.minAmount}+
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Montant (USDT)</label>
                    <span className="text-sm font-bold">{amount} USDT</span>
                  </div>
                  
                  <Slider
                    value={[amount]}
                    min={tier.minAmount}
                    max={100}
                    step={0.01}
                    onValueChange={(values) => setAmount(values[0])}
                    className="py-4"
                  />
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Annuler
          </Button>
          <Button onClick={handleApply} className="w-full sm:w-auto">
            Appliquer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
