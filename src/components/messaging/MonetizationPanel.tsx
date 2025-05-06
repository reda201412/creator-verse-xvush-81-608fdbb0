
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose, DrawerFooter } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CircleDollarSign, Zap, Shield, Lock, Star } from 'lucide-react';
import { MonetizationTier } from '@/types/messaging';
import { cn } from '@/lib/utils';

interface MonetizationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (data: any) => void;
}

export const MonetizationPanel: React.FC<MonetizationPanelProps> = ({
  isOpen,
  onClose,
  onApply
}) => {
  const [tab, setTab] = useState<'price' | 'tier'>('tier');
  const [tier, setTier] = useState<MonetizationTier>('premium');
  const [price, setPrice] = useState(1.99);
  
  const handleApply = () => {
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
      label: 'Basic', 
      description: 'Message payant simple', 
      icon: <Zap size={16} className="text-blue-400" />
    },
    { 
      value: 'premium', 
      label: 'Premium', 
      description: 'Contenu de qualité supérieure',
      icon: <Star size={16} className="text-amber-400" />
    },
    { 
      value: 'vip', 
      label: 'VIP', 
      description: 'Contenu exclusif personnalisé',
      icon: <Shield size={16} className="text-purple-400" />
    },
    { 
      value: 'exclusive', 
      label: 'Exclusive', 
      description: 'Contenu ultra-premium éphémère',
      icon: <Lock size={16} className="text-green-400" />
    }
  ];

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="bg-black text-white border-t border-white/10 max-h-[85vh]">
        <DrawerHeader className="border-b border-white/10">
          <DrawerTitle className="flex items-center gap-2">
            <CircleDollarSign size={20} className="text-amber-400" />
            <span>Monétiser votre message</span>
          </DrawerTitle>
        </DrawerHeader>
        
        <div className="p-4">
          <Tabs defaultValue="tier" value={tab} onValueChange={(v) => setTab(v as any)}>
            <TabsList className="w-full bg-white/5 border border-white/10">
              <TabsTrigger value="tier" className="data-[state=active]:bg-white/10">Niveau</TabsTrigger>
              <TabsTrigger value="price" className="data-[state=active]:bg-white/10">Prix</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tier" className="mt-4">
              <RadioGroup 
                value={tier} 
                onValueChange={(value) => setTier(value as MonetizationTier)}
                className="space-y-4"
              >
                {tierOptions.map((option) => (
                  <div key={option.value} className="flex items-start gap-2">
                    <RadioGroupItem 
                      id={`tier-${option.value}`} 
                      value={option.value} 
                      className="mt-1 border-white/20 text-purple-400" 
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
                      <p className="text-xs text-white/60 mt-1">
                        {option.description}
                      </p>
                      <div className={cn(
                        "mt-2 p-2 rounded-lg text-xs",
                        option.value === 'basic' ? "bg-blue-900/20 border border-blue-500/30" :
                        option.value === 'premium' ? "bg-amber-900/20 border border-amber-500/30" :
                        option.value === 'vip' ? "bg-purple-900/20 border border-purple-500/30" :
                        "bg-green-900/20 border border-green-500/30"
                      )}>
                        {option.value === 'basic' && "Visibilité standard"}
                        {option.value === 'premium' && "Meilleure visibilité + statistiques"}
                        {option.value === 'vip' && "Traitement prioritaire + analytics avancées"}
                        {option.value === 'exclusive' && "Message éphémère + paiement instantané"}
                      </div>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </TabsContent>
            
            <TabsContent value="price" className="mt-4 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Prix du message</Label>
                  <div className="text-xl font-bold text-amber-400">{price.toFixed(2)}€</div>
                </div>
                
                <Slider 
                  value={[price]}
                  min={0.99}
                  max={49.99}
                  step={0.5}
                  onValueChange={([value]) => setPrice(value)}
                  className="py-4"
                />
                
                <div className="flex justify-between text-xs text-white/60">
                  <span>0.99€</span>
                  <span>49.99€</span>
                </div>
              </div>
              
              <div className="p-3 rounded-lg bg-amber-900/20 border border-amber-500/30">
                <div className="flex items-center mb-2">
                  <Zap size={16} className="text-amber-400 mr-2" />
                  <h4 className="font-medium">Estimation de revenus</h4>
                </div>
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                  <div className="text-white/60">Prix du message:</div>
                  <div className="font-medium text-right">{price.toFixed(2)}€</div>
                  
                  <div className="text-white/60">Frais de plateforme:</div>
                  <div className="font-medium text-right">{(price * 0.15).toFixed(2)}€</div>
                  
                  <div className="text-white/60">Vos gains:</div>
                  <div className="font-medium text-amber-400 text-right">{(price * 0.85).toFixed(2)}€</div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="bg-white/5 rounded-lg border border-white/10 p-3 mt-4">
            <h4 className="font-medium text-sm mb-2">Aperçu</h4>
            <div className={cn(
              "px-4 py-3 rounded-xl inline-block",
              tier === 'basic' ? "bg-blue-600/50 border border-blue-400/50" :
              tier === 'premium' ? "bg-amber-600/50 border border-amber-400/50" :
              tier === 'vip' ? "bg-purple-600/50 border border-purple-400/50" :
              "bg-green-600/50 border border-green-400/50"
            )}>
              <div className="flex items-center gap-2">
                {tier === 'basic' && <Zap size={14} className="text-blue-200" />}
                {tier === 'premium' && <Star size={14} className="text-amber-200" />}
                {tier === 'vip' && <Shield size={14} className="text-purple-200" />}
                {tier === 'exclusive' && <Lock size={14} className="text-green-200" />}
                <span className="text-sm">Message monétisé</span>
              </div>
              <div className="text-xs mt-1 text-white/80">
                {tier} · {price.toFixed(2)}€
              </div>
            </div>
          </div>
        </div>
        
        <DrawerFooter className="border-t border-white/10 pt-4">
          <Button 
            onClick={handleApply}
            className="bg-gradient-to-r from-purple-600 to-amber-500 hover:from-purple-700 hover:to-amber-600 text-white"
          >
            Appliquer
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
