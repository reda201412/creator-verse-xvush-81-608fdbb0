
import React, { createContext, useContext, useState } from 'react';

interface ConversationContextType {
  conversations: any[];
  selectedConversation: any | null;
  setSelectedConversation: (conversation: any | null) => void;
  updateConversation: (conversationId: string, updates: any) => Promise<void>;
}

const ConversationContext = createContext<ConversationContextType | undefined>(undefined);

export const ConversationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any | null>(null);

  const updateConversation = async (conversationId: string, updates: any) => {
    // Mock implementation
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId ? { ...conv, ...updates } : conv
      )
    );
    
    // If the selected conversation is being updated, update that too
    if (selectedConversation?.id === conversationId) {
      setSelectedConversation(prev => ({ ...prev, ...updates }));
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
