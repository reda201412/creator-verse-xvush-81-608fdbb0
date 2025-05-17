import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface EmotionalInsightProps {
  messages: any[];
  onInsightClick?: (insight: string) => void;
}

const EmotionalInsights: React.FC<EmotionalInsightProps> = ({ 
  messages,
  onInsightClick
}) => {
  const [activeTab, setActiveTab] = useState('sentiment');
  
  // Mock data for sentiment analysis
  const sentimentData = [
    { name: 'Positive', value: 65, fill: '#4ade80' },
    { name: 'Neutral', value: 25, fill: '#93c5fd' },
    { name: 'Negative', value: 10, fill: '#f87171' },
  ];
  
  // Mock data for emotion detection
  const emotionData = [
    { name: 'Joy', value: 40, fill: '#fbbf24' },
    { name: 'Interest', value: 30, fill: '#60a5fa' },
    { name: 'Surprise', value: 15, fill: '#a78bfa' },
    { name: 'Anger', value: 8, fill: '#ef4444' },
    { name: 'Sadness', value: 7, fill: '#6b7280' },
  ];
  
  // Mock data for engagement metrics
  const engagementData = [
    { name: 'Mon', messages: 5, responses: 4 },
    { name: 'Tue', messages: 8, responses: 7 },
    { name: 'Wed', messages: 12, responses: 10 },
    { name: 'Thu', messages: 6, responses: 6 },
    { name: 'Fri', messages: 9, responses: 8 },
    { name: 'Sat', messages: 15, responses: 12 },
    { name: 'Sun', messages: 10, responses: 9 },
  ];
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Analyse émotionnelle</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="sentiment" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
            <TabsTrigger value="emotions">Émotions</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sentiment" className="space-y-4">
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sentimentData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" width={80} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Proportion']} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-muted-foreground">
              La conversation présente un ton généralement positif avec 65% de messages exprimant des sentiments positifs.
            </p>
          </TabsContent>
          
          <TabsContent value="emotions" className="space-y-4">
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={emotionData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" width={80} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Proportion']} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-muted-foreground">
              La joie et l'intérêt sont les émotions dominantes dans cette conversation, suggérant un engagement positif.
            </p>
          </TabsContent>
          
          <TabsContent value="engagement" className="space-y-4">
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="messages" name="Messages" fill="#8884d8" />
                  <Bar dataKey="responses" name="Réponses" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-muted-foreground">
              Le taux de réponse moyen est de 85%, indiquant un niveau d'engagement élevé dans cette conversation.
            </p>
          </TabsContent>
        </Tabs>
        
        <motion.div 
          className="mt-4 p-3 bg-primary/10 rounded-lg cursor-pointer"
          whileHover={{ scale: 1.02 }}
          onClick={() => onInsightClick?.("La conversation montre un engagement positif croissant")}
        >
          <p className="text-sm font-medium">Insight clé</p>
          <p className="text-sm text-muted-foreground">
            La conversation montre un engagement positif croissant, avec une augmentation de 30% des messages joyeux au cours de la dernière semaine.
          </p>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default EmotionalInsights;
