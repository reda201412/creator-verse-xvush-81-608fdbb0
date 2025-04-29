import React from 'react';
import { useToast } from '@/components/ui/use-toast';
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, BarChart, Users, ArrowUp, ArrowDown } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { 
  Line, 
  LineChart, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  Tooltip, 
  Legend 
} from 'recharts';

// Mock data
const viewsData = [
  { date: '01/04', count: 2400 },
  { date: '02/04', count: 1398 },
  { date: '03/04', count: 9800 },
  { date: '04/04', count: 3908 },
  { date: '05/04', count: 4800 },
  { date: '06/04', count: 3800 },
  { date: '07/04', count: 4300 },
];

const growthData = [
  { name: 'Jan', subscribers: 400, revenue: 2400 },
  { name: 'Fev', subscribers: 300, revenue: 1398 },
  { name: 'Mar', subscribers: 500, revenue: 9800 },
  { name: 'Avr', subscribers: 780, revenue: 3908 },
  { name: 'Mai', subscribers: 890, revenue: 4800 },
  { name: 'Jun', subscribers: 1390, revenue: 3800 },
  { name: 'Jul', subscribers: 1490, revenue: 4300 },
];

const Dashboard = () => {
  const { toast } = useToast();
  
  React.useEffect(() => {
    toast({
      title: 'Tableau de bord chargé',
      description: 'Bienvenue sur votre tableau de bord de créateur',
    });
  }, [toast]);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">Tableau de bord</h1>
          <p className="text-muted-foreground">Analysez vos performances et l'engagement de votre audience</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard 
            title="Nouveaux abonnés" 
            value="128" 
            change="+14%" 
            trend="up" 
            icon={<Users />}
          />
          <StatCard 
            title="Vues" 
            value="8,564" 
            change="+23%" 
            trend="up" 
            icon={<BarChart />}
          />
          <StatCard 
            title="Revenus" 
            value="$1,256" 
            change="+7%" 
            trend="up" 
            icon={<BarChart />}
          />
          <StatCard 
            title="Événements" 
            value="3" 
            description="Cette semaine" 
            icon={<Calendar />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Vues de contenu</CardTitle>
              <CardDescription>Les 7 derniers jours</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ChartContainer
                config={{
                  views: { label: "Vues", color: "#8B5CF6" },
                }}
              >
                <LineChart data={viewsData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip>
                    <ChartTooltipContent />
                  </ChartTooltip>
                  <Line
                    type="monotone"
                    dataKey="count"
                    name="views"
                    stroke="var(--color-views)"
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Croissance</CardTitle>
              <CardDescription>Abonnés et revenus</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ChartContainer
                config={{
                  subscribers: { label: "Abonnés", color: "#D946EF" },
                  revenue: { label: "Revenus", color: "#0EA5E9" },
                }}
              >
                <AreaChart
                  data={growthData}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <ChartTooltip>
                    <ChartTooltipContent />
                  </ChartTooltip>
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="subscribers"
                    name="subscribers"
                    stroke="var(--color-subscribers)"
                    fill="var(--color-subscribers)"
                    fillOpacity={0.3}
                  />
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="revenue"
                    name="revenue"
                    stroke="var(--color-revenue)"
                    fill="var(--color-revenue)"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down';
  description?: string;
  icon: React.ReactNode;
}

const StatCard = ({ title, value, change, trend, description, icon }: StatCardProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-2xl font-bold">{value}</h3>
              {change && (
                <span className={cn(
                  'text-xs font-medium',
                  trend === 'up' ? 'text-green-500' : 'text-red-500'
                )}>
                  {trend === 'up' ? <ArrowUp size={12} className="inline mr-0.5" /> : <ArrowDown size={12} className="inline mr-0.5" />}
                  {change}
                </span>
              )}
            </div>
            {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
          </div>
          <div className="bg-primary/10 p-2 rounded-full">
            <div className="text-primary">
              {icon}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Dashboard;
