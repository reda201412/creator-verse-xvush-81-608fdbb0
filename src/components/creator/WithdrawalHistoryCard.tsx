
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useTronWallet } from '@/hooks/use-tron-wallet';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const WithdrawalHistoryCard = () => {
  const { requestWithdrawal } = useTronWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const { toast } = useToast();

  const handleRequest = async () => {
    if (!withdrawalAmount || Number(withdrawalAmount) <= 0) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un montant valide",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await requestWithdrawal(Number(withdrawalAmount), 'XVT');
      if (result.success) {
        toast({
          title: "Demande envoyée",
          description: `Votre demande de retrait de ${withdrawalAmount} XVT a été envoyée`
        });
        setWithdrawalAmount('');
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de traiter votre demande pour le moment",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Retraits</CardTitle>
        <CardDescription>Gérer vos retraits de XVT.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <label htmlFor="withdrawalAmount">Montant à retirer</label>
          <Input
            type="number"
            id="withdrawalAmount"
            placeholder="0.00"
            value={withdrawalAmount}
            onChange={(e) => setWithdrawalAmount(e.target.value)}
          />
        </div>
        <Button onClick={handleRequest} disabled={isLoading}>
          {isLoading ? "Envoi en cours..." : "Demander le retrait"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default WithdrawalHistoryCard;
