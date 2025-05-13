
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, CreditCard, ArrowUpRight, ArrowDownLeft, 
  BarChart3, Clock, Copy, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTronWallet } from '@/hooks/use-tron-wallet';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import WalletConnect from '@/components/wallet/WalletConnect';
import WalletBalance from '@/components/wallet/WalletBalance';
import TransactionList from '@/components/wallet/TransactionList';
import TokenPurchasePanel from '@/components/monetization/TokenPurchasePanel';
import { useAuth } from '@/contexts/AuthContext';

const TokensPage: React.FC = () => {
  const { user } = useAuth();
  const { walletInfo, loading, error, getWalletInfo, createWallet } = useTronWallet();
  const [isPurchasePanelOpen, setIsPurchasePanelOpen] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    if (user) {
      getWalletInfo();
    }
  }, [user]);
  
  const handleCreateWallet = async () => {
    try {
      await createWallet();
      toast.success("Portefeuille TRON créé avec succès");
    } catch (err) {
      toast.error("Erreur lors de la création du portefeuille");
    }
  };
  
  const handleRefresh = () => {
    getWalletInfo();
    toast.success("Informations du portefeuille mises à jour");
  };
  
  const handlePurchase = async () => {
    return new Promise<boolean>((resolve) => {
      // Simulate purchase completion
      setTimeout(() => {
        toast.success("Achat de tokens réussi!");
        getWalletInfo(); // Refresh wallet info
        resolve(true);
      }, 1500);
    });
  };
  
  const hasWallet = walletInfo?.wallet !== null;
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      } 
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div 
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">Portefeuille de Tokens</h1>
              <p className="text-muted-foreground mt-1">
                Gérez vos tokens, achetez du contenu premium et suivez vos transactions
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                disabled={loading}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualiser
              </Button>
              
              <Button 
                onClick={() => setIsPurchasePanelOpen(true)}
                size="sm"
                className="bg-gradient-to-r from-amber-500 to-amber-600"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Acheter des Tokens
              </Button>
            </div>
          </div>
        </motion.div>
        
        {error && (
          <motion.div variants={itemVariants} className="bg-destructive/20 text-destructive p-4 rounded-lg">
            {error}
          </motion.div>
        )}
        
        {loading && !walletInfo ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="w-full h-32 animate-pulse bg-muted" />
            ))}
          </div>
        ) : !hasWallet ? (
          <motion.div variants={itemVariants} className="text-center py-16">
            <Wallet className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Vous n'avez pas encore de portefeuille</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Créez un portefeuille TRON pour acheter et gérer des tokens, accéder au contenu premium et soutenir vos créateurs préférés.
            </p>
            <Button onClick={handleCreateWallet} disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full" />
                  Création en cours...
                </>
              ) : (
                <>
                  <Wallet className="h-4 w-4 mr-2" />
                  Créer un portefeuille
                </>
              )}
            </Button>
          </motion.div>
        ) : (
          <>
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <WalletBalance walletInfo={walletInfo} />
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    Abonnement Actif
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {walletInfo?.subscription ? (
                    <div>
                      <div className="text-2xl font-bold">{walletInfo.subscription.subscription_tiers.name}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Expire le {new Date(walletInfo.subscription.expires_at).toLocaleDateString()}
                      </div>
                      <Button variant="outline" size="sm" className="mt-4 w-full">
                        Renouveler
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <div className="text-lg font-semibold">Aucun abonnement</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Abonnez-vous pour accéder au contenu premium
                      </div>
                      <Button variant="outline" size="sm" className="mt-4 w-full">
                        Voir les abonnements
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <BarChart3 className="h-4 w-4 mr-2 text-muted-foreground" />
                    Statistiques
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Contenu acheté</div>
                      <div className="text-2xl font-bold">0</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Créateurs supportés</div>
                      <div className="text-2xl font-bold">0</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-8">
              <Tabs defaultValue="transactions">
                <TabsList className="mb-6">
                  <TabsTrigger value="transactions">Transactions</TabsTrigger>
                  <TabsTrigger value="purchases">Achats</TabsTrigger>
                  <TabsTrigger value="wallet">Portefeuille</TabsTrigger>
                </TabsList>
                
                <TabsContent value="transactions">
                  <Card>
                    <CardHeader>
                      <CardTitle>Historique des transactions</CardTitle>
                      <CardDescription>Consultez l'historique de vos transactions récentes</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <TransactionList transactions={walletInfo?.transactions || []} />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="purchases">
                  <Card>
                    <CardHeader>
                      <CardTitle>Achats de contenu</CardTitle>
                      <CardDescription>Votre contenu premium acheté</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <div className="mx-auto h-12 w-12 text-muted-foreground mb-4">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium">Aucun achat pour le moment</h3>
                        <p className="text-muted-foreground mt-1 mb-6 max-w-md mx-auto">
                          Explorez le contenu premium de vos créateurs préférés pour faire votre premier achat.
                        </p>
                        <Button variant="outline">Découvrir du contenu</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="wallet">
                  <Card>
                    <CardHeader>
                      <CardTitle>Informations du portefeuille</CardTitle>
                      <CardDescription>Gérez votre portefeuille TRON</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <WalletConnect walletInfo={walletInfo} />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </>
        )}
      </motion.div>
      
      <TokenPurchasePanel 
        isOpen={isPurchasePanelOpen} 
        onClose={() => setIsPurchasePanelOpen(false)}
        onPurchase={handlePurchase}
      />
    </div>
  );
};

export default TokensPage;
