
import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import useHapticFeedback from '@/hooks/use-haptic-feedback';
import { 
  MessageSquare, 
  Send, 
  Mic, 
  Image, 
  Video, 
  Zap, 
  Lock, 
  Shield,
  UserPlus,
  Settings,
  ChevronDown,
  ChevronRight,
  Users,
  ArrowLeft,
  Key,
  Camera,
  X,
  User
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import MessageThread from './MessageThread';
import MessageInput from './MessageInput';
import WalletPanel from './WalletPanel';
import { Message, MessageThread as MessageThreadType } from '@/types/messaging';
import { mockMessageThreads } from '@/data/mockMessages';
import { encryptMessage, generateSessionKey } from '@/utils/encryption';

interface MessageCenterProps {
  userId: string;
  userName: string;
  userAvatar: string;
  isCreator?: boolean;
  className?: string;
}

const MessageCenter = ({
  userId,
  userName,
  userAvatar,
  isCreator = false,
  className,
}: MessageCenterProps) => {
  const isMobile = useIsMobile();
  const [threads, setThreads] = useState<MessageThreadType[]>(mockMessageThreads);
  const [activeThreadId, setActiveThreadId] = useState<string | undefined>();
  const [showWallet, setShowWallet] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const [monetizationEnabled, setMonetizationEnabled] = useState(false);
  const [encryptionEnabled, setEncryptionEnabled] = useState(true);
  const [sessionKeys, setSessionKeys] = useState<Record<string, string>>({});
  const [showThreadList, setShowThreadList] = useState(true);
  const [swipeStartY, setSwipeStartY] = useState<number | null>(null);
  
  const { toast } = useToast();
  const { triggerHaptic } = useHapticFeedback();
  const messageEndRef = useRef<HTMLDivElement>(null);
  
  const activeThread = threads.find(thread => thread.id === activeThreadId);
  
  // Générer ou récupérer la clé de session pour le thread actif
  useEffect(() => {
    if (activeThreadId && !sessionKeys[activeThreadId]) {
      const newSessionKey = generateSessionKey();
      setSessionKeys(prev => ({
        ...prev,
        [activeThreadId]: newSessionKey
      }));
    }
  }, [activeThreadId]);

  // Scroll to latest message when thread changes or new messages arrive
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    
    // If a thread is selected on mobile, hide thread list
    if (isMobile && activeThreadId) {
      setShowThreadList(false);
    }
  }, [activeThread?.messages, activeThreadId]);

  const handleSendMessage = async (content: string, to: string) => {
    if (!activeThreadId || !content.trim()) return;
    
    triggerHaptic('medium');
    
    let finalContent = content;
    let isEncrypted = false;
    
    // Chiffrer le message si l'option est activée
    if (encryptionEnabled && activeThreadId && sessionKeys[activeThreadId]) {
      try {
        const encryptedData = await encryptMessage(content, sessionKeys[activeThreadId]);
        finalContent = JSON.stringify(encryptedData);
        isEncrypted = true;
      } catch (error) {
        console.error('Erreur de chiffrement:', error);
        toast({
          title: "Échec du chiffrement",
          description: "Le message sera envoyé non chiffré.",
          variant: "destructive",
        });
      }
    }
    
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      senderId: userId,
      senderName: userName,
      senderAvatar: userAvatar,
      recipientId: activeThread?.participants.filter(p => p !== userId) || [],
      content: finalContent,
      type: 'text',
      timestamp: new Date().toISOString(),
      status: 'sent',
      isEncrypted,
      monetization: monetizationEnabled ? {
        tier: 'basic',
        price: 1.99,
        currency: 'USD',
        instantPayoutEnabled: true,
        accessControl: {
          isGated: true,
          requiredTier: 'basic'
        },
        analytics: {
          views: 0,
          revenue: 0,
          conversionRate: 0,
          engagementTime: 0
        }
      } : undefined,
      emotional: {
        primaryEmotion: 'neutral',
        intensity: 50,
        threadMapping: []
      }
    };
    
    // Update threads with new message
    setThreads(prev => 
      prev.map(thread => 
        thread.id === activeThreadId 
          ? { ...thread, messages: [...thread.messages, newMessage], lastActivity: newMessage.timestamp }
          : thread
      )
    );
  };
  
  const handleThreadClick = (threadId: string) => {
    setActiveThreadId(threadId);
    triggerHaptic('light');
  };
  
  const backToThreadList = () => {
    setActiveThreadId(undefined);
    setShowThreadList(true);
    triggerHaptic('light');
  };
  
  // Handle swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setSwipeStartY(e.touches[0].clientY);
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (swipeStartY && activeThreadId) {
      const endY = e.changedTouches[0].clientY;
      const diffY = endY - swipeStartY;
      
      // Swipe down to close conversation
      if (diffY > 100) {
        backToThreadList();
      }
    }
    
    setSwipeStartY(null);
  };

  return (
    <div 
      className={cn(
        "bg-black text-white h-full flex flex-col",
        className
      )}
    >
      {/* Thread List View */}
      <AnimatePresence mode="wait">
        {showThreadList ? (
          <motion.div 
            key="thread-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col"
          >
            <ScrollArea className="flex-1">
              <div className="space-y-1 p-2">
                {threads.map(thread => {
                  const otherParticipant = thread.participants.find(p => p !== userId);
                  const lastMessage = thread.messages[thread.messages.length - 1];
                  const timeAgo = getTimeAgo(new Date(thread.lastActivity));
                  const isUnread = Math.random() > 0.7; // Simulate unread for demo
                  
                  return (
                    <motion.div 
                      key={thread.id}
                      className={cn(
                        "flex items-center p-3 rounded-xl",
                        "bg-gray-900/30 border border-white/5 backdrop-blur-sm",
                        "hover:bg-gray-800/50 cursor-pointer"
                      )}
                      whileHover={{ scale: 0.99 }}
                      onClick={() => handleThreadClick(thread.id)}
                    >
                      {/* Avatar with status */}
                      <div className="relative mr-3">
                        <Avatar className="h-12 w-12 border-2 border-transparent">
                          <AvatarImage src={`https://i.pravatar.cc/100?u=${otherParticipant}`} />
                          <AvatarFallback className="bg-gray-800 text-white">
                            {otherParticipant?.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className={cn(
                          "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-black",
                          Math.random() > 0.5 ? "bg-green-500" : "bg-gray-500"
                        )} />
                      </div>
                      
                      {/* Message info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <p className="font-medium truncate">
                            {thread.name || `User_${otherParticipant}`}
                          </p>
                          <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">
                            {timeAgo}
                          </span>
                        </div>
                        
                        <div className="flex items-center">
                          {lastMessage?.isEncrypted && (
                            <Lock className="h-3 w-3 text-green-500 mr-1" />
                          )}
                          
                          {lastMessage?.type === 'text' ? (
                            <p className={cn(
                              "text-xs truncate",
                              isUnread ? "text-white" : "text-gray-400"
                            )}>
                              {lastMessage.content}
                            </p>
                          ) : (
                            <div className="flex items-center text-xs text-purple-400">
                              <Camera className="h-3 w-3 mr-1" />
                              <span>Appuyez pour voir</span>
                            </div>
                          )}
                          
                          {isUnread && (
                            <div className="ml-2 h-2 w-2 bg-purple-500 rounded-full" />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </ScrollArea>
          </motion.div>
        ) : null}
      </AnimatePresence>
      
      {/* Conversation View */}
      <AnimatePresence mode="wait">
        {!showThreadList && activeThread ? (
          <motion.div 
            key="conversation"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30 }}
            className="absolute inset-0 bg-black flex flex-col"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Conversation header */}
            <div className="px-4 py-3 flex items-center border-b border-white/10">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full mr-2" 
                onClick={backToThreadList}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              
              <div className="flex-1 flex items-center">
                <Avatar className="h-8 w-8 mr-3">
                  <AvatarImage src={`https://i.pravatar.cc/100?u=${activeThread.participants.find(p => p !== userId)}`} />
                  <AvatarFallback className="bg-gray-800">
                    {activeThread.participants.find(p => p !== userId)?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <p className="font-medium leading-tight">
                    {activeThread.name || `User_${activeThread.participants.find(p => p !== userId)}`}
                  </p>
                  <p className="text-xs text-gray-400">Online now</p>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                  <Video className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Messages */}
            <ScrollArea className="flex-1 px-4 pt-4 pb-20">
              <MessageThread
                messages={activeThread.messages} 
                currentUserId={userId}
                sessionKey={sessionKeys[activeThread.id]}
              />
              <div ref={messageEndRef} />
            </ScrollArea>
            
            {/* Input area */}
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gray-950 border-t border-white/10">
              <MessageInput
                onSendMessage={(content) => handleSendMessage(content, 'text')}
                isComposing={isComposing}
                setIsComposing={setIsComposing}
                monetizationEnabled={monetizationEnabled}
                onToggleMonetization={() => setMonetizationEnabled(!monetizationEnabled)}
                monetizationTier={'basic'}
                setMonetizationTier={() => {}}
                monetizationAmount={1.99}
                setMonetizationAmount={() => {}}
              />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      
      {/* Empty state when no thread is selected */}
      {!showThreadList && !activeThread && (
        <div className="flex-1 flex flex-col items-center justify-center">
          <MessageSquare className="h-16 w-16 text-gray-700 mb-4" />
          <p className="text-gray-500">Sélectionnez une conversation</p>
        </div>
      )}
    </div>
  );
};

// Helper function to display relative time
function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  
  if (diffSec < 60) return `${diffSec}s`;
  
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m`;
  
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h`;
  
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return `${diffDay}j`;
  
  return date.toLocaleDateString();
}

export default MessageCenter;
