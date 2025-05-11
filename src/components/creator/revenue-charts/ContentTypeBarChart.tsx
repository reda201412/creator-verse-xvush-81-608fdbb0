
import React from 'react';
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

// Type de contenu
const contentTypeData = [
  { name: 'Vidéos', value: 420 },
  { name: 'Photos', value: 180 },
  { name: 'Tutoriels', value: 320 },
  { name: 'Lives', value: 280 }
];

const ContentTypeBarChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={contentTypeData}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis width={40} tick={{ fontSize: 12 }} />
        <Tooltip 
          formatter={(value) => [`$${value}`, 'Revenu']} 
          contentStyle={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            border: 'none',
            borderRadius: '4px',
            fontSize: '12px',
            padding: '8px'
          }} 
        />
        <Bar 
          dataKey="value" 
          fill="#0ea5e9" 
          name="Revenu ($)" 
          radius={[4, 4, 0, 0]} 
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ContentTypeBarChart;
