
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EyeIcon, TrendingUp, DollarSign, ChartBar } from 'lucide-react';
// import { getVideoById } from '@/integrations/supabase/client'; // Ancienne importation
import { getVideoById, VideoSupabaseData } from '@/services/creatorService'; // Modifié pour utiliser le nom mis à jour et le type Supabase
import { formatNumber } from '@/lib/utils';

interface VideoAnalyticsModalProps {
  videoId: number | null; // Changed to number as per Supabase schema
  isOpen: boolean;
  onClose: () => void;
}

// Les données analytiques viendront de MUX ou d'une collection Firestore dédiée
interface VideoAnalytics {
  views: number;
  uniqueViewers: number;
  watchTime: number; // Heures ou minutes, à clarifier
  completionRate: number; // 0.0 - 1.0
  revenue: number;
  likes: number;
  comments: number;
  shares: number;
  dailyViews: { date: string; views: number }[];
  engagement: { name: string; value: number }[];
  revenueBreakdown: { source: string; amount: number }[];
}

const VideoAnalyticsModal: React.FC<VideoAnalyticsModalProps> = ({ videoId, isOpen, onClose }) => {
  const [videoDetails, setVideoDetails] = useState<VideoSupabaseData | null>(null); // Updated type
  const [analytics, setAnalytics] = useState<VideoAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (isOpen && videoId !== null) { // Added null check for videoId
      setLoading(true);
      setVideoDetails(null); // Réinitialiser pour éviter d'afficher d'anciennes données
      setAnalytics(null);
      
      const fetchData = async () => {
        try {
          // Use the correctly imported and renamed function
          const fetchedVideo = await getVideoById(videoId);
          if (fetchedVideo) {
            setVideoDetails(fetchedVideo);
            // TODO: Remplacer par la récupération des vraies données analytiques pour cette vidéo
            // Soit depuis MUX Data API, soit depuis une collection Firestore où vous stockez ces stats.
            // Pass the fetchedVideo data, but generate mock analytics independently for now
            generateMockAnalytics(); 
          } else {
            console.error('Video not found for analytics');
            // Gérer le cas où la vidéo n'est pas trouvée
             setLoading(false); // Ensure loading is set to false even if video not found
          }
        } catch (error) {
          console.error('Error fetching video details for analytics:', error);
           setLoading(false); // Ensure loading is set to false on error
        }
      };

      fetchData();
    } else if (!isOpen) {
        // Reset state when modal is closed
        setVideoDetails(null);
        setAnalytics(null);
        setLoading(true);
        setActiveTab('overview');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, videoId]); // generateMockAnalytics is not a stable dependency if defined within the scope

  // Function to generate mock analytics data (to be replaced with real data)
  // This function now generates random data and does not rely on properties from the video object
  const generateMockAnalytics = () => {
    const mockAnalytics: VideoAnalytics = {
      views: Math.floor(Math.random() * 15000) + 500,
      uniqueViewers: Math.floor(Math.random() * 8000) + 300,
      watchTime: Math.floor(Math.random() * 100) + 20,
      completionRate: Math.random() * 0.5 + 0.4,
      revenue: Math.floor(Math.random() * 1000) + 50,
      likes: Math.floor(Math.random() * 2000) + 100,
      comments: Math.floor(Math.random() * 300) + 10,
      shares: Math.floor(Math.random() * 500) + 20,
      dailyViews: [],
      engagement: [
        { name: 'Likes', value: 0 },
        { name: 'Comments', value: 0 },
        { name: 'Shares', value: 0 },
        { name: 'Saves', value: Math.floor(Math.random() * 400) + 30 }
      ],
      revenueBreakdown: [
        { source: 'Premium Access', amount: 0 },
        { source: 'Tips', amount: Math.floor(Math.random() * 200) + 20 },
        { source: 'Sponsorships', amount: Math.floor(Math.random() * 300) + 30 }
      ]
    };

    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const day = date.toISOString().split('T')[0];
      mockAnalytics.dailyViews.push({ date: day, views: Math.floor(Math.random() * 500) + 10 });
    }
    mockAnalytics.engagement[0].value = mockAnalytics.likes;
    mockAnalytics.engagement[1].value = mockAnalytics.comments;
    mockAnalytics.engagement[2].value = mockAnalytics.shares;
    // The distribution of revenue breakdown should sum up to the total mock revenue
    const premiumRevenue = Math.floor(mockAnalytics.revenue * 0.6);
    const tipsRevenue = Math.floor(mockAnalytics.revenue * 0.2);
    const sponsorshipsRevenue = mockAnalytics.revenue - premiumRevenue - tipsRevenue;
    mockAnalytics.revenueBreakdown[0].amount = premiumRevenue;
    mockAnalytics.revenueBreakdown[1].amount = tipsRevenue;
    mockAnalytics.revenueBreakdown[2].amount = sponsorshipsRevenue;

    setAnalytics(mockAnalytics);
    setLoading(false); // Mettre fin au chargement après avoir généré/récupéré les analytics
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {loading || !videoDetails ? 'Chargement des statistiques...' : `Statistiques: ${videoDetails?.title}`}
          </DialogTitle>
        </DialogHeader>

        {loading || !analytics ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-4">
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                <TabsTrigger value="engagement">Engagement</TabsTrigger>
                <TabsTrigger value="revenue">Revenus</TabsTrigger>
                <TabsTrigger value="audience">Audience</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Vues totales</p><p className="text-2xl font-bold">{formatNumber(analytics.views)}</p></div><EyeIcon className="h-5 w-5 text-blue-500" /></div></CardContent></Card>
                  <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Taux d'achèvement</p><p className="text-2xl font-bold">{Math.round(analytics.completionRate * 100)}%</p></div><TrendingUp className="h-5 w-5 text-green-500" /></div></CardContent></Card>
                  <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Revenus</p><p className="text-2xl font-bold">{analytics.revenue} €</p></div><DollarSign className="h-5 w-5 text-amber-500" /></div></CardContent></Card>
                  <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Engagement</p><p className="text-2xl font-bold">{analytics.likes + analytics.comments + analytics.shares}</p></div><ChartBar className="h-5 w-5 text-purple-500" /></div></CardContent></Card>
                </div>
                <Card><CardHeader><CardTitle>Vues au fil du temps</CardTitle></CardHeader><CardContent>
                  <ChartContainer config={{ views: { label: 'Vues', color: '#4f46e5' } }} className="aspect-[4/3] md:aspect-[2/1] lg:aspect-[3/1]">
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={analytics.dailyViews}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })} tick={{ fontSize: 12 }} tickMargin={10} />
                        <YAxis />
                        <ChartTooltip content={({ active, payload, label }) => active && payload && payload.length ? <ChartTooltipContent label={new Date(label).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })} payload={payload} /> : null} />
                        <Line type="monotone" dataKey="views" name="views" stroke="#4f46e5" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent></Card>
              </TabsContent>

              <TabsContent value="engagement" className="space-y-4">
                <Card><CardHeader><CardTitle>Statistiques d'engagement</CardTitle></CardHeader><CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="space-y-2"><p className="text-sm text-muted-foreground">J'aime</p><p className="text-2xl font-bold">{formatNumber(analytics.likes)}</p></div>
                    <div className="space-y-2"><p className="text-sm text-muted-foreground">Commentaires</p><p className="text-2xl font-bold">{formatNumber(analytics.comments)}</p></div>
                    <div className="space-y-2"><p className="text-sm text-muted-foreground">Partages</p><p className="text-2xl font-bold">{formatNumber(analytics.shares)}</p></div>
                    <div className="space-y-2"><p className="text-sm text-muted-foreground">Enregistrements</p><p className="text-2xl font-bold">{formatNumber(analytics.engagement[3].value)}</p></div>
                  </div>
                  <ChartContainer config={{ engagement: { label: 'Engagement', color: '#8b5cf6' } }} className="aspect-[3/2]">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={analytics.engagement}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" /><YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="value" name="engagement" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent></Card>
              </TabsContent>

              <TabsContent value="revenue" className="space-y-4">
                 <Card><CardHeader><CardTitle>Aperçu des revenus</CardTitle></CardHeader><CardContent>
                    <div className="mb-6"><div className="text-3xl font-bold mb-1">{analytics.revenue} €</div><p className="text-sm text-muted-foreground">Revenus totaux générés par cette vidéo</p></div>
                    <div className="space-y-6"><div><h4 className="font-medium mb-2">Revenus par source</h4>
                        <Table><TableHeader><TableRow><TableHead>Source</TableHead><TableHead className="text-right">Montant</TableHead><TableHead className="text-right">Pourcentage</TableHead></TableRow></TableHeader><TableBody>
                        {analytics.revenueBreakdown.map((item) => (<TableRow key={item.source}><TableCell>{item.source}</TableCell><TableCell className="text-right">{item.amount} €</TableCell><TableCell className="text-right">{analytics.revenue ? Math.round((item.amount / analytics.revenue) * 100) : 0}%</TableCell></TableRow>))}
                        </TableBody></Table>
                    </div><div><h4 className="font-medium mb-2">Répartition des revenus</h4>
                        <ChartContainer config={{ revenue: { label: 'Revenus', color: '#f59e0b' } }}>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={analytics.revenueBreakdown}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="source" /><YAxis /><ChartTooltip content={<ChartTooltipContent />} /><Bar dataKey="amount" name="revenue" fill="#f59e0b" radius={[4, 4, 0, 0]} /></BarChart>
                        </ResponsiveContainer>
                        </ChartContainer>
                    </div></div>
                </CardContent></Card>
              </TabsContent>

              <TabsContent value="audience" className="space-y-4">
                <Card><CardHeader><CardTitle>Informations sur l'audience</CardTitle></CardHeader><CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="space-y-2"><p className="text-sm text-muted-foreground">Spectateurs uniques</p><p className="text-2xl font-bold">{formatNumber(analytics.uniqueViewers)}</p></div>
                        <div className="space-y-2"><p className="text-sm text-muted-foreground">Temps de visionnage (heures)</p><p className="text-2xl font-bold">{analytics.watchTime}</p></div>
                    </div>
                    <div className="space-y-6"><div><h4 className="font-medium mb-2">Statistiques de rétention</h4>
                        <div className="bg-muted rounded-md p-4"><div className="flex justify-between mb-2"><span className="text-sm text-muted-foreground">Taux d'achèvement</span><span className="font-medium">{Math.round(analytics.completionRate * 100)}%</span></div><div className="w-full bg-muted-foreground/20 rounded-full h-2.5"><div className="bg-primary h-2.5 rounded-full" style={{ width: `${Math.round(analytics.completionRate * 100)}%` }}></div></div></div>
                    </div><div><h4 className="font-medium mb-2">Sources de trafic</h4>
                        <Table><TableHeader><TableRow><TableHead>Source</TableHead><TableHead className="text-right">Vues</TableHead><TableHead className="text-right">Pourcentage</TableHead></TableRow></TableHeader><TableBody>
                            <TableRow><TableCell>Profil</TableCell><TableCell className="text-right">{Math.round(analytics.views * 0.45)}</TableCell><TableCell className="text-right">45%</TableCell></TableRow>
                            <TableRow><TableCell>Recherche</TableCell><TableCell className="text-right">{Math.round(analytics.views * 0.25)}</TableCell><TableCell className="text-right">25%</TableCell></TableRow>
                            <TableRow><TableCell>Externe</TableCell><TableCell className="text-right">{Math.round(analytics.views * 0.18)}</TableCell><TableCell className="text-right">18%</TableCell></TableRow>
                            <TableRow><TableCell>Recommendations</TableCell><TableCell className="text-right">{Math.round(analytics.views * 0.12)}</TableCell><TableCell className="text-right">12%</TableCell></TableRow>
                        </TableBody></Table>
                    </div></div>
                </CardContent></Card>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end pt-2">
              <DialogClose asChild>
                <Button variant="outline" onClick={onClose}>Fermer</Button>
              </DialogClose>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VideoAnalyticsModal;
