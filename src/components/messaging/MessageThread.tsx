
import React from 'react';
import { Message } from '@/types/messaging';

interface MessageThreadProps {
  messages: Message[];
  currentUserId: string;
  sessionKey?: string;
}

const MessageThread: React.FC<MessageThreadProps> = ({ 
  messages, 
  currentUserId,
  sessionKey 
}) => {
  return (
    <div className="space-y-4">
      {messages.map(message => {
        const isOwnMessage = message.senderId === currentUserId;
        const alignmentClass = isOwnMessage ? "justify-end" : "justify-start";
        const bubbleColorClass = isOwnMessage 
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-foreground";
        
        return (
          <div key={message.id} className={`flex ${alignmentClass} gap-2`}>
            {!isOwnMessage && (
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                <img 
                  src={message.senderAvatar || `https://i.pravatar.cc/150?u=${message.senderId}`} 
                  alt="avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div>
              <div className={`rounded-lg px-3 py-2 max-w-xs sm:max-w-md ${bubbleColorClass}`}>
                {message.isEncrypted ? (
                  <div className="space-y-1">
                    <p>{message.content as string}</p>
                    {sessionKey && (
                      <div className="text-xs opacity-80 flex items-center gap-1">
                        Déchiffrement en cours...
                      </div>
                    )}
                  </div>
                ) : (
                  <p>{message.content as string}</p>
                )}
              </div>
              
              <div className="flex items-center gap-1 mt-1 justify-end">
                <span className="text-xs text-muted-foreground">
                  {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
            </div>
            
            {isOwnMessage && (
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                <img 
                  src={message.senderAvatar || `https://i.pravatar.cc/150?u=${message.senderId}`} 
                  alt="avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MessageThread;
