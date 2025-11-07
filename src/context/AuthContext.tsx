import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { oauthService } from '../lib/oauthService';
import { railwayApi } from '../lib/railwayApi';

interface User {
  id: string;
  email: string;
  name?: string;
  picture?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ data?: any; error?: any }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const { data, error } = await oauthService.signInWithGoogle();
      
      if (error) {
        throw new Error(error.message);
      }

      if (data?.url) {
        window.location.href = data.url; // Google'a yönlendir
      } else {
        throw new Error('No OAuth URL received');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
      throw error;
    }
  };

  // Email/password login wrapper
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await railwayApi.login(email, password);
      if ((res as any).success) {
        const u = (res as any).user ?? (res as any).data?.user ?? null;
        setUser(u);
        setLoading(false);
        return { data: res, error: null };
      }
      setLoading(false);
      return { data: null, error: { message: (res as any).error || (res as any).message || 'Login failed' } };
    } catch (err: any) {
      console.error('Login error:', err);
      setLoading(false);
      return { data: null, error: { message: err?.message || 'Login failed' } };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  const value = {
    user,
    loading,
    loginWithGoogle,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
