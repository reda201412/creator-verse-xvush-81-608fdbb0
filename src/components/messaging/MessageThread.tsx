
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Message } from '@/types/messaging';
import { Button } from '@/components/ui/button';
import SecureMessageBubble from './SecureMessageBubble';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { isEncrypted } from '@/utils/encryption';
import useHapticFeedback from '@/hooks/use-haptic-feedback';

interface MessageThreadProps {
  messages: Message[];
  currentUserId: string;
  sessionKey?: string;
}

const MessageThread: React.FC<MessageThreadProps> = ({ messages, currentUserId, sessionKey = "default-session-key" }) => {
  const { triggerHaptic } = useHapticFeedback();
  const [revealedMessages, setRevealedMessages] = useState<Record<string, boolean>>({});
  
  const revealMessage = (messageId: string) => {
    triggerHaptic('medium');
    setRevealedMessages(prev => ({
      ...prev,
      [messageId]: true
    }));
  };
  
  const messageVariants = {
    initial: { opacity: 0, y: 20, scale: 0.9 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <div className="flex flex-col space-y-4">
      {messages.map((message, index) => {
        const isCurrentUser = message.senderId === currentUserId;
        const hasMonetization = !!message.monetization;
        const isRevealed = revealedMessages[message.id];
        const showBlurred = hasMonetization && !isRevealed;
        
        return (
          <motion.div
            key={message.id}
            className={cn(
              "flex items-end gap-2",
              isCurrentUser ? "flex-row-reverse" : "flex-row"
            )}
            variants={messageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2, delay: index * 0.05 }}
          >
            {/* Avatar for non-current user */}
            {!isCurrentUser && (
              <Avatar className="h-6 w-6">
                <AvatarImage src={message.senderAvatar} />
                <AvatarFallback className="bg-gray-800 text-xs">
                  {message.senderName[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}
            
            {/* Message bubble */}
            <div className={cn(
              "group relative max-w-[75%]",
              showBlurred && "filter blur-md"
            )}>
              <div className={cn(
                "rounded-2xl px-4 py-2 text-sm backdrop-blur-sm",
                isCurrentUser 
                  ? "bg-purple-600 text-white rounded-br-sm" 
                  : "bg-gray-800 text-white rounded-bl-sm"
              )}>
                {/* If message has monetization and not revealed, show blurred content */}
                {showBlurred ? (
                  <div 
                    className="flex flex-col items-center justify-center py-2"
                    onClick={() => revealMessage(message.id)}
                  >
                    <Eye className="h-4 w-4 mb-1" />
                    <span className="text-xs font-medium">Appuyez pour voir</span>
                  </div>
                ) : (
                  <SecureMessageBubble
                    content={message.content}
                    isCurrentUser={isCurrentUser}
                    sender={message.senderName}
                    timestamp={new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    sessionKey={sessionKey}
                    isPremium={hasMonetization}
                    onDecrypt={() => console.log(`Message déchiffré: ${message.id}`)}
                  />
                )}
              </div>
              
              {/* Encryption indicator */}
              {message.isEncrypted && (
                <div className={cn(
                  "absolute -bottom-1",
                  isCurrentUser ? "-left-3" : "-right-3",
                  "text-green-500 opacity-0 group-hover:opacity-100 transition-opacity"
                )}>
                  <Lock className="h-3 w-3" />
                </div>
              )}
              
              {/* Message sender indicator for current user */}
              {isCurrentUser && (
                <div className="text-[10px] text-gray-400 text-right mt-0.5 pr-1">
                  MOI
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default MessageThread;
