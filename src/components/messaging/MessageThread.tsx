import React from 'react';
import { encryptMessage, decryptMessage } from '@/utils/encryption';

// Define isEncrypted function locally if needed
const isEncrypted = (message: any): boolean => {
  return message?.isEncrypted === true && 
    typeof message?.content === 'object' && 
    message?.content?.data !== undefined;
};

const MessageThread = () => {
  const [messages, setMessages] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [currentThread, setCurrentThread] = React.useState(null);
  const [encryptionKeys, setEncryptionKeys] = React.useState({});
  
  // Function to decrypt messages if they are encrypted
  const decryptMessageContent = async (message) => {
    if (!isEncrypted(message)) return message;
    
    try {
      const sessionKey = encryptionKeys[message.id];
      if (!sessionKey) {
        console.warn('No encryption key found for message:', message.id);
        return {
          ...message,
          content: '[Encrypted message - key not available]'
        };
      }
      
      const decryptedContent = await decryptMessage(message.content, sessionKey);
      return {
        ...message,
        decryptedContent,
        isDecrypted: true
      };
    } catch (error) {
      console.error('Failed to decrypt message:', error);
      return {
        ...message,
        content: '[Encryption error]'
      };
    }
  };
  
  // Function to load messages for a thread
  const loadMessages = async (threadId) => {
    if (!threadId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Fetch messages logic would go here
      const fetchedMessages = []; // Replace with actual API call
      
      // Process and decrypt messages if needed
      const processedMessages = await Promise.all(
        fetchedMessages.map(async (msg) => await decryptMessageContent(msg))
      );
      
      setMessages(processedMessages);
    } catch (err) {
      console.error('Error loading messages:', err);
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };
  
  // Function to send a new message
  const sendMessage = async (content, isEncrypted = false) => {
    if (!currentThread) return;
    
    try {
      let messageContent = content;
      let encryptionKey = null;
      
      // Encrypt the message if needed
      if (isEncrypted) {
        encryptionKey = generateRandomKey();
        messageContent = await encryptMessage(content, encryptionKey);
        
        // Store the encryption key
        setEncryptionKeys(prev => ({
          ...prev,
          [messageId]: encryptionKey
        }));
      }
      
      // Send message logic would go here
      
      // Optimistically add to UI
      const newMessage = {
        id: `temp-${Date.now()}`,
        content: messageContent,
        isEncrypted,
        senderId: 'current-user-id', // Replace with actual user ID
        createdAt: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, newMessage]);
      
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    }
  };
  
  // Helper function to generate a random key
  const generateRandomKey = () => {
    return Array.from(
      { length: 32 },
      () => Math.floor(Math.random() * 36).toString(36)
    ).join('');
  };
  
  return (
    <div className="message-thread">
      {loading && <div className="loading-indicator">Loading messages...</div>}
      {error && <div className="error-message">{error}</div>}
      
      <div className="messages-container">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`message ${message.senderId === 'current-user-id' ? 'sent' : 'received'}`}
          >
            <div className="message-content">
              {message.isDecrypted ? message.decryptedContent : message.content}
            </div>
            <div className="message-meta">
              {message.isEncrypted && <span className="encrypted-badge">🔒</span>}
              <span className="timestamp">
                {new Date(message.createdAt).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="message-input">
        {/* Message input form would go here */}
      </div>
    </div>
  );
};

export default MessageThread;
