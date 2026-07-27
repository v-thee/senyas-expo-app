import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type PreAuthStep = 'splash' | 'landing' | 'login' | 'assessment' | 'done';

interface AuthContextType {
  authStep: PreAuthStep;
  setAuthStep: (step: PreAuthStep) => void;
  logout: () => Promise<void>;
  isLoading: boolean;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authStep, setAuthStep] = useState<PreAuthStep>('splash');
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        setAuthStep('done');
      } else {
        setAuthStep('splash');
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setAuthStep('splash');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(['userToken', 'userData', 'userLRN']);
      setAuthStep('splash');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        authStep, 
        setAuthStep, 
        logout, 
        isLoading,
        checkAuthStatus 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}