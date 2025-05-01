
import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
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
  Users
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MessageThread from './MessageThread';
import MessageInput from './MessageInput';
import WalletPanel from './WalletPanel';
import MessageAnalytics from './MessageAnalytics';
import EmotionalInsights from './EmotionalInsights';
import { Message, MessageThread as MessageThreadType, MonetizationTier } from '@/types/messaging';
import { mockMessageThreads } from '@/data/mockMessages';

interface MessageCenterProps {
  userId: string;
  userName: string;
  userAvatar: string;
  className?: string;
}

const MessageCenter = ({
  userId,
  userName,
  userAvatar,
  className,
}: MessageCenterProps) => {
  const [threads, setThreads] = useState<MessageThreadType[]>(mockMessageThreads);
  const [activeThreadId, setActiveThreadId] = useState<string | undefined>(mockMessageThreads[0]?.id);
  const [showWallet, setShowWallet] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [walletBalance, setWalletBalance] = useState(125.40);
  const [isComposing, setIsComposing] = useState(false);
  const [monetizationEnabled, setMonetizationEnabled] = useState(false);
  const [monetizationTier, setMonetizationTier] = useState<MonetizationTier>('basic');
  const [monetizationAmount, setMonetizationAmount] = useState(1.99);

  const { toast } = useToast();
  const messageEndRef = useRef<HTMLDivElement>(null);
  
  const activeThread = threads.find(thread => thread.id === activeThreadId);
  
  useEffect(() => {
    // Scroll to latest message
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeThread?.messages]);
  
  const sendMessage = (content: string, type: 'text' | 'voice' | 'media') => {
    if (!activeThreadId || !content.trim()) return;
    
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      senderId: userId,
      senderName: userName,
      senderAvatar: userAvatar,
      recipientId: activeThread?.participants.filter(p => p !== userId) || [],
      content,
      type,
      timestamp: new Date().toISOString(),
      status: 'sent',
      isEncrypted: true,
      monetization: monetizationEnabled ? {
        tier: monetizationTier,
        price: monetizationAmount,
        currency: 'USD',
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
    
    // Show a toast if this was a monetized message
    if (monetizationEnabled) {
      toast({
        title: "Message monétisé",
        description: `Votre message est maintenant disponible au tarif ${monetizationAmount}€ (${monetizationTier}).`,
      });
    }
    
    // Reset monetization for next message
    setMonetizationEnabled(false);
  };
  
  const toggleWallet = () => {
    setShowWallet(!showWallet);
    if (showAnalytics) setShowAnalytics(false);
  };
  
  const toggleAnalytics = () => {
    setShowAnalytics(!showAnalytics);
    if (showWallet) setShowWallet(false);
  };
  
  const toggleMonetization = () => {
    setMonetizationEnabled(!monetizationEnabled);
    if (!monetizationEnabled) {
      toast({
        title: "Monétisation activée",
        description: `Ce message sera monétisé à ${monetizationAmount}€ (${monetizationTier}).`,
      });
    }
  };

  return (
    <div className={cn(
      "glass-card rounded-2xl overflow-hidden shadow-lg flex flex-col",
      "h-[600px] md:h-[700px] relative",
      className
    )}>
      {/* Header with tabs for different message categories */}
      <div className="bg-background/50 backdrop-blur-sm border-b border-border/20 p-3">
        <Tabs defaultValue="direct" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="direct" className="flex items-center gap-2">
              <MessageSquare size={16} />
              <span className="text-sm hidden sm:inline">Direct</span>
            </TabsTrigger>
            <TabsTrigger value="groups" className="flex items-center gap-2">
              <Users size={16} />
              <span className="text-sm hidden sm:inline">Groupes</span>
            </TabsTrigger>
            <TabsTrigger value="vip" className="flex items-center gap-2">
              <Shield size={16} />
              <span className="text-sm hidden sm:inline">VIP</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2 mt-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn(
                "h-8 w-8 p-0 rounded-full", 
                showWallet && "bg-primary/10 text-primary"
              )}
              onClick={toggleWallet}
            >
              <Zap size={16} />
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn(
                "h-8 w-8 p-0 rounded-full", 
                showAnalytics && "bg-primary/10 text-primary"
              )}
              onClick={toggleAnalytics}
            >
              <ChevronDown size={16} />
            </Button>
          </div>
        </Tabs>
      </div>
      
      <div className="flex flex-grow overflow-hidden">
        {/* Thread list sidebar */}
        <div className="w-1/3 border-r border-border/20 hidden md:block">
          <ScrollArea className="h-full">
            {threads.map(thread => (
              <div 
                key={thread.id}
                className={cn(
                  "p-3 border-b border-border/10 hover:bg-primary/5 cursor-pointer",
                  thread.id === activeThreadId && "bg-primary/10",
                  thread.isGated && "relative"
                )}
                onClick={() => setActiveThreadId(thread.id)}
              >
                {thread.isGated && (
                  <div className="absolute top-2 right-2">
                    <Lock size={12} className="text-muted-foreground" />
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img 
                      src={thread.participants[0] !== userId ? 
                        `https://i.pravatar.cc/40?u=${thread.participants[0]}` : 
                        `https://i.pravatar.cc/40?u=${thread.participants[1]}`} 
                      alt="Avatar" 
                      className="w-8 h-8 rounded-full object-cover" 
                    />
                    <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></span>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between">
                      <p className="font-medium text-sm truncate">
                        {thread.name || `User_${thread.participants.find(p => p !== userId)}`}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {new Date(thread.lastActivity).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {thread.messages[thread.messages.length - 1]?.content || "New conversation"}
                      {thread.messages[thread.messages.length - 1]?.monetization && " 💰"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>
        
        {/* Active conversation */}
        <div className="flex-1 flex flex-col">
          {activeThread ? (
            <>
              <div className="p-3 border-b border-border/20 bg-background/50 backdrop-blur-sm flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img 
                      src={`https://i.pravatar.cc/40?u=${activeThread.participants.find(p => p !== userId)}`} 
                      alt="Avatar" 
                      className="w-8 h-8 rounded-full object-cover" 
                    />
                    <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {activeThread.name || `User_${activeThread.participants.find(p => p !== userId)}`}
                    </p>
                    <p className="text-xs text-muted-foreground">En ligne maintenant</p>
                  </div>
                </div>
                
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <ChevronRight size={18} />
                </Button>
              </div>
              
              <ScrollArea className="flex-1">
                <div className="p-4">
                  <MessageThread 
                    messages={activeThread.messages} 
                    currentUserId={userId} 
                  />
                  <div ref={messageEndRef} />
                </div>
              </ScrollArea>
              
              <div className="p-3 border-t border-border/20 bg-background/50 backdrop-blur-sm">
                <MessageInput 
                  onSendMessage={(content) => sendMessage(content, 'text')}
                  isComposing={isComposing}
                  setIsComposing={setIsComposing}
                  monetizationEnabled={monetizationEnabled}
                  onToggleMonetization={toggleMonetization}
                  monetizationTier={monetizationTier}
                  setMonetizationTier={setMonetizationTier}
                  monetizationAmount={monetizationAmount}
                  setMonetizationAmount={setMonetizationAmount}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center flex-col gap-4">
              <MessageSquare size={64} className="text-muted-foreground/40" />
              <p className="text-muted-foreground text-center">
                Sélectionnez une conversation pour commencer à discuter
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Collapsible wallet panel */}
      <AnimatePresence>
        {showWallet && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-border/20 bg-background/50 backdrop-blur-sm"
          >
            <WalletPanel 
              balance={walletBalance}
              currency="€"
              onClose={() => setShowWallet(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Collapsible analytics panel */}
      <AnimatePresence>
        {showAnalytics && activeThread && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-border/20 bg-background/50 backdrop-blur-sm"
          >
            <Tabs defaultValue="analytics" className="w-full p-3">
              <TabsList>
                <TabsTrigger value="analytics">Revenus</TabsTrigger>
                <TabsTrigger value="emotional">Emotional AI</TabsTrigger>
              </TabsList>
              <TabsContent value="analytics" className="mt-3">
                <MessageAnalytics threadId={activeThread.id} />
              </TabsContent>
              <TabsContent value="emotional" className="mt-3">
                <EmotionalInsights threadId={activeThread.id} />
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MessageCenter;
