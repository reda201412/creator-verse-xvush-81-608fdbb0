
import React, { Suspense, lazy } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Wallet, TrendingUp, BarChart2, CreditCard, DollarSign } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useTronWallet } from '@/hooks/use-tron-wallet';

// Import the chart components lazily
const RevenueAreaChart = lazy(() => import('./revenue-charts/RevenueAreaChart'));
const RevenueSourcePieChart = lazy(() => import('./revenue-charts/RevenueSourcePieChart'));
const ContentTypeBarChart = lazy(() => import('./revenue-charts/ContentTypeBarChart'));

// Types de données pour les métriques de revenus
interface RevenueMetrics {
  totalRevenue: number;
  monthlyRevenue: number;
  growthRate: number;
  pendingWithdrawals: number;
  subscriptionRevenue: number;
  tokenRevenue: number;
}

const RevenueMetricsCard: React.FC = () => {
  const { walletInfo } = useTronWallet();
  
  // Données mockées de revenus
  const metrics: RevenueMetrics = {
    totalRevenue: 7850,
    monthlyRevenue: 1320,
    growthRate: 24,
    pendingWithdrawals: 420,
    subscriptionRevenue: 890,
    tokenRevenue: 430
  };
  
  // Chart loading fallback
  const ChartFallback = () => (
    <div className="h-[200px] md:h-[300px] w-full flex items-center justify-center">
      <Skeleton className="h-full w-full" />
    </div>
  );
  
  return (
    <Card className="col-span-3">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-2 space-y-2 sm:space-y-0">
        <CardTitle className="text-lg sm:text-xl flex items-center">
          <Wallet className="h-5 w-5 mr-2" />
          <span>Revenus</span>
        </CardTitle>
        <Button variant="outline" size="sm" className="w-full sm:w-auto">
          <DollarSign className="h-4 w-4 mr-1" />
          Demander un retrait
        </Button>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
          <div className="p-3 sm:p-4 bg-secondary/30 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Revenue Total</div>
            <div className="text-xl sm:text-2xl font-bold">${metrics.totalRevenue}</div>
            <div className="flex items-center mt-1 text-xs text-green-500">
              <TrendingUp className="h-3 w-3 mr-1" />
              {metrics.growthRate}% ce mois
            </div>
          </div>
          
          <div className="p-3 sm:p-4 bg-secondary/30 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Ce mois-ci</div>
            <div className="text-xl sm:text-2xl font-bold">${metrics.monthlyRevenue}</div>
            <div className="flex items-center mt-1 text-xs text-muted-foreground">
              <CreditCard className="h-3 w-3 mr-1" />
              Disponible pour retrait
            </div>
          </div>
          
          <div className="p-3 sm:p-4 bg-secondary/30 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Abonnements</div>
            <div className="text-xl sm:text-2xl font-bold">${metrics.subscriptionRevenue}</div>
            <div className="flex items-center mt-1 text-xs text-muted-foreground">
              <BarChart2 className="h-3 w-3 mr-1" />
              {Math.round(metrics.subscriptionRevenue / metrics.monthlyRevenue * 100)}% des revenus
            </div>
          </div>
          
          <div className="p-3 sm:p-4 bg-secondary/30 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Contenu Premium</div>
            <div className="text-xl sm:text-2xl font-bold">${metrics.tokenRevenue}</div>
            <div className="flex items-center mt-1 text-xs text-muted-foreground">
              <BarChart2 className="h-3 w-3 mr-1" />
              {Math.round(metrics.tokenRevenue / metrics.monthlyRevenue * 100)}% des revenus
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="monthly" className="w-full">
          <TabsList className="mb-4 w-full sm:w-auto overflow-x-auto whitespace-nowrap">
            <TabsTrigger value="monthly" className="text-xs sm:text-sm">Revenus Mensuels</TabsTrigger>
            <TabsTrigger value="sources" className="text-xs sm:text-sm">Sources de Revenus</TabsTrigger>
            <TabsTrigger value="content" className="text-xs sm:text-sm">Par Type de Contenu</TabsTrigger>
          </TabsList>
          
          <TabsContent value="monthly" className="mt-0">
            <div className="h-[200px] md:h-[300px]">
              <Suspense fallback={<ChartFallback />}>
                <RevenueAreaChart />
              </Suspense>
            </div>
          </TabsContent>
          
          <TabsContent value="sources" className="mt-0">
            <div className="h-[200px] md:h-[300px]">
              <Suspense fallback={<ChartFallback />}>
                <RevenueSourcePieChart />
              </Suspense>
            </div>
          </TabsContent>
          
          <TabsContent value="content" className="mt-0">
            <div className="h-[200px] md:h-[300px]">
              <Suspense fallback={<ChartFallback />}>
                <ContentTypeBarChart />
              </Suspense>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RevenueMetricsCard;
