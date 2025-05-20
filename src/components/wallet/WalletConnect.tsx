import React, { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { useTronWallet } from '@/hooks/use-tron-wallet';
import { toast } from 'sonner';

interface WalletConnectProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onClose: () => void;
}

export function WalletConnect({ isOpen, onOpenChange, onClose }: WalletConnectProps) {
  const { walletInfo, requestWithdrawal } = useTronWallet();
  const [amount, setAmount] = useState<number | undefined>(0);
  const [requestLoading, setRequestLoading] = useState(false);
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setAmount(isNaN(value) ? undefined : value);
  };

  const handleWithdrawalRequest = async () => {
    if (requestLoading) return;
    
    setRequestLoading(true);
    
    try {
      // Check amount is valid
      if (!amount || amount <= 0) {
        toast.error("Veuillez saisir un montant valide");
        return;
      }
      
      // Fix the parameter to be a number
      const success = await requestWithdrawal(Number(amount));
      
      if (success) {
        toast.success("Demande de retrait initiée");
        setAmount(0);
        onClose();
      }
    } catch (error) {
      console.error("Error processing withdrawal:", error);
      toast.error("Erreur lors de la demande de retrait");
    } finally {
      setRequestLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Connecter le portefeuille</ModalHeader>
            <ModalBody>
              <p>
                Adresse du portefeuille: {walletInfo?.wallet?.tron_address || "Non connecté"}
              </p>
              <p>
                Balance: {walletInfo?.wallet?.balance_usdt || 0} USDT
              </p>
              <Input
                type="number"
                label="Montant à retirer"
                placeholder="0.00"
                value={amount === undefined ? '' : amount.toString()}
                onChange={handleAmountChange}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Fermer
              </Button>
              <Button 
                color="primary" 
                onPress={handleWithdrawalRequest}
                isLoading={requestLoading}
              >
                Demande de retrait
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
