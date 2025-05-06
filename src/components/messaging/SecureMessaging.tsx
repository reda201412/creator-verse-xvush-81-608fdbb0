
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import useHapticFeedback from '@/hooks/use-haptic-feedback';
import { 
  ArrowLeft, X, Shield, Users, Lock, Star, Zap, 
  MessageSquare, Camera, Gift, Key, ChevronDown,
  Eye, EyeOff, CircleDollarSign
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import ConversationList from './ConversationList';
import ConversationView from './ConversationView';
import { MonetizationPanel } from './MonetizationPanel';
import { GiftPanel } from './GiftPanel';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Message, MessageThread as ThreadType, MonetizationTier } from '@/types/messaging';
import { mockMessageThreads } from '@/data/mockMessages';
import { generateSessionKey } from '@/utils/encryption';

const SecureMessaging = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { triggerHaptic } = useHapticFeedback();
  
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [threads, setThreads] = useState<ThreadType[]>(mockMessageThreads);
  const [showConversationList, setShowConversationList] = useState(true);
  const [showMonetizationPanel, setShowMonetizationPanel] = useState(false);
  const [showGiftPanel, setShowGiftPanel] = useState(false);
  const [isSecurityEnabled, setIsSecurityEnabled] = useState(true);
  const [sessionKeys, setSessionKeys] = useState<Record<string, string>>({});
  const [filterMode, setFilterMode] = useState<'all' | 'unread' | 'monetized'>('all');

  const userId = "current_user_id"; // En réalité proviendrait d'un context d'authentification
  const userName = "Julie Sky"; // De même

  // Effet pour générer des clés de session pour chaque conversation si nécessaire
  useEffect(() => {
    threads.forEach(thread => {
      if (!sessionKeys[thread.id]) {
        setSessionKeys(prev => ({
          ...prev,
          [thread.id]: generateSessionKey()
        }));
      }
    });
  }, [threads, sessionKeys]);

  // Activer le mode plein écran et effet de retour à la navigation
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const activeThread = threads.find(t => t.id === activeThreadId);

  const handleThreadSelect = (threadId: string) => {
    triggerHaptic('medium');
    setActiveThreadId(threadId);
    setShowConversationList(false);
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

  const handleSendMessage = (content: string, monetizationData?: any) => {
    if (!activeThreadId) return;
    
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      senderId: userId,
      senderName: userName,
      senderAvatar: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?crop=faces&w=200&h=200",
      recipientId: activeThread?.participants.filter(p => p !== userId) || [],
      content: content,
      type: 'text',
      timestamp: new Date().toISOString(),
      status: 'sent',
      isEncrypted: isSecurityEnabled,
      monetization: monetizationData,
      emotional: {
        primaryEmotion: 'neutral',
        intensity: 50,
        threadMapping: []
      }
    };

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

    if (monetizationData) {
      triggerHaptic('strong');
      toast({
        title: "Message monétisé envoyé",
        description: `${monetizationData.tier} - ${monetizationData.price}€`,
      });
    }
  };

  const filteredThreads = threads.filter(thread => {
    if (filterMode === 'all') return true;
    if (filterMode === 'unread') {
      return thread.messages.some(m => m.status !== 'read' && m.senderId !== userId);
    }
    if (filterMode === 'monetized') {
      return thread.messages.some(m => m.monetization);
    }
    return true;
  });

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

  return (
    <div className="fixed inset-0 bg-black/95 text-white flex flex-col h-full w-full">
      {/* Header */}
      <header className="flex items-center justify-between p-4 backdrop-blur-md bg-black/50 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-white/10 rounded-full"
            onClick={handleBack}
          >
            <ArrowLeft size={24} />
          </Button>
          
          <h1 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            {showConversationList ? "Messagerie" : activeThread?.name || "Chat"}
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            className={cn(
              "rounded-full",
              isSecurityEnabled ? "text-green-400 hover:text-green-300" : "text-red-400 hover:text-red-300"
            )}
            onClick={toggleSecurityMode}
          >
            {isSecurityEnabled ? <Lock size={20} /> : <Key size={20} />}
          </Button>

          <Button 
            variant="ghost" 
            size="icon"
            className="rounded-full text-white hover:bg-white/10"
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
              <TabsList className="w-full bg-white/5 border border-white/10">
                <TabsTrigger value="all" className="data-[state=active]:bg-white/10">
                  Tous
                </TabsTrigger>
                <TabsTrigger value="unread" className="data-[state=active]:bg-white/10">
                  Non lus
                </TabsTrigger>
                <TabsTrigger value="monetized" className="data-[state=active]:bg-white/10">
                  <Zap size={14} className="text-amber-400 mr-1" />
                  Premium
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
                  onOpenMonetization={() => setShowMonetizationPanel(true)}
                  onOpenGifts={() => setShowGiftPanel(true)}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Panels pour la monétisation et les cadeaux */}
      <MonetizationPanel 
        isOpen={showMonetizationPanel} 
        onClose={() => setShowMonetizationPanel(false)}
        onApply={(data) => {
          handleSendMessage("Ce message est monétisé", data);
          setShowMonetizationPanel(false);
        }}
      />
      
      <GiftPanel 
        isOpen={showGiftPanel} 
        onClose={() => setShowGiftPanel(false)}
        onSendGift={(gift) => {
          handleSendMessage(`🎁 ${gift.name}`, {
            tier: 'premium' as MonetizationTier,
            price: gift.price,
            currency: 'EUR',
            instantPayoutEnabled: true,
            accessControl: { isGated: true },
            analytics: { views: 0, revenue: 0, conversionRate: 0, engagementTime: 0 }
          });
          setShowGiftPanel(false);
        }}
      />
    </div>
  );
};

export default SecureMessaging;
