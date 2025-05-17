
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MessageAnalyticsProps {
  threadId: string;
}

const MessageAnalytics: React.FC<MessageAnalyticsProps> = ({ threadId }) => {
  // Mocked data for message revenue
  const messageRevenueData = [
    { day: 'Lun', revenue: 42.5 },
    { day: 'Mar', revenue: 28.99 },
    { day: 'Mer', revenue: 38.45 },
    { day: 'Jeu', revenue: 54.20 },
    { day: 'Ven', revenue: 74.99 },
    { day: 'Sam', revenue: 43.85 },
    { day: 'Dim', revenue: 32.10 },
  ];
  
  // Mocked data for message engagement
  const messageStats = {
    totalMessages: 48,
    totalViews: 1254,
    averageEngagement: '4.2s',
    conversionRate: '8.5%',
    topMessage: {
      content: "Découvrez mes photos exclusives de vacances...",
      revenue: 48.99,
      views: 324
    }
  };
  
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium mb-2">Revenus par jour</h4>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={messageRevenueData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip 
                formatter={(value: any) => [`${value}€`, 'Revenus']}
                contentStyle={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px'
                }}
              />
              <Bar 
                dataKey="revenue" 
                fill="url(#colorGradient)" 
                radius={[4, 4, 0, 0]}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(245, 158, 11)" stopOpacity={0.8}/>
                  <stop offset="100%" stopColor="rgb(245, 158, 11)" stopOpacity={0.2}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="bg-background/70 border border-border/50 rounded-lg p-3">
        <h4 className="text-sm font-medium mb-2">Statistiques des messages</h4>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Messages</p>
            <p className="text-xl font-bold">{messageStats.totalMessages}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Vues totales</p>
            <p className="text-xl font-bold">{messageStats.totalViews}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Taux de conversion</p>
            <p className="text-xl font-bold">{messageStats.conversionRate}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Engagement moyen</p>
            <p className="text-xl font-bold">{messageStats.averageEngagement}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-3">
        <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
          <span>Message le plus rentable</span>
          <div className="bg-amber-500 text-white rounded-full px-1.5 text-xs">Top</div>
        </h4>
        
        <p className="text-sm line-clamp-1 mb-1">{messageStats.topMessage.content}</p>
        
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{messageStats.topMessage.views} vues</span>
          <span className="text-amber-500 font-bold">{messageStats.topMessage.revenue}€</span>
        </div>
      </div>
    </div>
  );
};

export default MessageAnalytics;
