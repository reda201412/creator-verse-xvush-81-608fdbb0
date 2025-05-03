import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart as BarChartIcon, 
  TrendingUp, 
  ArrowUp, 
  ArrowDown,
  Users, 
  Heart,
  Eye,
  Sparkles,
  LayoutDashboard,
  Clock,
  Lightbulb,
  Zap,
  Activity,
  Star
} from 'lucide-react';
import { ChartContainer } from '@/components/ui/chart';
import { 
  Line, 
  LineChart, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  Tooltip as RechartsTooltip, 
  Legend,
  PieChart,
  Pie,
  Cell,
  Scatter,
  ScatterChart,
  Bar,
  BarChart
} from 'recharts';
import { toast } from '@/components/ui/sonner';
import { useNeuroAesthetic } from '@/hooks/use-neuro-aesthetic';

// Revenue DNA data
const revenueDnaData = [
  { name: 'Abonnements', value: 65 },
  { name: 'Contenus Premium', value: 20 },
  { name: 'Tips', value: 10 },
  { name: 'Merchandising', value: 5 },
];

// Fan Engagement Data for Fan Value Cartography
const fanData = Array(100).fill(null).map((_, i) => ({
  id: `fan-${i}`,
  engagement: Math.random() * 100,
  value: 10 + Math.random() * 150,
  risk: Math.random() * 10,
  lifetime: Math.random() * 12, // months
  // Position for 3D effect
  x: Math.random() * 100,
  y: Math.random() * 100,
}));

// Revenue Trends Data
const revenueTrendsData = [
  { date: 'Jan', revenue: 2400, predicted: 2600 },
  { date: 'Fév', revenue: 1398, predicted: 1550 },
  { date: 'Mar', revenue: 9800, predicted: 10200 },
  { date: 'Avr', revenue: 3908, predicted: 4100 },
  { date: 'Mai', revenue: 4800, predicted: 5300 },
  { date: 'Juin', revenue: 3800, predicted: 4200 },
  { date: 'Juil', revenue: 4300, predicted: 5000 },
];

// Emotional Intelligence Data
const emotionalData = [
  { content: 'Tutorial #23', joy: 67, interest: 82, surprise: 45, anger: 5, sadness: 3 },
  { content: 'Behind Scenes', joy: 78, interest: 65, surprise: 60, anger: 2, sadness: 5 },
  { content: 'Q&A Session', joy: 45, interest: 90, surprise: 30, anger: 10, sadness: 8 },
  { content: 'Product Review', joy: 55, interest: 75, surprise: 50, anger: 15, sadness: 10 },
];

// Creator Wellbeing Data
const wellbeingData = [
  { day: 'Lun', productivity: 65, wellbeing: 70, balance: 60 },
  { day: 'Mar', productivity: 70, wellbeing: 65, balance: 67 },
  { day: 'Mer', productivity: 60, wellbeing: 50, balance: 55 },
  { day: 'Jeu', productivity: 80, wellbeing: 75, balance: 77 },
  { day: 'Ven', productivity: 70, wellbeing: 80, balance: 75 },
  { day: 'Sam', productivity: 50, wellbeing: 90, balance: 70 },
  { day: 'Dim', productivity: 30, wellbeing: 95, balance: 62 },
];

// Fan Segments Data
const fanSegments = [
  { id: 1, name: 'Super Fans', count: 128, growth: '+12%', value: '$35/mois', color: '#D946EF' },
  { id: 2, name: 'Réguliers', count: 952, growth: '+7%', value: '$17/mois', color: '#8B5CF6' },
  { id: 3, name: 'Occasionnels', count: 2048, growth: '+15%', value: '$8/mois', color: '#0EA5E9' },
  { id: 4, name: 'À risque', count: 341, growth: '-4%', value: '$12/mois', color: '#F97316' },
];

const COLORS = ['#D946EF', '#8B5CF6', '#0EA5E9', '#F97316'];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [insights, setInsights] = useState<string[]>([]);
  const [activeInsight, setActiveInsight] = useState(0);
  const { triggerMicroReward, updateConfig } = useNeuroAesthetic({});
  const [showCommandCenter, setShowCommandCenter] = useState(false);

  // Simulated creator profile type detection
  const creatorProfile = 'visuel'; // Could be: analytique, visuel, intuitif

  // Initialize insights
  useEffect(() => {
    const creatorInsights = [
      "Vos revenus sont en hausse de 23% par rapport au mois dernier",
      "Votre contenu 'Tutorial #23' génère un engagement émotionnel très positif",
      "72 fans à risque identifiés - une campagne de rétention est recommandée",
      "Opportunité: Augmenter vos offres premium de 5% pourrait générer +15% de revenus",
      "Alerte bien-être: Votre rythme actuel pourrait mener à un épuisement dans 3 semaines"
    ];
    setInsights(creatorInsights);
    
    // Set interval to rotate through insights
    const interval = setInterval(() => {
      setActiveInsight(current => (current + 1) % creatorInsights.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);

  // Simulate opportunity detection
  useEffect(() => {
    const timer = setTimeout(() => {
      toast("Opportunité détectée", {
        description: "Un groupe de fans est prêt pour une offre spéciale",
        action: {
          label: "Explorer",
          onClick: () => triggerMicroReward('opportunity')
        }
      });
    }, 15000);
    
    return () => clearTimeout(timer);
  }, [triggerMicroReward]);

  const handleCommandCenter = () => {
    setShowCommandCenter(prev => !prev);
    triggerMicroReward('click');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Intelligence Layer - Insights Banner */}
        <motion.div 
          className="relative bg-primary/10 rounded-lg p-4 mb-6 overflow-hidden border border-primary/20"
          whileHover={{ scale: 1.005 }}
        >
          <div className="flex items-center">
            <div className="bg-primary/20 p-2 rounded-full mr-4">
              <Sparkles className="text-primary h-5 w-5" />
            </div>
            <div>
              <AnimatePresence mode="wait">
                <motion.div 
                  key={activeInsight}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="font-medium"
                >
                  {insights[activeInsight]}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
        
        {/* Header with Creator Fingerprint UI Indicator */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-display font-bold flex items-center gap-3">
              Tableau de Bord
              <Badge variant="outline" className="bg-primary/10 text-xs font-normal">
                Profil {creatorProfile}
              </Badge>
            </h1>
            <p className="text-muted-foreground">
              Votre centre de commande créatif intelligent
            </p>
          </div>
          
          {/* Decision Velocity Hub Trigger */}
          <Button 
            onClick={handleCommandCenter} 
            className="flex items-center gap-2"
            variant={showCommandCenter ? "default" : "outline"}
          >
            <LayoutDashboard size={16} />
            Centre de Commande
          </Button>
        </div>

        {/* Decision Velocity Hub / Command Center */}
        <AnimatePresence>
          {showCommandCenter && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <Card className="border border-primary/20 bg-background/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Centre de Commande
                  </CardTitle>
                  <CardDescription>
                    Actions rapides et décisions critiques
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="secondary" className="flex items-center justify-start gap-2" onClick={() => triggerMicroReward('action')}>
                      <Lightbulb size={16} />
                      Générer nouveau contenu
                    </Button>
                    <Button variant="secondary" className="flex items-center justify-start gap-2" onClick={() => triggerMicroReward('action')}>
                      <Activity size={16} />
                      Analyser performances
                    </Button>
                    <Button variant="secondary" className="flex items-center justify-start gap-2" onClick={() => triggerMicroReward('action')}>
                      <Users size={16} />
                      Campagne de rétention
                    </Button>
                    <Button variant="secondary" className="flex items-center justify-start gap-2" onClick={() => triggerMicroReward('action')}>
                      <Star size={16} />
                      Optimiser prix
                    </Button>
                    <Button variant="secondary" className="flex items-center justify-start gap-2" onClick={() => triggerMicroReward('action')}>
                      <Clock size={16} />
                      Planifier publications
                    </Button>
                    <Button variant="secondary" className="flex items-center justify-start gap-2" onClick={() => triggerMicroReward('action')}>
                      <Heart size={16} />
                      Engagement communauté
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Dashboard Tabs with Psychometric Interface Adaptation */}
        <Tabs 
          defaultValue="overview" 
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value);
            triggerMicroReward('tab');
          }}
          className="space-y-6"
        >
          <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <LayoutDashboard size={16} />
              Vue d'ensemble
            </TabsTrigger>
            <TabsTrigger value="revenue" className="flex items-center gap-2">
              <BarChartIcon size={16} />
              Revenus
            </TabsTrigger>
            <TabsTrigger value="audience" className="flex items-center gap-2">
              <Users size={16} />
              Audience
            </TabsTrigger>
            <TabsTrigger value="wellbeing" className="flex items-center gap-2">
              <Heart size={16} />
              Bien-être
            </TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard 
                title="Revenus" 
                value="€4,285" 
                change="+23%" 
                trend="up" 
                icon={<BarChartIcon className="text-emerald-500" />}
                onClick={() => setActiveTab('revenue')}
              />
              <StatCard 
                title="Fans actifs" 
                value="3,472" 
                change="+7%" 
                trend="up" 
                icon={<Users className="text-blue-500" />}
                onClick={() => setActiveTab('audience')}
              />
              <StatCard 
                title="Engagement" 
                value="68%" 
                change="+12%" 
                trend="up" 
                icon={<Heart className="text-pink-500" />}
              />
              <StatCard 
                title="Score bien-être" 
                value="84/100" 
                change="-3%" 
                trend="down" 
                icon={<Activity className="text-purple-500" />}
                onClick={() => setActiveTab('wellbeing')}
              />
            </div>
            
            {/* Revenue Telescope & Emotional Intelligence */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Telescope */}
              <Card className="border border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Eye size={18} className="text-primary" />
                    Revenue Telescope
                  </CardTitle>
                  <CardDescription>
                    Visualisation temporelle des revenus
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ChartContainer
                    config={{
                      revenue: { label: "Actuel", color: "#8B5CF6" },
                      predicted: { label: "Prédit", color: "#D946EF" },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={revenueTrendsData}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <RechartsTooltip 
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-background border border-border rounded-md p-2 shadow-md text-xs">
                                  <p className="font-medium">{label}</p>
                                  <p className="text-purple-500">Actuel: €{payload[0].value}</p>
                                  <p className="text-pink-500">Prédit: €{payload[1].value}</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          name="revenue"
                          stroke="var(--color-revenue)"
                          fill="var(--color-revenue)"
                          fillOpacity={0.3}
                        />
                        <Area
                          type="monotone"
                          dataKey="predicted"
                          name="predicted"
                          stroke="var(--color-predicted)"
                          fill="var(--color-predicted)"
                          fillOpacity={0.3}
                          strokeDasharray="5 5"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
              
              {/* Emotional Intelligence Layer */}
              <Card className="border border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Heart size={18} className="text-pink-500" />
                    Emotional Intelligence Layer
                  </CardTitle>
                  <CardDescription>
                    Analyse des réactions émotionnelles par contenu
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={emotionalData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 10,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="content" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Bar dataKey="joy" name="Joie" fill="#F59E0B" />
                      <Bar dataKey="interest" name="Intérêt" fill="#3B82F6" />
                      <Bar dataKey="surprise" name="Surprise" fill="#10B981" />
                      <Bar dataKey="anger" name="Colère" fill="#EF4444" />
                      <Bar dataKey="sadness" name="Tristesse" fill="#6B7280" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            
            {/* Fan Value Cartography & Revenue DNA */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Fan Value Cartography */}
              <Card className="border border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Users size={18} className="text-blue-500" />
                    Fan Value Cartography
                  </CardTitle>
                  <CardDescription>
                    Visualisation de la valeur et de l'engagement des fans
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart
                      margin={{
                        top: 20,
                        right: 20,
                        bottom: 20,
                        left: 20,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        type="number" 
                        dataKey="engagement" 
                        name="Engagement" 
                        label={{ value: 'Engagement', position: 'bottom' }} 
                      />
                      <YAxis 
                        type="number" 
                        dataKey="value" 
                        name="Valeur" 
                        label={{ value: 'Valeur (€)', angle: -90, position: 'insideLeft' }} 
                      />
                      <RechartsTooltip 
                        cursor={{ strokeDasharray: '3 3' }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-background border border-border rounded-md p-2 shadow-md">
                                <p className="font-medium text-xs">Fan #{payload[0].payload.id}</p>
                                <p className="text-xs">Valeur: €{payload[1].value}</p>
                                <p className="text-xs">Engagement: {payload[0].value}%</p>
                                <p className="text-xs">Risque de départ: {payload[0].payload.risk.toFixed(1)}/10</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Scatter 
                        name="Fans" 
                        data={fanData} 
                        fill="#8884d8"
                        shape={(props) => {
                          const { cx, cy, payload } = props;
                          // Size based on lifetime value
                          const size = 4 + (payload.lifetime * 0.8);
                          // Color based on risk (green = low risk, red = high risk)
                          const riskColor = payload.risk > 7 
                            ? '#EF4444' // high risk
                            : payload.risk > 4 
                              ? '#F59E0B' // medium risk
                              : '#10B981'; // low risk
                          
                          return (
                            <circle 
                              cx={cx} 
                              cy={cy} 
                              r={size} 
                              fill={riskColor}
                              fillOpacity={0.7}
                              stroke="none"
                            />
                          );
                        }}
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              {/* Revenue DNA */}
              <Card className="border border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Activity size={18} className="text-emerald-500" />
                    Revenue DNA Visualization
                  </CardTitle>
                  <CardDescription>
                    Décomposition de vos sources de revenus
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80 flex flex-col">
                  <ResponsiveContainer width="100%" height="80%">
                    <PieChart>
                      <Pie
                        data={revenueDnaData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {revenueDnaData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        formatter={(value) => [`${value}%`, 'Proportion']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-2 mt-auto">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs"
                      onClick={() => {
                        setActiveTab('revenue');
                        triggerMicroReward('navigate');
                      }}
                    >
                      Analyse détaillée
                    </Button>
                    <Button 
                      size="sm" 
                      className="text-xs"
                      onClick={() => {
                        toast("Quantum Revenue Projection lancée", {
                          description: "Analyse en cours..."
                        });
                        triggerMicroReward('analyze');
                      }}
                    >
                      Projections avancées
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Revenue Tab */}
          <TabsContent value="revenue">
            <div className="space-y-6">
              <Card className="border border-primary/20">
                <CardHeader>
                  <CardTitle>Quantum Revenue Projector</CardTitle>
                  <CardDescription>
                    Simulez l'impact financier de différentes décisions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">Module d'analyse prédictive avancée</p>
                    <Button
                      onClick={() => {
                        toast("Simulation lancée", {
                          description: "Analyse des scénarios de monétisation en cours"
                        });
                        triggerMicroReward('analyze');
                      }}
                    >
                      Lancer une simulation
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border border-primary/20">
                  <CardHeader>
                    <CardTitle>Dynamic Pricing Engine</CardTitle>
                    <CardDescription>
                      Optimisations tarifaires basées sur la demande
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-60 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-muted-foreground mb-2">Analyses d'élasticité des prix en cours</p>
                      <Button variant="outline">Afficher les recommandations</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border border-primary/20">
                  <CardHeader>
                    <CardTitle>Monetization Mix Optimizer</CardTitle>
                    <CardDescription>
                      Répartition idéale entre types de revenus
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-60 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-muted-foreground mb-2">Analyse des flux de revenus</p>
                      <Button variant="outline">Optimiser la répartition</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Audience Tab */}
          <TabsContent value="audience">
            <div className="space-y-6">
              <Card className="border border-primary/20">
                <CardHeader>
                  <CardTitle>Segmentation des fans</CardTitle>
                  <CardDescription>
                    Analyse et catégorisation de votre communauté
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {fanSegments.map(segment => (
                      <div 
                        key={segment.id}
                        className="border border-muted rounded-lg p-4 hover:border-primary/30 transition-all cursor-pointer"
                        style={{ borderLeftWidth: '4px', borderLeftColor: segment.color }}
                        onClick={() => triggerMicroReward('select')}
                      >
                        <h3 className="font-semibold mb-2">{segment.name}</h3>
                        <div className="flex justify-between text-sm">
                          <span>{segment.count} fans</span>
                          <span className={cn(
                            segment.growth.startsWith('+') ? "text-green-500" : "text-red-500"
                          )}>{segment.growth}</span>
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                          Valeur moyenne: {segment.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border border-primary/20">
                <CardHeader>
                  <CardTitle>Super-Fan Detection System</CardTitle>
                  <CardDescription>
                    Identification des opportunités d'upsell
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-60 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-muted-foreground mb-2">42 super-fans potentiels identifiés</p>
                    <Button variant="outline">Explorer les opportunités</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Wellbeing Tab */}
          <TabsContent value="wellbeing">
            <div className="space-y-6">
              <Card className="border border-primary/20">
                <CardHeader>
                  <CardTitle>Creator Wellbeing Matrix</CardTitle>
                  <CardDescription>
                    Équilibre entre productivité et bien-être
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ChartContainer
                    config={{
                      productivity: { label: "Productivité", color: "#0EA5E9" },
                      wellbeing: { label: "Bien-être", color: "#8B5CF6" },
                      balance: { label: "Équilibre", color: "#10B981" },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={wellbeingData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="day" />
                        <YAxis domain={[0, 100]} />
                        <RechartsTooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="productivity" 
                          name="productivity" 
                          stroke="var(--color-productivity)" 
                          activeDot={{ r: 8 }} 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="wellbeing" 
                          name="wellbeing" 
                          stroke="var(--color-wellbeing)" 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="balance" 
                          name="balance" 
                          stroke="var(--color-balance)"
                          strokeDasharray="5 5"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
              
              <Card className="border border-primary/20">
                <CardHeader>
                  <CardTitle>Creator Wellbeing Optimizer</CardTitle>
                  <CardDescription>
                    Recommandations personnalisées pour votre équilibre
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 p-3 bg-muted/30 rounded-md">
                    <h4 className="font-medium text-sm">Recommandations du jour:</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Clock size={16} className="text-blue-500" />
                        Prendre une pause de 30 minutes après 2h de travail continu
                      </li>
                      <li className="flex items-center gap-2">
                        <Users size={16} className="text-purple-500" />
                        Déléguer la modération des commentaires pour réduire la charge
                      </li>
                      <li className="flex items-center gap-2">
                        <Heart size={16} className="text-pink-500" />
                        Prévoir une journée sans création cette semaine
                      </li>
                    </ul>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-2"
                      onClick={() => triggerMicroReward('wellbeing')}
                    >
                      Plus de recommandations
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down';
  icon: React.ReactNode;
  onClick?: () => void;
}

const StatCard = ({ title, value, change, trend, icon, onClick }: StatCardProps) => {
  return (
    <Card 
      className="border border-primary/20 hover:border-primary/40 transition-all"
      onClick={onClick}
    >
      <CardContent className={`pt-6 ${onClick ? 'cursor-pointer' : ''}`}>
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
          </div>
          <div className="bg-primary/10 p-2 rounded-full">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Dashboard;
