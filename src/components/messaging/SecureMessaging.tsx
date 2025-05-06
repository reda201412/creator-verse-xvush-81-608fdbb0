
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
import { Message, MessageThread as ThreadType, MonetizationTier } from '@/types/messaging';
import { generateSessionKey } from '@/utils/encryption';
import XDoseLogo from '@/components/XDoseLogo';
import { toast as sonnerToast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Spinner } from '@/components/ui/spinner';
import { useTronWallet } from '@/hooks/use-tron-wallet';

const SecureMessaging = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { triggerHaptic } = useHapticFeedback();
  const { profile, user } = useAuth();
  const { getWalletInfo, walletInfo } = useTronWallet();
  
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [threads, setThreads] = useState<ThreadType[]>([]);
  const [showConversationList, setShowConversationList] = useState(true);
  const [showSupportPanel, setShowSupportPanel] = useState(false);
  const [showGiftPanel, setShowGiftPanel] = useState(false);
  const [isSecurityEnabled, setIsSecurityEnabled] = useState(true);
  const [sessionKeys, setSessionKeys] = useState<Record<string, string>>({});
  const [filterMode, setFilterMode] = useState<'all' | 'unread' | 'supported'>('all');
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Use the actual user role from authentication context
  const userType = profile?.role || 'fan';
  const userId = user?.id || ""; // Real user ID from auth context
  const userName = profile?.display_name || profile?.username || "User"; // Use actual user name from profile

  // Load real conversation threads when component mounts
  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    loadConversations();
    getWalletInfo(); // Load wallet information for transactions
  }, [user, navigate]);

  // Load real conversations from Supabase
  const loadConversations = async () => {
    setIsLoading(true);
    try {
      // For creators, fetch all threads where they are participants or creator
      // For fans, fetch threads they're participating in
      const { data, error } = await supabase
        .from('message_threads')
        .select('*, messages:message_thread_messages(*)')
        .or(`participants.cs.{${userId}},creator_id.eq.${userId}`)
        .order('last_activity', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        // Transform the data to match our ThreadType format
        const formattedThreads: ThreadType[] = data.map(thread => ({
          id: String(thread.id), // Ensure ID is a string
          participants: thread.participants || [],
          messages: (Array.isArray(thread.messages) ? thread.messages : []).map(msg => ({
            id: String(msg.id),
            senderId: msg.sender_id,
            senderName: msg.sender_name,
            senderAvatar: msg.sender_avatar,
            recipientId: msg.recipient_id,
            content: msg.content,
            type: msg.type as any,
            timestamp: msg.created_at,
            status: msg.status as any,
            isEncrypted: msg.is_encrypted,
            emotional: msg.emotional_data,
            monetization: msg.monetization_data,
            mediaUrl: msg.media_url
          })),
          name: thread.name,
          isGated: thread.is_gated,
          requiredTier: thread.required_tier as MonetizationTier,
          lastActivity: thread.last_activity,
          emotionalMap: thread.emotional_map
        }));
        
        setThreads(formattedThreads);
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

  // Handle back navigation
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Setup real-time message notifications
  useEffect(() => {
    const channel = supabase
      .channel('message-notifications')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'message_thread_messages',
        filter: `recipient_id.cs.{${userId}}`
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
      senderAvatar: newMessage.sender_avatar,
      recipientId: newMessage.recipient_id,
      content: newMessage.content,
      type: newMessage.type as any,
      timestamp: newMessage.created_at,
      status: 'sent',
      isEncrypted: newMessage.is_encrypted,
      emotional: newMessage.emotional_data,
      monetization: newMessage.monetization_data,
      mediaUrl: newMessage.media_url
    };

    // Update the threads with this new message
    setThreads(prev => 
      prev.map(thread => 
        thread.id === threadId 
          ? { 
              ...thread, 
              messages: [...thread.messages, formattedMessage],
              lastActivity: formattedMessage.timestamp 
            }
          : thread
      )
    );
    
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
    triggerHaptic('medium');
    setActiveThreadId(threadId);
    setShowConversationList(false);
    setHasNewMessages(false);
    
    // Mark messages as read in this thread
    markMessagesAsRead(threadId);
  };

  // Mark messages as read
  const markMessagesAsRead = async (threadId: string) => {
    try {
      const thread = threads.find(t => t.id === threadId);
      if (!thread) return;
      
      const unreadMessages = thread.messages
        .filter(m => m.status !== 'read' && m.senderId !== userId)
        .map(m => m.id);
      
      if (unreadMessages.length === 0) return;
      
      // Update message status in database
      const { error } = await supabase
        .from('message_thread_messages')
        .update({ status: 'read' })
        .in('id', unreadMessages);
        
      if (error) throw error;
      
      // Update local state
      setThreads(prev => 
        prev.map(t => 
          t.id === threadId 
            ? { 
                ...t, 
                messages: t.messages.map(m => 
                  unreadMessages.includes(m.id) 
                    ? { ...m, status: 'read' } 
                    : m
                ) 
              }
            : t
        )
      );
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const handleBack = () => {
    if (!showConversationList && activeThreadId) {
      triggerHaptic('light');
      setShowConversationList(true);
      setActiveThreadId(null);
    } else {
      navigate('/');
    }
  };

  // Send message with real data saving
  const handleSendMessage = async (content: string, supportData?: any) => {
    if (!activeThreadId) return;
    if (!user) {
      toast({
        title: "Authentification requise",
        description: "Vous devez être connecté pour envoyer des messages",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Create the message object
      const timestamp = new Date().toISOString();
      const messageData = {
        thread_id: activeThreadId,
        sender_id: userId,
        sender_name: userName,
        sender_avatar: profile?.avatar_url || "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?crop=faces&w=200&h=200",
        recipient_id: activeThread?.participants.filter(p => p !== userId) || [],
        content: content,
        type: 'text',
        created_at: timestamp,
        status: 'sent',
        is_encrypted: isSecurityEnabled,
        monetization_data: supportData ? {
          tier: supportData.tier,
          price: supportData.price,
          currency: 'USDT',
          instantPayoutEnabled: true,
          accessControl: { isGated: true },
          analytics: { views: 0, revenue: 0, conversionRate: 0, engagementTime: 0 }
        } : null
      };

      // Save to Supabase
      const { data: savedMessage, error } = await supabase
        .from('message_thread_messages')
        .insert(messageData)
        .select()
        .single();

      if (error) throw error;

      // Update the thread's last activity
      await supabase
        .from('message_threads')
        .update({ last_activity: timestamp })
        .eq('id', activeThreadId);

      // If there's monetization data, process the transaction
      if (supportData) {
        // Process USDT transaction
        await processUsdtTransaction(supportData.price, activeThread?.participants[0], supportData.tier);
        
        triggerHaptic('strong');
        toast({
          title: "Message de soutien envoyé",
          description: `${supportData.tier} - ${supportData.price} USDT`,
        });
      }

      // Format message for local state update
      const newMessage: Message = {
        id: String(savedMessage.id),
        senderId: userId,
        senderName: userName,
        senderAvatar: profile?.avatar_url || "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?crop=faces&w=200&h=200",
        recipientId: activeThread?.participants.filter(p => p !== userId) || [],
        content: content,
        type: 'text',
        timestamp: timestamp,
        status: 'sent',
        isEncrypted: isSecurityEnabled,
        monetization: supportData ? {
          tier: supportData.tier as MonetizationTier,
          price: supportData.price,
          currency: 'USDT',
          instantPayoutEnabled: true,
          accessControl: { isGated: true },
          analytics: { views: 0, revenue: 0, conversionRate: 0, engagementTime: 0 }
        } : undefined,
        emotional: {
          primaryEmotion: 'neutral',
          intensity: 50,
          threadMapping: []
        }
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
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Erreur d'envoi",
        description: "Impossible d'envoyer le message",
        variant: "destructive",
      });
    }
  };

  // Process USDT transaction via the Edge Function
  const processUsdtTransaction = async (amount: number, recipientId: string, tier: string) => {
    try {
      // Verify wallet exists
      if (!walletInfo?.wallet) {
        toast({
          title: "Portefeuille requis",
          description: "Vous devez avoir un portefeuille pour effectuer cette opération",
          variant: "destructive",
        });
        return false;
      }

      // Check balance
      if ((walletInfo.wallet.balance_usdt || 0) < amount) {
        toast({
          title: "Solde insuffisant",
          description: `Vous avez besoin de ${amount} USDT pour cette opération`,
          variant: "destructive",
        });
        return false;
      }

      // Call the decrement_balance Edge Function
      const { data, error } = await supabase.functions.invoke("decrement_balance", {
        body: { userId: userId, amount: amount }
      });

      if (error) {
        throw new Error(error.message);
      }

      // Create transaction record
      const { data: transaction, error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: userId,
          amount_usdt: amount,
          transaction_type: 'message_support',
          status: 'completed',
          tron_tx_id: `tx_${Date.now()}`
        })
        .select()
        .single();

      if (transactionError) throw transactionError;

      // Update recipient's balance - use RPC call
      await supabase.rpc('increment_balance', { 
        user_id_param: recipientId, 
        amount_param: amount * 0.9  // 10% platform fee
      });

      // Get updated wallet info
      await getWalletInfo();

      return true;
    } catch (error) {
      console.error('Error processing USDT transaction:', error);
      toast({
        title: "Erreur de transaction",
        description: "Impossible de traiter la transaction USDT",
        variant: "destructive",
      });
      return false;
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
      <div className="fixed inset-0 flex items-center justify-center bg-white">
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
    <div className="fixed inset-0 bg-white/95 text-gray-800 flex flex-col h-full w-full">
      {/* Header */}
      <header className="flex items-center justify-between p-4 backdrop-blur-md bg-white/50 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-gray-700 hover:bg-gray-100 rounded-full"
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
              isSecurityEnabled ? "text-green-600 hover:text-green-700" : "text-red-600 hover:text-red-700"
            )}
            onClick={toggleSecurityMode}
          >
            {isSecurityEnabled ? <Lock size={20} /> : <Key size={20} />}
          </Button>

          <Button 
            variant="ghost" 
            size="icon"
            className="rounded-full text-gray-700 hover:bg-gray-100"
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
              <TabsList className="w-full bg-gray-100 border border-gray-200">
                <TabsTrigger value="all" className="data-[state=active]:bg-white/80">
                  Tous
                </TabsTrigger>
                <TabsTrigger value="unread" className="data-[state=active]:bg-white/80">
                  Non lus
                </TabsTrigger>
                <TabsTrigger value="supported" className="data-[state=active]:bg-white/80">
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
                  sessionKey={sessionKeys[activeThread.id]}
                  isSecurityEnabled={isSecurityEnabled}
                  onOpenSupport={() => userType === 'fan' && setShowSupportPanel(true)}
                  onOpenGifts={() => userType === 'fan' && setShowGiftPanel(true)}
                  userType={userType}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Panels pour le soutien et les cadeaux - uniquement visibles pour les fans */}
      {userType === 'fan' && (
        <>
          <SupportPanel 
            isOpen={showSupportPanel} 
            onClose={() => setShowSupportPanel(false)}
            onApply={(data) => {
              handleSendMessage("Je soutiens votre contenu", data);
              setShowSupportPanel(false);
            }}
          />
          
          <GiftPanel 
            isOpen={showGiftPanel} 
            onClose={() => setShowGiftPanel(false)}
            onSendGift={(gift) => {
              handleSendMessage(`🎁 ${gift.name}`, {
                tier: 'premium' as MonetizationTier,
                price: gift.price,
                currency: 'USDT',
                instantPayoutEnabled: true,
                accessControl: { isGated: true },
                analytics: { views: 0, revenue: 0, conversionRate: 0, engagementTime: 0 }
              });
              setShowGiftPanel(false);
            }}
          />
        </>
      )}
    </div>
  );
};

export default SecureMessaging;
