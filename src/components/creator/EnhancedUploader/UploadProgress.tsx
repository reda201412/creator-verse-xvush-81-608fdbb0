import React, { useEffect, useState } from 'react';
import { useUploader } from './UploaderContext';

export const UploadProgress: React.FC<{ progress?: number }> = ({ progress: externalProgress }) => {
  const { progress: contextProgress, stage } = useUploader();
  const [displayProgress, setDisplayProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initialisation...');
  
  // Use external progress if provided, otherwise use context
  const actualProgress = externalProgress !== undefined ? externalProgress : contextProgress;
  
  // Smooth animation for progress bar
  useEffect(() => {
    if (actualProgress === 0) {
      setDisplayProgress(0);
      return;
    }
    
    const timer = setTimeout(() => {
      setDisplayProgress(actualProgress);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [actualProgress]);
  
  // Update status text based on stage and progress
  useEffect(() => {
    if (stage === 'uploading') {
      if (actualProgress < 20) setStatusText('Démarrage du téléversement...');
      else if (actualProgress < 40) setStatusText('Téléversement en cours...');
      else if (actualProgress < 60) setStatusText('Presque terminé...');
      else if (actualProgress < 80) setStatusText('Finalisation...');
      else setStatusText('Traitement final...');
    } else if (stage === 'processing') {
      setStatusText('Traitement de la vidéo...');
    }
  }, [actualProgress, stage]);
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm mb-1">
        <span>{statusText}</span>
        <span>{Math.round(displayProgress)}%</span>
      </div>
      
      <div className="w-full bg-muted rounded-full h-2.5">
        <div 
          className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${displayProgress}%` }}
        />
      </div>
      
      {stage === 'uploading' && actualProgress > 0 && actualProgress < 100 && (
        <p className="text-xs text-muted-foreground text-center">
          Ne quittez pas cette page pendant le téléversement
        </p>
      )}
      
      {stage === 'processing' && (
        <div className="text-center py-4">
          <div className="inline-block animate-pulse">
            <div className="flex space-x-2">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i}
                  className="w-2 h-2 bg-primary rounded-full"
                  style={{
                    animation: 'bounce 1.4s infinite ease-in-out',
                    animationDelay: `${i * 0.16}s`,
                  }}
                />
              ))}
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Votre vidéo est en cours de traitement. Cela peut prendre quelques instants...
          </p>
        </div>
      )}
    </div>
  );
};

// Add global styles for the bounce animation
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes bounce {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1); }
    }
  `;
  document.head.appendChild(style);
}
