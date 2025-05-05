
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Trophy, Coins, CreditCard, TrendingUp, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/components/ui/sonner';
import { useNeuroAesthetic } from '@/hooks/use-neuro-aesthetic';
import { UserWallet, TokenTransaction } from '@/types/monetization';

interface TokenWalletProps {
  wallet: UserWallet;
  onPurchaseTokens: () => void;
  className?: string;
}

const TokenWallet = ({ wallet, onPurchaseTokens, className }: TokenWalletProps) => {
  const [activeTab, setActiveTab] = useState('balance');
  const { triggerMicroReward } = useNeuroAesthetic();
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    triggerMicroReward('tab');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'purchase': return <CreditCard size={16} />;
      case 'gift': return <Trophy size={16} />;
      case 'reward': return <Trophy size={16} />;
      case 'tip': return <TrendingUp size={16} />;
      case 'content': return <Coins size={16} />;
      case 'refund': return <History size={16} />;
      default: return <Coins size={16} />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'purchase': return 'text-green-500';
      case 'gift': return 'text-purple-500';
      case 'reward': return 'text-amber-500';
      case 'tip': return 'text-red-500';
      case 'content': return 'text-red-500';
      case 'refund': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Coins className="h-6 w-6 text-xvush-pink" />
          <CardTitle>Porte-monnaie XDose</CardTitle>
        </div>
        <CardDescription>Gérez vos tokens et abonnements</CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="balance" value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="w-full mb-4">
            <TabsTrigger value="balance" className="flex-1">
              Solde
            </TabsTrigger>
            <TabsTrigger value="history" className="flex-1">
              Historique
            </TabsTrigger>
            <TabsTrigger value="rewards" className="flex-1">
              Récompenses
            </TabsTrigger>
          </TabsList>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <TabsContent value="balance" className="space-y-4">
                <div className="glass-card p-4 rounded-lg text-center">
                  <div className="text-muted-foreground text-sm mb-1">Solde actuel</div>
                  <div className="flex justify-center items-center gap-2">
                    <Coins className="h-5 w-5 text-amber-500" />
                    <span className="text-4xl font-bold text-amber-500">{wallet.tokenBalance}</span>
                  </div>
                  <Button 
                    className="mt-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                    onClick={() => {
                      onPurchaseTokens();
                      triggerMicroReward('action');
                    }}
                  >
                    Acheter des tokens
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <div className="text-muted-foreground text-xs">Niveau d'abonnement</div>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge variant={wallet.subscriptionTier === 'free' ? 'outline' : 'default'} className="capitalize">
                        {wallet.subscriptionTier}
                      </Badge>
                    </div>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <div className="text-muted-foreground text-xs">Expire le</div>
                    <div className="mt-1 text-sm">
                      {wallet.subscriptionTier === 'free' 
                        ? 'Non applicable' 
                        : formatDate(wallet.subscriptionExpiresAt)
                      }
                    </div>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <div className="text-muted-foreground text-xs">Niveau de récompenses</div>
                    <div className="mt-1 flex items-center gap-1">
                      <Trophy size={16} className="text-amber-500" />
                      <span>Niveau {wallet.rewardsLevel}</span>
                    </div>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <div className="text-muted-foreground text-xs">Points de fidélité</div>
                    <div className="mt-1">{wallet.loyaltyPoints} pts</div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="history" className="space-y-3">
                <div className="max-h-[300px] overflow-y-auto pr-1">
                  {wallet.transactions.length === 0 ? (
                    <div className="text-center p-4 text-muted-foreground text-sm">
                      Aucune transaction pour le moment
                    </div>
                  ) : (
                    wallet.transactions.map(transaction => (
                      <div key={transaction.id} className="bg-muted/30 p-3 rounded-lg mb-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className={`p-1.5 rounded-full ${getTransactionColor(transaction.type)}`}>
                              {getTransactionIcon(transaction.type)}
                            </div>
                            <div>
                              <div className="text-sm font-medium">{transaction.description}</div>
                              <div className="text-xs text-muted-foreground">{formatDate(transaction.timestamp)}</div>
                            </div>
                          </div>
                          <div className={`font-semibold ${transaction.type === 'purchase' || transaction.type === 'gift' || transaction.type === 'reward' ? 'text-green-500' : 'text-red-500'}`}>
                            {transaction.type === 'purchase' || transaction.type === 'gift' || transaction.type === 'reward' ? '+' : '-'}{transaction.amount}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="rewards" className="space-y-4">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Trophy size={20} className="text-amber-500" />
                    <div>
                      <div className="font-semibold">Niveau {wallet.rewardsLevel}</div>
                      <div className="text-xs text-muted-foreground">Votre niveau actuel</div>
                    </div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-400 to-amber-600" 
                      style={{ width: `${Math.min((wallet.loyaltyPoints % 1000) / 10, 100)}%` }} 
                    />
                  </div>
                  <div className="mt-1 text-xs text-right text-muted-foreground">
                    {wallet.loyaltyPoints % 1000}/1000 points pour niveau {wallet.rewardsLevel + 1}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="text-sm font-medium">Avantages actuels</div>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="bg-muted/30 p-2 rounded-lg flex items-center gap-2">
                      <div className="p-1 bg-amber-500/20 rounded-full">
                        <Coins size={14} className="text-amber-500" />
                      </div>
                      <div className="text-xs">+{wallet.rewardsLevel * 5}% de tokens en bonus à l'achat</div>
                    </div>
                    <div className="bg-muted/30 p-2 rounded-lg flex items-center gap-2">
                      <div className="p-1 bg-amber-500/20 rounded-full">
                        <TrendingUp size={14} className="text-amber-500" />
                      </div>
                      <div className="text-xs">Rabais de {wallet.rewardsLevel * 2}% sur les contenus premiums</div>
                    </div>
                    {wallet.rewardsLevel >= 3 && (
                      <div className="bg-muted/30 p-2 rounded-lg flex items-center gap-2">
                        <div className="p-1 bg-amber-500/20 rounded-full">
                          <Trophy size={14} className="text-amber-500" />
                        </div>
                        <div className="text-xs">Accès anticipé aux nouveaux contenus (24h)</div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            toast.info("Guide d'utilisation des tokens ouvert");
            triggerMicroReward('opportunity');
          }}
        >
          Guide tokens
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            toast.info("Support d'aide ouvert");
          }}
        >
          Support
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TokenWallet;
