
import React from 'react';
import { 
  RadialBarChart, 
  RadialBar, 
  PieChart, 
  Pie, 
  Cell, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { MoveRight } from 'lucide-react';

interface EmotionalInsightsProps {
  threadId: string;
}

const EmotionalInsights: React.FC<EmotionalInsightsProps> = ({ threadId }) => {
  // Mocked data for emotional insights
  const emotionData = [
    { emotion: 'Joie', value: 80, fill: '#10B981' },
    { emotion: 'Curiosité', value: 65, fill: '#3B82F6' },
    { emotion: 'Admiration', value: 55, fill: '#8B5CF6' },
    { emotion: 'Gratitude', value: 45, fill: '#F59E0B' },
    { emotion: 'Excitation', value: 40, fill: '#EC4899' }
  ];
  
  // Mocked data for fan affinity
  const affinityData = [
    { name: 'Élevée', value: 65, fill: '#10B981' },
    { name: 'Moyenne', value: 25, fill: '#F59E0B' },
    { name: 'Faible', value: 10, fill: '#EF4444' },
  ];
  
  const insightsData = {
    dominantEmotion: 'Joie',
    volatility: 'Faible',
    responseRate: '92%',
    suggestedContent: [
      'Photos des coulisses',
      'Vidéos en direct',
      'Messages vocaux personnalisés'
    ]
  };
  
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium mb-2">Carte émotionnelle</h4>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              innerRadius="30%"
              outerRadius="100%"
              data={emotionData}
              startAngle={180}
              endAngle={-180}
            >
              <RadialBar
                background
                clockWise={true}
                dataKey="value"
                cornerRadius={10}
              />
              <Legend 
                iconSize={10}
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ fontSize: '10px' }}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-background/70 border border-border/50 rounded-lg p-3">
          <h4 className="text-sm font-medium mb-2">Fan Affinity AI</h4>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={affinityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={50}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {affinityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-background/70 border border-border/50 rounded-lg p-3">
          <h4 className="text-sm font-medium mb-1">Insights</h4>
          
          <div className="space-y-2 text-xs">
            <div>
              <span className="text-muted-foreground">Émotion dominante:</span>
              <div className="font-medium">{insightsData.dominantEmotion}</div>
            </div>
            
            <div>
              <span className="text-muted-foreground">Volatilité:</span>
              <div className="font-medium">{insightsData.volatility}</div>
            </div>
            
            <div>
              <span className="text-muted-foreground">Taux de réponse:</span>
              <div className="font-medium">{insightsData.responseRate}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg p-3">
        <h4 className="text-sm font-medium mb-2">Contenu suggéré</h4>
        
        <div className="space-y-2">
          {insightsData.suggestedContent.map((content, index) => (
            <div 
              key={index}
              className="flex items-center gap-2 text-sm bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2"
            >
              <MoveRight size={12} />
              <span>{content}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmotionalInsights;
