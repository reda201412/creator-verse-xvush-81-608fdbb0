
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import useHapticFeedback from '@/hooks/use-haptic-feedback';
import { 
  Send, Image, Gift, Mic, Zap, Lock, Eye, Video, CircleDollarSign, 
  Camera, Smile, Paperclip
} from 'lucide-react';
import { MessageThread, Message } from '@/types/messaging';
import MessageBubble from './MessageBubble';
import EphemeralIndicator from './EphemeralIndicator';
import { decryptMessage, isEncrypted } from '@/utils/encryption';

interface ConversationViewProps {
  thread: MessageThread;
  userId: string;
  userName: string;
  onSendMessage: (content: string, monetizationData?: any) => void;
  sessionKey: string;
  isSecurityEnabled: boolean;
  onOpenMonetization: () => void;
  onOpenGifts: () => void;
}

const ConversationView: React.FC<ConversationViewProps> = ({
  thread,
  userId,
  userName,
  onSendMessage,
  sessionKey,
  isSecurityEnabled,
  onOpenMonetization,
  onOpenGifts
}) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showEphemeralMessages, setShowEphemeralMessages] = useState<Record<string, boolean>>({});
  const [isComposing, setIsComposing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const recordingInterval = useRef<number | null>(null);
  const { toast } = useToast();
  const { triggerHaptic } = useHapticFeedback();
  
  // Fonction pour mettre à jour les messages décryptés
  const [decryptedContents, setDecryptedContents] = useState<Record<string, string>>({});
  
  // Auto-scroll au dernier message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread.messages]);
  
  // Formater le temps d'enregistrement
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Gérer le début d'enregistrement audio
  const startRecording = () => {
    triggerHaptic('medium');
    setIsRecording(true);
    let seconds = 0;
    recordingInterval.current = window.setInterval(() => {
      seconds += 1;
      setRecordingTime(seconds);
    }, 1000);
    
    toast({
      title: "Enregistrement démarré",
      description: "Appuyez sur Stop pour terminer",
    });
  };
  
  // Gérer la fin d'enregistrement audio
  const stopRecording = () => {
    if (recordingInterval.current) {
      clearInterval(recordingInterval.current);
    }
    
    triggerHaptic('medium');
    setIsRecording(false);
    const duration = formatTime(recordingTime);
    setRecordingTime(0);
    
    onSendMessage(`🎤 Message vocal (${duration})`);
    toast({
      title: "Message vocal envoyé",
      description: `Durée: ${duration}`,
    });
  };
  
  // Gérer l'envoi d'un message texte
  const handleSendMessage = () => {
    if (message.trim()) {
      triggerHaptic('light');
      onSendMessage(message);
      setMessage('');
      textAreaRef.current?.focus();
    }
  };
  
  // Gérer l'appui sur Entrée pour envoyer
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Obtenir l'autre participant dans la conversation
  const getOtherParticipant = () => {
    const otherParticipant = thread.participants.find(p => p !== userId);
    return {
      id: otherParticipant,
      name: thread.name || `User_${otherParticipant}`,
      avatar: `https://i.pravatar.cc/150?u=${otherParticipant}`,
    };
  };
  
  const other = getOtherParticipant();
  
  // Détection de capture d'écran (simulée pour cet exemple)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Simuler une détection de capture d'écran
        const random = Math.random();
        if (random < 0.2) { // 20% de chance pour la démo
          setTimeout(() => {
            toast({
              title: "⚠️ Capture d'écran détectée",
              description: `${other.name} a été notifié`,
              variant: "destructive",
            });
            triggerHaptic('strong');
          }, 500);
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [other.name, toast, triggerHaptic]);
  
  // Gérer la révélation d'un message éphémère
  const revealEphemeralMessage = (messageId: string) => {
    triggerHaptic('light');
    setShowEphemeralMessages(prev => ({
      ...prev,
      [messageId]: true
    }));
    
    // Le message disparaît après 5 secondes
    setTimeout(() => {
      setShowEphemeralMessages(prev => ({
        ...prev,
        [messageId]: false
      }));
    }, 5000);
  };
  
  const handleDecrypt = async (message: Message) => {
    if (!isEncrypted(message.content)) {
      return message.content;
    }
    
    try {
      if (!decryptedContents[message.id]) {
        // Si c'est un objet JSON stringifié, on le parse
        const content = typeof message.content === 'string' 
          ? JSON.parse(message.content)
          : message.content;
        
        const decrypted = await decryptMessage(content, sessionKey);
        setDecryptedContents(prev => ({
          ...prev,
          [message.id]: decrypted
        }));
        return decrypted;
      }
      return decryptedContents[message.id];
    } catch (error) {
      console.error("Erreur de déchiffrement:", error);
      return "🔒 Message chiffré (clé invalide)";
    }
  };
  
  // Déterminer si un message est éphémère (simulé)
  const isEphemeralMessage = (message: Message) => {
    // Pour la démo, nous considérons que tout message contenant "🔒" est éphémère
    return message.content.includes("🔒") || 
           (message.monetization && message.monetization.tier === 'exclusive');
  };

  return (
    <div className="flex flex-col h-full">
      {/* En-tête du chat */}
      <div className="p-4 backdrop-blur-md bg-black/30 border-b border-white/10">
        <div className="flex items-center">
          <div className="relative mr-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20">
              <img 
                src={other.avatar}
                alt={other.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-black"></span>
          </div>
          
          <div className="flex-1">
            <h3 className="font-medium">{other.name}</h3>
            <p className="text-xs text-white/60">En ligne maintenant</p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="rounded-full text-white hover:bg-white/10"
              onClick={() => {
                toast({
                  title: "Appel vidéo",
                  description: "Cette fonctionnalité sera disponible prochainement",
                });
              }}
            >
              <Video size={18} />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon"
              className="rounded-full text-white hover:bg-white/10"
              onClick={() => {
                toast({
                  title: "Appel audio",
                  description: "Cette fonctionnalité sera disponible prochainement",
                });
              }}
            >
              <Mic size={18} />
            </Button>
          </div>
        </div>
      </div>

      {/* Corps du chat */}
      <ScrollArea className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4 mb-4">
          {thread.messages.map((msg, index) => {
            const isCurrentUser = msg.senderId === userId;
            const showEphemeral = showEphemeralMessages[msg.id];
            const hasMonetization = !!msg.monetization;
            const isEphemeral = isEphemeralMessage(msg);
            
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "flex",
                  isCurrentUser ? "justify-end" : "justify-start"
                )}
              >
                <div className={cn(
                  "max-w-[80%]",
                  isCurrentUser ? "items-end" : "items-start"
                )}>
                  <MessageBubble 
                    message={msg}
                    isCurrentUser={isCurrentUser}
                    isEphemeral={isEphemeral}
                    isRevealed={showEphemeral}
                    onReveal={() => revealEphemeralMessage(msg.id)}
                    sessionKey={sessionKey}
                    decryptMessage={handleDecrypt}
                  />
                  
                  {/* Indicateur visuel pour les messages éphémères ou monétisés */}
                  {isEphemeral && !showEphemeral && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => revealEphemeralMessage(msg.id)}
                      className="text-xs mt-1 text-white/60 hover:text-white"
                    >
                      <Eye size={12} className="mr-1" />
                      Appuyer pour voir
                    </Button>
                  )}
                  
                  {/* Indicateur pour les messages chiffrés */}
                  {msg.isEncrypted && (
                    <div className="flex items-center justify-end mt-0.5">
                      <Lock size={10} className="text-green-400 mr-1" />
                      <span className="text-[10px] text-green-400">Chiffré</span>
                    </div>
                  )}
                  
                  {/* Indicateur pour les messages monétisés */}
                  {hasMonetization && (
                    <div className="flex items-center justify-end mt-0.5">
                      <Zap size={10} className="text-amber-400 mr-1" />
                      <span className="text-[10px] text-amber-400">
                        {msg.monetization?.tier} · {msg.monetization?.price}€
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Zone d'enregistrement vocal */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-white/10 bg-red-900/20 p-4 flex items-center justify-between"
          >
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse mr-3" />
              <span className="font-medium">Enregistrement {formatTime(recordingTime)}</span>
            </div>
            
            <Button 
              variant="destructive" 
              onClick={stopRecording}
              className="rounded-full"
            >
              Stop
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Barre d'outils - cadeaux et monétisation */}
      <div className="p-2 bg-black/30 border-t border-white/10 flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
          onClick={onOpenGifts}
        >
          <Gift size={18} className="mr-2" /> Cadeaux
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="text-green-400 hover:bg-green-500/10 hover:text-green-300"
          onClick={onOpenMonetization}
        >
          <CircleDollarSign size={18} className="mr-2" /> Monétiser
        </Button>
      </div>
      
      {/* Zone de saisie */}
      <div className="p-4 backdrop-blur-md bg-black/30 border-t border-white/10">
        <div className="flex items-end gap-2">
          <div className="relative flex-1">
            <Textarea
              ref={textAreaRef}
              placeholder="Écrivez un message..."
              className={cn(
                "resize-none min-h-[60px] pr-10 bg-white/5 border border-white/20 placeholder:text-white/40 text-white",
                isSecurityEnabled && "border-green-500/30"
              )}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setIsComposing(e.target.value.length > 0);
              }}
              onKeyDown={handleKeyDown}
            />
            
            <div className="absolute bottom-2 right-2 flex gap-1">
              <Button 
                type="button"
                size="icon"
                variant="ghost"
                className="h-8 w-8 rounded-full text-white/60 hover:text-white hover:bg-white/10"
                onClick={() => {
                  toast({
                    title: "Appareil photo",
                    description: "Cette fonctionnalité sera disponible prochainement",
                  });
                }}
              >
                <Camera size={16} />
              </Button>
            </div>
          </div>
          
          {message ? (
            <Button 
              className="rounded-full h-10 w-10 bg-purple-600 hover:bg-purple-500"
              onClick={handleSendMessage}
            >
              <Send size={18} />
            </Button>
          ) : (
            <Button 
              className="rounded-full h-10 w-10 bg-purple-600 hover:bg-purple-500"
              onClick={startRecording}
              disabled={isRecording}
            >
              <Mic size={18} />
            </Button>
          )}
        </div>
        
        {/* Options additionnelles */}
        <div className="flex mt-2 items-center justify-between">
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" className="p-1 h-8 w-8 rounded-full text-white/60 hover:bg-white/10">
              <Smile size={16} />
            </Button>
            <Button variant="ghost" size="sm" className="p-1 h-8 w-8 rounded-full text-white/60 hover:bg-white/10">
              <Paperclip size={16} />
            </Button>
            <Button variant="ghost" size="sm" className="p-1 h-8 w-8 rounded-full text-white/60 hover:bg-white/10">
              <Image size={16} />
            </Button>
          </div>
          
          {/* Indicateur de chiffrement */}
          {isSecurityEnabled && (
            <div className="flex items-center text-xs text-green-400">
              <Lock size={12} className="mr-1" />
              <span>Chiffré</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationView;
