import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import useHapticFeedback from '@/hooks/use-haptic-feedback';
import { 
  ArrowLeft, X, Lock, Key, Zap 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import ConversationList from './ConversationList';
import ConversationView from './ConversationView';
import { SupportPanel } from './SupportPanel';
import { GiftPanel } from './GiftPanel';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageType, 
  MonetizationTier, 
} from '@/types/messaging';
import { generateSessionKey } from '@/utils/encryption';
import XDoseLogo from '@/components/XDoseLogo';
import { toast as sonnerToast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/integrations/firebase/firebase';
import { collection, query, where, onSnapshot, orderBy, Timestamp, doc } from 'firebase/firestore';
import { Spinner } from '@/components/ui/spinner';
import { useTronWallet } from '@/hooks/use-tron-wallet';
import { fetchUserThreads, sendMessage, markMessagesAsRead, fetchMessagesForThread } from '@/utils/messaging-utils'; 
import { FirestoreMessage, FirestoreMessageThread } from '@/utils/create-conversation-utils';
import { useModals } from '@/hooks/use-modals';
import { createNewConversationWithCreator } from '@/utils/create-conversation-utils';

// Extend FirestoreMessageThread to include messages
interface ExtendedFirestoreMessageThread extends FirestoreMessageThread {
  messages: FirestoreMessage[];
  readStatus?: Record<string, Timestamp>;
}

interface SecureMessagingProps {
  userId: string;
  userName: string;
  userAvatar: string;
}

const SecureMessaging: React.FC<SecureMessagingProps> = ({ userId, userName, userAvatar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { triggerHaptic } = useHapticFeedback();
  const { user, profile } = useAuth();
  const { getWalletInfo } = useTronWallet();
  const { openModal, closeModal, openModals } = useModals();
  
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [threads, setThreads] = useState<ExtendedFirestoreMessageThread[]>([]);
  const [showConversationList, setShowConversationList] = useState(true);
  const [isSecurityEnabled, setIsSecurityEnabled] = useState(true);
  const [sessionKeys, setSessionKeys] = useState<Record<string, string>>({});
  const [filterMode, setFilterMode] = useState<'all' | 'unread' | 'supported'>('all');
  const [isLoadingThreads, setIsLoadingThreads] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [lastVisibleMessageDoc, setLastVisibleMessageDoc] = useState<any>(null);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);

  const userType = profile?.role || 'fan';

  const loadInitialConversationThreads = useCallback(async () => {
    if (!userId) return;
    console.log("SecureMessaging: Initial load of conversation threads for user:", userId);
    setIsLoadingThreads(true);
    try {
      const threadsData = await fetchUserThreads(userId);
      setThreads(threadsData.map(t => ({
        ...t, 
        messages: t.messages || [], 
        readStatus: t.readStatus || {} 
      })));
      
      const locationState = location.state as { creatorId?: string; threadId?: string; creatorName?: string; creatorAvatar?: string | null };
      let threadToActivate = null;
      let shouldClearLocationState = false;

      if (locationState?.threadId) {
        threadToActivate = locationState.threadId;
        shouldClearLocationState = true;
      } else if (locationState?.creatorId) {
        const existingThread = threadsData.find(t => t.participantIds.includes(locationState.creatorId!));
        if (existingThread) {
          threadToActivate = existingThread.id!;
        } else {
          if (userId && userName) {
            console.log("SecureMessaging: No existing thread for creatorId, creating...");
            const result = await createNewConversationWithCreator({
              userId: userId!, userName: userName!, userAvatar: userAvatar!,
              creatorId: locationState.creatorId!, creatorName: locationState.creatorName || "Créateur", creatorAvatar: locationState.creatorAvatar || null,
            });
            if (result.success && result.threadId) threadToActivate = result.threadId;
            else sonnerToast.error("Impossible de démarrer la nouvelle conversation.");
          }
        }
        shouldClearLocationState = true;
      }

      if (threadToActivate) {
        setActiveThreadId(threadToActivate);
        setShowConversationList(false); 
      }
      if(shouldClearLocationState){
        navigate(location.pathname, { replace: true, state: {} });
      }
    } catch (error) {
      console.error('Error loading initial conversation threads:', error);
      sonnerToast.error('Erreur de chargement des fils de discussion');
    } finally {
      setIsLoadingThreads(false);
    }
  }, [userId, location.state, navigate, userName, userAvatar, location.pathname]);

  useEffect(() => {
    if (userId) {
      loadInitialConversationThreads();
      getWalletInfo();
    }
  }, [userId, loadInitialConversationThreads, getWalletInfo]);

  useEffect(() => {
    if (!userId || !db) return () => {};
    const threadsQuery = query(collection(db, 'messageThreads'), where('participantIds', 'array-contains', userId), orderBy('lastActivity', 'desc'));
    const unsubscribeThreads = onSnapshot(threadsQuery, (snapshot) => {
      setThreads(prevThreads => {
        let newThreadsMap = new Map(prevThreads.map(t => [t.id, t]));
        snapshot.docChanges().forEach((change) => {
          const changedThreadData = { 
            id: change.doc.id, 
            ...change.doc.data(), 
            messages: newThreadsMap.get(change.doc.id)?.messages || [],
            readStatus: newThreadsMap.get(change.doc.id)?.readStatus || {}
          } as ExtendedFirestoreMessageThread;
          
          if (change.type === "added" || change.type === "modified") {
            newThreadsMap.set(change.doc.id, changedThreadData);
          } else if (change.type === "removed") {
            newThreadsMap.delete(change.doc.id);
          }
        });
        return Array.from(newThreadsMap.values()).sort((a, b) => (b.lastActivity as any).toMillis() - (a.lastActivity as any).toMillis());
      });
      setIsLoadingThreads(false);
    }, (error) => {
      console.error("Error listening to real-time thread metadata:", error);
      setIsLoadingThreads(false);
    });
    return () => unsubscribeThreads();
  }, [userId]);

  const loadMoreMessages = useCallback(async (isInitialLoad = false) => {
    if (!activeThreadId || !userId) return;
    if (!isInitialLoad && !hasMoreMessages) return;
    setIsLoadingMessages(true);
    try {
      const { messages: newMessagesData, newLastVisibleDoc } = await fetchMessagesForThread(activeThreadId, 20, isInitialLoad ? null : lastVisibleMessageDoc);
      setThreads(prevThreads =>
        prevThreads.map(thread =>
          thread.id === activeThreadId
            ? { 
                ...thread, 
                messages: isInitialLoad 
                  ? newMessagesData 
                  : [...newMessagesData, ...thread.messages].sort((a,b) => 
                      (a.createdAt as Timestamp).toMillis() - (b.createdAt as Timestamp).toMillis()
                    )
              }
            : thread
        )
      );
      setLastVisibleMessageDoc(newLastVisibleMessageDoc);
      setHasMoreMessages(newMessagesData.length === 20);
      if (isInitialLoad) markMessagesAsRead(activeThreadId, userId);
    } catch (error) {
      console.error("Error fetching messages:", error); 
      sonnerToast.error("Erreur de chargement des messages.");
    } finally {
      setIsLoadingMessages(false);
    }
  }, [activeThreadId, userId, lastVisibleMessageDoc, hasMoreMessages]);

  useEffect(() => {
    if (activeThreadId) {
      setHasMoreMessages(true); 
      setLastVisibleMessageDoc(null); 
      loadMoreMessages(true);
    }
  }, [activeThreadId, loadMoreMessages]);

  useEffect(() => {
    if (!activeThreadId || !db || !userId) return () => {};
    let queryRef = query(collection(db, 'messageThreads', activeThreadId, 'messages'), orderBy('createdAt', 'asc'));
    const currentThread = threads.find(t => t.id === activeThreadId);
    if (currentThread && currentThread.messages.length > 0) {
        const lastKnownMessage = currentThread.messages[currentThread.messages.length - 1];
        if (lastKnownMessage.createdAt) {
            queryRef = query(collection(db, 'messageThreads', activeThreadId, 'messages'), 
                             orderBy('createdAt', 'asc'), 
                             where('createdAt', '>', lastKnownMessage.createdAt));
        }
    }
    
    const unsubscribeMessages = onSnapshot(queryRef, (snapshot) => {
      const newMessages: FirestoreMessage[] = [];
      snapshot.docChanges().forEach((change) => { 
        if (change.type === "added") newMessages.push({ id: change.doc.id, ...change.doc.data() } as FirestoreMessage); 
      });
      
      if (newMessages.length > 0) {
        setThreads(prevThreads =>
          prevThreads.map(thread =>
            thread.id === activeThreadId
              ? { 
                  ...thread, 
                  messages: [...thread.messages, ...newMessages].sort(
                    (a,b) => (a.createdAt as Timestamp).toMillis() - (b.createdAt as Timestamp).toMillis()
                  ),
                  lastActivity: newMessages[newMessages.length - 1].createdAt as Timestamp,
                  lastMessageText: newMessages[newMessages.length - 1].content,
                  lastMessageSenderId: newMessages[newMessages.length - 1].senderId,
                  readStatus: { 
                    ...(thread.readStatus || {}), 
                    [newMessages[newMessages.length - 1].senderId]: newMessages[newMessages.length - 1].createdAt as Timestamp 
                  }
                }
              : thread
          )
        );
        
        const lastNewMessage = newMessages[newMessages.length - 1];
        if (lastNewMessage.senderId !== userId) { 
          triggerHaptic('medium'); 
          markMessagesAsRead(activeThreadId, userId);
        }
      }
    }, (error) => console.error(`Error listening to new messages for thread ${activeThreadId}:`, error));
    
    return () => unsubscribeMessages();
  }, [activeThreadId, userId, triggerHaptic, threads]);

  useEffect(() => {
    threads.forEach(thread => { 
      if (thread.id && !sessionKeys[thread.id]) 
        setSessionKeys(prev => ({ ...prev, [thread.id!]: generateSessionKey() })); 
    });
  }, [threads, sessionKeys]);

  const activeThreadData = threads.find(t => t.id === activeThreadId);

  const handleThreadSelect = (threadId: string) => {
    triggerHaptic('light');
    if (activeThreadId !== threadId) { 
      setActiveThreadId(threadId); 
      setShowConversationList(false);
    }
    else setShowConversationList(false);
  };

  const handleBack = () => {
    if (!showConversationList && activeThreadId) { 
      triggerHaptic('light'); 
      setShowConversationList(true); 
      setActiveThreadId(null); 
    }
    else navigate(-1);
  };

  const handleSendMessage = async (content: string, supportData?: any) => {
    if (!activeThreadId || !content.trim() || !userId ) return;
    const optimisticMessage: FirestoreMessage = { 
      id: `optimistic_${Date.now()}`, 
      senderId: userId, 
      content, 
      type: 'text', 
      createdAt: Timestamp.now(), 
      isEncrypted: isSecurityEnabled, 
      ...(supportData && { monetization: supportData }), 
    };
    
    setThreads(prevThreads => prevThreads.map(thread => 
      thread.id === activeThreadId 
        ? { 
            ...thread, 
            messages: [...thread.messages, optimisticMessage], 
            lastMessageText: content.substring(0,97)+(content.length > 100 ? "..." : ""), 
            lastMessageSenderId: userId, 
            lastActivity: Timestamp.now() 
          } 
        : thread 
    ));
    
    try {
      await sendMessage({ 
        threadId: activeThreadId, 
        senderId: userId, 
        content, 
        isEncrypted: isSecurityEnabled, 
        monetizationData: supportData 
      });
      
      if (supportData) { 
        triggerHaptic('strong'); 
        toast({ title: "Message de soutien envoyé"}); 
      }
    } catch (error) {
      console.error('Error sending message:', error); 
      toast({ title: "Erreur d'envoi", variant: "destructive" });
      
      setThreads(prevThreads => prevThreads.map(thread => 
        thread.id === activeThreadId 
          ? { 
              ...thread, 
              messages: thread.messages.filter(m => m.id !== optimisticMessage.id) 
            } 
          : thread 
      ));
    }
  };

  const toggleSecurityMode = () => { 
    setIsSecurityEnabled(!isSecurityEnabled); 
  };

  const handleNewConversationCreated = async (newThreadInfo: { creatorId: string; creatorName: string; creatorAvatar: string | null }) => {
    if (!userId || !userName) return;
    const { creatorId, creatorName, creatorAvatar } = newThreadInfo;
    
    const existingThread = threads.find(t => 
      t.participantIds.includes(creatorId) && t.participantIds.includes(userId)
    );
    
    if (existingThread && existingThread.id) { 
      setActiveThreadId(existingThread.id); 
      setShowConversationList(false); 
      return; 
    }
    
    try {
      const result = await createNewConversationWithCreator({ 
        userId: userId!, 
        userName: userName!, 
        userAvatar: userAvatar!, 
        creatorId, 
        creatorName, 
        creatorAvatar 
      });
      
      if (result.success && result.threadId) { 
        setActiveThreadId(result.threadId); 
        setShowConversationList(false); 
      }
      else sonnerToast.error(result.error?.message || "Impossible de créer la conversation.");
    } catch (error) { 
      console.error("Error creating new conversation:", error); 
      sonnerToast.error("Erreur."); 
    }
  };

  if (isLoadingThreads && threads.length === 0 && !activeThreadId) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-50">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-lg">Chargement des discussions...</p>
        </div>
      </div>
    );
  }

  const filteredThreads = threads.filter(thread => {
    if (filterMode === 'all') return true;
    if (filterMode === 'unread') {
      const lastReadByCurrentUser = (thread.readStatus && userId && thread.readStatus[userId] as Timestamp | undefined)?.toMillis() || 0;
      return thread.lastMessageCreatedAt && (thread.lastMessageCreatedAt as Timestamp).toMillis() > lastReadByCurrentUser && thread.lastMessageSenderId !== userId;
    }
    if (filterMode === 'supported') { 
      return thread.messages.some(m => m.senderId === userId && (m as any).monetization); 
    }
    return true;
  });

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 flex flex-col h-full w-full z-50">
      <header className="flex items-center justify-between p-4 backdrop-blur-md bg-white/50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full" onClick={handleBack}>
            <ArrowLeft size={24} />
          </Button>
          <XDoseLogo size="md" />
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn("rounded-full", isSecurityEnabled ? "text-green-500" : "text-red-500")} 
            onClick={toggleSecurityMode}
          >
            {isSecurityEnabled ? <Lock size={20} /> : <Key size={20} />}
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full text-gray-700 dark:text-gray-300" onClick={() => navigate('/')}>
            <X size={22} />
          </Button>
        </div>
      </header>

      <AnimatePresence>
        {showConversationList && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="px-4 pt-3 pb-1">
            <Tabs value={filterMode} onValueChange={(value) => setFilterMode(value as any)} className="w-full">
              <TabsList className="w-full bg-gray-100 dark:bg-gray-800 border">
                <TabsTrigger value="all">Tous</TabsTrigger>
                <TabsTrigger value="unread">Non lus</TabsTrigger>
                <TabsTrigger value="supported"><Zap size={14} className="mr-1"/>Soutenus</TabsTrigger>
              </TabsList>
            </Tabs>
          </motion.div>
        )}
      </AnimatePresence>

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
                threads={filteredThreads as any} 
                userId={userId!} 
                userName={userName} 
                userAvatar={userAvatar} 
                onSelectThread={handleThreadSelect} 
                activeThreadId={activeThreadId} 
                userType={userType} 
                onConversationCreated={handleNewConversationCreated as any} 
              />
            </motion.div>
          ) : (
            activeThreadData && (
              <motion.div 
                key={activeThreadData.id || 'active-conversation'} 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: 20 }} 
                transition={{ duration: 0.2 }} 
                className="h-full"
              >
                <ConversationView 
                  thread={activeThreadData as any} 
                  userId={userId!} 
                  userName={userName} 
                  onSendMessage={handleSendMessage} 
                  sessionKey={sessionKeys[activeThreadData.id!] || generateSessionKey()} 
                  isSecurityEnabled={isSecurityEnabled} 
                  onOpenSupport={() => openModal('supportCreator')} 
                  onOpenGifts={() => openModal('giftCreator')}
                  userType={userType}
                  isLoadingMessages={isLoadingMessages}
                  onLoadMoreMessages={() => loadMoreMessages(false)}
                  hasMoreMessages={hasMoreMessages}
                />
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>
      
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
            currency: 'USDT'
          }); 
          closeModal('giftCreator'); 
        }} 
      />
    </div>
  );
};

export default SecureMessaging;
