
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Camera, ArrowLeft, Phone, Video, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import useHapticFeedback from '@/hooks/use-haptic-feedback';
import MessageCenter from './MessageCenter';
import { Button } from '@/components/ui/button';

const SecureMessaging: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'all' | 'unread' | 'stories' | 'pending'>('all');
  const [isCreatorMode, setIsCreatorMode] = useState(false);
  const { toast } = useToast();
  const { triggerHaptic } = useHapticFeedback();
  
  const handleTabChange = (tab: 'all' | 'unread' | 'stories' | 'pending') => {
    setCurrentTab(tab);
    triggerHaptic('light');
  };
  
  const toggleCreatorMode = () => {
    setIsCreatorMode(!isCreatorMode);
    triggerHaptic('medium');
    toast({
      title: isCreatorMode ? "Mode visiteur activé" : "Mode créateur activé",
      description: isCreatorMode ? "Vous voyez maintenant vos messages comme un visiteur." : "Vous voyez maintenant vos messages comme un créateur.",
    });
  };

  return (
    <div className="bg-black min-h-screen text-white">
      <div className="max-w-md mx-auto h-screen flex flex-col">
        {/* Header with tabs */}
        <header className="pt-6 px-4 pb-2 backdrop-blur-lg bg-black/80 border-b border-white/10 sticky top-0 z-10">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">Messages</h1>
            <Button 
              variant="ghost" 
              size="sm"
              className={cn(
                "text-xs font-medium px-3 py-1 rounded-full",
                isCreatorMode ? "bg-purple-500/20 text-purple-400" : "bg-white/10"
              )}
              onClick={toggleCreatorMode}
            >
              {isCreatorMode ? "Mode Créateur" : "Mode Visiteur"}
            </Button>
          </div>
          
          {/* Tab navigation */}
          <div className="flex space-x-1 pb-1">
            {[
              { id: 'all', label: 'Tout' },
              { id: 'unread', label: 'Non lu' },
              { id: 'stories', label: 'Stories' },
              { id: 'pending', label: 'Sans réponse' }
            ].map((tab) => (
              <Button
                key={tab.id}
                variant="ghost"
                size="sm"
                className={cn(
                  "flex-1 rounded-full text-xs py-1.5",
                  currentTab === tab.id 
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:text-white"
                )}
                onClick={() => handleTabChange(tab.id as any)}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <MessageCenter
                userId={isCreatorMode ? "creator_id" : "visitor_id"}
                userName={isCreatorMode ? "Julie Sky" : "Visiteur"}
                userAvatar={isCreatorMode 
                  ? "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?crop=faces&w=200&h=200"
                  : "https://i.pravatar.cc/300?img=50"
                }
                isCreator={isCreatorMode}
                className="h-full"
              />
            </motion.div>
          </AnimatePresence>
        </main>
        
        {/* Floating action button for camera */}
        <div className="fixed bottom-20 right-6">
          <Button
            size="icon"
            className="h-14 w-14 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg shadow-purple-500/20"
            onClick={() => {
              triggerHaptic('medium');
              toast({
                title: "Appareil photo",
                description: "Fonctionnalité à venir",
              });
            }}
          >
            <Camera className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SecureMessaging;
