
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner } from '@/components/ui/spinner';

const Messages = () => {
  const navigate = useNavigate();
  
  // Rediriger automatiquement vers la nouvelle messagerie avec un effet visuel
  useEffect(() => {
    const redirectTimeout = setTimeout(() => {
      navigate('/secure-messaging');
    }, 1000); // Un délai plus long pour une meilleure expérience utilisateur
    
    return () => clearTimeout(redirectTimeout);
  }, [navigate]);
  
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
      <Spinner 
        size="xl" 
        color="primary" 
        label="Redirection vers la messagerie sécurisée..." 
      />
      <p className="text-sm text-muted-foreground animate-pulse">
        Mise à jour vers notre nouvelle expérience de messagerie...
      </p>
    </div>
  );
};

export default Messages;
