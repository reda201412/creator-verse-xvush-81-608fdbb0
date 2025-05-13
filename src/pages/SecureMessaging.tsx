
import React from 'react';
import SecureMessaging from '@/components/messaging/SecureMessaging';
import { useAuth } from '@/contexts/AuthContext';

const SecureMessagingPage = () => {
  const { profile, user } = useAuth();
  
  return (
    <div className="h-screen w-screen overflow-hidden">
      <SecureMessaging 
        userId={user?.id || ''}
        userName={profile?.display_name || profile?.username || 'User'}
        userAvatar={profile?.avatar_url || "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?crop=faces&w=200&h=200"}
      />
    </div>
  );
};

export default SecureMessagingPage;
