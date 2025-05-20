
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import useHapticFeedback from '@/hooks/use-haptic-feedback';
import { 
  Lock, Image, Video, Phone, Loader2, ArrowUpCircle
} from 'lucide-react';
import { FirestoreMessage, FirestoreMessageThread } from '@/utils/create-conversation-utils'; 
import { MonetizationTier } from '@/types/messaging';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import { decryptMessage } from '@/utils/encryption';
import { Timestamp } from 'firebase/firestore'; 

interface ExtendedFirestoreMessageThread extends FirestoreMessageThread {
  participants?: string[];
}

interface ConversationViewProps {
  thread: ExtendedFirestoreMessageThread;
  userId: string;
  userName: string; 
  onSendMessage: (content: string, supportData?: any) => void;
  sessionKey: string;
  isSecurityEnabled: boolean;
  onOpenSupport: () => void;
  onOpenGifts: () => void;
  userType: 'creator' | 'fan';
  isLoadingMessages: boolean;
  onLoadMoreMessages: () => void;
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
  const [monetizationEnabled, setMonetizationEnabled] = useState(false);
  const [monetizationTier, setMonetizationTier] = useState<MonetizationTier>('basic');
  const [monetizationAmount, setMonetizationAmount] = useState(1.99);
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const previousScrollHeightRef = useRef<number | null>(null);
  const { toast } = useToast();
  const { triggerHaptic } = useHapticFeedback();
  
  useEffect(() => {
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
    const supportData = monetizationEnabled ? { tier: monetizationTier, price: monetizationAmount /* ... */ } : undefined;
    onSendMessage(content, supportData);
    if (monetizationEnabled) setMonetizationEnabled(false);
  };
  
  const toggleMonetization = () => {}; // Empty function placeholder
  
  const otherParticipant = getOtherParticipantInfo();

  const handleLoadMore = () => {
    if (scrollAreaRef.current) {
        previousScrollHeightRef.current = scrollAreaRef.current.scrollHeight;
    }
    onLoadMoreMessages();
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="px-4 py-3 backdrop-blur-md bg-white/90 dark:bg-gray-900/90 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center">
          <div className="relative mr-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700">
              <img 
                src={otherParticipant.avatarUrl || `https://i.pravatar.cc/150?u=${thread.participantIds.find(pId => pId !== userId)}`} 
                alt={otherParticipant.displayName} 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>
          <div className="flex-1"><h3 className="font-medium text-gray-900 dark:text-gray-100">{otherParticipant.displayName}</h3></div>
          <div className="flex gap-2">{/* ... buttons ... */}</div>
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
          {thread.messages && [...thread.messages].sort(
            (a,b) => (a.createdAt as any).toMillis() - (b.createdAt as any).toMillis()
          ).map((message) => (
            <MessageBubble
              key={message.id}
              message={message as any} // Type cast to work with MessageBubble component
              isCurrentUser={message.senderId === userId}
              sessionKey={sessionKey}
              decryptMessage={handleDecryptMessage as any}
            />
          ))}
        </div>
        <div ref={messagesEndRef} />
      </ScrollArea>

      {isSecurityEnabled && ( 
        <div className="px-4 py-1 flex items-center justify-center">
          <div className="flex items-center px-2 py-1 bg-green-50 dark:bg-green-900/20 rounded text-xs text-green-700 dark:text-green-400">
            <Lock size={12} className="mr-1" />Messages chiffrés de bout en bout
          </div>
        </div> 
      )}
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <MessageInput 
          onSendMessage={handleSendMessageWrapper} 
          isComposing={isComposing} 
          setIsComposing={setIsComposing} 
          monetizationEnabled={monetizationEnabled} 
          onToggleMonetization={userType === 'fan' ? toggleMonetization : undefined} 
          monetizationTier={monetizationTier} 
          setMonetizationTier={setMonetizationTier} 
          monetizationAmount={monetizationAmount} 
          setMonetizationAmount={setMonetizationAmount} 
          isEncrypted={isSecurityEnabled} 
        />
      </div>
      
      {userType === 'fan' && ( 
        <div className="px-4 pb-3 flex gap-2 justify-center">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-amber-600 dark:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20" 
            onClick={onOpenGifts}
          >
            Offrir un cadeau
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-pink-600 dark:text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900/20" 
            onClick={onOpenSupport}
          >
            Soutenir
          </Button>
        </div> 
      )}
    </div>
  );
};

export default ConversationView;
