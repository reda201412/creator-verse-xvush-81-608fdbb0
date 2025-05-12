import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Message } from '@/types/messaging';
import { Lock, Zap, Eye, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { isEncrypted } from '@/utils/encryption';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/contexts/AuthContext';
import { getMoodColors } from '@/utils/mood-colors';
import { useMood } from '@/components/neuro-aesthetic/AdaptiveMoodLighting'

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  isEphemeral?: boolean;
  isRevealed?: boolean;
  onReveal?: () => void;
  sessionKey: string;
  decryptMessage?: (message: Message) => Promise<string>;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isCurrentUser,
  isEphemeral = false,
  isRevealed = false,
  onReveal,
  sessionKey,
  decryptMessage
}) => {
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptedContent, setDecryptedContent] = useState<string | null>(null);
  const [showDecrypted, setShowDecrypted] = useState(false);
  const hasMonetization = !!message.monetization;
  const { profile } = useAuth();
  const { intensity } = useMood();

  const opacityValue = Math.min(0.5, intensity / 200);

  // Get the mood colors based on the user profile
  const currentMood = profile?.mood || 'calm'; // Default to 'calm' if mood is not available
  const bubbleColors = getMoodColors(currentMood, opacityValue);

  const currentUserBubbleStyle = `bg-[${bubbleColors?.primary}] text-primary-foreground shadow-sm rounded-tr-none`;
  const otherUserBubbleStyle = `bg-[${bubbleColors?.secondary}] dark:bg-[${bubbleColors?.accent}] shadow-sm rounded-tl-none`;

  return (
    <div className={cn(
      "flex mb-2",
      isCurrentUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[80%] flex",
        isCurrentUser ? "flex-row-reverse" : "flex-row"
      )}>
        {!isCurrentUser && (
          <div className="mr-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white overflow-hidden">
              {message.senderAvatar ? (
                <img 
                  src={message.senderAvatar} 
                  alt={message.senderName} 
                  className="w-full h-full object-cover"
                />
              ) : (
                message.senderName.charAt(0).toUpperCase()
              )}
            </div>
          </div>
        )}
        
        <div className={cn(
          "flex flex-col",
          isCurrentUser ? "items-end" : "items-start"
        )}>
          {!isCurrentUser && (
            <span className="text-xs text-muted-foreground mb-1">{message.senderName}</span>
          )}
          
          <div className={cn(
            "rounded-2xl py-2 px-3 group relative",
            isCurrentUser ? currentUserBubbleStyle : otherUserBubbleStyle,
            hasMonetization && (isCurrentUser 
              ? "border-l-4 border-amber-400" 
              : "border-r-4 border-amber-400"
            ),
            message.isEncrypted && "border border-green-400/20",
            "transition-all duration-300"
          )}>
            {/* Indicateurs de sécurité et premium */}
            <div className={cn(
              "absolute -top-2",
              isCurrentUser ? "-left-2" : "-right-2",
              "flex space-x-1"
            )}>
              {message.isEncrypted && (
                <div className="bg-green-500 rounded-full p-1 shadow-lg">
                  <Lock size={10} className="text-white" />
                </div>
              )}
              {hasMonetization && (
                <div className="bg-amber-400 rounded-full p-1 shadow-lg">
                  <Heart size={10} className="text-amber-900" />
                </div>
              )}
            </div>
            
            {/* Contenu du message */}
            <motion.div
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </div>
          
          <span className="text-[10px] text-muted-foreground mt-1">
            {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            {message.isEncrypted && <span className="ml-1">• {showDecrypted ? "Déchiffré" : "Chiffré"}</span>}
          </span>
          
          {hasMonetization && (
            <div className={cn(
              "flex items-center mt-1",
              isCurrentUser ? "justify-end" : "justify-start"
            )}>
              <span className="text-xs text-amber-500 flex items-center">
                <Zap size={10} className="mr-1" />
                {message.monetization?.tier} · {message.monetization?.price} USDT
              </span>
            </div>
          )}
          <button onClick={handleReaction}>React</button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(MessageBubble);
