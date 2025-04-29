
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Users, Heart, MessageSquare, Star } from 'lucide-react';
import { CustomTooltip } from '@/components/charts/CustomTooltip';
import { ChartContainer } from '@/components/ui/chart';

interface EngagementDashboardProps {
  className?: string;
}

// Données simulées
const engagementData = [
  { month: 'Jan', views: 1200, likes: 450, comments: 120, subscriptions: 15 },
  { month: 'Fév', views: 1800, likes: 720, comments: 180, subscriptions: 22 },
  { month: 'Mar', views: 2400, likes: 950, comments: 230, subscriptions: 28 },
  { month: 'Avr', views: 2100, likes: 830, comments: 190, subscriptions: 25 },
  { month: 'Mai', views: 2800, likes: 1100, comments: 280, subscriptions: 35 },
  { month: 'Juin', views: 3200, likes: 1250, comments: 320, subscriptions: 42 },
];

const retentionData = [
  { month: 'Jan', rate: 85 },
  { month: 'Fév', rate: 82 },
  { month: 'Mar', rate: 88 },
  { month: 'Avr', rate: 91 },
  { month: 'Mai', rate: 89 },
  { month: 'Juin', rate: 93 },
];

const topContentData = [
  { title: 'Sunset Dance', views: 12000, likes: 3200, comments: 215 },
  { title: 'Night Sky', views: 15000, likes: 4300, comments: 320 },
  { title: 'Digital Dreams', views: 18500, likes: 5200, comments: 410 },
  { title: 'Dawn Light', views: 11200, likes: 3500, comments: 230 },
  { title: 'Mountain Mist', views: 9700, likes: 2800, comments: 185 },
];

const superfansData = [
  { month: 'Jan', count: 220, growth: 0 },
  { month: 'Fév', count: 280, growth: 27.3 },
  { month: 'Mar', count: 350, growth: 25.0 },
  { month: 'Avr', count: 410, growth: 17.1 },
  { month: 'Mai', count: 480, growth: 17.1 },
  { month: 'Juin', count: 560, growth: 16.7 },
];

const EngagementDashboard = ({ className }: EngagementDashboardProps) => {
  return (
    <div className={`space-y-6 ${className}`}>
      <h2 className="text-2xl font-bold">Tableau de bord d'engagement</h2>
      
      {/* Résumé des métriques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Abonnés actifs"
          value="3,245"
          change="+12%"
          trend="up"
          icon={<Users className="h-4 w-4" />}
        />
        <MetricCard 
          title="Taux d'engagement"
          value="18.5%"
          change="+3.2%"
          trend="up"
          icon={<Heart className="h-4 w-4" />}
        />
        <MetricCard 
          title="Taux de rétention"
          value="93%"
          change="+4%"
          trend="up"
          icon={<Star className="h-4 w-4" />}
        />
        <MetricCard 
          title="Commentaires/jour"
          value="145"
          change="-2%"
          trend="down"
          icon={<MessageSquare className="h-4 w-4" />}
        />
      </div>
      
      {/* Graphiques d'engagement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Évolution de l'engagement</CardTitle>
            <CardDescription>Vues, likes et commentaires sur 6 mois</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ChartContainer
              config={{
                views: { label: "Vues", color: "#0EA5E9" },
                likes: { label: "J'aime", color: "#D946EF" },
                comments: { label: "Commentaires", color: "#8B5CF6" },
              }}
            >
              <AreaChart
                data={engagementData}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={(props) => <CustomTooltip {...props} />} />
                <Area
                  type="monotone"
                  dataKey="views"
                  name="views"
                  stroke="var(--color-views)"
                  fill="var(--color-views)"
                  fillOpacity={0.2}
                />
                <Area
                  type="monotone"
                  dataKey="likes"
                  name="likes"
                  stroke="var(--color-likes)"
                  fill="var(--color-likes)"
                  fillOpacity={0.2}
                />
                <Area
                  type="monotone"
                  dataKey="comments"
                  name="comments"
                  stroke="var(--color-comments)"
                  fill="var(--color-comments)"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Taux de rétention</CardTitle>
            <CardDescription>Pourcentage d'abonnés actifs au fil du temps</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ChartContainer
              config={{
                rate: { label: "Taux de rétention", color: "#22C55E" },
              }}
            >
              <LineChart
                data={retentionData}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis domain={[60, 100]} />
                <Tooltip content={(props) => <CustomTooltip {...props} />} />
                <Line
                  type="monotone"
                  dataKey="rate"
                  name="rate"
                  stroke="var(--color-rate)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Superfans */}
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Évolution des super-fans</CardTitle>
            <CardDescription>Croissance des abonnés les plus engagés</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ChartContainer
              config={{
                count: { label: "Super-fans", color: "#F59E0B" },
                growth: { label: "Croissance", color: "#10B981" },
              }}
            >
              <BarChart
                data={superfansData}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip content={(props) => <CustomTooltip {...props} />} />
                <Bar
                  yAxisId="left"
                  dataKey="count"
                  name="count"
                  fill="var(--color-count)"
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="growth"
                  name="growth"
                  stroke="var(--color-growth)"
                  strokeWidth={2}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Top Content */}
      <Card>
        <CardHeader>
          <CardTitle>Contenus les plus performants</CardTitle>
          <CardDescription>Basé sur les vues et l'engagement</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead className="text-right">Vues</TableHead>
                <TableHead className="text-right">J'aime</TableHead>
                <TableHead className="text-right">Commentaires</TableHead>
                <TableHead className="text-right">Taux d'engagement</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topContentData.map((content, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{content.title}</TableCell>
                  <TableCell className="text-right">{content.views.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{content.likes.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{content.comments.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    {((content.likes + content.comments) / content.views * 100).toFixed(1)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

// Composant pour afficher une métrique individuelle
interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down';
  icon?: React.ReactNode;
}

const MetricCard = ({ title, value, change, trend, icon }: MetricCardProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {change && (
              <div className={`flex items-center text-xs font-medium ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {trend === 'up' ? <ArrowUpRight className="mr-1 h-3 w-3" /> : <ArrowDownRight className="mr-1 h-3 w-3" />}
                {change}
              </div>
            )}
          </div>
          {icon && (
            <div className="rounded-full bg-primary/10 p-2 text-primary">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EngagementDashboard;
