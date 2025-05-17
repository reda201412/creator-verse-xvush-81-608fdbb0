import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Paperclip, Plus, Smile, Wallet } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/components/ui/use-toast"
import { toast } from 'sonner';
import {
  createMessage,
  getMessages,
  getMessageThread,
  createThread,
  getThreadsForUser,
  ExtendedFirestoreMessageThread,
  FirestoreMessage,
  uploadFile,
  deleteFile,
  updateThread,
} from '@/utils/messaging-utils';
import MessageThread from '@/components/messaging/MessageThread';
import SecureMessageBubble from '@/components/messaging/SecureMessageBubble';
import EphemeralIndicator from '@/components/messaging/EphemeralIndicator';
import WalletPanel from '@/components/messaging/WalletPanel';
import EmotionalInsights from '@/components/messaging/EmotionalInsights';

interface MessageCenterProps {
  className?: string;
}

const MessageCenter = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [threads, setThreads] = useState<ExtendedFirestoreMessageThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<ExtendedFirestoreMessageThread | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const [showEmotionalInsights, setShowEmotionalInsights] = useState(false);
  const [monetizationTier, setMonetizationTier] = useState<'free' | 'premium'>('free');
  const [monetizationAmount, setMonetizationAmount] = useState<number>(0);
  const [isEphemeral, setIsEphemeral] = useState(false);
  const [ephemeralDuration, setEphemeralDuration] = useState(5);
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [sessionKey, setSessionKey] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [walletBalance, setWalletBalance] = useState(15.20);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;

    const fetchThreads = async () => {
      setIsLoading(true);
      try {
        const userThreads = await getThreadsForUser(user.uid);
        setThreads(userThreads);
      } catch (err) {
        setError('Failed to load messages.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchThreads();
  }, [user]);

  useEffect(() => {
    if (selectedThread) {
      const unsubscribe = getMessageThread(selectedThread.id, (updatedThread) => {
        setSelectedThread(updatedThread);
      });

      return () => unsubscribe();
    }
  }, [selectedThread]);

  const handleSelectThread = async (thread: ExtendedFirestoreMessageThread) => {
    setSelectedThread(thread);
  };

  const handleNewMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    if (!user || !selectedThread) return;

    setIsLoading(true);
    try {
      let messageContent: string | { url: string; name: string } = newMessage;

      if (file) {
        setIsUploading(true);
        const uploadResult = await uploadFile(file, setUploadProgress);

        if (uploadResult && uploadResult.url) {
          messageContent = { url: uploadResult.url, name: file.name };
          setFile(null);
        } else {
          throw new Error('File upload failed');
        }
      }

      const messageData: FirestoreMessage = {
        senderId: user.uid,
        senderAvatar: user.photoURL || '',
        content: messageContent,
        timestamp: new Date(),
        isEncrypted: isEncrypted,
        isEphemeral: isEphemeral,
        ephemeralDuration: isEphemeral ? ephemeralDuration : null,
      };

      await createMessage(selectedThread.id, messageData);
      setNewMessage('');
      setIsEphemeral(false);
      setEphemeralDuration(5);
      setIsEncrypted(false);
      setUploadProgress(0);
      toast({
        title: "Message sent!",
        description: "Your message has been successfully delivered.",
      })
    } catch (err) {
      setError('Failed to send message.');
      console.error(err);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your message.",
      })
    } finally {
      setIsLoading(false);
      setIsUploading(false);
    }
  };

  const handleCreateThread = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const newThread = await createThread(user.uid);
      setThreads(prevThreads => [...prevThreads, newThread]);
      setSelectedThread(newThread);
      toast({
        title: "New thread created!",
        description: "Start messaging now.",
      })
    } catch (err) {
      setError('Failed to create new thread.');
      console.error(err);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Could not create new thread.",
      })
    } finally {
      setIsLoading(false);
    }
  };

  const handleWalletToggle = () => {
    setShowWallet(!showWallet);
  };

  const handleEmotionalInsightsToggle = () => {
    setShowEmotionalInsights(!showEmotionalInsights);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
    }
  };

  const handleRemoveFile = async () => {
    if (file && selectedThread) {
      setIsLoading(true);
      try {
        await deleteFile(file.name);
        setFile(null);
        toast({
          title: "File removed!",
          description: "The attached file has been removed.",
        })
      } catch (err) {
        setError('Failed to remove file.');
        console.error(err);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Could not remove the file.",
        })
      } finally {
        setIsLoading(false);
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [selectedThread]);

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
                  {thread.participants && thread.participants.length > 0 ? (
                    <div className="flex items-center space-x-2">
                      {thread.participants
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
                  {selectedThread.participants && selectedThread.participants.length > 0 ? (
                    <div className="flex items-center space-x-2">
                      {selectedThread.participants
                        .filter(participantId => participantId !== user?.uid)
                        .map(participantId => (
                          <Avatar key={participantId} className="h-8 w-8">
                            <AvatarImage src={`https://i.pravatar.cc/150?u=${participantId}`} />
                            <AvatarFallback>{participantId.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                        ))}
                      <span className="text-lg font-semibold">
                        {selectedThread.participants
                          .filter(participantId => participantId !== user?.uid)
                          .map(participantId => `User ${participantId}`).join(', ')}
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
                    messages={selectedThread.messages || []}
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
                onFocus={() => setIsComposing(true)}
                onBlur={() => setIsComposing(false)}
              />
              <Button variant="secondary" size="icon" onClick={handleWalletToggle}>
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
              <EmotionalInsights messages={selectedThread.messages} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MessageCenter;
