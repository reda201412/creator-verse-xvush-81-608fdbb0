
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface SupportPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (data: { tier: string; price: number; currency: string }) => void;
}

const SupportPanel: React.FC<SupportPanelProps> = ({
  isOpen,
  onClose,
  onApply
}) => {
  const [selectedTierIndex, setSelectedTierIndex] = useState(1);
  const [customAmount, setCustomAmount] = useState('');
  const tiers = [
    { name: 'Basic', value: 'basic', amount: 1.99 },
    { name: 'Premium', value: 'premium', amount: 4.99 },
    { name: 'VIP', value: 'vip', amount: 9.99 },
    { name: 'Exclusive', value: 'exclusive', amount: 19.99 }
  ];
  
  const handleApply = () => {
    const tier = tiers[selectedTierIndex];
    const finalAmount = customAmount ? parseFloat(customAmount) : tier.amount;
    
    onApply({
      tier: tier.value,
      price: finalAmount,
      currency: 'USDT'
    });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Soutenir ce créateur</DialogTitle>
          <DialogDescription>
            Choisissez un montant ou entrez une valeur personnalisée pour soutenir ce créateur.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-3 gap-2">
            <RadioGroup defaultValue={tiers[1].value} onValueChange={(value) => {
              const index = tiers.findIndex(tier => tier.value === value);
              setSelectedTierIndex(index);
            }}>
              {tiers.map((tier, index) => (
                <div key={tier.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={tier.value} id={`tier${index}`} />
                  <Label htmlFor={`tier${index}`}>{tier.name} ({tier.amount}€)</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="customAmount" className="text-right">
              Montant personnalisé
            </Label>
            <Input
              type="number"
              id="customAmount"
              placeholder="0.00"
              className="col-span-3"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
            />
          </div>
        </div>
        <Button onClick={handleApply}>Soutenir</Button>
      </DialogContent>
    </Dialog>
  );
};

export default SupportPanel;
