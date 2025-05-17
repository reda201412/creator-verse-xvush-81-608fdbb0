
/**
 * Utilitaire de chiffrement pour les messages et contenus exclusifs
 * Utilise une approche de chiffrement côté client pour garantir la confidentialité
 */

// Interface pour le contenu chiffré
export interface EncryptedContent {
  data: string;
  iv: string;
  salt: string;
  timestamp: number;
}

// Générer une clé à partir d'un mot de passe et sel
export const deriveKey = async (password: string, salt: Uint8Array): Promise<CryptoKey> => {
  const encoder = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  
  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
};

// Chiffrer un message
export const encryptMessage = async (message: string, password: string): Promise<EncryptedContent> => {
  try {
    const encoder = new TextEncoder();
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const key = await deriveKey(password, salt);
    
    const encryptedData = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv
      },
      key,
      encoder.encode(message)
    );
    
    return {
      data: arrayBufferToBase64(encryptedData),
      iv: arrayBufferToBase64(iv),
      salt: arrayBufferToBase64(salt),
      timestamp: Date.now()
    };
  } catch (error) {
    console.error('Erreur lors du chiffrement:', error);
    throw new Error('Échec du chiffrement du message');
  }
};

// Déchiffrer un message
export const decryptMessage = async (
  encryptedContent: EncryptedContent,
  password: string
): Promise<string> => {
  try {
    const { data, iv, salt } = encryptedContent;
    const decoder = new TextDecoder();
    
    const saltArray = base64ToArrayBuffer(salt);
    const key = await deriveKey(password, new Uint8Array(saltArray));
    
    const decryptedData = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: new Uint8Array(base64ToArrayBuffer(iv))
      },
      key,
      base64ToArrayBuffer(data)
    );
    
    return decoder.decode(decryptedData);
  } catch (error) {
    console.error('Erreur lors du déchiffrement:', error);
    throw new Error('Échec du déchiffrement du message');
  }
};

// Utilitaires de conversion
const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const binaryString = window.atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

// Générer une clé de session unique pour chaque conversation
export const generateSessionKey = (): string => {
  const randomArray = window.crypto.getRandomValues(new Uint8Array(32));
  return arrayBufferToBase64(randomArray.buffer);
};

// Vérifier si un contenu est chiffré
export const isEncrypted = (content: any): boolean => {
  return content && 
    typeof content === 'object' && 
    'data' in content && 
    'iv' in content &&
    'salt' in content;
};

// Signature du chiffrement pour vérifier l'intégrité
export const createSignature = async (content: string, key: string): Promise<string> => {
  const encoder = new TextEncoder();
  const keyData = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(key),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await window.crypto.subtle.sign(
    'HMAC',
    keyData,
    encoder.encode(content)
  );
  
  return arrayBufferToBase64(signature);
};

// Vérifier la signature
export const verifySignature = async (
  content: string,
  signature: string,
  key: string
): Promise<boolean> => {
  const encoder = new TextEncoder();
  const keyData = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(key),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );
  
  return window.crypto.subtle.verify(
    'HMAC',
    keyData,
    base64ToArrayBuffer(signature),
    encoder.encode(content)
  );
};
