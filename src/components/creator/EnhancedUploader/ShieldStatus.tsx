import React from 'react';
import { ShieldStatus as ShieldStatusType } from './types';

interface ShieldStatusProps {
  status: ShieldStatusType;
  className?: string;
}

export const ShieldStatus: React.FC<ShieldStatusProps> = ({ 
  status,
  className = '' 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'warning': return 'Avertissement';
      case 'error': return 'Erreur';
      default: return 'Inactif';
    }
  };
  
  const getShieldIcon = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 15.67 2 11.225 2 6c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'warning':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'error':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0110 1.944 11.954 11.954 0 0117.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 15.67 2 11.225 2 6c0-.682.057-1.35.166-2.001z" clipRule="evenodd" />
          </svg>
        );
    }
  };
  
  const shields = [
    { id: 'encryption', label: 'Chiffrement', status: status.encryption },
    { id: 'watermark', label: 'Filigrane', status: status.watermark },
    { id: 'drm', label: 'Protection DRM', status: status.drm },
  ];

  return (
    <div className={`bg-muted/50 rounded-lg p-4 ${className}`}>
      <h4 className="text-sm font-medium mb-3 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-primary" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0110 1.944 11.954 11.954 0 0117.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 15.67 2 11.225 2 6c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        Protection TRIPLE SHIELD
      </h4>
      
      <div className="grid grid-cols-3 gap-2">
        {shields.map((shield) => (
          <div 
            key={shield.id}
            className={`flex flex-col items-center p-3 rounded-md transition-colors ${
              shield.status === 'active' 
                ? 'bg-green-50 dark:bg-green-900/20' 
                : shield.status === 'warning'
                ? 'bg-yellow-50 dark:bg-yellow-900/20'
                : shield.status === 'error'
                ? 'bg-red-50 dark:bg-red-900/20'
                : 'bg-muted/30'
            }`}
          >
            <div className={`mb-1 ${getStatusColor(shield.status)}`}>
              {getShieldIcon(shield.status)}
            </div>
            <div className="text-xs font-medium text-center">
              {shield.label}
            </div>
            <div className={`text-[10px] mt-0.5 ${getStatusColor(shield.status)}`}>
              {getStatusText(shield.status)}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-3 text-xs text-muted-foreground">
        <p>Votre contenu est protégé par notre système TRIPLE SHIELD avancé.</p>
      </div>
    </div>
  );
};
