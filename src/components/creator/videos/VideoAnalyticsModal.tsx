
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Clock, Eye, ThumbsUp, Share, DollarSign } from 'lucide-react';
import { getVideoByIdFromFirestore, VideoFirestoreData } from '@/services/creatorService';

interface VideoAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string | null;
}

const VideoAnalyticsModal: React.FC<VideoAnalyticsModalProps> = ({
  isOpen,
  onClose,
  videoId
}) => {
  const [video, setVideo] = useState<VideoFirestoreData | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (isOpen && videoId) {
      fetchVideoData(videoId);
    }
  }, [isOpen, videoId]);

  const fetchVideoData = async (id: string) => {
    setLoading(true);
    try {
      const videoData = await getVideoByIdFromFirestore(id);
      setVideo(videoData);
    } catch (error) {
      console.error('Error fetching video data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for charts
  const viewsData = [
    { name: 'Jan 1', views: 65 },
    { name: 'Jan 2', views: 80 },
    { name: 'Jan 3', views: 120 },
    { name: 'Jan 4', views: 95 },
    { name: 'Jan 5', views: 105 },
    { name: 'Jan 6', views: 155 },
    { name: 'Jan 7', views: 140 },
    { name: 'Jan 8', views: 162 },
    { name: 'Jan 9', views: 175 },
    { name: 'Jan 10', views: 190 }
  ];

  // Render a metric card with icon and value
  const MetricCard = ({ icon, title, value, trend = null }: { icon: React.ReactNode, title: string, value: string|number, trend?: { value: number, isPositive: boolean } | null }) => (
    <div className="bg-card rounded-lg p-4 border">
      <div className="flex items-center justify-between">
        <div className="bg-primary/10 p-2 rounded-full">{icon}</div>
        {trend && (
          <span className={`text-xs font-medium ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {trend.isPositive ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>
      <h3 className="text-xl font-semibold mt-2">{value}</h3>
      <p className="text-sm text-muted-foreground">{title}</p>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Analyse de vidéo : {video?.title}</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="audience">Audience</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard 
                icon={<Eye className="text-primary" />} 
                title="Vues totales" 
                value={video?.viewCount || 0} 
                trend={{ value: 12, isPositive: true }}
              />
              
              <MetricCard 
                icon={<Clock className="text-amber-500" />} 
                title="Temps de visionnage" 
                value={`${video?.watchHours || 0} heures`} 
                trend={{ value: 8, isPositive: true }}
              />
              
              <MetricCard 
                icon={<ThumbsUp className="text-blue-500" />} 
                title="Likes" 
                value={video?.likeCount || 0} 
                trend={{ value: 5, isPositive: true }}
              />
              
              <MetricCard 
                icon={<DollarSign className="text-green-500" />} 
                title="Revenus" 
                value={`${video?.revenueGenerated || 0} €`}
                trend={{ value: 15, isPositive: true }}
              />
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-4">Évolution des vues</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={viewsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="views" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2} 
                    dot={{ r: 4 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="audience" className="space-y-4">
            <h3 className="text-lg font-medium">Données d'audience à venir...</h3>
            <p className="text-muted-foreground">
              Les données démographiques et d'audience détaillées seront disponibles dans une prochaine mise à jour.
            </p>
          </TabsContent>
          
          <TabsContent value="engagement" className="space-y-4">
            <h3 className="text-lg font-medium">Données d'engagement à venir...</h3>
            <p className="text-muted-foreground">
              Les statistiques d'engagement détaillées seront disponibles dans une prochaine mise à jour.
            </p>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end">
          <DialogClose asChild>
            <Button variant="outline" onClick={onClose}>Fermer</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoAnalyticsModal;
