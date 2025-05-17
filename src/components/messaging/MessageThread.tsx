
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Message } from '@/types/messaging';
import { Lock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SecureMessageBubble from './SecureMessageBubble';
import { isEncrypted } from '@/utils/encryption';

interface MessageThreadProps {
  messages: Message[];
  currentUserId: string;
  sessionKey?: string;
}

const MessageThread: React.FC<MessageThreadProps> = ({ messages, currentUserId, sessionKey = "default-session-key" }) => {
  const messageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  };

  return (
    <div className="flex flex-col space-y-4">
      {messages.map((message, index) => {
        const isCurrentUser = message.senderId === currentUserId;
        const hasMonetization = !!message.monetization;
        
        return (
          <motion.div
            key={message.id}
            className={cn(
              "flex",
              isCurrentUser ? "justify-end" : "justify-start"
            )}
            variants={messageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2, delay: index * 0.05 }}
          >
            <SecureMessageBubble
              content={message.content}
              isCurrentUser={isCurrentUser}
              sender={message.senderName}
              timestamp={new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              sessionKey={sessionKey}
              isPremium={hasMonetization}
              onDecrypt={(decryptedContent) => {
                // Ici, on pourrait enregistrer que le message a été lu
                console.log(`Message déchiffré: ${message.id}`);
              }}
            />
          </motion.div>
        );
      })}
    </div>
  );
};

export default MessageThread;
