
import React from 'react';
import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Zap, Lock } from 'lucide-react';
import { MessageThread } from '@/types/messaging';

interface ConversationListProps {
  threads: MessageThread[];
  userId: string;
  onSelectThread: (threadId: string) => void;
  activeThreadId: string | null;
}

const ConversationList: React.FC<ConversationListProps> = ({
  threads,
  userId,
  onSelectThread,
  activeThreadId
}) => {
  // Conversations avec activité récente pour la grille du haut
  const activeThreads = threads
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

  // Obtenir un nom d'affichage pour chaque conversation
  const getDisplayName = (thread: MessageThread) => {
    return thread.name || `Utilisateur_${thread.participants.find(p => p !== userId)}`;
  };

  // Obtenir l'URL de l'avatar pour un thread
  const getAvatarUrl = (thread: MessageThread) => {
    const otherParticipant = thread.participants.find(p => p !== userId);
    return `https://i.pravatar.cc/150?u=${otherParticipant}`;
  };

  // Vérifier si une conversation contient des messages non lus
  const hasUnreadMessages = (thread: MessageThread) => {
    return thread.messages.some(m => m.status !== 'read' && m.senderId !== userId);
  };

  // Vérifier si une conversation contient du contenu premium
  const hasPremiumContent = (thread: MessageThread) => {
    return thread.messages.some(m => m.monetization);
  };

  // Obtenir le dernier message d'une conversation
  const getLastMessage = (thread: MessageThread) => {
    return thread.messages[thread.messages.length - 1];
  };

  return (
    <div className="flex flex-col h-full">
      {/* Grille des conversations actives */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="p-4 grid grid-cols-3 sm:grid-cols-6 gap-3"
      >
        {activeThreads.map(thread => (
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
              
              {/* Indicateurs de statut et de contenu premium */}
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
            <p className="text-xs truncate max-w-full text-center">{getDisplayName(thread)}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Ligne de séparation avec dégradé */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-2" />

      {/* Liste des conversations */}
      <ScrollArea className="flex-1">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="p-4 space-y-2"
        >
          {threads.map(thread => {
            const lastMessage = getLastMessage(thread);
            const isUnread = hasUnreadMessages(thread);
            const isPremium = hasPremiumContent(thread);
            
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
                    Math.random() > 0.3 ? "bg-green-500" : "bg-gray-500"
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
                      {new Date(thread.lastActivity).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
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
                      {lastMessage?.content || "Nouvelle conversation"}
                    </span>
                  </div>
                </div>
                
                {/* Indicateurs à droite */}
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
        </motion.div>
      </ScrollArea>
    </div>
  );
};

export default ConversationList;
