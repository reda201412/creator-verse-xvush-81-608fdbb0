
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coins, Wallet } from 'lucide-react';

interface WalletBalanceProps {
  walletInfo: any;
}

const WalletBalance: React.FC<WalletBalanceProps> = ({ walletInfo }) => {
  const balance = walletInfo?.wallet?.balance_usdt || 0;
  
  return (
    <Card className="bg-gradient-to-br from-xvush-blue-dark to-xvush-blue overflow-hidden relative">
      <div className="absolute inset-0 opacity-10">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern id="diagonalHatch" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="10" style={{ stroke: 'white', strokeWidth: 1 }} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#diagonalHatch)" />
        </svg>
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center text-white">
          <Wallet className="h-4 w-4 mr-2" />
          Solde de Tokens
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="mb-4">
          <div className="text-4xl font-bold text-white mb-1">{balance} USDT</div>
          <div className="text-sm text-white/70">≈ {balance} $</div>
        </div>
        
        <div className="flex flex-col gap-2">
          <Button 
            variant="secondary" 
            size="sm" 
            className="w-full bg-white/20 hover:bg-white/30 text-white"
          >
            <Coins className="h-4 w-4 mr-2" />
            Acheter des tokens
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletBalance;
