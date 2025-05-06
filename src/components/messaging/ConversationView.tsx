
import React, { useState, useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import useHapticFeedback from '@/hooks/use-haptic-feedback';
import { 
  Lock, Image, Video, Phone
} from 'lucide-react';
import { MessageThread, Message, MonetizationTier } from '@/types/messaging';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import { decryptMessage } from '@/utils/encryption';

interface ConversationViewProps {
  thread: MessageThread;
  userId: string;
  userName: string;
  onSendMessage: (content: string, supportData?: any) => void;
  sessionKey: string;
  isSecurityEnabled: boolean;
  onOpenSupport: () => void;
  onOpenGifts: () => void;
  userType: 'creator' | 'fan';
}

const ConversationView: React.FC<ConversationViewProps> = ({
  thread,
  userId,
  userName,
  onSendMessage,
  sessionKey,
  isSecurityEnabled,
  onOpenSupport,
  onOpenGifts,
  userType
}) => {
  const [isComposing, setIsComposing] = useState(false);
  const [showMonetizationPanel, setShowMonetizationPanel] = useState(false);
  const [monetizationEnabled, setMonetizationEnabled] = useState(false);
  const [monetizationTier, setMonetizationTier] = useState<MonetizationTier>('basic');
  const [monetizationAmount, setMonetizationAmount] = useState(1.99);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { triggerHaptic } = useHapticFeedback();
  
  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread.messages]);
  
  // Handle message decryption
  const handleDecryptMessage = async (message: Message) => {
    if (typeof message.content !== 'string' && !message.content) {
      return "Contenu indisponible";
    }
    
    try {
      let content;
      
      // Handle both string JSON and object format
      if (typeof message.content === 'string' && message.content.startsWith('{')) {
        content = JSON.parse(message.content);
      } else if (typeof message.content === 'object') {
        content = message.content;
      } else {
        return message.content as string;
      }
      
      return await decryptMessage(content, sessionKey);
    } catch (error) {
      console.error('Error decrypting message:', error);
      return "Impossible de déchiffrer le message";
    }
  };
  
  // Get the other participant in the conversation
  const getOtherParticipant = () => {
    const otherParticipantId = thread.participants.find(p => p !== userId);
    return {
      id: otherParticipantId,
      name: thread.name || `User_${otherParticipantId?.substring(0, 8)}`,
      avatar: `https://i.pravatar.cc/150?u=${otherParticipantId}`,
    };
  };
  
  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;
    
    triggerHaptic('light');
    
    // Prepare monetization data if enabled
    const supportData = monetizationEnabled ? {
      tier: monetizationTier,
      price: monetizationAmount,
      currency: 'USDT',
      instantPayoutEnabled: true,
      accessControl: { 
        isGated: monetizationTier !== 'free',
        requiredTier: monetizationTier
      },
      analytics: { 
        views: 0, 
        revenue: 0, 
        conversionRate: 0, 
        engagementTime: 0 
      }
    } : undefined;
    
    onSendMessage(content, supportData);
    
    // Reset monetization for next message
    if (monetizationEnabled) {
      setMonetizationEnabled(false);
    }
  };
  
  const toggleMonetization = () => {
    setMonetizationEnabled(!monetizationEnabled);
    
    if (!monetizationEnabled) {
      toast({
        title: "Monétisation activée",
        description: `Ce message sera monétisé à ${monetizationAmount} USDT (${monetizationTier}).`,
      });
      triggerHaptic('medium');
    }
  };
  
  const other = getOtherParticipant();

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="px-4 py-3 backdrop-blur-md bg-white/90 dark:bg-gray-900/90 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center">
          <div className="relative mr-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700">
              <img 
                src={other.avatar}
                alt={other.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></span>
          </div>
          
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">{other.name}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">En ligne maintenant</p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
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
              className="rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => {
                toast({
                  title: "Appel audio",
                  description: "Cette fonctionnalité sera disponible prochainement",
                });
              }}
            >
              <Phone size={18} />
            </Button>
          </div>
        </div>
      </div>

      {/* Message list */}
      <ScrollArea className="flex-1 px-4 py-3">
        <div className="space-y-1">
          {thread.messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isCurrentUser={message.senderId === userId}
              sessionKey={sessionKey}
              decryptMessage={handleDecryptMessage}
            />
          ))}
        </div>
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* Security indicator */}
      {isSecurityEnabled && (
        <div className="px-4 py-1 flex items-center justify-center">
          <div className="flex items-center px-2 py-1 bg-green-50 dark:bg-green-900/20 rounded text-xs text-green-700 dark:text-green-400">
            <Lock size={12} className="mr-1" />
            Messages chiffrés de bout en bout
          </div>
        </div>
      )}

      {/* Message input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <MessageInput
          onSendMessage={handleSendMessage}
          isComposing={isComposing}
          setIsComposing={setIsComposing}
          monetizationEnabled={monetizationEnabled}
          onToggleMonetization={userType === 'fan' ? toggleMonetization : undefined}
          monetizationTier={monetizationTier}
          setMonetizationTier={setMonetizationTier}
          monetizationAmount={monetizationAmount}
          setMonetizationAmount={setMonetizationAmount}
          isEncrypted={isSecurityEnabled}
        />
      </div>

      {/* Additional options for fans */}
      {userType === 'fan' && (
        <div className="px-4 pb-3 flex gap-2 justify-center">
          <Button
            variant="outline"
            size="sm"
            className="text-amber-600 dark:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20"
            onClick={onOpenGifts}
          >
            Offrir un cadeau
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="text-pink-600 dark:text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900/20"
            onClick={onOpenSupport}
          >
            Soutenir
          </Button>
        </div>
      )}
    </div>
  );
};

export default ConversationView;
