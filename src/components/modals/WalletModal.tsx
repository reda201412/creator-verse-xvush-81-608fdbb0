
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WalletConnect from '@/components/wallet/WalletConnect';
import WalletBalance from '@/components/wallet/WalletBalance';
import TransactionList from '@/components/wallet/TransactionList';

interface WalletModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WalletModal: React.FC<WalletModalProps> = ({ 
  open, 
  onOpenChange 
}) => {
  // Simulation de données pour le portefeuille
  const walletInfo = {
    wallet: {
      tron_address: 'TFFJ1DP6J97j6nGBjPufkru9Eu1FBpkCFF',
      balance_usdt: 125.75,
      balance_native: 18.32,
      native_currency: 'TRX',
    },
    transactions: [
      {
        id: 'tx1',
        type: 'deposit',
        amount: 50,
        currency: 'USDT',
        status: 'completed',
        timestamp: new Date().getTime() - 86400000, // 1 day ago
        tx_hash: '0x123456789abcdef...',
      },
      {
        id: 'tx2',
        type: 'purchase',
        amount: 10,
        currency: 'USDT',
        status: 'completed',
        timestamp: new Date().getTime() - 172800000, // 2 days ago
        tx_hash: '0xabcdef123456789...',
      }
    ]
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Portefeuille</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="balance" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="balance">Solde</TabsTrigger>
            <TabsTrigger value="connect">Connecter</TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
          </TabsList>

          <TabsContent value="balance" className="space-y-4 py-4">
            <WalletBalance walletInfo={walletInfo} />
          </TabsContent>

          <TabsContent value="connect" className="space-y-4 py-4">
            <WalletConnect walletInfo={walletInfo} />
          </TabsContent>

          <TabsContent value="history" className="space-y-4 py-4">
            <TransactionList transactions={walletInfo.transactions} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default WalletModal;
