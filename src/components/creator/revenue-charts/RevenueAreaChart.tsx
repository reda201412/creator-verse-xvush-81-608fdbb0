
import React from 'react';
import { 
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

// Données de revenus mensuels
const monthlyRevenueData = [
  { month: 'Jan', amount: 450 },
  { month: 'Fév', amount: 520 },
  { month: 'Mar', amount: 480 },
  { month: 'Avr', amount: 580 },
  { month: 'Mai', amount: 650 },
  { month: 'Juin', amount: 720 },
  { month: 'Juil', amount: 800 },
  { month: 'Août', amount: 920 },
  { month: 'Sep', amount: 880 },
  { month: 'Oct', amount: 1050 },
  { month: 'Nov', amount: 1180 },
  { month: 'Déc', amount: 1320 }
];

const RevenueAreaChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={monthlyRevenueData}>
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#9333ea" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#9333ea" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis width={40} tick={{ fontSize: 12 }} />
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            border: 'none',
            borderRadius: '4px',
            fontSize: '12px',
            padding: '8px'
          }} 
        />
        <Area 
          type="monotone" 
          dataKey="amount" 
          stroke="#9333ea" 
          fillOpacity={1} 
          fill="url(#colorRevenue)" 
          name="Revenu ($)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default RevenueAreaChart;
