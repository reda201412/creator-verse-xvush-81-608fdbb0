
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Wallet, 
  ArrowUp, 
  ArrowDown, 
  X
} from 'lucide-react';

interface WalletPanelProps {
  balance: number;
  currency?: string;
  onClose: () => void;
}

const WalletPanel: React.FC<WalletPanelProps> = ({ balance, currency = '$', onClose }) => {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Wallet size={18} />
          Mon Portefeuille
        </h3>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
          <X size={16} />
        </Button>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-sm text-muted-foreground">Balance</p>
          <h2 className="text-2xl font-bold">{currency}{balance.toFixed(2)}</h2>
        </div>
        
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex items-center gap-1">
            <ArrowUp size={14} />
            Ajouter
          </Button>
          <Button size="sm" variant="outline" className="flex items-center gap-1">
            <ArrowDown size={14} />
            Retirer
          </Button>
        </div>
      </div>
      
      <Separator className="my-4" />
      
      <div>
        <h4 className="font-medium mb-2">Transactions récentes</h4>
        <div className="space-y-1 text-sm">
          <div className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded">
            <div>
              <p className="font-medium">Message Premium</p>
              <p className="text-muted-foreground text-xs">Il y a 2 jours</p>
            </div>
            <span className="font-medium text-green-600 dark:text-green-500">+{currency}5.99</span>
          </div>
          
          <div className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded">
            <div>
              <p className="font-medium">Support de Julien</p>
              <p className="text-muted-foreground text-xs">Il y a 1 semaine</p>
            </div>
            <span className="font-medium text-red-600 dark:text-red-500">-{currency}2.99</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPanel;
