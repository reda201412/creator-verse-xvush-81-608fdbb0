
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import useHapticFeedback from '@/hooks/use-haptic-feedback';
import { 
  ArrowLeft, X, Shield, Users, Lock, Star, Zap, 
  MessageSquare, Camera, Gift, Key, ChevronDown,
  Eye, EyeOff, Heart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import ConversationList from './ConversationList';
import ConversationView from './ConversationView';
import { SupportPanel } from './SupportPanel';
import { GiftPanel } from './GiftPanel';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Message, 
  MessageThread as ThreadType, 
  MonetizationTier, 
  MessageType, 
  JsonData,
  MessageEmotionalData,
  MessageStatus
} from '@/types/messaging';
import { generateSessionKey } from '@/utils/encryption';
import XDoseLogo from '@/components/XDoseLogo';
import { toast as sonnerToast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Spinner } from '@/components/ui/spinner';
import { useTronWallet } from '@/hooks/use-tron-wallet';
import { fetchUserThreads, sendMessage, markMessagesAsRead } from '@/utils/messaging-utils';
import { useModals } from '@/hooks/use-modals';

interface SecureMessagingProps {
  userId: string;
  userName: string;
  userAvatar: string;
}

const SecureMessaging = ({ userId, userName, userAvatar }: SecureMessagingProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { triggerHaptic } = useHapticFeedback();
  const { profile } = useAuth();
  const { getWalletInfo, walletInfo } = useTronWallet();
  const { openModal, closeModal, openModals } = useModals();
  
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [threads, setThreads] = useState<ThreadType[]>([]);
  const [showConversationList, setShowConversationList] = useState(true);
  const [isSecurityEnabled, setIsSecurityEnabled] = useState(true);
  const [sessionKeys, setSessionKeys] = useState<Record<string, string>>({});
  const [filterMode, setFilterMode] = useState<'all' | 'unread' | 'supported'>('all');
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Use the actual user role from authentication context
  const userType = profile?.role || 'fan';

  // Load real conversation threads when component mounts
  useEffect(() => {
    loadConversations();
    getWalletInfo(); // Load wallet information for transactions
  }, [userId]);

  // Load real conversations from Supabase
  const loadConversations = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const threadsData = await fetchUserThreads(userId);
      
      if (threadsData.length > 0) {
        // Transform the data to match our ThreadType format
        const formattedThreads: ThreadType[] = threadsData.map(thread => ({
          id: String(thread.id),
          participants: thread.participants || [],
          messages: (thread.messages || []).map(msg => ({
            id: String(msg.id),
            senderId: msg.sender_id,
            senderName: msg.sender_name,
            senderAvatar: msg.sender_avatar || '',
            recipientId: msg.recipient_id,
            content: msg.content,
            type: (msg.type || 'text') as MessageType,
            timestamp: msg.created_at,
            status: (msg.status || 'sent') as MessageStatus,
            isEncrypted: msg.is_encrypted,
            emotional: msg.emotional_data as JsonData | MessageEmotionalData,
            monetization: msg.monetization_data as JsonData,
            mediaUrl: msg.media_url
          })),
          name: thread.name,
          isGated: thread.is_gated,
          requiredTier: thread.required_tier as MonetizationTier | undefined,
          lastActivity: thread.last_activity,
          emotionalMap: thread.emotional_map as JsonData
        }));
        
        setThreads(formattedThreads);
        
        // If there are threads but no active thread, select the first one
        if (formattedThreads.length > 0 && !activeThreadId) {
          setActiveThreadId(formattedThreads[0].id);
        }
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
      sonnerToast.error('Erreur lors du chargement des conversations');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate session keys for each conversation
  useEffect(() => {
    threads.forEach(thread => {
      if (!sessionKeys[thread.id]) {
        setSessionKeys(prev => ({
          ...prev,
          [thread.id]: generateSessionKey()
        }));
      }
    });
  }, [threads]);

  // Setup real-time message notifications
  useEffect(() => {
    if (!userId) return;
    
    const channel = supabase
      .channel('message-notifications')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'message_thread_messages',
        filter: `recipient_id=cs.{${userId}}`
      }, handleRealTimeMessage)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, activeThreadId]);

  // Handle real-time message notifications
  const handleRealTimeMessage = (payload: any) => {
    const newMessage = payload.new;
    
    // Find the thread this message belongs to
    const threadId = newMessage.thread_id;
    
    // Format the message to match our Message type
    const formattedMessage: Message = {
      id: String(newMessage.id),
      senderId: newMessage.sender_id,
      senderName: newMessage.sender_name,
      senderAvatar: newMessage.sender_avatar || '',
      recipientId: newMessage.recipient_id,
      content: newMessage.content,
      type: (newMessage.type || 'text') as MessageType,
      timestamp: newMessage.created_at,
      status: 'sent' as MessageStatus,
      isEncrypted: newMessage.is_encrypted,
      emotional: newMessage.emotional_data as JsonData | MessageEmotionalData,
      monetization: newMessage.monetization_data as JsonData,
      mediaUrl: newMessage.media_url
    };

    // Update the threads with this new message
    setThreads(prev => {
      const existingThread = prev.find(t => t.id === threadId);
      
      if (existingThread) {
        return prev.map(thread => 
          thread.id === threadId 
            ? { 
                ...thread, 
                messages: [...thread.messages, formattedMessage],
                lastActivity: formattedMessage.timestamp 
              }
            : thread
        );
      } else {
        // If the thread doesn't exist in our state, we need to reload conversations
        loadConversations();
        return prev;
      }
    });
    
    // Show notification if the user is not currently viewing this thread
    if (!activeThreadId || activeThreadId !== threadId) {
      setHasNewMessages(true);
      triggerHaptic('medium');
      
      sonnerToast("Nouveau message", {
        description: `${formattedMessage.senderName} vous a envoyé un message`,
        action: {
          label: 'Voir',
          onClick: () => {
            setActiveThreadId(threadId);
            setShowConversationList(false);
            setHasNewMessages(false);
          }
        }
      });
    }
  };

  const activeThread = threads.find(t => t.id === activeThreadId);

  // Handle thread selection
  const handleThreadSelect = (threadId: string) => {
    triggerHaptic('light');
    setActiveThreadId(threadId);
    setShowConversationList(false);
    setHasNewMessages(false);
    
    // Mark messages as read in this thread
    if (threadId) {
      markMessagesAsRead(threadId, userId);
    }
  };

  const handleBack = () => {
    if (!showConversationList && activeThreadId) {
      triggerHaptic('light');
      setShowConversationList(true);
    } else {
      navigate(-1);
    }
  };

  // Send message with real data saving
  const handleSendMessage = async (content: string, supportData?: any) => {
    if (!activeThreadId || !content.trim()) return;
    
    try {
      const recipientIds = activeThread?.participants.filter(p => p !== userId) || [];
      
      // Send message using utility function
      const message = await sendMessage({
        threadId: activeThreadId,
        senderId: userId,
        senderName: userName,
        senderAvatar: userAvatar,
        recipientIds,
        content,
        isEncrypted: isSecurityEnabled,
        monetizationData: supportData
      });
      
      // Format message for local state update
      const newMessage: Message = {
        id: String(message.id),
        senderId: userId,
        senderName: userName,
        senderAvatar: userAvatar,
        recipientId: recipientIds,
        content,
        type: 'text',
        timestamp: message.created_at,
        status: 'sent',
        isEncrypted: isSecurityEnabled,
        emotional: message.emotional_data as JsonData | MessageEmotionalData,
        monetization: supportData,
      };
      
      // Update local state
      setThreads(prev => 
        prev.map(thread => 
          thread.id === activeThreadId 
            ? { 
                ...thread, 
                messages: [...thread.messages, newMessage],
                lastActivity: newMessage.timestamp 
              }
            : thread
        )
      );
      
      if (supportData) {
        triggerHaptic('strong');
        toast({
          title: "Message de soutien envoyé",
          description: `${supportData.tier} - ${supportData.price} USDT`,
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Erreur d'envoi",
        description: "Impossible d'envoyer le message",
        variant: "destructive",
      });
    }
  };

  const toggleSecurityMode = () => {
    setIsSecurityEnabled(!isSecurityEnabled);
    triggerHaptic('medium');
    toast({
      title: isSecurityEnabled ? "Chiffrement désactivé" : "Chiffrement activé",
      description: isSecurityEnabled 
        ? "Vos messages ne seront plus chiffrés" 
        : "Vos messages sont maintenant sécurisés",
      variant: isSecurityEnabled ? "destructive" : "default",
    });
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-50">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-lg">Chargement de vos conversations...</p>
        </div>
      </div>
    );
  }

  const filteredThreads = threads.filter(thread => {
    if (filterMode === 'all') return true;
    if (filterMode === 'unread') {
      return thread.messages.some(m => m.status !== 'read' && m.senderId !== userId);
    }
    if (filterMode === 'supported') {
      return thread.messages.some(m => m.monetization);
    }
    return true;
  });

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 flex flex-col h-full w-full z-50">
      {/* Header */}
      <header className="flex items-center justify-between p-4 backdrop-blur-md bg-white/50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
            onClick={handleBack}
          >
            <ArrowLeft size={24} />
          </Button>
          
          <XDoseLogo size="md" />
          {hasNewMessages && (
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            className={cn(
              "rounded-full",
              isSecurityEnabled ? "text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400" : "text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400"
            )}
            onClick={toggleSecurityMode}
          >
            {isSecurityEnabled ? <Lock size={20} /> : <Key size={20} />}
          </Button>

          <Button 
            variant="ghost" 
            size="icon"
            className="rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => navigate('/')}
          >
            <X size={22} />
          </Button>
        </div>
      </header>

      {/* Tabs pour le filtrage (uniquement visible sur la vue liste) */}
      <AnimatePresence>
        {showConversationList && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }}
            className="px-4 pt-3 pb-1"
          >
            <Tabs
              defaultValue="all"
              value={filterMode}
              onValueChange={(value) => setFilterMode(value as any)}
              className="w-full"
            >
              <TabsList className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <TabsTrigger value="all" className="data-[state=active]:bg-white/80 dark:data-[state=active]:bg-gray-900/80">
                  Tous
                </TabsTrigger>
                <TabsTrigger value="unread" className="data-[state=active]:bg-white/80 dark:data-[state=active]:bg-gray-900/80">
                  Non lus
                </TabsTrigger>
                <TabsTrigger value="supported" className="data-[state=active]:bg-white/80 dark:data-[state=active]:bg-gray-900/80">
                  <Zap size={14} className="text-amber-500 mr-1" />
                  Soutenus
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contenu principal */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {showConversationList ? (
            <motion.div
              key="conversation-list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <ConversationList 
                threads={filteredThreads}
                userId={userId}
                onSelectThread={handleThreadSelect}
                activeThreadId={activeThreadId}
                userType={userType}
                onNewConversation={() => {
                  toast({
                    title: "Bientôt disponible",
                    description: "La création de nouvelles conversations sera bientôt disponible"
                  });
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              key="conversation-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {activeThread && (
                <ConversationView
                  thread={activeThread}
                  userId={userId}
                  userName={userName}
                  onSendMessage={handleSendMessage}
                  sessionKey={sessionKeys[activeThread.id] || generateSessionKey()}
                  isSecurityEnabled={isSecurityEnabled}
                  onOpenSupport={() => openModal('supportCreator')}
                  onOpenGifts={() => openModal('giftCreator')}
                  userType={userType}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Panels pour le soutien et les cadeaux */}
      <SupportPanel 
        isOpen={openModals.supportCreator} 
        onClose={() => closeModal('supportCreator')}
        onApply={(data) => {
          handleSendMessage("Je soutiens votre contenu", data);
          closeModal('supportCreator');
        }}
      />
      
      <GiftPanel 
        isOpen={openModals.giftCreator} 
        onClose={() => closeModal('giftCreator')}
        onSendGift={(gift) => {
          handleSendMessage(`🎁 ${gift.name}`, {
            tier: 'premium' as MonetizationTier,
            price: gift.price,
            currency: 'USDT',
            instantPayoutEnabled: true,
            accessControl: { isGated: true },
            analytics: { views: 0, revenue: 0, conversionRate: 0, engagementTime: 0 }
          });
          closeModal('giftCreator');
        }}
      />
    </div>
  );
};

export default SecureMessaging;
