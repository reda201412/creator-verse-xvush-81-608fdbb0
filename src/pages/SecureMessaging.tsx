
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

// Import the corrected SecureMessaging component
import SecureMessaging from '@/components/messaging/SecureMessaging';

const SecureMessagingPage = () => {
  const { profile, user } = useAuth();
  
  return (
    <div className="h-screen w-screen overflow-hidden">
      <SecureMessaging 
        selectedConversation={{
          id: 'sample-conversation',
          participantIds: [(user?.id || user?.uid || ''), 'other-user'],
          participantInfo: { 
            [(user?.id || user?.uid || '')]: { name: profile?.displayName || profile?.username || 'User' },
            'other-user': { name: 'Other User' } 
          },
          lastActivity: new Date(),
          createdAt: new Date(),
          isGated: false,
          messages: [
            {
              id: 'sample-message-1',
              senderId: 'other-user',
              content: 'Hello there! Welcome to the secure messaging app.',
              type: 'text',
              createdAt: new Date(Date.now() - 3600000),
              sender_name: 'Other User',
              sender_avatar: 'https://i.pravatar.cc/150?img=2'
            },
            {
              id: 'sample-message-2',
              senderId: (user?.id || user?.uid || ''),
              content: 'Hi! Thanks for the welcome.',
              type: 'text',
              createdAt: new Date(),
              sender_name: profile?.displayName || profile?.username || 'User',
              sender_avatar: profile?.avatarUrl || 'https://i.pravatar.cc/150?img=1'
            }
          ],
        }}
      />
    </div>
  );
};

export default SecureMessagingPage;
