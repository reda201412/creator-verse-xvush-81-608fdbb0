import React, { useEffect, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Info, Wallet, Users, Calendar, ArrowUpRight } from 'lucide-react';
import { useTronWallet } from '@/hooks/use-tron-wallet';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { RouteChangeProps } from '@/types/navigation';

// Lazy load heavy components
const RevenueMetricsCard = lazy(() => import('@/components/creator/RevenueMetricsCard'));
const WithdrawalHistoryCard = lazy(() => import('@/components/creator/WithdrawalHistoryCard'));

// Loading fallback component
const CardSkeleton = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2" />
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </CardContent>
  </Card>
);

// Mock withdrawal data 
const withdrawals = [
  {
    id: '1',
    amount: 120.50,
    currency: 'USDT',
    status: 'completed',
    timestamp: new Date('2023-05-15T10:30:00'),
    address: '0x1234...5678'
  },
  {
    id: '2',
    amount: 75.25,
    currency: 'USDT',
    status: 'pending',
    timestamp: new Date('2023-05-10T14:15:00'),
    address: '0x8765...4321'
  },
  {
    id: '3',
    amount: 200.00,
    currency: 'USDT',
    status: 'completed',
    timestamp: new Date('2023-05-01T09:45:00'),
    address: '0x5432...9876'
  }
];

const CreatorRevenueDashboard: React.FC<RouteChangeProps> = ({ onRouteChange }) => {
  const { user, isCreator } = useAuth();
  const { walletInfo, getWalletInfo, createWallet } = useTronWallet();
  
  useEffect(() => {
    if (user) {
      getWalletInfo();
    }
    
    // Call onRouteChange when component mounts
    onRouteChange?.();
  }, [user, getWalletInfo, onRouteChange]);
  
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
        staggerChildren: 0.05, // Reduced from 0.1 for faster animation
        duration: 0.3 // Added for smoother transition
      } 
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 }, // Reduced y from 20 to 10 for subtler animation
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 } // Quick animation
    }
  };
  
  const hasWallet = walletInfo?.wallet !== null;
  
  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <motion.div 
        className="space-y-4 sm:space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-2 sm:mb-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 md:mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Tableau de bord des revenus</h1>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                Gérez vos revenus, suivez vos statistiques et effectuez des retraits
              </p>
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Button 
                variant="outline" 
                size="sm"
                asChild
                className="flex-1 md:flex-none"
              >
                <a href="/dashboard">
                  Tableau de bord principal
                </a>
              </Button>
              
              <Button
                size="sm"
                className="flex-1 md:flex-none bg-gradient-to-r from-xvush-blue to-xvush-teal"
              >
                <ArrowUpRight className="h-4 w-4 mr-2" />
                Demander un retrait
              </Button>
            </div>
          </div>
        </motion.div>
        
        {!hasWallet ? (
          <motion.div variants={itemVariants} className="text-center py-8 sm:py-16 bg-card rounded-lg p-4 sm:p-6">
            <Wallet className="h-12 sm:h-16 w-12 sm:w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-lg sm:text-xl font-semibold mb-2">Configuration du portefeuille créateur</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm sm:text-base">
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
              <Suspense fallback={<CardSkeleton />}>
                <RevenueMetricsCard />
              </Suspense>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="col-span-1 lg:col-span-2">
                  <Suspense fallback={<CardSkeleton />}>
                    <WithdrawalHistoryCard withdrawals={withdrawals} />
                  </Suspense>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Informations de paiement</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Adresse TRON</h3>
                      <div className="bg-secondary p-2 sm:p-3 rounded-md font-mono text-xs overflow-hidden overflow-ellipsis">
                        {walletInfo?.wallet?.tron_address || 'Non configurée'}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Commission de la plateforme</h3>
                      <div className="text-xl sm:text-2xl font-bold">10%</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        La plateforme prélève 10% sur tous les revenus générés pour couvrir les frais de service.
                      </p>
                    </div>
                    
                    <div className="bg-blue-500/10 p-2 sm:p-3 rounded-md flex items-start gap-2">
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
            
            <motion.div variants={itemVariants} className="mt-4 sm:mt-6">
              <Tabs defaultValue="subscriptions" className="overflow-x-auto">
                <TabsList className="mb-4 sm:mb-6 whitespace-nowrap w-full md:w-auto">
                  <TabsTrigger value="subscriptions" className="text-xs sm:text-sm">
                    <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    Revenus d'abonnements
                  </TabsTrigger>
                  <TabsTrigger value="content" className="text-xs sm:text-sm">
                    <Wallet className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    Revenus de contenu
                  </TabsTrigger>
                  <TabsTrigger value="calendar" className="text-xs sm:text-sm">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    Calendrier des revenus
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="subscriptions">
                  <Card>
                    <CardHeader>
                      <CardTitle>Revenus d'abonnements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8 sm:py-12">
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
                      <div className="text-center py-8 sm:py-12">
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
                      <div className="text-center py-8 sm:py-12">
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
