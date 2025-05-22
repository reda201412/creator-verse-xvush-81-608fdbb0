import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coins, Lock, Unlock, CreditCard, Copy } from 'lucide-react';
import { ContentPrice } from '@/types/monetization';
import { toast } from 'sonner';
import { useNeuroAesthetic } from '@/hooks/use-neuro-aesthetic';
import ContentPurchaseModal from '@/components/monetization/ContentPurchaseModal';
import { useTronWallet } from '@/hooks/use-tron-wallet';

interface ContentPricingProps {
  contentId: string;
  title: string;
  pricing: ContentPrice;
  thumbnailUrl: string;
  userSubscriptionTier?: string;
  userTokenBalance?: number;
  onPurchase: () => void;
  onSubscribe: () => void;
  className?: string;
}

const ContentPricing: React.FC<ContentPricingProps> = ({
  contentId,
  title,
  pricing,
  thumbnailUrl,
  userSubscriptionTier = 'free',
  userTokenBalance = 0,
  onPurchase,
  onSubscribe,
  className
}) => {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const { triggerMicroReward } = useNeuroAesthetic();
  const { checkContentAccess } = useTronWallet();
  const [hasAccess, setHasAccess] = useState(false);
  
  // Check if user can access the content with their subscription
  const canAccessWithSubscription = () => {
    if (!pricing.requiredTier) return true;
    
    const tierLevels = {
      'free': 0,
      'fan': 1,
      'superfan': 2,
      'vip': 3,
      'exclusive': 4
    };
    
    return tierLevels[userSubscriptionTier as keyof typeof tierLevels] >= 
           tierLevels[pricing.requiredTier as keyof typeof tierLevels];
  };
  
  // Check if user has enough tokens
  const hasEnoughTokens = () => {
    if (!pricing.tokenPrice) return true;
    
    // Apply subscription discount if applicable
    let finalPrice = pricing.tokenPrice;
    if (userSubscriptionTier !== 'free' && pricing.discountForSubscribers) {
      finalPrice = Math.floor(finalPrice * (1 - (pricing.discountForSubscribers / 100)));
    }
    
    return userTokenBalance >= finalPrice;
  };
  
  // Get final token price with any discount applied
  const getFinalTokenPrice = () => {
    if (!pricing.tokenPrice) return 0;
    
    if (userSubscriptionTier !== 'free' && pricing.discountForSubscribers) {
      return Math.floor(pricing.tokenPrice * (1 - (pricing.discountForSubscribers / 100)));
    }
    
    return pricing.tokenPrice;
  };
  
  // Open purchase modal
  const handleOpenPurchaseModal = () => {
    setIsPurchaseModalOpen(true);
    triggerMicroReward('action');
  };
  
  // Handle purchase completion
  const handlePurchaseComplete = () => {
    setHasAccess(true);
    onPurchase();
    triggerMicroReward('action');
  };
  
  // Handle subscription
  const handleSubscribe = () => {
    onSubscribe();
    triggerMicroReward('opportunity');
  };
  
  // Get pricing display message
  const getPricingMessage = () => {
    switch (pricing.type) {
      case 'free':
        return 'Contenu gratuit';
      case 'subscription':
        return `Abonnement ${pricing.requiredTier} requis`;
      case 'token':
        return `${pricing.tokenPrice} tokens`;
      case 'hybrid':
        return `${pricing.tokenPrice} tokens ou abonnement ${pricing.requiredTier}`;
      default:
        return '';
    }
  };

  // Get pricing badge variant
  const getPricingBadgeVariant = () => {
    switch (pricing.type) {
      case 'free': return 'outline';
      case 'subscription': return 'secondary';
      case 'token': return 'default';
      case 'hybrid': return 'destructive';
      default: return 'default';
    }
  };
  
  // Check if content is accessible to the user
  const isAccessible = () => {
    if (hasAccess) return true;
    if (pricing.type === 'free') return true;
    if (pricing.type === 'subscription') return canAccessWithSubscription();
    if (pricing.type === 'token') return hasEnoughTokens();
    if (pricing.type === 'hybrid') return canAccessWithSubscription() || hasEnoughTokens();
    return false;
  };
  
  return (
    <>
      <Card className={className}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">Accès au contenu</CardTitle>
            <Badge variant={getPricingBadgeVariant()}>
              {getPricingMessage()}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <div className="relative rounded-md overflow-hidden">
              <img 
                src={thumbnailUrl} 
                alt={title}
                className="w-full h-40 object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                {isAccessible() ? (
                  <Unlock size={40} className="text-green-500" />
                ) : (
                  <Lock size={40} className="text-white" />
                )}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-sm mb-1">{title}</h3>
              
              {pricing.type !== 'free' && (
                <div className="text-xs text-muted-foreground mb-4">
                  {pricing.type === 'subscription' || pricing.type === 'hybrid' ? (
                    <div className="flex items-center gap-1 mt-1">
                      <CreditCard size={14} />
                      <span>Abonnement {pricing.requiredTier} ou supérieur requis</span>
                    </div>
                  ) : null}
                  
                  {pricing.type === 'token' || pricing.type === 'hybrid' ? (
                    <div className="flex items-center gap-1 mt-1">
                      <Coins size={14} />
                      <span>
                        {pricing.tokenPrice} tokens
                        {pricing.discountForSubscribers && userSubscriptionTier !== 'free' && (
                          <span className="text-green-500 ml-1">(-{pricing.discountForSubscribers}% abonné)</span>
                        )}
                      </span>
                    </div>
                  ) : null}
                </div>
              )}
              
              {!isAccessible() && (
                <div className="space-y-2">
                  {(pricing.type === 'token' || pricing.type === 'hybrid') && !hasEnoughTokens() && (
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="w-full flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600"
                      onClick={() => {
                        toast("Redirection vers l'achat de tokens");
                        triggerMicroReward('navigate');
                      }}
                    >
                      <Coins size={14} />
                      Acheter des tokens
                    </Button>
                  )}
                  
                  {(pricing.type === 'subscription' || pricing.type === 'hybrid') && !canAccessWithSubscription() && (
                    <Button 
                      variant="default"
                      size="sm"
                      className="w-full flex items-center gap-2 bg-gradient-to-r from-xvush-pink to-xvush-purple"
                      onClick={handleSubscribe}
                    >
                      <CreditCard size={14} />
                      S'abonner ({pricing.requiredTier})
                    </Button>
                  )}
                  
                  {pricing.type === 'hybrid' && (
                    <div className="text-xs text-center text-muted-foreground">OU</div>
                  )}
                  
                  {(pricing.type === 'token' || pricing.type === 'hybrid') && hasEnoughTokens() && (
                    <Button 
                      variant="default"
                      size="sm"
                      className="w-full"
                      disabled={isPurchasing}
                      onClick={handleOpenPurchaseModal}
                    >
                      {isPurchasing ? (
                        <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
                      ) : (
                        <Coins size={14} className="mr-2" />
                      )}
                      Acheter ({getFinalTokenPrice()} tokens)
                    </Button>
                  )}
                </div>
              )}
              
              {isAccessible() && (
                <Button 
                  variant="default"
                  size="sm"
                  className="w-full bg-gradient-to-r from-green-500 to-green-600"
                >
                  <Unlock size={14} className="mr-2" />
                  Accéder au contenu
                </Button>
              )}
              
              <div className="mt-3 flex justify-center">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-xs text-muted-foreground"
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/content/${contentId}`);
                    toast.success("Lien du contenu copié!");
                    triggerMicroReward('action');
                  }}
                >
                  <Copy size={14} className="mr-2" />
                  Partager
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <ContentPurchaseModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        onPurchaseComplete={handlePurchaseComplete}
        contentTitle={title}
        contentThumbnail={thumbnailUrl}
        pricing={pricing}
        userTokenBalance={userTokenBalance}
      />
    </>
  );
};

export default ContentPricing;
