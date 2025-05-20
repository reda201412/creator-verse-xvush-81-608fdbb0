import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useConversation } from '@/contexts/ConversationContext';
import { toast } from 'sonner';
import { db } from '@/firebase';
import { collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp, startAfter, getDocs, getDoc, doc } from 'firebase/firestore';
import { FirestoreMessage, FirestoreMessageThread } from '@/vite-env';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useTronWallet } from '@/hooks/use-tron-wallet';

const functions = getFunctions();
const getMoreMessages = httpsCallable(functions, 'getMoreMessages');

interface Props {
  selectedConversation: FirestoreMessageThread | null;
}

const SecureMessaging: React.FC<Props> = ({ selectedConversation }) => {
  const { user } = useAuth();
  const { updateConversation } = useConversation();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<FirestoreMessage[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [lastVisibleDoc, setLastVisibleDoc] = useState<any>(null);
  const bottomBoundaryRef = useRef(null);
  const [isGated, setIsGated] = useState(false);
  const [isPremiumContent, setIsPremiumContent] = useState(false);
  const { checkContentAccess } = useTronWallet();
  
  // Scroll listener to load more messages when near the bottom
  useBottomScrollListener(bottomBoundaryRef, fetchMoreMessages);
  
  useEffect(() => {
    if (selectedConversation) {
      setIsGated(selectedConversation.isGated);
    }
  }, [selectedConversation]);
  
  useEffect(() => {
    const checkIfPremium = async () => {
      if (selectedConversation?.id && isGated) {
        const hasAccess = await checkContentAccess(selectedConversation.id, 'premium');
        setIsPremiumContent(!hasAccess);
      } else {
        setIsPremiumContent(false);
      }
    };
    
    checkIfPremium();
  }, [selectedConversation, isGated, checkContentAccess]);
  
  useEffect(() => {
    if (!selectedConversation) {
      setMessages([]);
      setLastVisibleDoc(null);
      setHasMoreMessages(true);
      return;
    }
    
    const messagesRef = collection(db, 'threads', selectedConversation.id, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'desc'), limit(10));
    
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const newMessages: FirestoreMessage[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FirestoreMessage[];
      
      setMessages(newMessages);
      
      // Update the lastVisibleDoc reference
      if (snapshot.docs.length > 0) {
        setLastVisibleDoc(snapshot.docs[snapshot.docs.length - 1]);
      } else {
        setLastVisibleDoc(null);
      }
      
      setHasMoreMessages(snapshot.docs.length >= 10);
    });
    
    return () => unsubscribe();
  }, [selectedConversation]);
  
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !selectedConversation) {
      toast.error("Vous devez être connecté pour envoyer un message");
      return;
    }
    
    if (!input.trim()) {
      return;
    }
    
    try {
      const newMessage: Omit<FirestoreMessage, 'id'> = {
        senderId: user.id,
        content: input,
        type: 'text',
        createdAt: serverTimestamp(),
        sender_name: user.username || user.email,
        sender_avatar: user.profileImageUrl || null,
      };
      
      const messagesRef = collection(db, 'threads', selectedConversation.id, 'messages');
      await addDoc(messagesRef, newMessage);
      
      // Update last activity on the thread
      const threadRef = doc(db, 'threads', selectedConversation.id);
      await updateConversation(selectedConversation.id, {
        lastActivity: serverTimestamp(),
        lastMessageText: input,
        lastMessageSenderId: user.id,
      });
      
      setInput('');
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Impossible d'envoyer le message");
    }
  };

const fetchMoreMessages = async () => {
  if (!selectedConversation || isLoadingMore) return;
  
  setIsLoadingMore(true);
  
  try {
    // Fetch more messages from the backend
    
    const result = await getMoreMessages(selectedConversation.id, lastVisibleDoc);
    
    if (result.messages.length === 0) {
      setHasMoreMessages(false);
      return;
    }
    
    // Update the lastVisibleDoc reference from the result
    setLastVisibleDoc(result.newLastVisibleDoc);
    
    const newMessages: FirestoreMessage[] = result.messages.map((doc: any) => ({
      id: doc.id,
      ...doc.data
    }));
    
    setMessages(prevMessages => [...prevMessages, ...newMessages]);
    setHasMoreMessages(result.messages.length >= 10);
  } catch (error) {
    console.error("Error fetching more messages:", error);
    toast.error("Impossible de charger plus de messages");
  } finally {
    setIsLoadingMore(false);
  }
};
  
  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {isGated && isPremiumContent && (
          <div className="text-center text-red-500 mb-4">
            This is a premium conversation. Unlock to view messages.
          </div>
        )}
        {messages.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)).map(message => (
          <div
            key={message.id}
            className={`mb-2 p-2 rounded-lg ${message.senderId === user?.id ? 'bg-blue-100 ml-auto text-right' : 'bg-gray-100 mr-auto text-left'}`}
          >
            <div className="text-sm text-gray-600">{message.sender_name}</div>
            <div>{message.content}</div>
          </div>
        ))}
        {isLoadingMore && <div className="text-center">Loading more messages...</div>}
        {!hasMoreMessages && <div className="text-center">No more messages</div>}
        <div ref={bottomBoundaryRef} />
      </div>
      
      {/* Input Area */}
      <form onSubmit={sendMessage} className="p-4 bg-gray-50">
        <div className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border rounded-l-md py-2 px-3 text-black focus:outline-none"
            disabled={isGated && isPremiumContent}
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-md"
            disabled={isGated && isPremiumContent}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default SecureMessaging;
