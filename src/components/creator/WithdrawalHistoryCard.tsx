
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTronWallet } from '@/hooks/use-tron-wallet';
import { ArrowUpRight, Ban, Check, Clock, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Types de données pour les retraits
interface Withdrawal {
  id: string;
  date: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  txHash?: string;
}

const WithdrawalHistoryCard: React.FC = () => {
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { requestWithdrawal } = useTronWallet();
  const { toast } = useToast();
  
  // Données mockées d'historique de retraits
  const withdrawalHistory: Withdrawal[] = [
    {
      id: 'w1',
      date: '2023-11-01T14:32:00Z',
      amount: 520,
      status: 'completed',
      txHash: 'TRX123456789abcdef'
    },
    {
      id: 'w2',
      date: '2023-10-15T09:12:00Z',
      amount: 430,
      status: 'completed',
      txHash: 'TRX987654321fedcba'
    },
    {
      id: 'w3',
      date: '2023-09-28T16:45:00Z',
      amount: 300,
      status: 'completed',
      txHash: 'TRXabcdef123456789'
    },
    {
      id: 'w4',
      date: '2023-12-05T10:21:00Z',
      amount: 650,
      status: 'pending'
    }
  ];
  
  const handleWithdraw = async () => {
    if (!amount || !address) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      toast.error("Veuillez entrer un montant valide");
      return;
    }
    
    setIsProcessing(true);
    try {
      await requestWithdrawal({
        amount: amountValue,
        destinationAddress: address
      });
      
      toast.success("Demande de retrait soumise avec succès");
      setWithdrawDialogOpen(false);
      setAmount('');
      setAddress('');
    } catch (error) {
      toast.error("Erreur lors de la demande de retrait");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="outline" className="bg-green-500/20 text-green-500 border-0">
            <Check className="h-3 w-3 mr-1" />
            Complété
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="bg-amber-500/20 text-amber-500 border-0">
            <Clock className="h-3 w-3 mr-1" />
            En attente
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="outline" className="bg-red-500/20 text-red-500 border-0">
            <Ban className="h-3 w-3 mr-1" />
            Échoué
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base">Historique des retraits</CardTitle>
          <Button size="sm" onClick={() => setWithdrawDialogOpen(true)}>
            <ArrowUpRight className="h-4 w-4 mr-1" /> 
            Demander un retrait
          </Button>
        </CardHeader>
        
        <CardContent>
          {withdrawalHistory.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Détails</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {withdrawalHistory.map((withdrawal) => (
                  <TableRow key={withdrawal.id}>
                    <TableCell className="font-medium">
                      {new Date(withdrawal.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>${withdrawal.amount}</TableCell>
                    <TableCell>{getStatusBadge(withdrawal.status)}</TableCell>
                    <TableCell className="text-right">
                      {withdrawal.txHash ? (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          asChild
                        >
                          <a 
                            href={`https://tronscan.org/#/transaction/${withdrawal.txHash}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Tronscan
                          </a>
                        </Button>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">Aucun retrait effectué pour le moment</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Modale de demande de retrait */}
      <Dialog open={withdrawDialogOpen} onOpenChange={setWithdrawDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Demande de retrait</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Montant à retirer (USDT)</Label>
              <Input 
                id="amount" 
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Entrez le montant"
                min="0"
                step="0.01"
              />
              <p className="text-xs text-muted-foreground">
                Minimum: 10 USDT. Frais de transaction: 1 USDT.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Adresse TRON de destination</Label>
              <Input 
                id="address" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Entrez votre adresse TRON (commence par T)"
              />
              <p className="text-xs text-muted-foreground">
                Assurez-vous que l'adresse est correcte. Les transactions sur la blockchain sont irréversibles.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setWithdrawDialogOpen(false)}>
              Annuler
            </Button>
            <Button 
              onClick={handleWithdraw}
              disabled={isProcessing || !amount || !address}
            >
              {isProcessing ? (
                <>
                  <div className="h-4 w-4 border-2 border-current border-t-transparent animate-spin rounded-full mr-2"></div>
                  Traitement...
                </>
              ) : (
                <>
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  Demander le retrait
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WithdrawalHistoryCard;
