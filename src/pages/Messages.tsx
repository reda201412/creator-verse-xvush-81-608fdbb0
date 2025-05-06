
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Messages = () => {
  const navigate = useNavigate();
  
  // Rediriger automatiquement vers la nouvelle messagerie
  useEffect(() => {
    navigate('/secure-messaging');
  }, [navigate]);
  
  return (
    <div className="flex items-center justify-center h-screen">
      Redirection vers la messagerie moderne...
    </div>
  );
};

export default Messages;
