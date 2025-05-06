
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner } from '@/components/ui/spinner';

const Messages = () => {
  const navigate = useNavigate();
  
  // Rediriger automatiquement vers la nouvelle messagerie avec un effet visuel
  useEffect(() => {
    const redirectTimeout = setTimeout(() => {
      navigate('/secure-messaging');
    }, 500); // Petit délai pour l'animation
    
    return () => clearTimeout(redirectTimeout);
  }, [navigate]);
  
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
      <Spinner size="lg" color="primary" label="Redirection vers la messagerie sécurisée..." />
    </div>
  );
};

export default Messages;
