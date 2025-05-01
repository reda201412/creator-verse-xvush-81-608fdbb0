
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import MessageCenter from '@/components/messaging/MessageCenter';
import { useIsMobile } from '@/hooks/use-mobile';

const Messages = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [isCreatorMode, setIsCreatorMode] = useState(false);

  const toggleCreatorMode = () => {
    setIsCreatorMode(!isCreatorMode);
    toast({
      title: isCreatorMode ? "Mode visiteur activé" : "Mode créateur activé",
      description: isCreatorMode ? "Vous voyez maintenant vos messages comme un visiteur." : "Vous voyez maintenant vos messages comme un créateur.",
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 px-4 py-6 md:px-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link to="/" className="hover:opacity-80">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft size={20} />
              </Button>
            </Link>
            <h1 className="text-2xl font-semibold">Messagerie</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size={isMobile ? "sm" : "default"}
              onClick={toggleCreatorMode}
              className="text-xs md:text-sm"
            >
              {isCreatorMode ? "Mode visiteur" : "Mode créateur"}
            </Button>
            
            <Link to="/settings">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Settings size={20} />
              </Button>
            </Link>
          </div>
        </header>
        
        <MessageCenter 
          userId={isCreatorMode ? "creator_id" : "visitor_id"}
          userName={isCreatorMode ? "Julie Sky" : "Visiteur"}
          userAvatar={isCreatorMode 
            ? "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?crop=faces&w=200&h=200"
            : "https://i.pravatar.cc/300?img=50"
          }
          className="w-full shadow-xl"
          isCreator={isCreatorMode}
        />
      </div>
    </div>
  );
};

export default Messages;
