
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Message } from '@/types/messaging';
import { Lock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MessageThreadProps {
  messages: Message[];
  currentUserId: string;
}

const MessageThread: React.FC<MessageThreadProps> = ({ messages, currentUserId }) => {
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
            <div className={cn(
              "max-w-[80%] flex",
              isCurrentUser ? "flex-row-reverse" : "flex-row"
            )}>
              {!isCurrentUser && (
                <img
                  src={message.senderAvatar}
                  alt={message.senderName}
                  className="w-8 h-8 rounded-full mr-2 object-cover flex-shrink-0"
                />
              )}
              
              <div className={cn(
                "flex flex-col",
                isCurrentUser ? "items-end" : "items-start"
              )}>
                {!isCurrentUser && (
                  <span className="text-xs text-muted-foreground mb-1">
                    {message.senderName}
                  </span>
                )}
                
                <div className={cn(
                  "rounded-2xl py-2 px-3 group relative",
                  isCurrentUser 
                    ? "bg-primary text-primary-foreground rounded-tr-none" 
                    : "bg-muted/60 backdrop-blur-sm rounded-tl-none",
                  hasMonetization && !isCurrentUser && "border border-amber-400/30",
                  message.isEncrypted && "border border-green-400/20"
                )}>
                  {/* Monetization indicator */}
                  {hasMonetization && !isCurrentUser && (
                    <div className="absolute -top-2 -right-2 bg-amber-400 rounded-full p-1 shadow-lg">
                      <Zap size={12} className="text-black" />
                    </div>
                  )}
                  
                  {/* Encryption indicator */}
                  {message.isEncrypted && (
                    <div className={cn(
                      "absolute opacity-0 group-hover:opacity-100 transition-opacity", 
                      isCurrentUser ? "-left-2 -top-2" : "-right-2 -top-2"
                    )}>
                      <Lock size={12} className="text-green-400" />
                    </div>
                  )}
                  
                  {/* If monetized and not viewed yet */}
                  {hasMonetization && !isCurrentUser ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center gap-1 text-amber-400/90">
                        <Zap size={14} />
                        <span className="text-xs font-medium">Contenu Premium</span>
                      </div>
                      <p className="text-xs text-muted-foreground text-center">
                        {message.monetization?.tier === 'vip' ? 'Message VIP' : 'Message Premium'}
                      </p>
                      <Button variant="outline" size="sm" className="mt-1 w-full bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20">
                        Débloquer pour {message.monetization?.price}{message.monetization?.currency === 'USD' ? '$' : '€'}
                      </Button>
                    </div>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  )}
                </div>
                
                <span className="text-[10px] text-muted-foreground mt-1">
                  {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  {message.status === 'read' && " • Lu"}
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default MessageThread;
