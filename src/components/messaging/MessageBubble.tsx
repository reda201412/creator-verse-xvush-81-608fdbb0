
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, Heart, Star, Trophy, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Message } from '@/types/messaging';
import { formatRelativeTime } from '@/lib/utils';

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  isEphemeral?: boolean;
  isRevealed?: boolean;
  onReveal?: () => void;
  sessionKey?: string;
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
  const [content, setContent] = useState<string>(message.content);
  const [isDecrypting, setIsDecrypting] = useState<boolean>(false);
  
  // Vérifier si ce message est soutenu
  const hasSupport = !!message.monetization;
  // Détermine si le message est un cadeau
  const isGift = content.startsWith('🎁');
  
  // Décrypter le message si nécessaire
  useEffect(() => {
    const handleDecrypt = async () => {
      if (message.isEncrypted && decryptMessage && !isEphemeral) {
        setIsDecrypting(true);
        try {
          const decryptedContent = await decryptMessage(message);
          setContent(decryptedContent);
        } catch (error) {
          console.error("Erreur de déchiffrement", error);
          setContent("Message chiffré (impossible à déchiffrer)");
        } finally {
          setIsDecrypting(false);
        }
      }
    };
    
    handleDecrypt();
  }, [message, decryptMessage, isEphemeral]);
  
  // Obtenir l'icône du niveau de soutien
  const getSupportIcon = () => {
    if (!hasSupport) return null;
    
    const tier = message.monetization?.tier;
    switch (tier) {
      case 'basic':
        return <ThumbsUp size={12} className="text-blue-600" />;
      case 'premium':
        return <Heart size={12} className="text-pink-600" />;
      case 'vip':
        return <Star size={12} className="text-amber-600" />;
      case 'exclusive':
        return <Trophy size={12} className="text-purple-600" />;
      default:
        return <Heart size={12} className="text-pink-600" />;
    }
  };
  
  // Obtenir les couleurs basées sur le niveau de soutien
  const getSupportColors = () => {
    if (!hasSupport) return {};
    
    const tier = message.monetization?.tier;
    switch (tier) {
      case 'basic':
        return {
          bgColor: 'bg-blue-100',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-800'
        };
      case 'premium':
        return {
          bgColor: 'bg-pink-100',
          borderColor: 'border-pink-200',
          textColor: 'text-pink-800'
        };
      case 'vip':
        return {
          bgColor: 'bg-amber-100',
          borderColor: 'border-amber-200',
          textColor: 'text-amber-800'
        };
      case 'exclusive':
        return {
          bgColor: 'bg-purple-100',
          borderColor: 'border-purple-200',
          textColor: 'text-purple-800'
        };
      default:
        return {
          bgColor: 'bg-pink-100',
          borderColor: 'border-pink-200',
          textColor: 'text-pink-800'
        };
    }
  };
  
  const supportColors = getSupportColors();

  return (
    <div>
      <div 
        className={cn(
          "px-4 py-2 rounded-2xl max-w-[320px] relative",
          isCurrentUser 
            ? hasSupport 
              ? `${supportColors.bgColor} ${supportColors.borderColor} border rounded-br-none`
              : "bg-purple-100 rounded-br-none" 
            : hasSupport
              ? `${supportColors.bgColor} ${supportColors.borderColor} border rounded-bl-none`
              : "bg-gray-100 rounded-bl-none",
          isEphemeral && !isRevealed && "bg-opacity-50 backdrop-blur-sm"
        )}
      >
        {/* Indicateur de message chiffré */}
        {message.isEncrypted && (
          <div className="absolute top-1 right-1">
            <Lock size={12} className="text-green-600" />
          </div>
        )}
        
        {/* Contenu du message */}
        <div className={cn(
          "text-sm break-words",
          isCurrentUser ? "text-gray-800" : "text-gray-800",
          isEphemeral && !isRevealed && "filter blur-sm select-none",
          hasSupport && supportColors.textColor
        )}>
          {isDecrypting ? (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse animation-delay-200"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse animation-delay-400"></div>
              <span className="ml-1 text-xs text-gray-500">Déchiffrement...</span>
            </div>
          ) : isEphemeral && !isRevealed ? (
            <div className="text-center py-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={onReveal}
                className="text-gray-600 hover:text-gray-800"
              >
                <Eye size={14} className="mr-1" />
                Appuyer pour voir
              </Button>
            </div>
          ) : (
            <div className="whitespace-pre-wrap">
              {/* Afficher le contenu du cadeau de manière spéciale */}
              {isGift ? (
                <div className="flex flex-col items-center">
                  <span className="text-2xl mb-1">🎁</span>
                  <span className="font-medium">{content.replace('🎁 ', '')}</span>
                  <span className="text-xs mt-1">Cadeau offert</span>
                </div>
              ) : (
                content
              )}
            </div>
          )}
        </div>

        {/* Indicateur de soutien */}
        {hasSupport && !isEphemeral && (
          <div className={cn(
            "absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center",
            message.monetization?.tier === 'basic' ? "bg-blue-500" :
            message.monetization?.tier === 'premium' ? "bg-pink-500" :
            message.monetization?.tier === 'vip' ? "bg-amber-500" :
            "bg-purple-500",
          )}>
            {getSupportIcon()}
          </div>
        )}
      </div>
      
      {/* Timestamp du message */}
      <div className={cn(
        "text-[10px] mt-1",
        isCurrentUser ? "text-right mr-1" : "ml-1", 
        "text-gray-500"
      )}>
        {formatRelativeTime ? formatRelativeTime(new Date(message.timestamp)) : 
          new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
      </div>
    </div>
  );
};

export default MessageBubble;
