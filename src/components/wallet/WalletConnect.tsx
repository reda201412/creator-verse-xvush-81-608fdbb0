import { useState } from 'react';
import { Button } from '@/components/ui/button';

// Mock function with proper argument count
const connectWallet = async (provider: string, callback?: () => void) => {
  console.log(`Connecting to ${provider}`);
  if (callback) callback();
  return true;
};

const WalletConnect = () => {
  const [connected, setConnected] = useState(false);
  
  const handleConnect = async () => {
    // Make sure to call connectWallet with both required arguments
    await connectWallet('metamask', () => {
      setConnected(true);
    });
  };
  
  return (
    <div>
      <Button onClick={handleConnect}>
        {connected ? 'Connected' : 'Connect Wallet'}
      </Button>
    </div>
  );
};

export default WalletConnect;
