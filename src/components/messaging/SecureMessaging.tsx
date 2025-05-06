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
import { mockMessageThreads } from '@/data/mockMessages';
import { generateSessionKey } from '@/utils/encryption';
import XDoseLogo from '@/components/XDoseLogo';
import { toast as sonnerToast } from 'sonner';

const SecureMessaging = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { triggerHaptic } = useHapticFeedback();
  
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [threads, setThreads] = useState<ThreadType[]>(mockMessageThreads);
  const [showConversationList, setShowConversationList] = useState(true);
  const [showSupportPanel, setShowSupportPanel] = useState(false);
  const [showGiftPanel, setShowGiftPanel] = useState(false);
  const [isSecurityEnabled, setIsSecurityEnabled] = useState(true);
  const [sessionKeys, setSessionKeys] = useState<Record<string, string>>({});
  const [filterMode, setFilterMode] = useState<'all' | 'unread' | 'supported'>('all');
  const [userType, setUserType] = useState<'creator' | 'fan'>('fan'); // Set to 'fan' by default
  const [hasNewMessages, setHasNewMessages] = useState(false);

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

  // Simulate receiving new messages
  useEffect(() => {
    const interval = setInterval(() => {
      const shouldSendMessage = Math.random() > 0.7;
      
      if (shouldSendMessage && threads.length > 0) {
        const randomThreadIndex = Math.floor(Math.random() * threads.length);
        const threadId = threads[randomThreadIndex].id;
        
        const newMessage: Message = {
          id: `msg_${Date.now()}`,
          senderId: `other_user_${randomThreadIndex}`,
          senderName: `User_${randomThreadIndex}`,
          senderAvatar: `https://i.pravatar.cc/150?img=${10 + randomThreadIndex}`,
          recipientId: userId,
          content: "Hey, j'adore ton contenu! 😍",
          type: 'text',
          timestamp: new Date().toISOString(),
          status: 'sent',
          isEncrypted: false,
          emotional: {
            primaryEmotion: 'joy',
            intensity: 80,
            threadMapping: []
          }
        };

        setThreads(prev => 
          prev.map(thread => 
            thread.id === threadId 
              ? { 
                  ...thread, 
                  messages: [...thread.messages, newMessage],
                  lastActivity: newMessage.timestamp 
                }
              : thread
          )
        );
        
        if (!activeThreadId || activeThreadId !== threadId) {
          setHasNewMessages(true);
          triggerHaptic('medium');
          
          sonnerToast("Nouveau message", {
            description: `${newMessage.senderName} vous a envoyé un message`,
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
      }
    }, 30000); // Every 30 seconds
    
    return () => clearInterval(interval);
  }, [threads, activeThreadId, triggerHaptic]);

  const activeThread = threads.find(t => t.id === activeThreadId);

  const handleThreadSelect = (threadId: string) => {
    triggerHaptic('medium');
    setActiveThreadId(threadId);
    setShowConversationList(false);
    setHasNewMessages(false);
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

  const handleSendMessage = (content: string, supportData?: any) => {
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
      monetization: supportData,
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

    if (supportData) {
      triggerHaptic('strong');
      toast({
        title: "Message de soutien envoyé",
        description: `${supportData.tier} - ${supportData.price}€`,
      });
    }
  };

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
          {/* Toggle for switching between fan and creator mode - for demo purposes */}
          <div className="mr-2 flex items-center">
            <span className="text-xs mr-2">Mode:</span>
            <Button 
              variant={userType === 'fan' ? "default" : "outline"} 
              size="sm"
              className="text-xs h-7 rounded-r-none"
              onClick={() => setUserType('fan')}
            >
              Fan
            </Button>
            <Button 
              variant={userType === 'creator' ? "default" : "outline"} 
              size="sm"
              className="text-xs h-7 rounded-l-none"
              onClick={() => setUserType('creator')}
            >
              Créateur
            </Button>
          </div>
          
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
                currency: 'EUR',
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
