import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { CircleArrowUp, CircleArrowDown } from 'lucide-react';

// Remove unused type
// type TokenTransaction = {
//   id: string;
//   type: 'purchase' | 'spend' | 'earn';
//   amount: number;
//   date: string;
//   description: string;
// };

interface TokenWalletProps {
  balance: number;
  currency: string;
  onClose: () => void;
}

const TokenWallet: React.FC<TokenWalletProps> = ({ balance, currency, onClose }) => {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Mon Portefeuille</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>Fermer</Button>
      </div>
      
      <div className="bg-muted/50 dark:bg-muted/30 rounded-md p-3 mb-4">
        <p className="text-sm text-muted-foreground">Solde actuel</p>
        <p className="text-2xl font-semibold">{balance} {currency}</p>
      </div>
      
      <ScrollArea className="h-48 mb-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CircleArrowUp className="text-green-500" size={16} />
              <p className="text-sm">Reçu de Paiement</p>
            </div>
            <p className="text-sm text-muted-foreground">+12.50 €</p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CircleArrowDown className="text-red-500" size={16} />
              <p className="text-sm">Achat de contenu premium</p>
            </div>
            <p className="text-sm text-muted-foreground">-5.00 €</p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CircleArrowUp className="text-green-500" size={16} />
              <p className="text-sm">Revenu de parrainage</p>
            </div>
            <p className="text-sm text-muted-foreground">+25.00 €</p>
          </div>
        </div>
      </ScrollArea>
      
      <Button className="w-full">Retirer des fonds</Button>
    </div>
  );
};

export default TokenWallet;
