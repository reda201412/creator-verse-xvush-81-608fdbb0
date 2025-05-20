
import React, { createContext, useContext, useState } from 'react';
import { FirestoreMessageThread } from '@/utils/create-conversation-utils';

interface ConversationContextType {
  conversations: FirestoreMessageThread[];
  selectedConversation: FirestoreMessageThread | null;
  setSelectedConversation: (conversation: FirestoreMessageThread | null) => void;
  updateConversation: (conversationId: string, updates: any) => Promise<void>;
}

const ConversationContext = createContext<ConversationContextType | undefined>(undefined);

export const ConversationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState<FirestoreMessageThread[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<FirestoreMessageThread | null>(null);

  const updateConversation = async (conversationId: string, updates: any) => {
    // Mock implementation
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId ? { ...conv, ...updates } : conv
      )
    );
    
    // If the selected conversation is being updated, update that too
    if (selectedConversation?.id === conversationId) {
      setSelectedConversation(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  return (
    <ConversationContext.Provider
      value={{ conversations, selectedConversation, setSelectedConversation, updateConversation }}
    >
      {children}
    </ConversationContext.Provider>
  );
};

export const useConversation = () => {
  const context = useContext(ConversationContext);
  if (context === undefined) {
    throw new Error('useConversation must be used within a ConversationProvider');
  }
  return context;
};
