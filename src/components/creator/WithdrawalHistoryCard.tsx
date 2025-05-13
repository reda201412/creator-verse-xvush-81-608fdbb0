
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowDownToLine, Clock, CheckCircle, AlertCircle, HelpCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Withdrawal {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  date: string;
  method: string;
  address?: string;
  txHash?: string;
}

interface WithdrawalHistoryCardProps {
  withdrawals: Withdrawal[];
  className?: string;
}

const WithdrawalHistoryCard: React.FC<WithdrawalHistoryCardProps> = ({ 
  withdrawals = [],
  className
}) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <HelpCircle className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const handleExportHistory = () => {
    setIsLoading(true);
    
    try {
      // Create CSV content
      const headers = ['ID', 'Date', 'Montant', 'Devise', 'Méthode', 'Statut', 'Adresse', 'Transaction'];
      const csvContent = [
        headers.join(','),
        ...withdrawals.map(w => [
          w.id,
          formatDate(w.date),
          w.amount,
          w.currency,
          w.method,
          w.status,
          w.address || '',
          w.txHash || ''
        ].join(','))
      ].join('\n');
      
      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `withdrawals-history-${new Date().toISOString().slice(0, 10)}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast("Export réussi - L'historique des retraits a été téléchargé");
    } catch (error) {
      console.error('Failed to export withdrawal history:', error);
      toast("Erreur d'export - Une erreur s'est produite lors de l'export");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl">Historique des retraits</CardTitle>
          <CardDescription>
            Suivez l'état de vos demandes de retrait
          </CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 gap-1"
          onClick={handleExportHistory}
          disabled={isLoading || withdrawals.length === 0}
        >
          <ArrowDownToLine className="h-4 w-4" />
          Exporter
        </Button>
      </CardHeader>
      <CardContent>
        {withdrawals.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Méthode</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {withdrawals.map((withdrawal) => (
                  <TableRow key={withdrawal.id}>
                    <TableCell className="font-medium">
                      {formatDate(withdrawal.date)}
                    </TableCell>
                    <TableCell>
                      {withdrawal.amount} {withdrawal.currency}
                    </TableCell>
                    <TableCell>{withdrawal.method}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={`flex w-fit items-center gap-1 ${getStatusColor(withdrawal.status)}`}
                      >
                        {getStatusIcon(withdrawal.status)}
                        <span>
                          {withdrawal.status === 'pending' && 'En attente'}
                          {withdrawal.status === 'completed' && 'Complété'}
                          {withdrawal.status === 'failed' && 'Échoué'}
                        </span>
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <ArrowDownToLine className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground mb-2">Aucun retrait effectué</p>
            <p className="text-sm text-muted-foreground/70">
              Vos demandes de retrait apparaîtront ici
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WithdrawalHistoryCard;
