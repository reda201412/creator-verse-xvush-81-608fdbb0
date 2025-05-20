
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { formatMessageTimestamp } from '@/utils/messaging-utils';
import { Lock, Zap, CheckCheck, Check, Image, FileText, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FirestoreMessage } from '@/utils/create-conversation-utils';

interface MessageBubbleProps {
  message: FirestoreMessage;
  isCurrentUser: boolean;
  sessionKey: string;
  decryptMessage?: (message: FirestoreMessage) => Promise<string>;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isCurrentUser,
  sessionKey,
  decryptMessage
}) => {
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptedContent, setDecryptedContent] = useState<string | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  
  const handleDecrypt = async () => {
    if (!decryptMessage) return;
    
    setIsDecrypting(true);
    try {
      const content = await decryptMessage(message);
      setDecryptedContent(content);
    } catch (error) {
      console.error('Failed to decrypt message:', error);
      setDecryptedContent('Failed to decrypt message');
    } finally {
      setIsDecrypting(false);
    }
  };
  
  const renderMessageContent = () => {
    if (message.isEncrypted && !decryptedContent) {
      return (
        <div className="flex flex-col">
          <div className="flex items-center mb-1">
            <Lock className="h-3 w-3 mr-1" />
            <span className="text-xs">Message chiffré</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleDecrypt} 
            disabled={isDecrypting}
            className="text-xs h-6"
          >
            {isDecrypting ? 'Déchiffrement...' : 'Déchiffrer'}
          </Button>
        </div>
      );
    }
    
    // If we have decrypted content or the message isn't encrypted
    const contentToRender = decryptedContent || message.content;
    
    if (message.type === 'image') {
      return (
        <div className="relative rounded overflow-hidden">
          <img 
            src={contentToRender} 
            alt="Image" 
            className="w-full max-h-48 object-cover"
          />
          <div className="absolute bottom-1 right-1 bg-black/50 rounded-full p-1">
            <Image className="h-3 w-3 text-white" />
          </div>
        </div>
      );
    } else if (message.type === 'video') {
      return (
        <div className="relative rounded overflow-hidden">
          <video 
            src={contentToRender}
            className="w-full max-h-48 object-cover"
            controls
          />
          <div className="absolute top-1 right-1 bg-black/50 rounded-full p-1">
            <Video className="h-3 w-3 text-white" />
          </div>
        </div>
      );
    } else if (message.type === 'file') {
      return (
        <div className="flex items-center p-2 bg-background rounded border">
          <FileText className="h-4 w-4 mr-2" />
          <span className="text-sm truncate">{contentToRender}</span>
        </div>
      );
    }
    
    return <span>{contentToRender}</span>;
  };
  
  const renderTimestamp = () => {
    return (
      <div className="text-xs text-muted-foreground flex items-center">
        <span>{formatMessageTimestamp(message.createdAt)}</span>
        {isCurrentUser && (
          <span className="ml-1">
            {message.status === 'read' ? (
              <CheckCheck className="h-3 w-3" />
            ) : (
              <Check className="h-3 w-3" />
            )}
          </span>
        )}
      </div>
    );
  };
  
  return (
    <div
      className={cn(
        "group flex flex-col mb-2 max-w-[80%]",
        isCurrentUser ? "self-end items-end" : "self-start items-start"
      )}
      onMouseEnter={() => setShowOptions(true)}
      onMouseLeave={() => setShowOptions(false)}
    >
      <div
        className={cn(
          "relative rounded-lg px-3 py-2",
          isCurrentUser
            ? "bg-primary text-primary-foreground rounded-br-none"
            : "bg-muted text-foreground rounded-bl-none"
        )}
      >
        {message.monetization && (
          <div className="absolute -top-3 -right-2 bg-amber-500 text-white rounded-full p-1">
            <Zap className="h-3 w-3" />
          </div>
        )}
        
        {!isCurrentUser && message.sender_name && (
          <div className="text-xs font-medium mb-1">
            {message.sender_name}
          </div>
        )}
        
        {renderMessageContent()}
        
        <div className="mt-1 text-right">
          {renderTimestamp()}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
