
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Paperclip, Plus, Smile, Wallet } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/components/ui/use-toast";
import {
  fetchUserThreads,
  fetchMessagesForThread,
  sendMessage,
  markMessagesAsRead,
  ExtendedFirestoreMessageThread
} from '@/utils/messaging-utils';
import MessageThread from '@/components/messaging/MessageThread';
import EmotionalInsights from '@/components/messaging/EmotionalInsights';
import { Message, FirestoreMessage } from '@/types/messaging';

const MessageCenter = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [threads, setThreads] = useState<ExtendedFirestoreMessageThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<ExtendedFirestoreMessageThread | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showEmotionalInsights, setShowEmotionalInsights] = useState(false);
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [sessionKey] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;

    const fetchThreads = async () => {
      setIsLoading(true);
      try {
        const userThreads = await fetchUserThreads(user.uid);
        setThreads(userThreads);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchThreads();
  }, [user]);

  useEffect(() => {
    if (selectedThread) {
      // This would be replaced with actual subscription logic
      const loadMessages = async () => {
        try {
          const { messages } = await fetchMessagesForThread(selectedThread.id);
          setSelectedThread(prev => prev ? { ...prev, messages } : null);
        } catch (err) {
          console.error(err);
        }
      };

      loadMessages();
      markMessagesAsRead(selectedThread.id, user?.uid || '');
    }
  }, [selectedThread?.id, user?.uid]);

  const handleSelectThread = async (thread: ExtendedFirestoreMessageThread) => {
    setSelectedThread(thread);
  };

  const handleNewMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    if (!user || !selectedThread || !newMessage.trim()) return;

    setIsLoading(true);
    try {
      await sendMessage({
        threadId: selectedThread.id,
        senderId: user.uid,
        content: newMessage,
        isEncrypted: isEncrypted,
        messageType: 'text'
      });

      setNewMessage('');
      setIsEncrypted(false);
      
      // Refresh messages
      const { messages } = await fetchMessagesForThread(selectedThread.id);
      setSelectedThread(prev => prev ? { ...prev, messages } : null);
      
      toast({
        title: "Message sent!",
        description: "Your message has been successfully delivered."
      });
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Error sending message",
        description: "Failed to send message. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateThread = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // In a real app, this would create an actual thread
      const newThread: ExtendedFirestoreMessageThread = {
        id: `new-thread-${Date.now()}`,
        participantIds: [user.uid],
        lastActivity: new Date(),
        messages: [],
        name: `New Thread ${Date.now()}`
      };
      
      setThreads(prevThreads => [...prevThreads, newThread]);
      setSelectedThread(newThread);
      
      toast({
        title: "New thread created!",
        description: "Start messaging now."
      });
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Error creating thread",
        description: "Failed to create new thread. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmotionalInsightsToggle = () => {
    setShowEmotionalInsights(!showEmotionalInsights);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setUploadProgress(0);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedThread?.messages]);

  // Convert FirestoreMessages to Messages for display
  const convertToMessages = (firestoreMessages: FirestoreMessage[] = []): Message[] => {
    return firestoreMessages.map(msg => ({
      id: msg.id,
      content: msg.content,
      senderId: msg.senderId,
      senderName: `User ${msg.senderId.substring(0, 5)}`,
      timestamp: msg.createdAt?.toDate?.() || new Date(),
      status: 'delivered',
      isEncrypted: msg.isEncrypted
    }));
  };

  return (
    <div className="flex flex-row h-full">
      <div className="w-64 border-r overflow-y-auto">
        <Card>
          <CardHeader>
            <CardTitle>Messages</CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <Button variant="outline" className="w-full mb-4" onClick={handleCreateThread} disabled={isLoading}>
              Nouveau Message
            </Button>
            <ScrollArea className="h-[calc(100vh-200px)]">
              {threads.map(thread => (
                <div
                  key={thread.id}
                  className={`p-2 rounded-md cursor-pointer hover:bg-secondary ${selectedThread?.id === thread.id ? 'bg-secondary/50' : ''}`}
                  onClick={() => handleSelectThread(thread)}
                >
                  {thread.participantIds && thread.participantIds.length > 0 ? (
                    <div className="flex items-center space-x-2">
                      {thread.participantIds
                        .filter(participantId => participantId !== user?.uid)
                        .map(participantId => (
                          <Avatar key={participantId} className="h-6 w-6">
                            <AvatarImage src={`https://i.pravatar.cc/150?u=${participantId}`} />
                            <AvatarFallback>{participantId.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                        ))}
                      <span className="text-sm">Thread ID: {thread.id}</span>
                    </div>
                  ) : (
                    <span className="text-sm">Nouveau message</span>
                  )}
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
      
      {selectedThread && (
        <>
          <div className="flex-1 p-4 flex flex-col">
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>
                  {selectedThread.participantIds && selectedThread.participantIds.length > 0 ? (
                    <div className="flex items-center space-x-2">
                      {selectedThread.participantIds
                        .filter(participantId => participantId !== user?.uid)
                        .map(participantId => (
                          <Avatar key={participantId} className="h-8 w-8">
                            <AvatarImage src={`https://i.pravatar.cc/150?u=${participantId}`} />
                            <AvatarFallback>{participantId.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                        ))}
                      <span className="text-lg font-semibold">
                        {selectedThread.participantIds
                          .filter(participantId => participantId !== user?.uid)
                          .map(participantId => `User ${participantId.substring(0, 5)}`).join(', ')}
                      </span>
                    </div>
                  ) : (
                    'Nouveau message'
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <ScrollArea className="h-[calc(100vh-300px)]">
                  <MessageThread
                    messages={convertToMessages(selectedThread.messages)}
                    currentUserId={user?.uid || ''}
                    sessionKey={sessionKey}
                  />
                  <div ref={messagesEndRef} />
                </ScrollArea>
              </CardContent>
            </Card>

            <div className="mt-4 flex items-center">
              <Input
                type="text"
                placeholder="Écrire un message..."
                value={newMessage}
                onChange={handleNewMessageChange}
                className="mr-2"
              />
              <Button variant="secondary" size="icon" onClick={() => setIsEncrypted(!isEncrypted)}>
                <Wallet size={16} />
              </Button>
              <Button variant="secondary" size="icon" onClick={handleEmotionalInsightsToggle}>
                <Smile size={16} />
              </Button>
              <label htmlFor="upload-file">
                <Input
                  type="file"
                  id="upload-file"
                  className="hidden"
                  onChange={handleFileSelect}
                />
                <Button variant="secondary" size="icon" disabled={isUploading}>
                  <Paperclip size={16} />
                </Button>
              </label>
              <Button onClick={handleSendMessage} disabled={isLoading || isUploading}>
                <Send size={16} />
              </Button>
            </div>
            {file && (
              <div className="mt-2 p-2 bg-muted rounded-md flex items-center justify-between">
                <p className="text-sm">{file.name}</p>
                <div className="flex items-center">
                  {isUploading && (
                    <progress value={uploadProgress} max="100" className="mr-2"></progress>
                  )}
                  <Button variant="ghost" size="icon" onClick={handleRemoveFile}>
                    <Plus className="rotate-45" size={16} />
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          {showEmotionalInsights && (
            <div className="w-72 border-l overflow-y-auto">
              <EmotionalInsights messages={convertToMessages(selectedThread.messages)} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MessageCenter;
