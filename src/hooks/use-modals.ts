
import { useState } from 'react';

interface Modals {
  wallet: boolean;
  security: boolean;
  subscriptions: boolean;
  contentPurchase: boolean;
}

export function useModals() {
  const [openModals, setOpenModals] = useState<Modals>({
    wallet: false,
    security: false,
    subscriptions: false,
    contentPurchase: false,
  });

  const openModal = (modalName: keyof Modals) => {
    setOpenModals(prev => ({
      ...prev,
      [modalName]: true
    }));
  };

  const closeModal = (modalName: keyof Modals) => {
    setOpenModals(prev => ({
      ...prev,
      [modalName]: false
    }));
  };

  const toggleModal = (modalName: keyof Modals) => {
    setOpenModals(prev => ({
      ...prev,
      [modalName]: !prev[modalName]
    }));
  };

  return {
    openModals,
    openModal,
    closeModal,
    toggleModal
  };
}
