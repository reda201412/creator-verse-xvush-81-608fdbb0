
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Coins, CreditCard, ArrowRight, Gift } from 'lucide-react';
import TokenWallet from '@/components/monetization/TokenWallet';
import TokenPurchasePanel from '@/components/monetization/TokenPurchasePanel';
import { UserWallet, TokenTransaction } from '@/types/monetization';
import { Link } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';

// Mock data for the user wallet
const mockWallet: UserWallet = {
  id: "wallet1",
  userId: "user123",
  tokenBalance: 350,
  subscriptionTier: "superfan",
  subscriptionExpiresAt: new Date(Date.now() + 86400000 * 30).toISOString(), // 30 days from now
  lifetimeSpending: 120,
  rewardsLevel: 3,
  loyaltyPoints: 575,
  transactions: [
    {
      id: "t1",
      userId: "user123",
      amount: 500,
      type: 'purchase',
      description: "Achat de tokens",
      timestamp: new Date(Date.now() - 86400000 * 2).toISOString() // 2 days ago
    },
    {
      id: "t2",
      userId: "user123",
      amount: 50,
      type: 'reward',
      description: "Bonus de connexion quotidienne",
      timestamp: new Date(Date.now() - 86400000).toISOString() // 1 day ago
    },
    {
      id: "t3",
      userId: "user123",
      amount: 100,
      type: 'tip',
      description: "Pourboire à Sarah K.",
      timestamp: new Date(Date.now() - 3600000 * 5).toISOString() // 5 hours ago
    },
    {
      id: "t4",
      userId: "user123",
      amount: 100,
      type: 'content',
      description: "Accès au contenu premium",
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString() // 2 hours ago
    },
  ]
};

const TokensPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('wallet');
  const [purchasePanelOpen, setPurchasePanelOpen] = useState(false);
  const [wallet, setWallet] = useState<UserWallet>(mockWallet);
  
  const handlePurchaseTokens = () => {
    setPurchasePanelOpen(true);
  };
  
  const handlePurchaseComplete = async (optionId: string) => {
    // Simulate API call
    return new Promise<boolean>((resolve) => {
      // Simulate token purchase
      setTimeout(() => {
        // Add transaction and update balance
        const newTransaction: TokenTransaction = {
          id: `t${Date.now()}`,
          userId: wallet.userId,
          amount: optionId === 'basic' ? 100 : optionId === 'standard' ? 550 : optionId === 'premium' ? 1400 : 3750,
          type: 'purchase',
          description: "Achat de tokens",
          timestamp: new Date().toISOString()
        };
        
        setWallet(prev => ({
          ...prev,
          tokenBalance: prev.tokenBalance + newTransaction.amount,
          transactions: [newTransaction, ...prev.transactions],
          loyaltyPoints: prev.loyaltyPoints + Math.floor(newTransaction.amount / 10),
        }));
        
        // Add XP and potentially level up
        const newLoyaltyPoints = wallet.loyaltyPoints + Math.floor(newTransaction.amount / 10);
        if (Math.floor(newLoyaltyPoints / 1000) > Math.floor(wallet.loyaltyPoints / 1000)) {
          // Level up!
          setWallet(prev => ({
            ...prev,
            rewardsLevel: prev.rewardsLevel + 1,
          }));
          
          toast.success("Niveau de récompense augmenté!", {
            description: `Vous êtes maintenant niveau ${wallet.rewardsLevel + 1}!`,
            duration: 5000
          });
          
          // Dispatch a custom reward event for the level up animation
          const event = new CustomEvent('xvush:micro-reward', {
            detail: { type: 'star' }
          });
          document.dispatchEvent(event);
        }
        
        resolve(true);
      }, 1500);
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Coins className="h-8 w-8 text-amber-500" />
          XDose Tokens
        </h1>
        
        <Button
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
          onClick={handlePurchaseTokens}
        >
          <Coins className="mr-2 h-4 w-4" />
          Acheter des tokens
        </Button>
      </div>
      
      <Tabs defaultValue="wallet" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full max-w-md mx-auto mb-8">
          <TabsTrigger value="wallet" className="flex-1">
            <Coins className="mr-2 h-4 w-4" />
            Porte-monnaie
          </TabsTrigger>
          <TabsTrigger value="subscription" className="flex-1">
            <CreditCard className="mr-2 h-4 w-4" />
            Abonnement
          </TabsTrigger>
          <TabsTrigger value="gifts" className="flex-1">
            <Gift className="mr-2 h-4 w-4" />
            Cadeaux
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="wallet" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <TokenWallet 
                wallet={wallet} 
                onPurchaseTokens={handlePurchaseTokens} 
              />
            </div>
            
            <div className="space-y-6">
              <div className="glass-card p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Fonctionnement des tokens</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="bg-amber-500/20 p-1 rounded-full mt-0.5">
                      <Coins size={16} className="text-amber-500" />
                    </div>
                    <span>Accédez à du contenu premium et exclusif</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="bg-amber-500/20 p-1 rounded-full mt-0.5">
                      <Gift size={16} className="text-amber-500" />
                    </div>
                    <span>Soutenez vos créateurs préférés</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="bg-amber-500/20 p-1 rounded-full mt-0.5">
                      <CreditCard size={16} className="text-amber-500" />
                    </div>
                    <span>Gagnez des réductions en tant qu'abonné</span>
                  </li>
                </ul>
                
                <Button variant="link" className="mt-2 p-0 h-auto" asChild>
                  <Link to="/tokens-faq">
                    En savoir plus <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>
              
              <div className="glass-card p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Avantages des tokens</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Les créateurs que vous supportez reçoivent 70% de la valeur des tokens que vous dépensez sur leur contenu.
                </p>
                <Button className="w-full" variant="outline" onClick={handlePurchaseTokens}>
                  Acheter des tokens
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="subscription" className="space-y-6">
          <div className="text-center max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-2">Abonnements</h2>
            <p className="text-muted-foreground mb-4">
              Accédez au contenu premium de vos créateurs préférés avec nos abonnements.
            </p>
            <Button 
              className="bg-gradient-to-r from-xvush-pink to-xvush-purple hover:from-xvush-pink-dark hover:to-xvush-purple-dark"
              onClick={() => {
                toast("Redirection vers les abonnements");
              }}
            >
              Voir les abonnements
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="gifts" className="space-y-6">
          <div className="text-center max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-2">Cadeaux et récompenses</h2>
            <p className="text-muted-foreground mb-4">
              Offrez des tokens à vos créateurs préférés ou réclamez vos récompenses quotidiennes.
            </p>
            <Button 
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
              onClick={() => {
                toast("Réclamation de récompense quotidienne");
                
                // Add daily reward to wallet
                const newTransaction: TokenTransaction = {
                  id: `t${Date.now()}`,
                  userId: wallet.userId,
                  amount: 5 + (wallet.rewardsLevel * 2),
                  type: 'reward',
                  description: "Récompense quotidienne",
                  timestamp: new Date().toISOString()
                };
                
                setWallet(prev => ({
                  ...prev,
                  tokenBalance: prev.tokenBalance + newTransaction.amount,
                  transactions: [newTransaction, ...prev.transactions],
                  loyaltyPoints: prev.loyaltyPoints + 10,
                }));
                
                // Trigger reward animation
                const event = new CustomEvent('xvush:micro-reward', {
                  detail: { type: 'token', value: newTransaction.amount }
                });
                document.dispatchEvent(event);
              }}
            >
              <Gift className="mr-2 h-4 w-4" />
              Récompense quotidienne
            </Button>
          </div>
        </TabsContent>
      </Tabs>
      
      <TokenPurchasePanel 
        isOpen={purchasePanelOpen} 
        onClose={() => setPurchasePanelOpen(false)} 
        onPurchase={handlePurchaseComplete}
      />
    </div>
  );
};

export default TokensPage;
