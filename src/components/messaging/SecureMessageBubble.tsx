
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Unlock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { decryptMessage } from '@/utils/encryption';
import { Spinner } from '@/components/ui/spinner';

interface EncryptedContent {
  iv: string;
  encryptedData: string;
}

interface SecureMessageBubbleProps {
  content: string | EncryptedContent;
  isCurrentUser: boolean;
  sender: string;
  timestamp: string;
  sessionKey: string;
  isPremium?: boolean;
  onDecrypt?: (decryptedContent: string) => void;
  className?: string;
}

const SecureMessageBubble: React.FC<SecureMessageBubbleProps> = ({
  content,
  isCurrentUser,
  sender,
  timestamp,
  sessionKey,
  isPremium = false,
  onDecrypt,
  className
}) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [decryptedContent, setDecryptedContent] = useState<string | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const { toast } = useToast();
  
  // Déterminer si le contenu est chiffré
  const encrypted = typeof content === 'object' && 'iv' in content && 'encryptedData' in content;
  
  const handleDecrypt = useCallback(async () => {
    if (!encrypted || !sessionKey) return;
    
    try {
      setIsDecrypting(true);
      // Déchiffrement du message
      const message = await decryptMessage(content as EncryptedContent, sessionKey);
      setDecryptedContent(message);
      setIsRevealed(true);
      if (onDecrypt) onDecrypt(message);
      
      toast({
        title: "Message déchiffré",
        description: "Le message a été déchiffré avec succès",
        variant: "default",
      });
    } catch (error) {
      console.error('Erreur de déchiffrement:', error);
      toast({
        title: "Erreur de déchiffrement",
        description: "Impossible de déchiffrer ce message. La clé pourrait être invalide.",
        variant: "destructive",
      });
    } finally {
      setIsDecrypting(false);
    }
  }, [content, sessionKey, onDecrypt, toast]);
  
  const toggleReveal = useCallback(() => {
    if (!decryptedContent && encrypted) {
      handleDecrypt();
    } else {
      setIsRevealed(!isRevealed);
    }
  }, [decryptedContent, encrypted, handleDecrypt, isRevealed]);
  
  return (
    <div className={cn(
      "flex",
      isCurrentUser ? "justify-end" : "justify-start",
      className
    )}>
      <div className={cn(
        "max-w-[80%] flex",
        isCurrentUser ? "flex-row-reverse" : "flex-row"
      )}>
        {!isCurrentUser && (
          <div className="mr-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              {sender.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
        
        <div className={cn(
          "flex flex-col",
          isCurrentUser ? "items-end" : "items-start"
        )}>
          {!isCurrentUser && (
            <span className="text-xs text-muted-foreground mb-1">{sender}</span>
          )}
          
          <div className={cn(
            "rounded-2xl py-2 px-3 group relative message-bubble",
            isCurrentUser 
              ? "bg-primary text-primary-foreground rounded-tr-none" 
              : "bg-muted/60 backdrop-blur-sm rounded-tl-none",
            isPremium && "border-amber-400/30",
            encrypted && "border border-green-400/20",
            "transition-all duration-300"
          )}>
            {/* Indicateurs de sécurité et premium */}
            <div className="absolute -top-2 -right-2 flex space-x-1">
              {encrypted && (
                <div className="bg-green-500 rounded-full p-1 shadow-lg">
                  <Lock size={10} className="text-white" />
                </div>
              )}
              {isPremium && (
                <div className="bg-amber-400 rounded-full p-1 shadow-lg">
                  <Shield size={10} className="text-black" />
                </div>
              )}
            </div>
            
            {/* Contenu du message */}
            <AnimatePresence mode="wait">
              <motion.div
                key={isRevealed ? 'revealed' : 'hidden'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {encrypted ? (
                  isRevealed && decryptedContent ? (
                    <div className="relative">
                      <p className="text-sm whitespace-pre-wrap pr-6">{decryptedContent}</p>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-0 right-0 h-6 w-6 opacity-50 hover:opacity-100"
                        onClick={toggleReveal}
                      >
                        <EyeOff size={14} />
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-1 text-green-500">
                        <Lock size={14} />
                        <span className="text-xs font-medium">Message chiffré</span>
                      </div>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={handleDecrypt}
                        disabled={isDecrypting}
                        className="w-full"
                      >
                        {isDecrypting ? (
                          <Spinner size="sm" className="mr-2" />
                        ) : (
                          <Eye size={14} className="mr-2" />
                        )}
                        Déchiffrer
                      </Button>
                    </div>
                  )
                ) : (
                  <p className="text-sm whitespace-pre-wrap">{content as string}</p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          
          <span className="text-[10px] text-muted-foreground mt-1">
            {new Date(timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            {encrypted && <span className="ml-1">• {isRevealed ? "Déchiffré" : "Chiffré"}</span>}
          </span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(SecureMessageBubble);
