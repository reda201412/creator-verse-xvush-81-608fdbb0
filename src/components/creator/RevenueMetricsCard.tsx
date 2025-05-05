
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart,
  AreaChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Legend,
  Cell
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Wallet, TrendingUp, BarChart2, CreditCard, DollarSign } from 'lucide-react';
import { useTronWallet } from '@/hooks/use-tron-wallet';

// Types de données pour les métriques de revenus
interface RevenueMetrics {
  totalRevenue: number;
  monthlyRevenue: number;
  growthRate: number;
  pendingWithdrawals: number;
  subscriptionRevenue: number;
  tokenRevenue: number;
}

// Données de revenus mensuels
const monthlyRevenueData = [
  { month: 'Jan', amount: 450 },
  { month: 'Fév', amount: 520 },
  { month: 'Mar', amount: 480 },
  { month: 'Avr', amount: 580 },
  { month: 'Mai', amount: 650 },
  { month: 'Juin', amount: 720 },
  { month: 'Juil', amount: 800 },
  { month: 'Août', amount: 920 },
  { month: 'Sep', amount: 880 },
  { month: 'Oct', amount: 1050 },
  { month: 'Nov', amount: 1180 },
  { month: 'Déc', amount: 1320 }
];

// Données des sources de revenus
const revenueSourceData = [
  { name: 'Abonnements', value: 68 },
  { name: 'Contenus Premium', value: 25 },
  { name: 'Pourboires', value: 7 }
];

// Couleurs pour le graphique en camembert
const COLORS = ['#9333ea', '#0ea5e9', '#f97316'];

// Type de contenu
const contentTypeData = [
  { name: 'Vidéos', value: 420 },
  { name: 'Photos', value: 180 },
  { name: 'Tutoriels', value: 320 },
  { name: 'Lives', value: 280 }
];

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
  
  return (
    <Card className="col-span-3">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl flex items-center">
          <Wallet className="h-5 w-5 mr-2" />
          <span>Revenus</span>
        </CardTitle>
        <Button variant="outline" size="sm">
          <DollarSign className="h-4 w-4 mr-1" />
          Demander un retrait
        </Button>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-secondary/30 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Revenue Total</div>
            <div className="text-2xl font-bold">${metrics.totalRevenue}</div>
            <div className="flex items-center mt-1 text-xs text-green-500">
              <TrendingUp className="h-3 w-3 mr-1" />
              {metrics.growthRate}% ce mois
            </div>
          </div>
          
          <div className="p-4 bg-secondary/30 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Ce mois-ci</div>
            <div className="text-2xl font-bold">${metrics.monthlyRevenue}</div>
            <div className="flex items-center mt-1 text-xs text-muted-foreground">
              <CreditCard className="h-3 w-3 mr-1" />
              Disponible pour retrait
            </div>
          </div>
          
          <div className="p-4 bg-secondary/30 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Abonnements</div>
            <div className="text-2xl font-bold">${metrics.subscriptionRevenue}</div>
            <div className="flex items-center mt-1 text-xs text-muted-foreground">
              <BarChart2 className="h-3 w-3 mr-1" />
              {Math.round(metrics.subscriptionRevenue / metrics.monthlyRevenue * 100)}% des revenus
            </div>
          </div>
          
          <div className="p-4 bg-secondary/30 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Contenu Premium</div>
            <div className="text-2xl font-bold">${metrics.tokenRevenue}</div>
            <div className="flex items-center mt-1 text-xs text-muted-foreground">
              <BarChart2 className="h-3 w-3 mr-1" />
              {Math.round(metrics.tokenRevenue / metrics.monthlyRevenue * 100)}% des revenus
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="monthly">
          <TabsList className="mb-4">
            <TabsTrigger value="monthly">Revenus Mensuels</TabsTrigger>
            <TabsTrigger value="sources">Sources de Revenus</TabsTrigger>
            <TabsTrigger value="content">Par Type de Contenu</TabsTrigger>
          </TabsList>
          
          <TabsContent value="monthly" className="mt-0">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyRevenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9333ea" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#9333ea" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#9333ea" 
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                    name="Revenu ($)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="sources" className="mt-0">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueSourceData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {revenueSourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Pourcentage']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="content" className="mt-0">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={contentTypeData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Revenu']} />
                  <Bar dataKey="value" fill="#0ea5e9" name="Revenu ($)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RevenueMetricsCard;
