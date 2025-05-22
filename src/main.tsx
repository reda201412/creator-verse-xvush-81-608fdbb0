
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import App from './App.tsx'
import './index.css'

// Set a timeout handler to catch any potential loading issues
const MAX_LOAD_TIME = 10000; // 10 seconds
let loadTimer: number | null = null;

const initializeApp = () => {
  try {
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
    
    // Clear the timeout once the app loads successfully
    if (loadTimer) {
      clearTimeout(loadTimer);
      loadTimer = null;
    }
  } catch (error) {
    console.error('Error initializing app:', error);
  }
};

// Set a timeout to detect long loading times
loadTimer = window.setTimeout(() => {
  console.warn('Application initialization is taking longer than expected');
}, MAX_LOAD_TIME) as unknown as number;

// Ensure the DOM is ready before mounting React
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
