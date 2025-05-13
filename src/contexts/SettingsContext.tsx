
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SettingsContextProps {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  motionReduced: boolean;
  setMotionReduced: (reduced: boolean) => void;
  hapticFeedback: boolean;
  setHapticFeedback: (enabled: boolean) => void;
}

const SettingsContext = createContext<SettingsContextProps | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [motionReduced, setMotionReduced] = useState(false);
  const [hapticFeedback, setHapticFeedback] = useState(true);

  const value = {
    theme,
    setTheme,
    motionReduced,
    setMotionReduced,
    hapticFeedback,
    setHapticFeedback
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
