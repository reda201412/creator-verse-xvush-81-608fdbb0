import React, { useState } from 'react';
import { toast } from 'sonner';
import { useTronWallet } from '@/hooks/use-tron-wallet';

interface WithdrawalHistoryCardProps {
  className?: string;
}

const WithdrawalHistoryCard: React.FC<WithdrawalHistoryCardProps> = ({ className }) => {
  const { requestWithdrawal } = useTronWallet();
  const [amount, setAmount] = useState<number | ''>('');
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [showWithdrawalForm, setShowWithdrawalForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggleWithdrawalForm = () => {
    setShowWithdrawalForm(!showWithdrawalForm);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and ensure it can be cleared
    if (/^\d*\.?\d*$/.test(value) || value === '') {
      setAmount(value);
    }
  };

  const handleWalletAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWalletAddress(e.target.value);
  };

  const handleWithdrawalSubmit = async () => {
    if (!amount || amount <= 0) {
      toast.error("Veuillez saisir un montant valide");
      return;
    }
    
    if (!walletAddress) {
      toast.error("Veuillez saisir une adresse de portefeuille");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Fix by passing just the amount as number
      const success = await requestWithdrawal(Number(amount));
      
      if (success) {
        toast.success("Demande de retrait initiée");
        setAmount(0);
        setWalletAddress("");
        setShowWithdrawalForm(false);
      }
    } catch (error) {
      console.error("Withdrawal request error:", error);
      toast.error("Erreur lors de la demande de retrait");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h2 className="text-lg font-semibold mb-4">Retirer des fonds</h2>
      
      <button
        onClick={handleToggleWithdrawalForm}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
      >
        {showWithdrawalForm ? 'Annuler' : 'Effectuer un retrait'}
      </button>

      {showWithdrawalForm && (
        <div>
          <div className="mb-4">
            <label htmlFor="amount" className="block text-gray-700 text-sm font-bold mb-2">
              Montant à retirer:
            </label>
            <input
              id="amount"
              type="number"
              placeholder="Montant en USDT"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={amount}
              onChange={handleAmountChange}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="walletAddress" className="block text-gray-700 text-sm font-bold mb-2">
              Adresse du portefeuille:
            </label>
            <input
              id="walletAddress"
              type="text"
              placeholder="Adresse Tron (TRC-20)"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={walletAddress}
              onChange={handleWalletAddressChange}
            />
          </div>

          <button
            onClick={handleWithdrawalSubmit}
            className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'En cours...' : 'Confirmer le retrait'}
          </button>
        </div>
      )}

      <div className="mt-6">
        <h3 className="text-md font-semibold mb-2">Historique des retraits</h3>
        <p className="text-gray-500">Aucun retrait enregistré pour le moment.</p>
      </div>
    </div>
  );
};

export default WithdrawalHistoryCard;
