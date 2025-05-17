
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { DollarSign, Users, TrendingUp, Lock } from 'lucide-react';
import TripleShieldSecurity from '../TripleShieldSecurity';
import { VideoFormValues } from './useVideoUpload';
import { useFormContext } from 'react-hook-form';

interface MonetizationPreviewProps {
  className?: string;
}

const MonetizationPreview: React.FC<MonetizationPreviewProps> = ({ className }) => {
  const form = useFormContext<VideoFormValues>();
  const videoType = form.watch('videoType');
  const tokenPrice = form.watch('tokenPrice') || 0;
  const allowSharing = form.watch('allowSharing');
  const allowDownload = form.watch('allowDownload');

  const [estimatedRevenue, setEstimatedRevenue] = useState({
    min: 0,
    max: 0,
    subscribers: 0,
    oneTime: 0
  });
  
  // Dynamic security level based on video type
  const securityLevel = 
    videoType === 'vip' ? 3 : 
    videoType === 'premium' ? 2 :
    videoType === 'teaser' ? 1 : 1;
  
  // Calculate estimated revenue based on type and price
  useEffect(() => {
    let subscriberBase = 100; // Example base number
    let conversionRate = 0;
    let minPrice = 0;
    let maxPrice = 0;
    
    switch (videoType) {
      case 'vip':
        conversionRate = 0.05; // 5% conversion
        minPrice = tokenPrice || 20;
        maxPrice = tokenPrice || 30;
        break;
      case 'premium':
        conversionRate = 0.10; // 10% conversion
        minPrice = tokenPrice || 10;
        maxPrice = tokenPrice || 15;
        break;
      case 'teaser':
        conversionRate = 0.15; // 15% conversion
        minPrice = tokenPrice || 5;
        maxPrice = tokenPrice || 7;
        break;
      default:
        conversionRate = 0;
        minPrice = 0;
        maxPrice = 0;
    }
    
    // Apply pricing adjustments based on options
    if (!allowSharing) {
      subscriberBase *= 0.85; // Reduce by 15%
    }
    
    if (allowDownload) {
      minPrice *= 1.3; // Increase by 30%
      maxPrice *= 1.3;
    }
    
    const potentialBuyers = Math.round(subscriberBase * conversionRate);
    const minRevenue = Math.round(potentialBuyers * minPrice);
    const maxRevenue = Math.round(potentialBuyers * maxPrice);
    
    setEstimatedRevenue({
      min: minRevenue,
      max: maxRevenue,
      subscribers: Math.round(subscriberBase * 0.3), // Subscription revenue
      oneTime: Math.round((minRevenue + maxRevenue) / 2) // Average one-time revenue
    });
    
  }, [videoType, tokenPrice, allowSharing, allowDownload]);
  
  return (
    <div className={className}>
      <Tabs defaultValue="preview">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="preview">
            <TrendingUp className="w-4 h-4 mr-2" />
            Prévisions
          </TabsTrigger>
          <TabsTrigger value="security">
            <Lock className="w-4 h-4 mr-2" />
            Sécurité
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Prévisions de Revenus
              </CardTitle>
              <CardDescription>
                Estimations basées sur vos réglages actuels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary/10 rounded-lg p-3">
                  <div className="flex items-center text-xs text-muted-foreground mb-1">
                    <DollarSign className="h-3 w-3 mr-1" />
                    Revenus uniques
                  </div>
                  <div className="text-lg font-semibold">
                    {estimatedRevenue.oneTime} tokens
                  </div>
                </div>
                
                <div className="bg-primary/10 rounded-lg p-3">
                  <div className="flex items-center text-xs text-muted-foreground mb-1">
                    <Users className="h-3 w-3 mr-1" />
                    Revenus abonnements
                  </div>
                  <div className="text-lg font-semibold">
                    {estimatedRevenue.subscribers} tokens
                  </div>
                </div>
              </div>
              
              <div className="pt-2">
                <h4 className="text-sm font-medium mb-2">Potentiel total</h4>
                <div className="bg-muted/50 p-3 rounded-lg text-center">
                  <div className="text-xs text-muted-foreground mb-1">
                    Estimation de revenus
                  </div>
                  <div className="text-xl font-bold">
                    {estimatedRevenue.min} - {estimatedRevenue.max} tokens
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Optimisations</CardTitle>
              <CardDescription>
                Suggestions pour maximiser vos revenus
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {videoType === 'standard' && (
                <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium">Passez au Premium</h4>
                    <p className="text-sm text-muted-foreground">
                      Monétisez votre contenu en passant en mode Premium pour générer des revenus.
                    </p>
                  </div>
                </div>
              )}
              
              {!allowDownload && videoType !== 'standard' && (
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium">Activer les téléchargements</h4>
                    <p className="text-sm text-muted-foreground">
                      Augmentez le prix et les revenus en permettant le téléchargement aux acheteurs.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Protection du Contenu</CardTitle>
              <CardDescription>
                Niveau de protection actuel: {
                  securityLevel === 3 ? 'Maximum (VIP)' :
                  securityLevel === 2 ? 'Élevé (Premium)' :
                  'Standard'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <TripleShieldSecurity 
                level={securityLevel as 1 | 2 | 3}
                size="md"
                showLabels={true}
              />
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="watermark"
                    checked={videoType !== 'standard'}
                    disabled={true}
                  />
                  <Label htmlFor="watermark">Filigrane invisible</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="piracy-detection"
                    checked={videoType === 'premium' || videoType === 'vip'}
                    disabled={true}
                  />
                  <Label htmlFor="piracy-detection">Détection de copie d'écran</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="encryption"
                    checked={videoType === 'vip'}
                    disabled={true}
                  />
                  <Label htmlFor="encryption">Chiffrement de bout en bout</Label>
                </div>
              </div>
              
              <div className="pt-2">
                <h4 className="text-sm font-medium mb-2">Niveau de Protection</h4>
                <Slider
                  value={[securityLevel]}
                  min={1}
                  max={3}
                  step={1}
                  disabled
                  className="mb-3"
                />
                <p className="text-xs text-muted-foreground text-center">
                  {securityLevel === 1 && "Protection standard adaptée au contenu gratuit"}
                  {securityLevel === 2 && "Protection avancée pour contenu premium"}
                  {securityLevel === 3 && "Protection maximale pour contenu exclusif"}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MonetizationPreview;
