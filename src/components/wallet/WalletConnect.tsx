
import React, { useState } from 'react';
import { useTronWallet } from '@/hooks/use-tron-wallet';
import { toast } from 'sonner';

// Temporary UI components until we can add @nextui-org/react
const Modal = ({ isOpen, onClose, children }) => isOpen ? (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
    <div className="bg-white rounded-lg p-6 w-full max-w-md">
      {children}
    </div>
  </div>
) : null;

const ModalContent = ({ children }) => <div>{children}</div>;
const ModalHeader = ({ children }) => <h3 className="text-lg font-bold mb-4">{children}</h3>;
const ModalBody = ({ children }) => <div className="mb-4">{children}</div>;
const ModalFooter = ({ children }) => <div className="flex justify-end gap-2">{children}</div>;

interface ButtonProps {
  color: string;
  variant?: string;
  onPress: () => void;
  children: React.ReactNode;
  isLoading?: boolean;
}

const Button = ({ color, variant = "default", onPress, children, isLoading = false }: ButtonProps) => (
  <button
    className={`px-4 py-2 rounded ${
      color === 'primary' ? 'bg-blue-500 text-white' :
      color === 'danger' ? 'bg-red-500 text-white' :
      'bg-gray-200'
    } ${variant === 'flat' ? 'hover:bg-opacity-80' : ''} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    onClick={onPress}
    disabled={isLoading}
  >
    {isLoading ? 'Chargement...' : children}
  </button>
);

const Input = ({ label, type, placeholder, value, onChange }) => (
  <div className="mb-4">
    <label className="block text-sm mb-1">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border rounded"
    />
  </div>
);

interface WalletConnectProps {
  isOpen?: boolean;
  onOpenChange?: () => void;
  onClose?: () => void;
  walletInfo?: any;
}

function WalletConnect({ isOpen, onOpenChange, onClose, walletInfo }: WalletConnectProps) {
  const { requestWithdrawal } = useTronWallet();
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
        if (onClose) onClose();
      }
    } catch (error) {
      console.error("Error processing withdrawal:", error);
      toast.error("Erreur lors de la demande de retrait");
    } finally {
      setRequestLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Connecter le portefeuille</ModalHeader>
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
          <Button 
            color="danger" 
            variant="flat" 
            onPress={onClose}
            isLoading={false}
          >
            Fermer
          </Button>
          <Button 
            color="primary" 
            variant="default"
            onPress={handleWithdrawalRequest}
            isLoading={requestLoading}
          >
            Demande de retrait
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default WalletConnect;
