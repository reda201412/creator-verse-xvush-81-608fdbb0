import React, { createContext, useState, useContext, useEffect } from 'react';
import { BrowserRouter, useNavigate } from 'react-router-dom';

interface AuthContextProps {
  user: any;
  profile: any;
  loading: boolean;
  isLoading: boolean;
  isCreator: boolean; // ADD THIS LINE
  login: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProviderInner: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isCreator, setIsCreator] = useState(false); // ADD THIS LINE
  const navigate = useNavigate();

  useEffect(() => {
    setIsCreator(profile?.role === 'creator');
  }, [profile]);

  const login = () => {
    setUser({ id: 'test-user' });
    setProfile({ name: 'Test User', role: 'creator' }); //Set role to creator for testing
    setIsCreator(true);
    console.log("Before navigate()");
    navigate('/');
    console.log("After navigate()");
  };

  const value: AuthContextProps = {
    user,
    profile,
    loading,
    isLoading: loading,
    isCreator: isCreator, // ADD THIS LINE
    login,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  return (
    <BrowserRouter>
      <AuthProviderInner>
        {children}
      </AuthProviderInner>
    </BrowserRouter>
  );
};
