import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { messagingService } from '@/services/messagingService';
import { useToast } from '@/components/ui/use-toast';
import {
  ExtendedUser,
  UserInfo,
  Participant,
  MessageMetadata,
  BaseMessage,
  Message,
  MessageWithSender,
  BaseConversation,
  Conversation,
  ConversationWithParticipants,
  ConversationContextType
} from './conversationTypes';

const ConversationContext = createContext<ConversationContextType | undefined>(undefined);

export { ConversationContext };

export const ConversationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 20;

  // Charger les conversations de l'utilisateur
  const loadConversations = useCallback(async () => {
    if (!user?.uid) return;

    setIsLoading(true);
    try {
      const userConversations = await messagingService.getUserConversations(user.uid);
      
      // Map the API response to our local Conversation type
      const mappedConversations = userConversations.map(conv => {
        // Map messages to ensure they match our Message type
        const messages = conv.messages.map(msg => ({
          id: msg.id,
          content: msg.content,
          conversationId: msg.conversationId,
          senderId: msg.senderId,
          type: msg.type || 'text',
          metadata: msg.metadata || null,
          isEdited: msg.isEdited ?? false,
          isDeleted: msg.isDeleted ?? false,
          deletedAt: msg.deletedAt || null,
          createdAt: msg.createdAt || new Date(),
          updatedAt: msg.updatedAt || new Date(),
          sender: {
            id: msg.sender.id,
            username: msg.sender.username || null,
            profileImageUrl: msg.sender.profileImageUrl || null,
          }
        } as Message));

        return {
          ...conv,
          messages,
          participants: conv.participants.map(participant => ({
            ...participant,
            user: {
              id: participant.user.id,
              username: participant.user.username || null,
              profileImageUrl: participant.user.profileImageUrl || null,
            }
          }))
        } as Conversation;
      });
      
      setConversations(mappedConversations);
    } catch (error) {
      console.error('Failed to load conversations:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les conversations',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [user?.uid, toast]);

  // Marquer une conversation comme lue
  const markAsRead = useCallback(async (conversationId: string): Promise<void> => {
    if (!user?.uid) return;
    
    try {
      await messagingService.markAsRead(conversationId, user.uid);
      
      // Mettre à jour l'état local
      setConversations(prev => 
        prev.map(conv => {
          if (conv.id === conversationId) {
            const updatedParticipants = conv.participants.map(p => 
              p.userId === user.uid ? { ...p, lastReadAt: new Date() } : p
            );
            return { ...conv, participants: updatedParticipants, unreadCount: 0 };
          }
          return conv;
        })
      );
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  }, [user?.uid]);

  // Charger les messages d'une conversation
  const loadMessages = useCallback(
    async (conversationId: string, loadMore = false) => {
      if (messagesLoading || !user?.uid) return;

      setMessagesLoading(true);
      try {
        const { messages: apiMessages, hasMore } = await messagingService.getConversationMessages(
          conversationId,
          user.uid,
          loadMore ? Math.ceil(messages.length / 20) + 1 : 1,
          20
        );

        // Map API messages to our local Message type
        const mappedMessages = apiMessages.map(msg => ({
          id: msg.id,
          content: msg.content,
          conversationId: msg.conversationId,
          senderId: msg.senderId,
          type: msg.type || 'text',
          metadata: msg.metadata || null,
          isEdited: Boolean(msg.isEdited),
          isDeleted: Boolean(msg.isDeleted),
          deletedAt: msg.deletedAt || null,
          createdAt: msg.createdAt || new Date(),
          updatedAt: msg.updatedAt || new Date(),
          sender: {
            id: msg.sender.id,
            username: msg.sender.username || null,
            profileImageUrl: msg.sender.profileImageUrl || null,
          }
        } as Message));

        setMessages(prev => (loadMore ? [...prev, ...mappedMessages] : mappedMessages));
        setHasMoreMessages(hasMore);
      } catch (error) {
        console.error('Failed to load messages:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les messages',
          variant: 'destructive',
        });
      } finally {
        setMessagesLoading(false);
      }
    },
    [messages.length, messagesLoading, user, toast]
  );

  // Charger plus de messages (pagination)
  const loadMoreMessages = useCallback(async (): Promise<void> => {
    if (!selectedConversation || !hasMoreMessages || messagesLoading) return;
    await loadMessages(selectedConversation.id, true);
  }, [selectedConversation, hasMoreMessages, messagesLoading, loadMessages]);

  // Envoyer un message
  const sendMessage = useCallback(
    async (content: string, metadata: MessageMetadata = {}): Promise<Message> => {
      if (!selectedConversation || !user) {
        throw new Error('Aucune conversation sélectionnée ou utilisateur non connecté');
      }

      try {
        const newMessage = await messagingService.sendMessage({
          content,
          conversationId: selectedConversation.id,
          senderId: user.uid,
          metadata,
        });

        // Create a complete message object that matches our Message interface
        const completeMessage: Message = {
          id: newMessage.id,
          content: newMessage.content,
          conversationId: newMessage.conversationId,
          senderId: newMessage.senderId,
          type: newMessage.type || 'text',
          metadata: newMessage.metadata || null, // Ensure metadata is either an object or null
          isEdited: false,
          isDeleted: false,
          deletedAt: null,
          createdAt: newMessage.createdAt || new Date(),
          updatedAt: newMessage.updatedAt || new Date(),
          sender: {
            id: newMessage.sender.id,
            username: newMessage.sender.username || null,
            profileImageUrl: newMessage.sender.profileImageUrl || null,
          },
        };

        setMessages((prev) => [...prev, completeMessage]);

        // Update conversation's last activity
        setSelectedConversation((prev) =>
          prev
            ? {
                ...prev,
                updatedAt: new Date(),
                lastMessageAt: new Date(),
              }
            : null
        );

        // Update conversations list
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === selectedConversation.id
              ? {
                  ...conv,
                  updatedAt: new Date(),
                  lastMessageAt: new Date(),
                  messages: [...conv.messages, completeMessage],
                }
              : conv
          )
        );

        return completeMessage;
      } catch (error) {
        console.error('Erreur lors de l\'envoi du message :', error);
        toast({
          title: 'Erreur',
          description: 'Impossible d\'envoyer le message. Veuillez réessayer.',
          variant: 'destructive',
        });
        throw error;
      }
    },
    [selectedConversation, user, toast]
  );

  // Créer une nouvelle conversation
  const createConversation = useCallback(async (participantIds: string[], title?: string): Promise<Conversation> => {
    if (!user?.uid) throw new Error('Utilisateur non connecté');
    if (participantIds.length < 1) throw new Error('Au moins un participant est requis');

    try {
      const newConversation = await messagingService.createConversation({
        participantIds: [...participantIds, user.uid],
        title,
        isGroup: participantIds.length > 1 || !!title,
      });

      // Map the API response to our local Conversation type
      const mappedConversation: Conversation = {
        ...newConversation,
        messages: newConversation.messages.map(msg => ({
          ...msg,
          sender: msg.sender
        }))
      };

      setConversations(prev => [mappedConversation, ...prev]);
      setSelectedConversation(mappedConversation);
      return mappedConversation;
    } catch (error) {
      console.error('Failed to create conversation:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de créer la conversation',
        variant: 'destructive',
      });
      throw error;
    }
  }, [user?.uid, toast]);

  // Ajouter un participant à une conversation
  const addParticipant = useCallback(async (conversationId: string, userId: string): Promise<void> => {
    if (!user?.uid) return;
    
    try {
      await messagingService.addParticipant(conversationId, userId, user.uid);
      
      // Recharger les détails de la conversation
      if (selectedConversation?.id === conversationId) {
        const updatedConversation = await messagingService.getUserConversations(user.uid)
          .then(convs => convs.find(c => c.id === conversationId));
        
        if (updatedConversation) {
          setSelectedConversation(updatedConversation);
        }
      }
      
      // Recharger la liste des conversations
      await loadConversations();
      
      toast({
        title: 'Succès',
        description: 'Participant ajouté avec succès',
      });
    } catch (error) {
      console.error('Failed to add participant:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'ajouter le participant',
        variant: 'destructive',
      });
      throw error;
    }
  }, [user?.uid, selectedConversation?.id, loadConversations, toast]);

  // Supprimer un participant d'une conversation
  const removeParticipant = useCallback(async (conversationId: string, userId: string): Promise<void> => {
    if (!user?.uid) return;
    
    try {
      await messagingService.removeParticipant(conversationId, userId, user.uid);
      
      // Si l'utilisateur actuel est supprimé, quitter la conversation
      if (userId === user.uid) {
        setSelectedConversation(null);
      } else if (selectedConversation?.id === conversationId) {
        // Recharger les détails de la conversation
        const updatedConversation = await messagingService.getUserConversations(user.uid)
          .then(convs => convs.find(c => c.id === conversationId));
        
        if (updatedConversation) {
          setSelectedConversation(updatedConversation);
        }
      }
      
      // Recharger la liste des conversations
      await loadConversations();
      
      toast({
        title: 'Succès',
        description: 'Participant supprimé avec succès',
      });
    } catch (error) {
      console.error('Failed to remove participant:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le participant',
        variant: 'destructive',
      });
      throw error;
    }
  }, [user?.uid, selectedConversation?.id, loadConversations, toast]);

  // Effet pour charger les conversations au montage
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Effet pour charger les messages quand une conversation est sélectionnée
  useEffect(() => {
    if (selectedConversation?.id) {
      setPage(1);
      loadMessages(selectedConversation.id);
    } else {
      setMessages([]);
    }
  }, [selectedConversation?.id, loadMessages]);

  return (
    <ConversationContext.Provider
      value={{
        conversations,
        isLoading,
        selectedConversation,
        messages,
        messagesLoading,
        hasMoreMessages,
        loadMoreMessages,
        setSelectedConversation,
        sendMessage,
        createConversation,
        markAsRead,
        loadConversations,
        loadMessages,
        addParticipant,
        removeParticipant,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
};

export default ConversationProvider;
