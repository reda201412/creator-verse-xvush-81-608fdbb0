
import React from 'react';
import { ArrowUpRight, TrendingUp, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface RevenueSectionProps {
  totalRevenue?: number;
  tokenBalance?: number;
  percentChange?: number;
  currency?: string;
}

const RevenueSection = ({
  totalRevenue = 0,
  tokenBalance = 0,
  percentChange = 0,
  currency = 'EUR'
}: RevenueSectionProps) => {
  // Format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-4 pb-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">
              Revenus totaux
            </div>
            <div className="flex items-center">
              <span className="text-xl font-bold">{formatCurrency(totalRevenue)}</span>
              <div className={`ml-2 flex items-center text-xs font-medium ${percentChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>{percentChange}%</span>
              </div>
            </div>
          </div>
          
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">
              Tokens
            </div>
            <div className="flex items-center">
              <span className="text-xl font-bold">{tokenBalance}</span>
              <Coins className="ml-1 h-4 w-4 text-yellow-500" />
            </div>
          </div>
        </div>
        
        <div className="mt-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-xs"
            onClick={() => window.location.href = '/creator/revenue'}
          >
            Voir le tableau de bord
            <ArrowUpRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueSection;
