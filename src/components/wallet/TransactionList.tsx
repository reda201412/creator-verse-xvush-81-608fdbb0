
import React from 'react';

interface TransactionListProps {
  transactions: any[];
  compact?: boolean;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, compact = false }) => {
  // Mock implementation
  return (
    <div className="space-y-3">
      {transactions && transactions.length > 0 ? (
        transactions.map((tx, index) => (
          <div 
            key={tx.id || index} 
            className="p-3 border rounded-md flex justify-between items-center"
          >
            <div>
              <div className="font-medium">{tx.type || 'Transaction'}</div>
              <div className="text-sm text-gray-500">{tx.date || new Date().toLocaleDateString()}</div>
            </div>
            <div className="text-right">
              <div className={`font-medium ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {tx.amount > 0 ? '+' : ''}{tx.amount || 0} {tx.currency || 'USDT'}
              </div>
              {!compact && tx.status && (
                <div className="text-xs text-gray-500">{tx.status}</div>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center p-4 text-gray-500">No transactions to display</div>
      )}
    </div>
  );
};

export default TransactionList;
