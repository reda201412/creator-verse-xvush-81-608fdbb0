
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Info, Wallet, Users, Calendar, ArrowUpRight } from 'lucide-react';
import { useTronWallet } from '@/hooks/use-tron-wallet';
import { useAuth } from '@/contexts/AuthContext';
import RevenueMetricsCard from '@/components/creator/RevenueMetricsCard';
import WithdrawalHistoryCard from '@/components/creator/WithdrawalHistoryCard';

const CreatorRevenueDashboard: React.FC = () => {
  const { user, isCreator } = useAuth();
  const { walletInfo, getWalletInfo, createWallet } = useTronWallet();
  
  useEffect(() => {
    if (user) {
      getWalletInfo();
    }
  }, [user]);
  
  if (!isCreator) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Accès réservé aux créateurs</h1>
        <p className="text-muted-foreground mb-6">
          Cette page est uniquement accessible aux comptes créateurs.
        </p>
        <Button asChild>
          <a href="/">Retour à l'accueil</a>
        </Button>
      </div>
    );
  }
  
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
  
  const hasWallet = walletInfo?.wallet !== null;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div 
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold">Tableau de bord des revenus</h1>
              <p className="text-muted-foreground mt-1">
                Gérez vos revenus, suivez vos statistiques et effectuez des retraits
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                asChild
              >
                <a href="/dashboard">
                  Tableau de bord principal
                </a>
              </Button>
              
              <Button
                size="sm"
                className="bg-gradient-to-r from-xvush-blue to-xvush-teal"
              >
                <ArrowUpRight className="h-4 w-4 mr-2" />
                Demander un retrait
              </Button>
            </div>
          </div>
        </motion.div>
        
        {!hasWallet ? (
          <motion.div variants={itemVariants} className="text-center py-16 bg-card rounded-lg p-6">
            <Wallet className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Configuration du portefeuille créateur</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Vous devez créer un portefeuille TRON pour recevoir des paiements de vos fans et gérer vos revenus.
            </p>
            <Button onClick={createWallet}>
              <Wallet className="h-4 w-4 mr-2" />
              Créer un portefeuille créateur
            </Button>
          </motion.div>
        ) : (
          <>
            <motion.div variants={itemVariants}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <RevenueMetricsCard />
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-2">
                  <WithdrawalHistoryCard />
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Informations de paiement</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Adresse TRON</h3>
                      <div className="bg-secondary p-3 rounded-md font-mono text-xs overflow-hidden overflow-ellipsis">
                        {walletInfo?.wallet?.tron_address || 'Non configurée'}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Commission de la plateforme</h3>
                      <div className="text-2xl font-bold">10%</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        La plateforme prélève 10% sur tous les revenus générés pour couvrir les frais de service.
                      </p>
                    </div>
                    
                    <div className="bg-blue-500/10 p-3 rounded-md flex items-start gap-2">
                      <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div className="text-xs">
                        <span className="font-medium text-blue-500 block mb-1">Information</span>
                        Les retraits sont traités dans un délai de 24 à 48 heures ouvrées. Le montant minimum pour un retrait est de 10 USDT.
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="mt-6">
              <Tabs defaultValue="subscriptions">
                <TabsList className="mb-6">
                  <TabsTrigger value="subscriptions">
                    <Users className="h-4 w-4 mr-2" />
                    Revenus d'abonnements
                  </TabsTrigger>
                  <TabsTrigger value="content">
                    <Wallet className="h-4 w-4 mr-2" />
                    Revenus de contenu
                  </TabsTrigger>
                  <TabsTrigger value="calendar">
                    <Calendar className="h-4 w-4 mr-2" />
                    Calendrier des revenus
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="subscriptions">
                  <Card>
                    <CardHeader>
                      <CardTitle>Revenus d'abonnements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <p className="text-muted-foreground">
                          Les données sur les abonnements s'afficheront ici une fois que vous aurez des abonnés.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="content">
                  <Card>
                    <CardHeader>
                      <CardTitle>Revenus de contenu premium</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <p className="text-muted-foreground">
                          Les données sur les ventes de contenu premium s'afficheront ici une fois que vous aurez publié du contenu payant.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="calendar">
                  <Card>
                    <CardHeader>
                      <CardTitle>Calendrier des revenus</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <p className="text-muted-foreground">
                          Un calendrier détaillé de vos revenus quotidiens s'affichera ici prochainement.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default CreatorRevenueDashboard;
