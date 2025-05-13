
import React, { useState } from 'react';
import { FirestoreMessage } from '@/utils/create-conversation-utils';
import { cn } from '@/lib/utils';
import { Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';
import { Heart, ThumbsUp, MessageSquare, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MessageBubbleProps {
  message: FirestoreMessage;
  isCurrentUser: boolean;
  sessionKey: string;
  decryptMessage: (message: FirestoreMessage) => Promise<string>;
  renderContent: (message: FirestoreMessage) => React.ReactNode;
  onReaction: (messageId: string, reactionType: string) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  isCurrentUser,
  sessionKey,
  decryptMessage,
  renderContent,
  onReaction
}) => {
  const [isDecrypted, setIsDecrypted] = useState(false);
  const [decryptedContent, setDecryptedContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const getFormattedTime = (timestamp: Timestamp) => {
    if (!timestamp || !timestamp.toDate) return "";
    return format(timestamp.toDate(), 'HH:mm');
  };

  const handleDecrypt = async () => {
    if (isDecrypted || !message.isEncrypted) return;
    
    setIsLoading(true);
    try {
      const content = await decryptMessage(message);
      setDecryptedContent(content);
      setIsDecrypted(true);
    } catch (error) {
      console.error('Failed to decrypt message:', error);
      setDecryptedContent('Failed to decrypt message');
    } finally {
      setIsLoading(false);
    }
  };

  // Determine the message content to display
  const displayContent = () => {
    // If message is not encrypted, show content directly
    if (!message.isEncrypted) {
      return renderContent(message);
    }
    
    // If message is encrypted but not yet decrypted
    if (!isDecrypted) {
      if (isLoading) {
        return <span className="text-muted-foreground italic">Déchiffrement...</span>;
      }
      return (
        <span 
          onClick={handleDecrypt}
          className="text-muted-foreground italic cursor-pointer hover:text-primary"
        >
          Chiffré. Cliquez pour afficher.
        </span>
      );
    }
    
    // If message is decrypted
    return decryptedContent;
  };

  return (
    <div 
      className={cn(
        "group flex flex-col max-w-[80%] relative",
        isCurrentUser ? "ml-auto items-end" : "mr-auto items-start"
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div 
        className={cn(
          "px-3 py-2 rounded-lg mb-1",
          isCurrentUser 
            ? "bg-primary text-primary-foreground" 
            : "bg-muted text-foreground",
          message.monetization && "border-2 border-amber-400 dark:border-amber-500"
        )}
      >
        {displayContent()}

        {message.monetization && (
          <div className="mt-1 text-xs opacity-80">
            💰 {message.monetization.tier === 'premium' ? 'Support Premium' : 'Tip'}: ${message.monetization.price}
          </div>
        )}
      </div>
      
      <div className="flex items-center text-xs text-muted-foreground">
        <span>
          {message.createdAt && getFormattedTime(message.createdAt as Timestamp)}
        </span>
        
        {message.isEncrypted && (
          <span className="ml-1">🔒</span>
        )}
      </div>
      
      {showActions && !isCurrentUser && (
        <div className="absolute -bottom-8 left-0 bg-background border rounded-full shadow-sm flex">
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-6 w-6 rounded-full"
            onClick={() => onReaction(message.id, 'like')}
          >
            <ThumbsUp size={12} />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-6 w-6 rounded-full"
            onClick={() => onReaction(message.id, 'heart')}
          >
            <Heart size={12} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
