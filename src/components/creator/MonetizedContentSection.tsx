
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lock, Unlock, Coins, CreditCard } from 'lucide-react';
import { ContentPrice } from '@/types/monetization';
import ContentPricing from '@/components/creator/ContentPricing';
import TokenPurchasePanel from '@/components/monetization/TokenPurchasePanel';
import { Link } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';

// Mock monetized content data
const mockMonetizedContent = [
  {
    id: "mc1",
    title: "Masterclass Photo Portrait",
    description: "Apprenez mes techniques avancées de portrait en studio et en extérieur",
    thumbnailUrl: "https://images.unsplash.com/photo-1554080353-a576cf803bda?w=800&auto=format&fit=crop",
    type: "course",
    pricing: {
      type: 'hybrid',
      requiredTier: 'superfan',
      tokenPrice: 250,
      discountForSubscribers: 20
    } as ContentPrice
  },
  {
    id: "mc2",
    title: "Séance photo exclusive: Paris by Night",
    description: "Une série de photos nocturnes inédites dans les rues de Paris",
    thumbnailUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop",
    type: "photo",
    pricing: {
      type: 'token',
      tokenPrice: 50
    } as ContentPrice
  },
  {
    id: "mc3",
    title: "Tutoriel retouche: Collection Été",
    description: "Découvrez mes presets et ma méthode de retouche pour ma dernière collection",
    thumbnailUrl: "https://images.unsplash.com/photo-1542395765-761f1b5f9a55?w=800&auto=format&fit=crop",
    type: "tutorial",
    pricing: {
      type: 'subscription',
      requiredTier: 'fan'
    } as ContentPrice
  },
  {
    id: "mc4",
    title: "Q&A mensuel: Vos questions de mai",
    description: "Retrouvez toutes mes réponses aux questions posées ce mois-ci",
    thumbnailUrl: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&auto=format&fit=crop",
    type: "video",
    pricing: {
      type: 'free'
    } as ContentPrice
  }
];

interface MonetizedContentSectionProps {
  isCreator?: boolean;
  userTokenBalance?: number;
  userSubscriptionTier?: string;
  className?: string;
}

const MonetizedContentSection: React.FC<MonetizedContentSectionProps> = ({
  isCreator = false,
  userTokenBalance = 350,
  userSubscriptionTier = 'fan',
  className
}) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [purchasePanelOpen, setPurchasePanelOpen] = useState(false);
  
  const filteredContent = activeTab === 'all' 
    ? mockMonetizedContent 
    : mockMonetizedContent.filter(content => content.type === activeTab);
    
  const handlePurchaseTokens = () => {
    setPurchasePanelOpen(true);
  };
  
  const handleSubscribe = () => {
    toast("Redirection vers la page d'abonnements");
  };
  
  const handleContentPurchase = () => {
    // In a real app, this would handle the token transaction
    toast.success("Contenu déverrouillé avec succès!");
  };
  
  const handlePurchaseComplete = async () => {
    // Mock purchase completion
    setTimeout(() => {
      toast.success("Tokens ajoutés à votre portefeuille!");
      setPurchasePanelOpen(false);
    }, 1500);
    return true;
  };
  
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Contenu exclusif
        </CardTitle>
        <div className="flex items-center gap-2">
          {!isCreator && (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={handlePurchaseTokens}
              >
                <Coins className="h-4 w-4 text-amber-500" />
                <span className="font-medium">{userTokenBalance}</span>
              </Button>
              <Button 
                variant="outline"
                size="sm"
                asChild
              >
                <Link to="/tokens">
                  Gérer
                </Link>
              </Button>
            </>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full mb-4">
            <TabsTrigger value="all">Tout</TabsTrigger>
            <TabsTrigger value="course">Cours</TabsTrigger>
            <TabsTrigger value="photo">Photos</TabsTrigger>
            <TabsTrigger value="tutorial">Tutoriels</TabsTrigger>
            <TabsTrigger value="video">Vidéos</TabsTrigger>
          </TabsList>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContent.map((content) => (
              <ContentPricing 
                key={content.id}
                contentId={content.id}
                title={content.title}
                pricing={content.pricing}
                thumbnailUrl={content.thumbnailUrl}
                userSubscriptionTier={userSubscriptionTier}
                userTokenBalance={userTokenBalance}
                onPurchase={handleContentPurchase}
                onSubscribe={handleSubscribe}
              />
            ))}
          </div>
        </Tabs>
      </CardContent>
      
      <TokenPurchasePanel 
        isOpen={purchasePanelOpen} 
        onClose={() => setPurchasePanelOpen(false)} 
        onPurchase={handlePurchaseComplete}
      />
    </Card>
  );
};

export default MonetizedContentSection;
