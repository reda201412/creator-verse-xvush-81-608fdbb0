
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getVideoStats } from '@/services/videoService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Eye, ThumbsUp, MessageSquare, Clock, TrendingUp, Users } from 'lucide-react';

interface VideoAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string | null;
}

interface VideoStats {
  video_id: number;
  views: number;
  likes: number;
  comments_count: number;
  avg_watch_time_seconds: number;
  last_updated_at: string;
}

const VideoAnalyticsModal: React.FC<VideoAnalyticsModalProps> = ({ isOpen, onClose, videoId }) => {
  const [stats, setStats] = useState<VideoStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch video statistics
  useEffect(() => {
    const fetchVideoStats = async () => {
      if (!videoId || !isOpen) return;
      
      setLoading(true);
      
      try {
        const videoStats = await getVideoStats(videoId);
        console.log("Fetched video stats:", videoStats);
        
        if (videoStats) {
          // Ensure we have a complete VideoStats object
          const completeStats: VideoStats = {
            video_id: typeof videoStats.video_id === 'number' ? videoStats.video_id : parseInt(videoId),
            views: videoStats.views || 0,
            likes: videoStats.likes || 0,
            comments_count: videoStats.comments_count || 0,
            avg_watch_time_seconds: videoStats.avg_watch_time_seconds || 0,
            last_updated_at: videoStats.last_updated_at || new Date().toISOString()
          };
          setStats(completeStats);
        } else {
          // If no stats exist yet, create mock data for display
          const defaultStats: VideoStats = {
            video_id: parseInt(videoId),
            views: 0,
            likes: 0,
            comments_count: 0,
            avg_watch_time_seconds: 0,
            last_updated_at: new Date().toISOString()
          };
          setStats(defaultStats);
        }
      } catch (error) {
        console.error("Error fetching video stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoStats();
  }, [videoId, isOpen]);

  // Sample time series data for charts (would be replaced with real data in production)
  const viewsData = [
    { date: '01/05', views: 120 },
    { date: '02/05', views: 180 },
    { date: '03/05', views: 200 },
    { date: '04/05', views: 350 },
    { date: '05/05', views: 290 },
    { date: '06/05', views: 400 },
    { date: '07/05', views: stats?.views || 450 },
  ];

  const engagementData = [
    { name: 'Likes', value: stats?.likes || 0, color: '#10b981' },
    { name: 'Comments', value: stats?.comments_count || 0, color: '#3b82f6' },
    { name: 'Shares', value: Math.floor(Math.random() * 50), color: '#8b5cf6' },
  ];

  const audienceData = [
    { name: '18-24', value: 35 },
    { name: '25-34', value: 45 },
    { name: '35-44', value: 15 },
    { name: '45+', value: 5 },
  ];

  // Format watch time in a human-readable format
  const formatWatchTime = (seconds: number): string => {
    if (seconds < 60) return `${Math.round(seconds)} secondes`;
    if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
    return `${(seconds / 3600).toFixed(1)} heures`;
  };

  // Format date to locale string
  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Analytiques de la vidéo</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="pt-6 flex flex-col items-center">
                  <Eye className="h-8 w-8 text-blue-500 mb-2" />
                  <p className="text-sm text-muted-foreground">Vues</p>
                  <h3 className="text-2xl font-bold">{stats?.views.toLocaleString()}</h3>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6 flex flex-col items-center">
                  <ThumbsUp className="h-8 w-8 text-green-500 mb-2" />
                  <p className="text-sm text-muted-foreground">Likes</p>
                  <h3 className="text-2xl font-bold">{stats?.likes.toLocaleString()}</h3>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6 flex flex-col items-center">
                  <Clock className="h-8 w-8 text-amber-500 mb-2" />
                  <p className="text-sm text-muted-foreground">Temps moyen de visionnage</p>
                  <h3 className="text-2xl font-bold">{formatWatchTime(stats?.avg_watch_time_seconds || 0)}</h3>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                <TabsTrigger value="engagement">Engagement</TabsTrigger>
                <TabsTrigger value="audience">Audience</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Évolution des vues</CardTitle>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart
                        data={viewsData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="views"
                          stroke="#8884d8"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="font-medium mb-2">Informations supplémentaires</div>
                  <p className="text-sm text-muted-foreground">
                    Dernière mise à jour: {stats?.last_updated_at ? formatDate(stats.last_updated_at) : 'Jamais'}
                  </p>
                  <p className="text-sm mt-2 text-muted-foreground">
                    Le taux d'engagement de cette vidéo est {stats && stats.views > 0 ? ((stats.likes / stats.views) * 100).toFixed(1) : '0'}%, 
                    ce qui est {stats && stats.views > 0 && ((stats.likes / stats.views) > 0.05) ? 'au-dessus' : 'en-dessous'} de la moyenne.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="engagement">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Répartition de l'engagement</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80">
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={engagementData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            fill="#8884d8"
                          />
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Statistiques d'engagement</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <ThumbsUp className="h-4 w-4 mr-2 text-green-500" />
                            <span>Likes</span>
                          </div>
                          <span className="font-medium">{stats?.likes.toLocaleString()}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <MessageSquare className="h-4 w-4 mr-2 text-blue-500" />
                            <span>Commentaires</span>
                          </div>
                          <span className="font-medium">{stats?.comments_count.toLocaleString()}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <TrendingUp className="h-4 w-4 mr-2 text-purple-500" />
                            <span>Taux de clic</span>
                          </div>
                          <span className="font-medium">{(Math.random() * 100).toFixed(2)}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="audience">
                <Card>
                  <CardHeader>
                    <CardTitle>Démographie du public</CardTitle>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={audienceData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={onClose}>
                Fermer
              </Button>
              <Button>
                <Users className="mr-2 h-4 w-4" />
                Exporter les données
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VideoAnalyticsModal;
