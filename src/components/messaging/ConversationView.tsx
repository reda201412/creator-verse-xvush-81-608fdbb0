
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import useHapticFeedback from '@/hooks/use-haptic-feedback';
import {
  Lock, Image, Video, Phone, Loader2, ArrowUpCircle
} from 'lucide-react';
import { Message, MessageThread } from '@/types/messaging';
import { FirestoreMessageThread, FirestoreMessage } from '@/utils/create-conversation-utils'; // Types Firestore
import { MonetizationTier } from '@/types/messaging';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import { decryptMessage } from '@/utils/encryption';
import { Timestamp } from 'firebase/firestore'; // Importer Timestamp pour le tri

// Extend FirestoreMessageThread to include messages property
interface ExtendedFirestoreMessageThread extends FirestoreMessageThread {
  messages: FirestoreMessage[];
  readStatus?: Record<string, Timestamp>;
}

interface ConversationViewProps {
  /**
   * The message thread to display.
   */
  thread: ExtendedFirestoreMessageThread;
  /**
   * The current user's ID.
   */
  userId: string;
  /**
   * The current user's display name.
   */
  userName: string; // Peut-être redondant si participantInfo est bien peuplé sur le thread
  /**
   * Callback function to send a message.
   */
  onSendMessage: (content: string, supportData?: any) => void;
  /**
   * The session key for encrypting/decrypting messages.
   */
  sessionKey: string;
  /**
   * Whether security (encryption) is enabled.
   */
  isSecurityEnabled: boolean;
  /**
   * Callback function to open the support panel.
   */
  onOpenSupport: () => void;
  /**
   * Callback function to open the gifts panel.
   */
  onOpenGifts: () => void;
  /**
   * The current user's type (e.g., 'creator' or 'fan').
   */
  userType: 'creator' | 'fan';
  /**
   * Whether messages are currently loading.
   */
  isLoadingMessages: boolean;
  /**
   * Callback to load more messages.
   */
  onLoadMoreMessages: () => void;
  /**
   * Whether there are more messages to load.
   */
  hasMoreMessages: boolean;
}

const ConversationView: React.FC<ConversationViewProps> = ({
  thread,
  userId,
  userName,
  onSendMessage,
  sessionKey,
  isSecurityEnabled,
  onOpenSupport,
  onOpenGifts,
  userType,
  isLoadingMessages,
  onLoadMoreMessages,
  hasMoreMessages
}) => {
  const [isComposing, setIsComposing] = useState(false);
  // const [showMonetizationPanel, setShowMonetizationPanel] = useState(false); // Non utilisé, à vérifier
  const [monetizationEnabled, setMonetizationEnabled] = useState(false);
  const [monetizationTier, setMonetizationTier] = useState<MonetizationTier>('basic');
  const [monetizationAmount, setMonetizationAmount] = useState(1.99);

  /**
   * Ref to the ScrollArea component to manage scrolling.
   */
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  /**
   * Ref to the end of the messages to scroll to the bottom.
   */
  const messagesEndRef = useRef<HTMLDivElement>(null);
  /**
   * Ref to store the previous scroll height for preserving scroll position when loading more messages.
   */
  const previousScrollHeightRef = useRef<number | null>(null);
  const { triggerHaptic } = useHapticFeedback();

  useEffect(() => {
    /**
     * useEffect hook to handle scrolling behavior.
     * - If messages are loading, it preserves the scroll position.
     * - If messages are not loading, it scrolls to the bottom of the conversation.
     * @security Potential issue: Large number of messages could impact performance on initial load.
     */
    if (isLoadingMessages && previousScrollHeightRef.current !== null) {
      if (scrollAreaRef.current) {
        const currentScrollHeight = scrollAreaRef.current.scrollHeight;
        scrollAreaRef.current.scrollTop += (currentScrollHeight - previousScrollHeightRef.current);
        previousScrollHeightRef.current = null;
      }
    } else if (!isLoadingMessages && thread.messages.length > 0) {
      const lastMessage = thread.messages[thread.messages.length - 1];
      if (lastMessage?.senderId === userId || !previousScrollHeightRef.current) {
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
      }
    }
  }, [thread.messages, isLoadingMessages, userId]);

  const handleDecryptMessage = async (message: FirestoreMessage) => {
    if (typeof message.content !== 'string' && !message.content) return "Contenu indisponible";
    try {
      let content;
      if (typeof message.content === 'string' && message.content.startsWith('{')) content = JSON.parse(message.content);
      else if (typeof message.content === 'object') content = message.content;
      else return message.content as string;
      return await decryptMessage(content, sessionKey);
    } catch (error) { console.error('Error decrypting:', error); return "Déchiffrement impossible"; }
  };

  const getOtherParticipantInfo = () => {
    const otherParticipantId = thread.participantIds.find(pId => pId !== userId);
    if (otherParticipantId && thread.participantInfo && thread.participantInfo[otherParticipantId]) {
      return thread.participantInfo[otherParticipantId];
    }
    return { displayName: thread.name || `Utilisateur...`, avatarUrl: `https://i.pravatar.cc/150?u=${otherParticipantId}` };
  };

  const handleSendMessageWrapper = (content: string) => {
    if (!content.trim()) return;
    triggerHaptic('light');
    const supportData = monetizationEnabled ? { tier: monetizationTier, price: monetizationAmount, /* ... */ } : undefined;
    onSendMessage(content, supportData);
    if (monetizationEnabled) setMonetizationEnabled(false);
  };

  const toggleMonetization = () => { }; // Remplacé par une fonction vide pour tester

  const otherParticipant = getOtherParticipantInfo();

  const handleLoadMore = () => {
    if (scrollAreaRef.current) {
      previousScrollHeightRef.current = scrollAreaRef.current.scrollHeight;
    }
    onLoadMoreMessages();
  }

  // Function to render content - was missing in the original file
  const renderContent = (message: FirestoreMessage) => {
    // Default implementation
    return message.content as string;
  };

  // Function to handle reaction - was missing in the original file
  const handleReaction = (messageId: string, reaction: string) => {
    console.log(`Reaction ${reaction} for message ${messageId}`);
    // Implement reaction handling
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="px-4 py-3 backdrop-blur-md bg-white/90 dark:bg-gray-900/90 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center">
          <div className="relative mr-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700">
              <img src={otherParticipant.avatarUrl || `https://i.pravatar.cc/150?u=${thread.participantIds.find(pId => pId !== userId)}`} alt={otherParticipant.displayName} className="w-full h-full object-cover" />
            </div>
            {/* Statut en ligne à implémenter */}
          </div>
          <div className="flex-1"><h3 className="font-medium text-gray-900 dark:text-gray-100">{otherParticipant.displayName}</h3></div>
          <div className="flex gap-2"> {/* ... boutons Phone/Video ... */} </div>
        </div>
      </div>

      {/* Message list */}
      <ScrollArea className="flex-1 px-4 py-3" ref={scrollAreaRef as any}>
        {isLoadingMessages && thread.messages.length === 0 && (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        {hasMoreMessages && !isLoadingMessages && (
          <div className="text-center my-4">
            <Button variant="outline" size="sm" onClick={handleLoadMore} disabled={isLoadingMessages}>
              {isLoadingMessages ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowUpCircle className="mr-2 h-4 w-4" />}
              Charger plus de messages
            </Button>
          </div>
        )}
        {isLoadingMessages && thread.messages.length > 0 && (
          <div className="flex justify-center py-2"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
        )}
        <div className="space-y-1">
          {thread.messages && [...thread.messages].sort((a, b) => (a.createdAt as Timestamp).toMillis() - (b.createdAt as Timestamp).toMillis()).map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isCurrentUser={message.senderId === userId}
              sessionKey={sessionKey}
              decryptMessage={handleDecryptMessage}
              renderContent={renderContent}
              onReaction={handleReaction}
            />
          ))}
        </div>
        <div ref={messagesEndRef} />
      </ScrollArea>

      {isSecurityEnabled && (<div className="px-4 py-1 flex items-center justify-center"><div className="flex items-center px-2 py-1 bg-green-50 dark:bg-green-900/20 rounded text-xs text-green-700 dark:text-green-400"><Lock size={12} className="mr-1" />Messages chiffrés de bout en bout</div></div>)}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <MessageInput onSendMessage={handleSendMessageWrapper} isComposing={isComposing} setIsComposing={setIsComposing} monetizationEnabled={monetizationEnabled} onToggleMonetization={userType === 'fan' ? toggleMonetization : undefined} monetizationTier={monetizationTier} setMonetizationTier={setMonetizationTier} monetizationAmount={monetizationAmount} setMonetizationAmount={setMonetizationAmount} isEncrypted={isSecurityEnabled} />
      </div>
      {userType === 'fan' && (<div className="px-4 pb-3 flex gap-2 justify-center"><Button variant="outline" size="sm" className="text-amber-600 dark:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20" onClick={onOpenGifts}>Offrir un cadeau</Button><Button variant="outline" size="sm" className="text-pink-600 dark:text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900/20" onClick={onOpenSupport}>Soutenir</Button></div>)}
    </div>
  );
};

export default ConversationView;
