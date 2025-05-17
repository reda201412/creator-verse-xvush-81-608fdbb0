
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  CreditCard, 
  ChevronUp, 
  ChevronDown,
  ArrowUpRight,
  ArrowDownLeft,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface WalletPanelProps {
  balance: number;
  currency: string;
  onClose: () => void;
}

const WalletPanel: React.FC<WalletPanelProps> = ({ balance, currency, onClose }) => {
  // Mocked data for recent transactions
  const recentTransactions = [
    { id: 'tx1', type: 'incoming', amount: 15.99, from: 'Alex', timestamp: new Date(Date.now() - 3600000) },
    { id: 'tx2', type: 'outgoing', amount: 5.99, to: 'Sophie', timestamp: new Date(Date.now() - 86400000) },
    { id: 'tx3', type: 'incoming', amount: 25.00, from: 'Thomas', timestamp: new Date(Date.now() - 172800000) },
  ];
  
  return (
    <div className="p-4 space-y-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Wallet size={16} />
          <h3 className="font-medium">Votre Wallet</h3>
        </div>
        
        <Button variant="ghost" size="sm" onClick={onClose}>
          <ChevronUp size={16} />
        </Button>
      </div>
      
      <div className="bg-background/70 border border-border/50 rounded-xl p-4 flex flex-col items-center">
        <p className="text-sm text-muted-foreground">Balance disponible</p>
        <p className="text-3xl font-bold mt-1">
          {balance.toFixed(2)}{currency}
        </p>
        
        <div className="flex gap-2 mt-3">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <ArrowUpRight size={14} />
            <span>Retirer</span>
          </Button>
          <Button size="sm" className="flex items-center gap-1">
            <CreditCard size={14} />
            <span>Ajouter</span>
          </Button>
        </div>
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium">Transactions récentes</h4>
          <Button variant="link" size="sm" className="h-auto p-0">
            Voir tout
          </Button>
        </div>
        
        <div className="space-y-2">
          {recentTransactions.map(transaction => (
            <div 
              key={transaction.id} 
              className="flex items-center justify-between bg-muted/30 rounded-lg p-2"
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center",
                  transaction.type === 'incoming' ? "bg-green-500/10 text-green-500" : "bg-blue-500/10 text-blue-500"
                )}>
                  {transaction.type === 'incoming' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                </div>
                
                <div>
                  <p className="text-sm font-medium">
                    {transaction.type === 'incoming' ? `De ${transaction.from}` : `À ${transaction.to}`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {transaction.timestamp.toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className={cn(
                "font-medium",
                transaction.type === 'incoming' ? "text-green-500" : "text-blue-500"
              )}>
                {transaction.type === 'incoming' ? '+' : '-'}{transaction.amount}{currency}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-amber-500/20 to-amber-600/20 rounded-lg p-4 flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium flex items-center gap-1">
            <Zap size={14} className="text-amber-500" />
            <span>Vos revenus ce mois</span>
          </h4>
          <p className="text-xl font-bold mt-1">294.95{currency}</p>
        </div>
        
        <Button variant="secondary">Analyser</Button>
      </div>
    </div>
  );
};

export default WalletPanel;
