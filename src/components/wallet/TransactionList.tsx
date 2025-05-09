
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  CreditCard, 
  DollarSign, 
  ExternalLink,
  ShoppingCart,
  Users
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Transaction {
  id: string;
  transaction_type: string;
  amount_usdt: number;
  status: string;
  created_at: string;
  tron_tx_id?: string;
  reference_content?: { title: string; thumbnail_url: string; };
  reference_tier?: { name: string; price_usdt: number; };
}

interface TransactionListProps {
  transactions: Transaction[];
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="h-4 w-4 text-green-500" />;
      case 'withdrawal':
        return <ArrowUpRight className="h-4 w-4 text-amber-500" />;
      case 'purchase':
        return <ShoppingCart className="h-4 w-4 text-blue-500" />;
      case 'subscription':
        return <Users className="h-4 w-4 text-purple-500" />;
      case 'content_sale':
        return <DollarSign className="h-4 w-4 text-green-500" />;
      case 'system_credit':
        return <CreditCard className="h-4 w-4 text-primary" />;
      default:
        return <CreditCard className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'Dépôt';
      case 'withdrawal':
        return 'Retrait';
      case 'purchase':
        return 'Achat de contenu';
      case 'subscription':
        return 'Abonnement';
      case 'content_sale':
        return 'Vente de contenu';
      case 'system_credit':
        return 'Crédit système';
      case 'message_support':
        return 'Support créateur';
      case 'fan_support':
        return 'Support reçu';
      default:
        return type;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="outline" className="bg-green-500/20 text-green-600 border-0">Complété</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-amber-500/20 text-amber-600 border-0">En attente</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-500/20 text-red-600 border-0">Échoué</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true,
        locale: fr
      });
    } catch (error) {
      return 'Date invalide';
    }
  };
  
  const getTransactionDetails = (transaction: Transaction) => {
    if (transaction.reference_content) {
      return transaction.reference_content.title;
    }
    
    if (transaction.reference_tier) {
      return `Abonnement ${transaction.reference_tier.name}`;
    }
    
    return '';
  };
  
  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center p-8">
        <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Aucune transaction</h3>
        <p className="text-sm text-muted-foreground">
          Vous n'avez pas encore effectué de transaction.
        </p>
      </div>
    );
  }
  
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Montant</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Détails</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => (
            <TableRow key={tx.id}>
              <TableCell>
                <div className="flex items-center">
                  {getTransactionTypeIcon(tx.transaction_type)}
                  <span className="ml-2">{getTransactionTypeLabel(tx.transaction_type)}</span>
                </div>
                {getTransactionDetails(tx) && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {getTransactionDetails(tx)}
                  </div>
                )}
              </TableCell>
              <TableCell className={tx.transaction_type.includes('withdrawal') ? 'text-amber-500' : 'text-green-500'}>
                {tx.transaction_type.includes('withdrawal') ? '-' : '+'}{tx.amount_usdt} USDT
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {formatDate(tx.created_at)}
              </TableCell>
              <TableCell>{getStatusBadge(tx.status)}</TableCell>
              <TableCell className="text-right">
                {tx.tron_tx_id && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    asChild
                  >
                    <a 
                      href={`https://tronscan.org/#/transaction/${tx.tron_tx_id}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Blockchain
                    </a>
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionList;
