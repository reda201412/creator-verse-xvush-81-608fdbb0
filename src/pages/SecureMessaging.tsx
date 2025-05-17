
import SecureMessaging from '@/components/messaging/SecureMessaging';
import { useAuth } from '@/contexts/AuthContext';

const SecureMessagingPage = () => {
  const { profile, user } = useAuth();
  
  return (
    <div className="h-screen w-screen overflow-hidden">
      <SecureMessaging 
        userId={user?.id || ''}
        userName={profile?.displayName || profile?.username || 'User'}
        userAvatar={profile?.avatarUrl || "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?crop=faces&w=200&h=200"}
      />
    </div>
  );
};

export default SecureMessagingPage;
