import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { railwayAuth, type RailwaySession, type User } from '../lib/railwayAuth';

// Define the shape of our auth context
interface AuthContextType {
  user: User | null;
  session: RailwaySession | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ data: any; error: any }>;
  register: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{ data: any; error: any }>;
  logout: () => Promise<{ error: any }>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider component props
interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<RailwaySession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await railwayAuth.getSession();
        if (error) {
          console.error('Error getting initial session:', error);
        } else {
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth state changes
    const { data: { subscription } } = railwayAuth.onAuthStateChange(
      async (event: string, session: RailwaySession | null) => {
        console.log('Auth state changed:', event, session);
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Handle different auth events
        switch (event) {
          case 'SIGNED_IN':
            console.log('User signed in');
            break;
          case 'SIGNED_OUT':
            console.log('User signed out');
            break;
          case 'TOKEN_REFRESHED':
            console.log('Token refreshed');
            break;
          case 'USER_UPDATED':
            console.log('User updated');
            break;
          case 'PASSWORD_RECOVERY':
            console.log('Password recovery');
            break;
          default:
            break;
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await railwayAuth.signInWithPassword(email, password);
      
      if (result.error) {
        console.error('Login error:', result.error);
      } else {
        console.log('Login successful');
      }
      
      return result;
    } catch (error) {
      console.error('Login exception:', error);
      return { data: null, error: { message: 'Login failed' } };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (email: string, password: string, firstName?: string, lastName?: string) => {
    setLoading(true);
    try {
      const result = await railwayAuth.signUp(email, password, { firstName, lastName });
      
      if (result.error) {
        console.error('Registration error:', result.error);
      } else {
        console.log('Registration successful');
      }
      
      return result;
    } catch (error) {
      console.error('Registration exception:', error);
      return { data: null, error: { message: 'Registration failed' } };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    try {
      const result = await railwayAuth.signOut();
      
      if (result.error) {
        console.error('Logout error:', result.error);
      } else {
        console.log('Logout successful');
        // Clear local state immediately
        setUser(null);
        setSession(null);
      }
      
      return result;
    } catch (error) {
      console.error('Logout exception:', error);
      return { error: { message: 'Logout failed' } };
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value: AuthContextType = {
    user,
    session,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
