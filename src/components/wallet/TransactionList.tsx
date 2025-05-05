
import React from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ArrowUpRight, ArrowDownLeft, Check, Clock, AlertCircle } from 'lucide-react';

interface Transaction {
  id: string;
  amount_usdt: number;
  transaction_type: string;
  status: string;
  created_at: string;
}

interface TransactionListProps {
  transactions: Transaction[];
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="h-4 w-4 text-green-500" />;
      case 'withdrawal':
        return <ArrowUpRight className="h-4 w-4 text-red-500" />;
      case 'purchase':
        return <ArrowUpRight className="h-4 w-4 text-orange-500" />;
      case 'subscription':
        return <ArrowUpRight className="h-4 w-4 text-purple-500" />;
      default:
        return <ArrowDownLeft className="h-4 w-4 text-blue-500" />;
    }
  };
  
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'Dépôt';
      case 'withdrawal':
        return 'Retrait';
      case 'purchase':
        return 'Achat de contenu';
      case 'subscription':
        return 'Abonnement';
      default:
        return type;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Terminé';
      case 'pending':
        return 'En attente';
      case 'failed':
        return 'Échec';
      default:
        return status;
    }
  };
  
  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-12 w-12 text-muted-foreground mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
          </svg>
        </div>
        <h3 className="text-lg font-medium">Aucune transaction</h3>
        <p className="text-muted-foreground mt-1 max-w-md mx-auto">
          Vos transactions apparaîtront ici une fois que vous commencerez à utiliser vos tokens.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((tx, index) => (
        <motion.div
          key={tx.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-secondary rounded-full">
              {getTypeIcon(tx.transaction_type)}
            </div>
            <div>
              <div className="font-medium">{getTypeLabel(tx.transaction_type)}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                {formatDistanceToNow(new Date(tx.created_at), { addSuffix: true, locale: fr })}
                <span className="inline-flex items-center ml-2">
                  {getStatusIcon(tx.status)}
                  <span className="ml-1">{getStatusLabel(tx.status)}</span>
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className={`font-medium ${tx.transaction_type === 'deposit' ? 'text-green-500' : ''}`}>
              {tx.transaction_type === 'deposit' ? '+' : '-'}{tx.amount_usdt} USDT
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default TransactionList;
