// Simple encryption utilities for the message system
// This is a simplified implementation for demonstration purposes

export interface EncryptedContent {
  data: string;
  iv: string;
  salt: string;
}

// Check if a message content is encrypted
export const isEncrypted = (content: any): boolean => {
  if (typeof content === 'string' && content.startsWith('{') && content.includes('"data":')) {
    try {
      const parsed = JSON.parse(content);
      return !!(parsed.data && parsed.iv && parsed.salt);
    } catch (e) {
      return false;
    }
  }
  
  return typeof content === 'object' && 
    content !== null && 
    'data' in content && 
    'iv' in content && 
    'salt' in content;
};

// Encrypt a message using the session key
export const encryptMessage = async (message: string, sessionKey: string): Promise<EncryptedContent> => {
  // In a real implementation, this would use the Web Crypto API
  // For this demo, we'll just do a simple base64 encoding with the key
  
  // Create a faux "salt" and "iv" for demo purposes
  const salt = Math.random().toString(36).substring(2, 15);
  const iv = Date.now().toString(36);
  
  // Simple XOR "encryption" with the key and salt (NOT secure, just for demo)
  const simpleEncrypt = (text: string, key: string): string => {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const keyChar = key.charCodeAt(i % key.length);
      result += String.fromCharCode(text.charCodeAt(i) ^ keyChar);
    }
    return btoa(result); // Base64 encode
  };
  
  const encryptedData = simpleEncrypt(message, sessionKey + salt);
  
  return {
    data: encryptedData,
    iv,
    salt
  };
};

// Decrypt a message using the session key
export const decryptMessage = async (encryptedContent: EncryptedContent, sessionKey: string): Promise<string> => {
  // In a real implementation, this would use the Web Crypto API
  // For this demo, we'll just reverse the simple encoding
  
  // Simple XOR "decryption" (corresponds to the encryption above)
  const simpleDecode = (encoded: string, key: string): string => {
    const text = atob(encoded); // Base64 decode
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const keyChar = key.charCodeAt(i % key.length);
      result += String.fromCharCode(text.charCodeAt(i) ^ keyChar);
    }
    return result;
  };
  
  try {
    return simpleDecode(encryptedContent.data, sessionKey + encryptedContent.salt);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt message');
  }
};

// Create a conversation utility for creating conversations
export const createNewConversationWithCreator = async ({
  userId,
  userName,
  userAvatar,
  creatorId,
  creatorName,
  creatorAvatar
}: {
  userId: string;
  userName: string;
  userAvatar: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string | null;
}): Promise<{ success: boolean; threadId?: string }> => {
  // Simulate creating a new conversation
  console.log(`Creating conversation between ${userName} (${userId}) and ${creatorName} (${creatorId})`);
  
  return new Promise(resolve => {
    setTimeout(() => {
      const threadId = `thread-${Date.now()}`;
      resolve({
        success: true,
        threadId
      });
    }, 1000);
  });
};

/**
 * Generates a new secure session key for encrypted messaging
 * @returns A Promise that resolves to a secure random string for use as session key
 */
export const generateSessionKey = async (): Promise<string> => {
  // Generate a random array of 32 bytes (256 bits)
  const randomBytes = new Uint8Array(32);
  crypto.getRandomValues(randomBytes);
  
  // Convert to base64 string for storage and transmission
  return btoa(String.fromCharCode(...randomBytes));
};
