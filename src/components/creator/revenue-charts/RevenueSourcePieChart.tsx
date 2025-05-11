
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

const RevenueSourcePieChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={revenueSourceData}
          cx="50%"
          cy="50%"
          labelLine={true}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {revenueSourceData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value}%`, 'Pourcentage']} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default RevenueSourcePieChart;
