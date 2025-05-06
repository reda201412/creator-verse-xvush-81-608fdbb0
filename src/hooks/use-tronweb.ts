
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

// Définir les types pour TronWeb
interface TronWebInstance {
  ready: boolean;
  defaultAddress: {
    base58: string;
    hex: string;
  };
  fullNode: {
    host: string;
  };
  isConnected(): boolean;
  setAddress(address: string): void;
  trx: {
    getBalance(address: string): Promise<number>;
    getAccount(address: string): Promise<any>;
    getTransaction(txid: string): Promise<any>;
  };
  contract(): {
    at(address: string): Promise<any>;
  };
}

declare global {
  interface Window {
    tronWeb?: TronWebInstance;
    tronLink?: {
      ready: boolean;
      request(args: any): Promise<any>;
    };
  }
}

export type TronWalletState = {
  installed: boolean;
  loggedIn: boolean;
  name: string | null;
  address: string | null;
  network: string | null;
  balance: number | null;
};

export function useTronWeb() {
  const [tronWeb, setTronWeb] = useState<TronWebInstance | null>(null);
  const [walletState, setWalletState] = useState<TronWalletState>({
    installed: false,
    loggedIn: false,
    name: null,
    address: null,
    network: null,
    balance: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Vérifier la présence de TronLink et initialiser
  useEffect(() => {
    const checkTronLink = async () => {
      try {
        setLoading(true);
        setError(null);

        // Vérifier si TronLink est installé
        if (window.tronWeb && window.tronLink) {
          setWalletState(prev => ({ ...prev, installed: true }));
          
          // Attendre que TronLink soit prêt
          if (!window.tronLink.ready) {
            await new Promise<void>((resolve) => {
              const checkReady = () => {
                if (window.tronLink?.ready) {
                  resolve();
                } else {
                  setTimeout(checkReady, 100);
                }
              };
              checkReady();
            });
          }

          // Obtenir l'instance TronWeb
          const tronWebInstance = window.tronWeb;
          setTronWeb(tronWebInstance);

          if (tronWebInstance && tronWebInstance.defaultAddress.base58) {
            const address = tronWebInstance.defaultAddress.base58;
            const network = getNetworkName(tronWebInstance);
            
            // Récupérer le solde
            const balanceSun = await tronWebInstance.trx.getBalance(address);
            const balanceTrx = balanceSun / 1_000_000;

            setWalletState({
              installed: true,
              loggedIn: true,
              name: 'TronLink',
              address,
              network,
              balance: balanceTrx
            });
          } else {
            setWalletState(prev => ({
              ...prev,
              loggedIn: false
            }));
          }
        } else {
          setWalletState({
            installed: false,
            loggedIn: false,
            name: null,
            address: null,
            network: null,
            balance: null
          });
        }
      } catch (err) {
        console.error('Error initializing TronWeb:', err);
        setError('Failed to initialize TronWeb');
      } finally {
        setLoading(false);
      }
    };

    checkTronLink();

    // Configurer les écouteurs d'événements pour les changements de compte ou de réseau
    const handleAccountsChanged = () => {
      window.location.reload();
    };

    if (window.tronLink) {
      window.addEventListener('message', (e) => {
        if (e.data.message && e.data.message.action === 'accountsChanged') {
          handleAccountsChanged();
        }
        if (e.data.message && e.data.message.action === 'connectWeb') {
          handleAccountsChanged();
        }
        if (e.data.message && e.data.message.action === 'disconnect') {
          handleAccountsChanged();
        }
      });
    }

    return () => {
      // Nettoyer les écouteurs d'événements
      window.removeEventListener('message', handleAccountsChanged);
    };
  }, []);

  // Fonction pour connecter le portefeuille
  const connectWallet = async () => {
    try {
      if (!window.tronLink) {
        window.open('https://www.tronlink.org/', '_blank');
        throw new Error('TronLink n\'est pas installé. Veuillez installer TronLink et rafraîchir la page.');
      }

      await window.tronLink.request({ method: 'tron_requestAccounts' });
      
      // Rafraîchir l'état après connexion
      if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
        const address = window.tronWeb.defaultAddress.base58;
        const network = getNetworkName(window.tronWeb);
        
        // Récupérer le solde
        const balanceSun = await window.tronWeb.trx.getBalance(address);
        const balanceTrx = balanceSun / 1_000_000;

        setWalletState({
          installed: true,
          loggedIn: true,
          name: 'TronLink',
          address,
          network,
          balance: balanceTrx
        });
        
        setTronWeb(window.tronWeb);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error connecting wallet:', err);
      const message = err instanceof Error ? err.message : 'Erreur lors de la connexion du portefeuille';
      setError(message);
      toast.error(message);
      return false;
    }
  };

  // Fonction pour déconnecter le portefeuille (simulée, car TronLink ne prend pas en charge la déconnexion via API)
  const disconnectWallet = () => {
    setWalletState({
      installed: true,
      loggedIn: false,
      name: null,
      address: null,
      network: null,
      balance: null
    });
    setTronWeb(null);
    toast.info('Portefeuille déconnecté');
  };

  // Fonction pour rafraîchir le solde
  const refreshBalance = async () => {
    if (tronWeb && walletState.address) {
      try {
        const balanceSun = await tronWeb.trx.getBalance(walletState.address);
        const balanceTrx = balanceSun / 1_000_000;
        
        setWalletState(prev => ({
          ...prev,
          balance: balanceTrx
        }));
        
        return balanceTrx;
      } catch (err) {
        console.error('Error refreshing balance:', err);
        return null;
      }
    }
    return null;
  };

  // Fonction pour vérifier si on est sur le bon réseau
  const checkNetwork = () => {
    if (!tronWeb) return false;
    
    const network = getNetworkName(tronWeb);
    // En production, nous voulons être sur le réseau principal
    // En développement, nous pouvons accepter le réseau de test Shasta
    const isProduction = import.meta.env.MODE === 'production';
    
    if (isProduction && network !== 'Mainnet') {
      toast.error('Veuillez vous connecter au réseau principal TRON');
      return false;
    }
    
    return true;
  };

  // Fonction utilitaire pour déterminer le nom du réseau
  function getNetworkName(tronWebInstance: TronWebInstance): string {
    const fullNode = tronWebInstance.fullNode.host;
    
    if (fullNode.includes('api.trongrid.io')) {
      return 'Mainnet';
    } else if (fullNode.includes('api.shasta.trongrid.io')) {
      return 'Shasta Testnet';
    } else if (fullNode.includes('api.nile.trongrid.io')) {
      return 'Nile Testnet';
    } else {
      return 'Unknown Network';
    }
  }

  return {
    tronWeb,
    walletState,
    loading,
    error,
    connectWallet,
    disconnectWallet,
    refreshBalance,
    checkNetwork
  };
}
