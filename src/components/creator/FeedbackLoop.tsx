
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, Clock, Heart } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface FeedbackMessage {
  id: string;
  username: string;
  avatar?: string;
  message: string;
  timestamp: string;
  type: 'comment' | 'request' | 'appreciation';
}

interface FeedbackLoopProps {
  feedbackMessages: FeedbackMessage[];
  className?: string;
  isCreator?: boolean;
}

const FeedbackLoop = ({ feedbackMessages = [], isCreator = false, className }: FeedbackLoopProps) => {
  const [activeTab, setActiveTab] = useState<string>('comments');
  const [newMessage, setNewMessage] = useState('');
  const { toast } = useToast();
  
  const comments = feedbackMessages.filter(msg => msg.type === 'comment');
  const requests = feedbackMessages.filter(msg => msg.type === 'request');
  const appreciation = feedbackMessages.filter(msg => msg.type === 'appreciation');
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    toast({
      title: "Message envoyé",
      description: "Votre message a bien été envoyé au créateur",
    });
    
    setNewMessage('');
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'comment': return <MessageCircle size={16} />;
      case 'request': return <Clock size={16} />;
      case 'appreciation': return <Heart size={16} />;
      default: return <MessageCircle size={16} />;
    }
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <MessageCircle className="h-6 w-6 text-primary" />
          <CardTitle>Feedback Loop</CardTitle>
        </div>
        <CardDescription>
          {isCreator 
            ? "Recevez les commentaires et demandes de vos abonnés" 
            : "Interagissez directement avec le créateur"}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="comments" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="comments" className="flex-1">
              Commentaires ({comments.length})
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex-1">
              Demandes ({requests.length})
            </TabsTrigger>
            <TabsTrigger value="appreciation" className="flex-1">
              Appréciations ({appreciation.length})
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <TabsContent value="comments" className="mt-0">
                <div className="space-y-3 max-h-[300px] overflow-y-auto p-1">
                  {comments.map(msg => (
                    <div key={msg.id} className="bg-muted/40 p-3 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-sm">{msg.username}</span>
                        <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                      </div>
                      <p className="text-sm mt-1">{msg.message}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="requests" className="mt-0">
                <div className="space-y-3 max-h-[300px] overflow-y-auto p-1">
                  {requests.map(msg => (
                    <div key={msg.id} className="bg-muted/40 p-3 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-sm">{msg.username}</span>
                        <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                      </div>
                      <p className="text-sm mt-1">{msg.message}</p>
                      {isCreator && (
                        <div className="flex justify-end gap-2 mt-2">
                          <Button size="sm" variant="outline">Décliner</Button>
                          <Button size="sm">Accepter</Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="appreciation" className="mt-0">
                <div className="space-y-3 max-h-[300px] overflow-y-auto p-1">
                  {appreciation.map(msg => (
                    <div key={msg.id} className="bg-muted/40 p-3 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-sm">{msg.username}</span>
                        <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-rose-500">
                        <Heart size={16} fill="currentColor" />
                        <p className="text-sm">{msg.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </motion.div>
          </AnimatePresence>
          
          {!isCreator && (
            <div className="mt-4 space-y-3">
              <Textarea 
                placeholder={`Écrire un ${activeTab === 'comments' ? 'commentaire' : activeTab === 'requests' ? 'demande' : 'message d\'appréciation'}...`}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="resize-none"
                rows={3}
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  {activeTab === 'requests' && "Les demandes sont traitées dans les 48h"}
                </span>
                <Button 
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="gap-2"
                >
                  {getIconForType(activeTab === 'comments' ? 'comment' : activeTab === 'requests' ? 'request' : 'appreciation')}
                  Envoyer
                </Button>
              </div>
            </div>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FeedbackLoop;
