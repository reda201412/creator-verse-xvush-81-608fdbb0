import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import App from './App.tsx'
import './index.css'
import { initializeFirestore } from './lib/firebase-admin';
import './lib/firebase'; // Importer Firebase pour s'assurer de son initialisation

// Initialiser Firebase Firestore
initializeFirestore().catch(error => {
  console.error('Failed to initialize Firestore:', error);
});

// Ensure the DOM is ready before mounting React
document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error('Root element not found');
    return;
  }
  
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
