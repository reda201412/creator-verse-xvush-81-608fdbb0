
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ConversationProvider } from '@/contexts/ConversationContext';
import SecureMessagingComponent from '@/components/messaging/SecureMessaging';

// Define the props type expected by the SecureMessaging component
interface ConversationType {
  id: string;
  participantIds: string[];
  participantInfo: Record<string, { name: string }>;
  lastActivity: Date;
  createdAt: Date;
  isGated: boolean;
  messages: any[];
}

const SecureMessagingPage = () => {
  const { profile, user } = useAuth();
  
  // Create mock conversation data
  const mockConversation: ConversationType = {
    id: 'sample-conversation',
    participantIds: [(user?.uid || ''), 'other-user'],
    participantInfo: { 
      [(user?.uid || '')]: { name: profile?.displayName || profile?.username || 'User' },
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
        senderId: (user?.uid || ''),
        content: 'Hi! Thanks for the welcome.',
        type: 'text',
        createdAt: new Date(),
        sender_name: profile?.displayName || profile?.username || 'User',
        sender_avatar: profile?.avatarUrl || 'https://i.pravatar.cc/150?img=1'
      }
    ],
  };
  
  return (
    <ConversationProvider>
      <div className="h-screen w-screen overflow-hidden">
        <SecureMessagingComponent 
          selectedConversation={mockConversation}
        />
      </div>
    </ConversationProvider>
  );
};

export default SecureMessagingPage;
