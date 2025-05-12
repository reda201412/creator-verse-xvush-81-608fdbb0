import React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Zap, Lock, Search, Plus, UserPlus, Dot } from 'lucide-react';
import { MessageThread } from '@/types/messaging';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import CreatorSelector from './CreatorSelector';
import { createNewConversationWithCreator } from '@/utils/create-conversation-utils';
import useHapticFeedback from '@/hooks/use-haptic-feedback';
import usePresence from '@/hooks/use-presence';

interface ConversationListProps {
  threads: MessageThread[];
  userId: string;
  userName: string;
  userAvatar: string;
  onSelectThread: (threadId: string) => void;
  activeThreadId: string | null;
  userType: 'creator' | 'fan';
  onNewConversation?: () => void;
  onConversationCreated?: (threadId: string) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  threads,
  userId,
  userName,
  userAvatar,
  onSelectThread,
  activeThreadId,
  userType,
  onNewConversation,
  onConversationCreated
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreatorSelectorOpen, setIsCreatorSelectorOpen] = useState(false);
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  const { toast } = useToast();
  const { triggerHaptic } = useHapticFeedback();

  // Get all unique participant IDs (excluding current user)
const otherParticipants = Array.from(
  new Set(
    threads.flatMap(thread => thread.participants.filter(p => p !== userId))
  )
);

// Create presence map for all participants
const presenceMap = Object.fromEntries(
  otherParticipants.map(id => [id, usePresence(id)])
);

  // Filter threads based on search term
const filteredThreads = threads.filter(thread => {
  const displayName = getDisplayName(thread);
  return displayName.toLowerCase().includes(searchTerm.toLowerCase());
});

// Active threads for the top grid
const activeThreads = filteredThreads
  .sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime())
  .slice(0, 6);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  const getDisplayName = (thread: MessageThread) => {
    return thread.name || `Utilisateur_${thread.participants.find(p => p !== userId)}`;
  };

  const getAvatarUrl = (thread: MessageThread) => {
    const otherParticipant = thread.participants.find(p => p !== userId);
    return `https://i.pravatar.cc/150?u=${otherParticipant}`;
  };

  const hasUnreadMessages = (thread: MessageThread) => {
    return thread.messages.some(m => m.status !== 'read' && m.senderId !== userId);
  };

  const hasPremiumContent = (thread: MessageThread) => {
    return thread.messages.some(m => m.monetization);
  };

  const getLastMessage = (thread: MessageThread) => {
    return thread.messages[thread.messages.length - 1];
  };

  const handleNewConversation = () => {
    triggerHaptic('light');
    setIsCreatorSelectorOpen(true);
  };

  const handleCreatorSelected = async (creator: any) => {
    if (!creator || !creator.user_id || isCreatingConversation) return;

    setIsCreatingConversation(true);

    try {
      const result = await createNewConversationWithCreator({
        userId,
        userName,
        userAvatar,
        creatorId: String(creator.user_id),
        creatorName: String(creator.name || creator.username),
        creatorAvatar: `https://i.pravatar.cc/150?u=${creator.user_id}`,
      });

      if (result.success && result.threadId) {
        toast({
          title: "Conversation created",
          description: `You can now chat with ${creator.name || creator.username}`
        });

        setIsCreatorSelectorOpen(false);
        if (onConversationCreated) {
          onConversationCreated(result.threadId);
        }

        triggerHaptic('medium');
      } else {
        const errorMessage = result.error?.message || "Failed to create conversation.";
        console.error("Error creating conversation:", errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error("Error during conversation creation:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create conversation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingConversation(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search bar */}
      <div className="p-4 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            placeholder="Rechercher une conversation..."
            className="pl-9 bg-background"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          size="icon"
          variant="outline"
          onClick={handleNewConversation}
          disabled={isCreatingConversation}
        >
          {isCreatingConversation ? (
            <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
          ) : (
            <UserPlus size={18} />
          )}
        </Button>
      </div>

      {/* Active conversations grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="p-4 grid grid-cols-3 sm:grid-cols-6 gap-3"
      >
        {activeThreads.map(thread => {
          const otherParticipantId = thread.participants.find(p => p !== userId);
          const presence = otherParticipantId ? presenceMap[otherParticipantId] : null;
          
          return (
            <motion.div
              key={`grid-${thread.id}`}
              variants={itemVariants}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center"
              onClick={() => onSelectThread(thread.id)}
            >
              <div className="relative mb-2">
                <div className={cn(
                  "w-16 h-16 rounded-full overflow-hidden border-2",
                  hasPremiumContent(thread) ? "border-amber-500" : hasUnreadMessages(thread) ? "border-purple-500" : "border-white/20"
                )}>
                  <img
                    src={getAvatarUrl(thread)}
                    alt={getDisplayName(thread)}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="absolute bottom-0 right-0">
                  <div className="flex">
                    {hasUnreadMessages(thread) && (
                      <span className="w-3 h-3 bg-purple-500 rounded-full" />
                    )}
                    {hasPremiumContent(thread) && (
                      <span className="w-3 h-3 bg-amber-500 rounded-full ml-0.5">
                        <Zap size={6} className="text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="absolute top-0 right-0">
                {presence === 'online' ? <Dot className="text-green-500" size={12} /> : null}
              </div>
              <p className="text-xs truncate max-w-full text-center">{getDisplayName(thread)}</p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-2" />

      {/* Conversations list */}
      <ScrollArea className="flex-1">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="p-4 space-y-2"
        >
          {filteredThreads.map(thread => {
            const lastMessage = getLastMessage(thread);
            const isUnread = hasUnreadMessages(thread);
            const isPremium = hasPremiumContent(thread);
            const otherParticipantId = thread.participants.find(p => p !== userId);
            const presence = otherParticipantId ? presenceMap[otherParticipantId] : null;

            return (
              <motion.div
                key={`list-${thread.id}`}
                variants={itemVariants}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "p-3 rounded-xl transition-all flex items-center",
                  isUnread ? "bg-purple-900/30 border border-purple-500/30" :
                    isPremium ? "bg-amber-900/20 border border-amber-500/30" :
                      "bg-white/5 border border-white/10",
                  thread.id === activeThreadId && "ring-2 ring-white/30"
                )}
                onClick={() => onSelectThread(thread.id)}
              >
                <div className="relative mr-3">
                  <div className={cn(
                    "w-12 h-12 rounded-full overflow-hidden border",
                    isPremium ? "border-amber-500" : isUnread ? "border-purple-500" : "border-white/20"
                  )}>
                    <img
                      src={getAvatarUrl(thread)}
                      alt={getDisplayName(thread)}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className={cn(
                    "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-black",
                    presence === 'online' ? "bg-green-500" : "bg-gray-500"
                  )}></span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className={cn(
                      "font-medium truncate",
                      isUnread && "font-bold"
                    )}>
                      {getDisplayName(thread)}
                    </h3>
                    <span className="text-xs text-white/60 ml-2 whitespace-nowrap">
                      {new Date(thread.lastActivity).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="flex items-center text-sm text-white/60 truncate">
                    {lastMessage?.isEncrypted && (
                      <Lock size={10} className="text-green-400 mr-1 inline-flex" />
                    )}

                    {lastMessage?.monetization && (
                      <Zap size={10} className="text-amber-400 mr-1 inline-flex" />
                    )}

                    <span className={cn(
                      "truncate",
                      isUnread && "text-white font-medium"
                    )}>
                      {lastMessage?.content || "New conversation"}
                    </span>
                  </div>
                </div>

                <div className="ml-2 flex flex-col items-center">
                  {isUnread && (
                    <span className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center text-xs mb-1">
                      {thread.messages.filter(m => m.status !== 'read' && m.senderId !== userId).length}
                    </span>
                  )}
                  {isPremium && (
                    <span className="text-amber-400">
                      <Zap size={14} />
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}

          {filteredThreads.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <p className="text-muted-foreground mb-4">
                {searchTerm ? "No results for your search" : "No conversations found"}
              </p>
              <Button
                variant="outline"
                onClick={handleNewConversation}
                disabled={isCreatingConversation}
                className="flex items-center gap-2"
              >
                <Plus size={16} />
                New conversation
              </Button>
            </div>
          )}
        </motion.div>
      </ScrollArea>

      {/* Creator selector dialog */}
      <Dialog open={isCreatorSelectorOpen} onOpenChange={setIsCreatorSelectorOpen}>
        <DialogContent className="sm:max-w-md h-4/5 flex flex-col">
          <CreatorSelector
            onSelectCreator={handleCreatorSelected}
            onCancel={() => setIsCreatorSelectorOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConversationList;