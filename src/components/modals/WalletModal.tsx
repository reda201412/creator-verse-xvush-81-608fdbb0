
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WalletConnect } from '@/components/wallet/WalletConnect';
import WalletBalance from '@/components/wallet/WalletBalance';
import TransactionList from '@/components/wallet/TransactionList';
import { useTronWallet } from '@/hooks/use-tron-wallet';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface WalletModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WalletModal: React.FC<WalletModalProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const { user } = useAuth();
  const { walletInfo, getWalletInfo, isLoading, loading } = useTronWallet();
  const [activeTab, setActiveTab] = useState('balance');
  
  // Fetch wallet info when modal opens
  useEffect(() => {
    if (open && user) {
      getWalletInfo();
    }
  }, [open, user]);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Portefeuille</DialogTitle>
        </DialogHeader>

        {(isLoading || loading) ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="balance">Solde</TabsTrigger>
              <TabsTrigger value="connect">Connecter</TabsTrigger>
              <TabsTrigger value="history">Historique</TabsTrigger>
            </TabsList>

            <TabsContent value="balance" className="space-y-4 py-4">
              <WalletBalance walletInfo={walletInfo} />
            </TabsContent>

            <TabsContent value="connect" className="space-y-4 py-4">
              <WalletConnect 
                isOpen={activeTab === 'connect'} 
                onOpenChange={() => {}}
                onClose={() => setActiveTab('balance')}
                walletInfo={walletInfo}
              />
            </TabsContent>

            <TabsContent value="history" className="space-y-4 py-4">
              <TransactionList transactions={walletInfo?.transactions || []} />
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WalletModal;
