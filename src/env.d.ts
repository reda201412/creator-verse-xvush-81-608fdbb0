/// <reference types="vite/client" />

declare namespace NodeJS {
  interface ProcessEnv {
    // MUX
    readonly MUX_TOKEN_ID: string;
    readonly MUX_TOKEN_SECRET: string;
    readonly MUX_WEBHOOK_SIGNING_SECRET: string;
    
    // Firebase
    readonly NEXT_PUBLIC_FIREBASE_API_KEY: string;
    readonly NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: string;
    readonly NEXT_PUBLIC_FIREBASE_PROJECT_ID: string;
    readonly NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: string;
    readonly NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: string;
    readonly NEXT_PUBLIC_FIREBASE_APP_ID: string;
    readonly NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: string;
    
    // Database
    readonly DATABASE_URL: string;
    readonly DATABASE_URL_NON_POOLING: string;
    
    // Vercel
    readonly VERCEL_ENV: 'development' | 'preview' | 'production';
  }
}

// Pour les fichiers de l'API Vercel
declare namespace NodeJS {
  interface ProcessEnv {
    VERCEL_URL?: string;
  }
}

// Pour le client
declare interface Window {
  ENV: {
    NODE_ENV: 'development' | 'production';
  };
}
