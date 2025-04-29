
import React from 'react';
import { Users, Crown, Star, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface SubscriberStatsProps {
  totalSubscribers: number;
  activeSubscribers: number;
  premiumSubscribers: number;
  vipSubscribers: number;
  averageSpending: number;
}

const SubscriberStats = ({
  totalSubscribers,
  activeSubscribers,
  premiumSubscribers,
  vipSubscribers,
  averageSpending
}: SubscriberStatsProps) => {
  
  const stats = [
    {
      label: 'Total des abonnés',
      value: totalSubscribers,
      icon: <Users className="h-5 w-5 text-blue-600" />,
      color: 'bg-blue-50 dark:bg-blue-950/30'
    },
    {
      label: 'Abonnés actifs',
      value: activeSubscribers,
      percentage: Math.round((activeSubscribers / totalSubscribers) * 100),
      icon: <Users className="h-5 w-5 text-green-600" />,
      color: 'bg-green-50 dark:bg-green-950/30'
    },
    {
      label: 'Abonnés Premium',
      value: premiumSubscribers,
      percentage: Math.round((premiumSubscribers / totalSubscribers) * 100),
      icon: <Crown className="h-5 w-5 text-pink-600" />,
      color: 'bg-pink-50 dark:bg-pink-950/30'
    },
    {
      label: 'Abonnés VIP',
      value: vipSubscribers,
      percentage: Math.round((vipSubscribers / totalSubscribers) * 100),
      icon: <Star className="h-5 w-5 text-purple-600" />,
      color: 'bg-purple-50 dark:bg-purple-950/30'
    },
    {
      label: 'Dépense moyenne',
      value: `${Math.round(averageSpending)}€`,
      icon: <TrendingUp className="h-5 w-5 text-amber-600" />,
      color: 'bg-amber-50 dark:bg-amber-950/30'
    }
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="h-full">
          <CardContent className="flex flex-col items-start justify-center p-4 h-full">
            <div className={`p-2 rounded-md ${stat.color} mb-3`}>
              {stat.icon}
            </div>
            <div className="space-y-0.5">
              <h3 className="text-muted-foreground text-sm">{stat.label}</h3>
              <div className="text-2xl font-bold">{stat.value}</div>
              {stat.percentage !== undefined && (
                <div className="text-xs text-muted-foreground">
                  {stat.percentage}% du total
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SubscriberStats;
