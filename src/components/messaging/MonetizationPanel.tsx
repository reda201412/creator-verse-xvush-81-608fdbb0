import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { MonetizationTier } from '@/types/messaging';
import { Zap, Lock, Sparkles, Crown, Diamond } from 'lucide-react';

interface MonetizationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (data: {
    tier: MonetizationTier;
    price: number;
  }) => void;
  defaultTier?: MonetizationTier;
  defaultAmount?: number;
}

const MonetizationPanel: React.FC<MonetizationPanelProps> = ({
  isOpen,
  onClose,
  onApply,
  defaultTier = 'basic',
  defaultAmount = 1.99
}) => {
  const [selectedTier, setSelectedTier] = React.useState<MonetizationTier>(defaultTier);
  const [customAmount, setCustomAmount] = React.useState<string>(defaultAmount.toString());
  
  const tiers = [
    { 
      value: 'basic' as MonetizationTier, 
      label: 'Basic', 
      description: 'Message monétisé standard',
      icon: <Zap className="h-4 w-4" />,
      defaultPrice: 1.99
    },
    { 
      value: 'premium' as MonetizationTier, 
      label: 'Premium', 
      description: 'Contenu exclusif de qualité',
      icon: <Sparkles className="h-4 w-4" />,
      defaultPrice: 4.99
    },
    { 
      value: 'vip' as MonetizationTier, 
      label: 'VIP', 
      description: 'Expérience personnalisée',
      icon: <Crown className="h-4 w-4" />,
      defaultPrice: 9.99
    },
    { 
      value: 'exclusive' as MonetizationTier, 
      label: 'Exclusive', 
      description: 'Contenu ultra-premium',
      icon: <Diamond className="h-4 w-4" />,
      defaultPrice: 19.99
    }
  ];
  
  const handleTierChange = (value: MonetizationTier) => {
    setSelectedTier(value);
    const tier = tiers.find(t => t.value === value);
    if (tier) {
      setCustomAmount(tier.defaultPrice.toString());
    }
  };
  
  const handleApply = () => {
    const amount = parseFloat(customAmount);
    if (isNaN(amount) || amount <= 0) return;
    
    onApply({
      tier: selectedTier,
      price: amount
    });
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-lg flex items-center gap-2">
          <Zap className="h-5 w-5 text-amber-500" />
          Monétiser ce message
        </h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Annuler
        </Button>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium mb-2 block">Niveau de monétisation</Label>
          <RadioGroup 
            value={selectedTier} 
            onValueChange={(value) => handleTierChange(value as MonetizationTier)}
            className="grid grid-cols-2 gap-2"
          >
            {tiers.map((tier) => (
              <div key={tier.value} className="flex items-start space-x-2">
                <RadioGroupItem value={tier.value} id={tier.value} />
                <Label 
                  htmlFor={tier.value}
                  className="flex flex-col cursor-pointer"
                >
                  <span className="font-medium flex items-center gap-1">
                    {tier.icon}
                    {tier.label}
                  </span>
                  <span className="text-xs text-muted-foreground">{tier.description}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        <div>
          <Label htmlFor="amount" className="text-sm font-medium mb-2 block">
            Prix ({customAmount} €)
          </Label>
          <div className="flex items-center gap-4">
            <Slider
              id="price-slider"
              min={0.99}
              max={99.99}
              step={0.5}
              value={[parseFloat(customAmount) || 1.99]}
              onValueChange={(values) => setCustomAmount(values[0].toString())}
              className="flex-1"
            />
            <Input
              type="number"
              id="amount"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="w-20"
              min={0.99}
              step={0.5}
            />
          </div>
        </div>
        
        <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg text-sm text-amber-800 dark:text-amber-300 flex items-start gap-2">
          <Lock className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <p>
            Les messages monétisés ne sont accessibles qu'après paiement par le destinataire.
            Vous recevrez {(parseFloat(customAmount) * 0.85).toFixed(2)}€ après frais de plateforme.
          </p>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={handleApply}>
            <Zap className="mr-2 h-4 w-4" />
            Appliquer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MonetizationPanel;
