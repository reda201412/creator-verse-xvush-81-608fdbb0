
import React, { useState, useEffect, useRef } from 'react';
// Import encryption utilities directly with aliases to avoid conflict
import { 
  encryptMessage, 
  decryptMessage,
  // Avoid importing generateSessionKey from here
} from '@/utils/encryption';
// Import generateSessionKey from dedicated utilities to avoid conflict
import { generateSessionKey } from '@/utils/exclusive-content-utils';

const MessageCenter = () => {
  const [encryptionKeys, setEncryptionKeys] = useState<Record<string, string>>({});
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Fetch messages when component mounts
    fetchMessages();
  }, []);
  
  useEffect(() => {
    // Scroll to bottom when messages change
    scrollToBottom();
  }, [messages]);
  
  const fetchMessages = async () => {
    setLoading(true);
    try {
      // Mock API call to fetch messages
      const response = await new Promise(resolve => {
        setTimeout(() => {
          resolve([
            { id: '1', content: 'Hello there!', sender: 'user1', timestamp: new Date().toISOString() },
            { id: '2', content: 'Hi! How are you?', sender: 'user2', timestamp: new Date().toISOString() },
          ]);
        }, 1000);
      });
      
      setMessages(response as any[]);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    const messageId = `msg_${Date.now()}`;
    const messageContent = newMessage;
    
    // Add message to UI immediately (optimistic update)
    const newMessageObj = {
      id: messageId,
      content: messageContent,
      sender: 'currentUser', // Replace with actual user ID
      timestamp: new Date().toISOString(),
      pending: true
    };
    
    setMessages(prev => [...prev, newMessageObj]);
    setNewMessage('');
    
    try {
      // Encrypt message if needed
      const encryptedContent = await handleEncryptMessage(messageId, messageContent);
      
      // Send message to server (mock API call)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update message status after successful send
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, pending: false, sent: true } 
            : msg
        )
      );
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Mark message as failed
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, pending: false, error: true } 
            : msg
        )
      );
    }
  };
  
  // Fix the issue with async generateSessionKey by making sure it's called correctly
  const handleEncrypt = (messageId: string) => {
    // Generate a new session key for this message - not async anymore
    const newKey = generateSessionKey();
    
    // Update encryption keys with the new key
    setEncryptionKeys(prev => ({
      ...prev,
      [messageId]: newKey
    }));
    
    // Return the key for further use
    return newKey;
  };
  
  // Fix async issue in other functions that use encryption
  const handleEncryptMessage = async (messageId: string, content: string) => {
    const key = handleEncrypt(messageId);
    
    // Update encryption keys synchronously
    setEncryptionKeys(prev => ({
      ...prev,
      [messageId]: key
    }));
    
    // Return the encrypted content
    return content; // For demo, we're not actually encrypting
  };
  
  const handleDecryptMessage = async (messageId: string, encryptedContent: any) => {
    const key = encryptionKeys[messageId];
    if (!key) return '[Encrypted message]';
    
    try {
      return await decryptMessage(encryptedContent, key);
    } catch (error) {
      console.error('Error decrypting message:', error);
      return '[Encrypted message]';
    }
  };
  
  const renderMessages = () => {
    if (loading) {
      return <div className="loading">Loading messages...</div>;
    }
    
    if (messages.length === 0) {
      return <div className="empty-state">No messages yet</div>;
    }
    
    return (
      <div className="messages-container">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`message ${message.sender === 'currentUser' ? 'sent' : 'received'}`}
          >
            <div className="message-content">
              {message.content}
              {message.pending && <span className="pending-indicator">Sending...</span>}
              {message.error && <span className="error-indicator">Failed to send</span>}
            </div>
            <div className="message-timestamp">
              {new Date(message.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    );
  };
  
  return (
    <div className="message-center">
      <div className="threads-sidebar">
        <h2>Conversations</h2>
        <div className="thread-list">
          {/* Thread list would go here */}
          <div className="thread-item active">
            <div className="thread-avatar"></div>
            <div className="thread-info">
              <div className="thread-name">John Doe</div>
              <div className="thread-preview">Latest message...</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="message-area">
        <div className="message-header">
          <h3>John Doe</h3>
        </div>
        
        <div className="message-list">
          {renderMessages()}
        </div>
        
        <form className="message-input" onSubmit={handleSendMessage}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default MessageCenter;
