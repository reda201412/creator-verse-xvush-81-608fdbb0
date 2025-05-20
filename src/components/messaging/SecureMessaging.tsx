
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useConversation } from '@/contexts/ConversationContext';
import { toast } from 'sonner';
import { db } from '@/firebase';
import { FirestoreMessage, FirestoreMessageThread, ExtendedFirestoreMessageThread } from '@/vite-env';
import { useInfiniteQuery } from '@tanstack/react-query';

// Mock firebase/functions
const getFunctions = () => ({});
const httpsCallable = () => async (...args) => ({ data: { messages: [], newLastVisibleDoc: null } });

// Mock scroll listener hook
const useBottomScrollListener = (ref, callback) => {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = element;
      if (scrollHeight - scrollTop <= clientHeight + 100) {
        callback();
      }
    };
    
    element.addEventListener('scroll', handleScroll);
    return () => element.removeEventListener('scroll', handleScroll);
  }, [ref, callback]);
};

interface Props {
  selectedConversation?: ExtendedFirestoreMessageThread | null;
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
  
  // Fetch more messages function
  const fetchMoreMessages = async () => {
    if (!selectedConversation || isLoadingMore) return;
    
    setIsLoadingMore(true);
    
    try {
      // Fetch more messages from the backend      
      const result = await httpsCallable(getFunctions(), 'getMoreMessages')(selectedConversation.id);
      
      if (result.data.messages.length === 0) {
        setHasMoreMessages(false);
        return;
      }
      
      // Update the lastVisibleDoc reference from the result
      setLastVisibleDoc(result.data.newLastVisibleDoc);
      
      const newMessages: FirestoreMessage[] = result.data.messages.map((doc: any) => ({
        id: doc.id,
        ...doc.data
      }));
      
      setMessages(prevMessages => [...prevMessages, ...newMessages]);
      setHasMoreMessages(result.data.messages.length >= 10);
    } catch (error) {
      console.error("Error fetching more messages:", error);
      toast.error("Impossible de charger plus de messages");
    } finally {
      setIsLoadingMore(false);
    }
  };
  
  // Scroll listener to load more messages when near the bottom
  useBottomScrollListener(bottomBoundaryRef, fetchMoreMessages);
  
  useEffect(() => {
    if (selectedConversation) {
      setIsGated(selectedConversation.isGated);
      if (selectedConversation.messages) {
        setMessages(selectedConversation.messages);
      }
    }
  }, [selectedConversation]);
  
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Vous devez être connecté pour envoyer un message");
      return;
    }
    
    if (!selectedConversation) {
      toast.error("Aucune conversation sélectionnée");
      return;
    }
    
    if (!input.trim()) {
      return;
    }
    
    try {
      const newMessage: Omit<FirestoreMessage, 'id'> = {
        senderId: user.id || user.uid,
        content: input,
        type: 'text',
        createdAt: new Date(),
        sender_name: user.username || user.email,
        sender_avatar: user.profileImageUrl || null,
      };
      
      // Add the message to the UI immediately
      const tempId = `temp_${Date.now()}`;
      const tempMessage = { ...newMessage, id: tempId };
      setMessages(prev => [...prev, tempMessage as FirestoreMessage]);
      
      // Mock API call for sending message
      setTimeout(() => {
        // Update the message list with the "server" message
        const serverMessage = { ...newMessage, id: `msg_${Date.now()}` };
        setMessages(prev => prev.map(m => m.id === tempId ? serverMessage as FirestoreMessage : m));
        
        // Update conversation
        if (selectedConversation && updateConversation) {
          updateConversation(selectedConversation.id, {
            lastActivity: new Date(),
            lastMessageText: input,
            lastMessageSenderId: user.id || user.uid,
          });
        }
      }, 500);
      
      setInput('');
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Impossible d'envoyer le message");
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4" ref={bottomBoundaryRef}>
        {isGated && isPremiumContent && (
          <div className="text-center text-red-500 mb-4">
            This is a premium conversation. Unlock to view messages.
          </div>
        )}
        {messages
          .sort((a, b) => {
            const aTime = a.createdAt?.seconds ? a.createdAt.seconds : (new Date(a.createdAt)).getTime() / 1000;
            const bTime = b.createdAt?.seconds ? b.createdAt.seconds : (new Date(b.createdAt)).getTime() / 1000;
            return bTime - aTime;
          })
          .map(message => (
          <div
            key={message.id}
            className={`mb-2 p-2 rounded-lg ${
              message.senderId === (user?.id || user?.uid) 
                ? 'bg-blue-100 ml-auto text-right' 
                : 'bg-gray-100 mr-auto text-left'
            }`}
          >
            <div className="text-sm text-gray-600">{message.sender_name}</div>
            <div>{message.content}</div>
          </div>
        ))}
        {isLoadingMore && <div className="text-center">Loading more messages...</div>}
        {!hasMoreMessages && <div className="text-center">No more messages</div>}
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
