
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Eye, Lock, Zap, Shield, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Message } from '@/types/messaging';
import { isEncrypted } from '@/utils/encryption';

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  isEphemeral: boolean;
  isRevealed: boolean;
  onReveal: () => void;
  sessionKey: string;
  decryptMessage: (message: Message) => Promise<string>;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isCurrentUser,
  isEphemeral,
  isRevealed,
  onReveal,
  sessionKey,
  decryptMessage
}) => {
  const [content, setContent] = useState<string>('');
  const [decryptionError, setDecryptionError] = useState(false);
  const [showEffects, setShowEffects] = useState(false);
  const [decrypting, setDecrypting] = useState(false);
  
  const isPremium = !!message.monetization;
  const isVoice = message.content.includes("🎤");
  const isGift = message.content.includes("🎁");
  
  // Déchiffrer le message si nécessaire
  useEffect(() => {
    const processMessage = async () => {
      try {
        if (message.isEncrypted) {
          setDecrypting(true);
          const decrypted = await decryptMessage(message);
          setContent(decrypted);
          setDecrypting(false);
        } else {
          setContent(message.content);
        }
      } catch (error) {
        console.error("Erreur lors du déchiffrement:", error);
        setDecryptionError(true);
        setDecrypting(false);
        setContent("🔒 Impossible de déchiffrer le message");
      }
    };
    
    processMessage();
  }, [message, decryptMessage]);
  
  // Effets visuels (étoiles, particules, etc.) pour les messages spéciaux
  useEffect(() => {
    if (isPremium || isGift) {
      setShowEffects(true);
      const timer = setTimeout(() => {
        setShowEffects(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isPremium, isGift]);
  
  // Variants pour l'animation des bulles
  const bubbleVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { type: 'spring', damping: 10 } },
    exit: { opacity: 0, scale: 0.8 }
  };
  
  // Variants pour les effets
  const effectsVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    },
    exit: { opacity: 0 }
  };
  
  const particleVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: { 
      opacity: [0, 1, 0], 
      scale: [0, 1, 0],
      transition: { 
        duration: 1.5,
        repeat: 1,
        repeatType: 'loop' as any
      }
    }
  };
  
  // Si le message est éphémère et n'est pas révélé, afficher un bouton pour le révéler
  if (isEphemeral && !isRevealed) {
    return (
      <div 
        className={cn(
          "px-4 py-3 rounded-2xl max-w-full flex items-center gap-2",
          isCurrentUser ? "bg-purple-600/50 text-white" : "bg-white/10 text-white",
          isPremium && "border border-amber-500/50",
          message.isEncrypted && "border-green-500/20"
        )}
      >
        <Shield size={16} className="text-purple-300" />
        <p className="text-sm">Message confidentiel</p>
      </div>
    );
  }
  
  // Si le message est en cours de déchiffrement
  if (decrypting) {
    return (
      <div className="px-4 py-3 rounded-2xl bg-white/5 text-white flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-green-500/70 animate-pulse" />
        <p className="text-sm text-white/70">Déchiffrement...</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={bubbleVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={cn(
        "relative",
        isCurrentUser ? "items-end" : "items-start"
      )}
    >
      {/* Effets visuels pour les messages premium/cadeaux */}
      <AnimatePresence>
        {showEffects && (
          <motion.div 
            className="absolute inset-0 pointer-events-none"
            variants={effectsVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {Array.from({ length: 15 }).map((_, i) => (
              <motion.div 
                key={i}
                variants={particleVariants}
                className="absolute"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 10 + 5}px`,
                  height: `${Math.random() * 10 + 5}px`,
                  backgroundColor: isPremium 
                    ? `rgba(245, 158, 11, ${Math.random() * 0.7})`
                    : `rgba(139, 92, 246, ${Math.random() * 0.7})`,
                  borderRadius: '50%'
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* La bulle de message proprement dite */}
      <div 
        className={cn(
          "px-4 py-3 max-w-full break-words",
          isCurrentUser 
            ? "bg-purple-600 text-white rounded-t-2xl rounded-bl-2xl rounded-br-sm" 
            : "bg-white/10 text-white rounded-t-2xl rounded-br-2xl rounded-bl-sm",
          isPremium && "border border-amber-500/50",
          isGift && "bg-gradient-to-br from-amber-600/80 to-amber-800/80",
          decryptionError && "bg-red-900/50 border border-red-500/50",
          message.isEncrypted && !decryptionError && "border border-green-500/50"
        )}
      >
        {/* Contenu du message avec icône adéquat si nécessaire */}
        <div className="flex items-start gap-2">
          {isVoice && (
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10">
              <div className="flex items-center space-x-1">
                {[1, 2, 3].map((i) => (
                  <div 
                    key={i} 
                    className="w-0.5 h-2 bg-current animate-pulse" 
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
            </div>
          )}
          
          {isGift && (
            <div className="mr-2 text-amber-200">
              <Star size={16} className="animate-pulse" />
            </div>
          )}
          
          <p className={cn(
            "text-sm",
            isEphemeral && "animate-pulse"
          )}>
            {content}
          </p>
        </div>
        
        {/* Horodatage du message */}
        <div className={cn(
          "mt-1 flex justify-end items-center text-xs",
          isCurrentUser ? "text-white/60" : "text-white/60"
        )}>
          {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;
