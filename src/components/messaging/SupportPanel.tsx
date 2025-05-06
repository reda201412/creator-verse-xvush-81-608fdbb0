
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose, DrawerFooter } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Zap, Shield, Star, Gift, Trophy, ThumbsUp } from 'lucide-react';
import { MonetizationTier } from '@/types/messaging';
import { cn } from '@/lib/utils';
import { useNeuroAesthetic } from '@/hooks/use-neuro-aesthetic';

interface SupportPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (data: any) => void;
}

export const SupportPanel: React.FC<SupportPanelProps> = ({
  isOpen,
  onClose,
  onApply
}) => {
  const [tab, setTab] = useState<'niveau' | 'montant'>('niveau');
  const [tier, setTier] = useState<MonetizationTier>('premium');
  const [price, setPrice] = useState(1.99);
  const { triggerMicroReward } = useNeuroAesthetic();

  const handleApply = () => {
    triggerMicroReward('award');
    onApply({
      tier,
      price,
      currency: 'EUR',
      instantPayoutEnabled: true,
      accessControl: {
        isGated: tier !== 'free',
        requiredTier: tier
      },
      analytics: {
        views: 0,
        revenue: 0,
        conversionRate: 0,
        engagementTime: 0
      }
    });
  };
  
  const tierOptions: {value: MonetizationTier, label: string, description: string, icon: React.ReactNode}[] = [
    { 
      value: 'basic', 
      label: 'Encouragement', 
      description: 'Un petit coup de pouce', 
      icon: <ThumbsUp size={16} className="text-blue-500" />
    },
    { 
      value: 'premium', 
      label: 'Soutien', 
      description: 'Montrez votre appréciation',
      icon: <Heart size={16} className="text-pink-500" />
    },
    { 
      value: 'vip', 
      label: 'Super Fan', 
      description: 'Devenez un supporter privilégié',
      icon: <Star size={16} className="text-amber-500" />
    },
    { 
      value: 'exclusive', 
      label: 'Champion', 
      description: 'Soutien exceptionnel',
      icon: <Trophy size={16} className="text-purple-500" />
    }
  ];

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="bg-white text-gray-800 border-t border-gray-200 max-h-[85vh]">
        <DrawerHeader className="border-b border-gray-200">
          <DrawerTitle className="flex items-center gap-2">
            <Heart size={20} className="text-rose-500" />
            <span>Soutenir le créateur</span>
          </DrawerTitle>
        </DrawerHeader>
        
        <div className="p-4">
          <Tabs defaultValue="niveau" value={tab} onValueChange={(v) => setTab(v as any)}>
            <TabsList className="w-full bg-gray-100 border border-gray-200">
              <TabsTrigger value="niveau" className="data-[state=active]:bg-white">Niveau de soutien</TabsTrigger>
              <TabsTrigger value="montant" className="data-[state=active]:bg-white">Montant</TabsTrigger>
            </TabsList>
            
            <TabsContent value="niveau" className="mt-4">
              <RadioGroup 
                value={tier} 
                onValueChange={(value) => {
                  setTier(value as MonetizationTier);
                  triggerMicroReward('select');
                }}
                className="space-y-4"
              >
                {tierOptions.map((option) => (
                  <div key={option.value} className="flex items-start gap-2">
                    <RadioGroupItem 
                      id={`tier-${option.value}`} 
                      value={option.value} 
                      className="mt-1 border-gray-300 text-purple-600" 
                    />
                    <div className="flex-1">
                      <div className="flex items-center">
                        {option.icon}
                        <Label 
                          htmlFor={`tier-${option.value}`} 
                          className="ml-2 font-medium"
                        >
                          {option.label}
                        </Label>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {option.description}
                      </p>
                      <div className={cn(
                        "mt-2 p-2 rounded-lg text-xs",
                        option.value === 'basic' ? "bg-blue-50 border border-blue-200" :
                        option.value === 'premium' ? "bg-pink-50 border border-pink-200" :
                        option.value === 'vip' ? "bg-amber-50 border border-amber-200" :
                        "bg-purple-50 border border-purple-200"
                      )}>
                        {option.value === 'basic' && "Message affiché en priorité"}
                        {option.value === 'premium' && "Message affiché en priorité + badge spécial"}
                        {option.value === 'vip' && "Message spécial + remerciements personnalisés"}
                        {option.value === 'exclusive' && "Message exceptionnel + contact privilégié"}
                      </div>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </TabsContent>
            
            <TabsContent value="montant" className="mt-4 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Montant du soutien</Label>
                  <div className="text-xl font-bold text-purple-600">{price.toFixed(2)}€</div>
                </div>
                
                <Slider 
                  value={[price]}
                  min={0.99}
                  max={49.99}
                  step={0.5}
                  onValueChange={([value]) => {
                    setPrice(value);
                    triggerMicroReward('interact');
                  }}
                  className="py-4"
                />
                
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0.99€</span>
                  <span>49.99€</span>
                </div>
              </div>
              
              <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
                <div className="flex items-center mb-2">
                  <Trophy size={16} className="text-purple-500 mr-2" />
                  <h4 className="font-medium">Impact de votre soutien</h4>
                </div>
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                  <div className="text-gray-600">Votre soutien:</div>
                  <div className="font-medium text-right">{price.toFixed(2)}€</div>
                  
                  <div className="text-gray-600">Contribution à l'artiste:</div>
                  <div className="font-medium text-right">{(price * 0.85).toFixed(2)}€</div>
                  
                  <div className="text-gray-600">Votre nouveau niveau:</div>
                  <div className="font-medium text-purple-600 text-right">
                    {price < 2 ? "Supporter" : 
                     price < 5 ? "Fan" : 
                     price < 10 ? "Super Fan" : 
                     price < 20 ? "Champion" : "Légende"}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-3 mt-4">
            <h4 className="font-medium text-sm mb-2">Aperçu de votre soutien</h4>
            <div className={cn(
              "px-4 py-3 rounded-xl inline-block",
              tier === 'basic' ? "bg-blue-100 border border-blue-200" :
              tier === 'premium' ? "bg-pink-100 border border-pink-200" :
              tier === 'vip' ? "bg-amber-100 border border-amber-200" :
              "bg-purple-100 border border-purple-200"
            )}>
              <div className="flex items-center gap-2">
                {tier === 'basic' && <ThumbsUp size={14} className="text-blue-600" />}
                {tier === 'premium' && <Heart size={14} className="text-pink-600" />}
                {tier === 'vip' && <Star size={14} className="text-amber-600" />}
                {tier === 'exclusive' && <Trophy size={14} className="text-purple-600" />}
                <span className="text-sm text-gray-800 font-medium">Message soutenu</span>
              </div>
              <div className="text-xs mt-1 text-gray-600">
                {tierOptions.find(t => t.value === tier)?.label} · {price.toFixed(2)}€
              </div>
            </div>
          </div>
        </div>
        
        <DrawerFooter className="border-t border-gray-200 pt-4">
          <Button 
            onClick={handleApply}
            className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white"
          >
            Envoyer mon soutien
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" className="border-gray-300 text-gray-700">
              Annuler
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
