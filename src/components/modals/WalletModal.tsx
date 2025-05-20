
import React from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import WalletConnect from '@/components/wallet/WalletConnect';
import { useTronWallet } from '@/hooks/use-tron-wallet';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
  const { walletInfo } = useTronWallet();
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="bg-card rounded-lg shadow-lg w-full max-w-md overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold">Wallet</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="p-4">
            <WalletConnect 
              isOpen={isOpen} 
              onClose={onClose}
              walletInfo={walletInfo}
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default WalletModal;
