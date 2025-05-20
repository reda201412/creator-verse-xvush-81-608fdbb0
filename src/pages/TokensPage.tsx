
import React, { useState, useEffect } from 'react';
import { useTronWallet } from '@/hooks/use-tron-wallet';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Check, Clock, CreditCard, Loader2, RefreshCcw, Wallet } from 'lucide-react';
import { WalletConnect } from '@/components/wallet/WalletConnect';
import TransactionList from '@/components/wallet/TransactionList';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { toast } from 'sonner';

const TokensPage: React.FC = () => {
  const { walletInfo, isLoading, getWalletInfo } = useTronWallet();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(false);
  
  useEffect(() => {
    if (user) {
      getWalletInfo();
    }
  }, [user, getWalletInfo]);
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(date);
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  const getSubscriptionStatusColor = () => {
    if (!walletInfo.subscription) return 'bg-gray-200 text-gray-800';
    
    switch (walletInfo.subscription.status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const handleRefresh = () => {
    getWalletInfo();
    toast.success('Données mises à jour');
  };
  
  const handleSubscribe = (tier) => {
    setIsLoadingSubscription(true);
    
    // Mock subscription process
    setTimeout(() => {
      toast.success(`Abonnement ${tier.name} souscrit avec succès`);
      setIsLoadingSubscription(false);
      getWalletInfo();
    }, 2000);
  };
  
  // Safely access subscription tiers with fallback
  const subscriptionTiers = walletInfo.subscription?.subscription_tiers || [
    { id: 'basic', name: 'Basic', price: 9.99 },
    { id: 'premium', name: 'Premium', price: 19.99 },
    { id: 'vip', name: 'VIP', price: 49.99 }
  ];
  
  // Safely get subscription expiry date
  const subscriptionExpiryDate = walletInfo.subscription?.expiry || 
                               walletInfo.subscription?.expires_at ||
                               null;
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Jetons & Abonnements</h1>
        <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
        </Button>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Aperçu</TabsTrigger>
          <TabsTrigger value="subscription">Abonnement</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between">
                  <span>Portefeuille</span>
                  {walletInfo.wallet?.is_verified && (
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Vérifié</Badge>
                  )}
                </CardTitle>
                <CardDescription>Gérer et recharger votre solde</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ) : walletInfo.wallet ? (
                  <div>
                    <div className="text-3xl font-bold">{walletInfo.wallet.balance_usdt} USDT</div>
                    <div className="text-sm text-muted-foreground truncate mt-1">{walletInfo.wallet.tron_address}</div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground mb-2">Pas de portefeuille connecté</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full flex gap-2" 
                  onClick={() => setIsWalletOpen(true)}
                >
                  <Wallet className="h-4 w-4" />
                  {walletInfo.wallet ? "Accéder au portefeuille" : "Créer un portefeuille"}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between">
                  <span>Abonnement</span>
                  {walletInfo.subscription && (
                    <Badge variant="outline" className={getSubscriptionStatusColor()}>
                      {walletInfo.subscription.status === 'active' ? 'Actif' : 
                       walletInfo.subscription.status === 'pending' ? 'En attente' :
                       walletInfo.subscription.status === 'expired' ? 'Expiré' : walletInfo.subscription.status}
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>Votre abonnement actuel</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ) : walletInfo.subscription ? (
                  <div>
                    <div className="text-2xl font-semibold capitalize">{walletInfo.subscription.level}</div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Clock className="h-4 w-4" />
                      <span>Expire le {formatDate(subscriptionExpiryDate)}</span>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Période d'abonnement</span>
                        <span>30 jours</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground mb-2">Pas d'abonnement actif</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant={walletInfo.subscription ? "outline" : "default"}
                  onClick={() => setActiveTab('subscription')}
                >
                  {walletInfo.subscription ? "Gérer l'abonnement" : "Souscrire à un abonnement"}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Transactions récentes</CardTitle>
              <CardDescription>Historique de vos dernières transactions</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex justify-between">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                  ))}
                </div>
              ) : walletInfo.transactions && walletInfo.transactions.length > 0 ? (
                <TransactionList 
                  transactions={walletInfo.transactions.slice(0, 3)} 
                  compact={true}
                />
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">Aucune transaction récente</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setActiveTab('transactions')}
              >
                Voir toutes les transactions
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="subscription">
          <Card>
            <CardHeader>
              <CardTitle>Abonnements disponibles</CardTitle>
              <CardDescription>Choisissez un plan qui vous convient</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                {subscriptionTiers.map((tier) => (
                  <Card key={tier.id} className={`overflow-hidden ${walletInfo.subscription?.level === tier.id ? 'border-primary' : ''}`}>
                    <div className={`p-1 ${walletInfo.subscription?.level === tier.id ? 'bg-primary' : 'bg-transparent'}`}></div>
                    <CardHeader>
                      <CardTitle>{tier.name}</CardTitle>
                      <CardDescription>{tier.description || `Access to ${tier.name} content`}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">${tier.price}<span className="text-sm text-muted-foreground">/mois</span></div>
                      <ul className="mt-4 space-y-2">
                        <li className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-sm">Accès {tier.name}</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full" 
                        variant={walletInfo.subscription?.level === tier.id ? "secondary" : "default"}
                        disabled={isLoadingSubscription || walletInfo.subscription?.level === tier.id}
                        onClick={() => handleSubscribe(tier)}
                      >
                        {isLoadingSubscription ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : walletInfo.subscription?.level === tier.id ? (
                          "Abonnement actuel"
                        ) : (
                          "Souscrire"
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Historique des transactions</CardTitle>
              <CardDescription>Visualisez toutes vos transactions</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="flex justify-between">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                  ))}
                </div>
              ) : walletInfo.transactions && walletInfo.transactions.length > 0 ? (
                <TransactionList transactions={walletInfo.transactions} />
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">Aucune transaction à afficher</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Dialog open={isWalletOpen} onOpenChange={setIsWalletOpen}>
        <DialogContent className="sm:max-w-md">
          <WalletConnect 
            isOpen={isWalletOpen}
            onClose={() => setIsWalletOpen(false)}
            walletInfo={walletInfo}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TokensPage;
