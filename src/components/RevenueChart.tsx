
import React from 'react';
import { cn } from '@/lib/utils';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from '@/components/ui/chart';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

// Mock data for the revenue chart
const mockRevenueData = [
  { day: '01', amount: 140 },
  { day: '05', amount: 180 },
  { day: '10', amount: 120 },
  { day: '15', amount: 160 },
  { day: '20', amount: 210 },
  { day: '25', amount: 190 },
  { day: '30', amount: 240 }
];

interface RevenueChartProps {
  data?: Array<{ day: string, amount: number }>;
  growthRate?: number;
  className?: string;
}

const RevenueChart = ({ 
  data = mockRevenueData, 
  growthRate = 0, 
  className 
}: RevenueChartProps) => {
  const isPositiveGrowth = growthRate >= 0;
  
  return (
    <div className={cn("w-full h-12 flex items-center gap-2", className)}>
      <div className="flex-grow h-full">
        <ChartContainer 
          config={{
            revenue: {
              theme: {
                light: isPositiveGrowth ? "#16a34a" : "#dc2626",
                dark: isPositiveGrowth ? "#22c55e" : "#ef4444"
              }
            }
          }}
          className="h-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop 
                    offset="5%" 
                    stopColor={isPositiveGrowth ? "var(--color-revenue)" : "var(--color-revenue)"} 
                    stopOpacity={0.3} 
                  />
                  <stop 
                    offset="95%" 
                    stopColor={isPositiveGrowth ? "var(--color-revenue)" : "var(--color-revenue)"} 
                    stopOpacity={0} 
                  />
                </linearGradient>
              </defs>
              <ChartTooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <ChartTooltipContent>
                        <p className="text-xs font-medium">${payload[0].value}</p>
                      </ChartTooltipContent>
                    );
                  }
                  return null;
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="amount" 
                stroke="var(--color-revenue)" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#revenueGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
      {growthRate !== 0 && (
        <div className={cn(
          "flex items-center text-xs font-medium",
          isPositiveGrowth ? "text-green-500" : "text-red-500"
        )}>
          {isPositiveGrowth ? (
            <TrendingUp size={14} className="mr-1" />
          ) : (
            <TrendingDown size={14} className="mr-1" />
          )}
          {Math.abs(growthRate)}%
        </div>
      )}
    </div>
  );
};

export default RevenueChart;
