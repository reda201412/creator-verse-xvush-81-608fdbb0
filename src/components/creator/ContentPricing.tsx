import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Coins, Check, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ContentPrice } from '@/types/monetization';
import { toast } from 'sonner';

type PricingModel = 'subscription' | 'one-time' | 'free';

interface Tier {
  id: string;
  name: string;
  price: number;
  description: string;
}

const ContentPricing = () => {
  const [pricingModel, setPricingModel] = useState<PricingModel>('subscription');
  const [tierCount, setTierCount] = useState(3);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [premium, setPremium] = useState(false);
  
  const [tiers, setTiers] = useState<Tier[]>([
    { id: 'tier-1', name: 'Basic', price: 4.99, description: 'Accès de base au contenu.' },
    { id: 'tier-2', name: 'Standard', price: 9.99, description: 'Accès standard et avantages supplémentaires.' },
    { id: 'tier-3', name: 'Premium', price: 19.99, description: 'Accès premium avec contenu exclusif.' },
  ]);

  const addTier = () => {
    const newTier: Tier = {
      id: `tier-${Date.now()}`,
      name: `Tier ${tiers.length + 1}`,
      price: 9.99,
      description: 'Nouvelle description de niveau.'
    };
    setTiers([...tiers, newTier]);
    setTierCount(tiers.length + 1);
  };

  const removeTier = (id: string) => {
    if (tiers.length <= 1) return;
    setTiers(tiers.filter(tier => tier.id !== id));
    setTierCount(tiers.length - 1);
  };

  const updateTier = (id: string, updatedTier: Partial<Tier>) => {
    setTiers(tiers.map(tier => tier.id === id ? { ...tier, ...updatedTier } : tier));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tarification du contenu</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="pricing-model">Modèle de tarification</Label>
          <Select value={pricingModel} onValueChange={(value) => setPricingModel(value as PricingModel)}>
            <SelectTrigger id="pricing-model">
              <SelectValue placeholder="Sélectionner un modèle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="subscription">Abonnement</SelectItem>
              <SelectItem value="one-time">Achat unique</SelectItem>
              <SelectItem value="free">Gratuit</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {pricingModel === 'subscription' && (
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="tier-count">Nombre de niveaux</Label>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" onClick={() => setTierCount(Math.max(1, tierCount - 1))}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span>{tierCount}</span>
                <Button variant="outline" size="icon" onClick={() => setTierCount(Math.min(5, tierCount + 1))}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {tiers.map((tier) => (
              <div key={tier.id} className="grid gap-2 border rounded-md p-4">
                <div className="flex justify-between items-center">
                  <Label htmlFor={`tier-name-${tier.id}`}>Niveau {tiers.indexOf(tier) + 1}</Label>
                  <Button variant="ghost" size="icon" onClick={() => removeTier(tier.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Input
                  type="text"
                  id={`tier-name-${tier.id}`}
                  value={tier.name}
                  onChange={(e) => updateTier(tier.id, { name: e.target.value })}
                />
                <Label htmlFor={`tier-price-${tier.id}`}>Prix</Label>
                <Input
                  type="number"
                  id={`tier-price-${tier.id}`}
                  value={tier.price}
                  onChange={(e) => updateTier(tier.id, { price: parseFloat(e.target.value) })}
                />
                <Label htmlFor={`tier-description-${tier.id}`}>Description</Label>
                <Textarea
                  id={`tier-description-${tier.id}`}
                  value={tier.description}
                  onChange={(e) => updateTier(tier.id, { description: e.target.value })}
                />
              </div>
            ))}

            {tiers.length < 5 && (
              <Button variant="secondary" onClick={addTier}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un niveau
              </Button>
            )}
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Switch id="premium" checked={premium} onCheckedChange={setPremium} />
          <Label htmlFor="premium">Contenu Premium</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch id="advanced" checked={showAdvanced} onCheckedChange={setShowAdvanced} />
          <Label htmlFor="advanced">Paramètres avancés</Label>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="secondary" onClick={() => toast('Feature coming soon!')}>
          <Lock className="h-4 w-4 mr-2" />
          <span>Monetiser le contenu</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ContentPricing;
