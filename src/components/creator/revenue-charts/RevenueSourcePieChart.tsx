
import React from 'react';
import { 
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Données des sources de revenus
const revenueSourceData = [
  { name: 'Abonnements', value: 68 },
  { name: 'Contenus Premium', value: 25 },
  { name: 'Pourboires', value: 7 }
];

// Couleurs pour le graphique en camembert
const COLORS = ['#9333ea', '#0ea5e9', '#f97316'];

interface RevenueSourcePieChartProps {
  className?: string;
}

const RevenueSourcePieChart: React.FC<RevenueSourcePieChartProps> = ({ className }) => {
  // Calculer si l'appareil est petit (mobile)
  const isSmallDevice = window.innerWidth < 640;

  return (
    <div className={`w-full h-full min-h-[200px] ${className || ''}`}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={revenueSourceData}
            cx="50%"
            cy="50%"
            labelLine={!isSmallDevice}
            outerRadius={isSmallDevice ? 60 : 80}
            fill="#8884d8"
            dataKey="value"
            label={isSmallDevice ? undefined : ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {revenueSourceData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => [`${value}%`, 'Pourcentage']} 
            contentStyle={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.8)', 
              border: 'none',
              borderRadius: '4px',
              padding: '8px',
              fontSize: '12px'
            }} 
          />
          <Legend 
            layout={isSmallDevice ? "horizontal" : "vertical"} 
            align={isSmallDevice ? "center" : "right"}
            verticalAlign={isSmallDevice ? "bottom" : "middle"}
            iconSize={10}
            wrapperStyle={isSmallDevice ? { fontSize: '10px' } : { fontSize: '12px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueSourcePieChart;
