// Railway Authentication Service
import railwayApi from './railwayApi';

// User interface (matching railwayApi User interface)
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
}

// API Response interface
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  user?: User;
  token?: string;
  session?: {
    accessToken?: string;
  };
  message?: string;
  error?: string;
}

// User session interface compatible with existing code
export interface RailwaySession {
  access_token: string;
  user: User;
  expires_at?: number;
}

// Custom event types for auth state changes
export type AuthEvent = 
  | 'SIGNED_IN' 
  | 'SIGNED_OUT' 
  | 'TOKEN_REFRESHED' 
  | 'USER_UPDATED' 
  | 'PASSWORD_RECOVERY';

// Auth state change callback type
export type AuthChangeCallback = (event: AuthEvent, session: RailwaySession | null) => void;

// Input validation helpers
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): { isValid: boolean; message: string } => {
  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters long' };
  }
  return { isValid: true, message: 'Password is valid' };
};

// In-memory session storage (could be enhanced with persistence)
let currentSession: RailwaySession | null = null;
let authCallbacks: Set<AuthChangeCallback> = new Set();

// Helper to create session from API response
const createSession = (apiResponse: ApiResponse<any>): RailwaySession | null => {
  const token = apiResponse.token || apiResponse.data?.token || apiResponse.session?.accessToken;
  const user = apiResponse.user || apiResponse.data?.user;
  
  if (apiResponse.success && token && user) {
    return {
      access_token: token,
      user: user,
      expires_at: Date.now() + (24 * 60 * 60 * 1000), // 24 hours from now
    };
  }
  return null;
};

// Helper to notify auth callbacks
const notifyAuthChange = (event: AuthEvent, session: RailwaySession | null) => {
  authCallbacks.forEach(callback => {
    try {
      callback(event, session);
    } catch (error) {
      console.error('Error in auth state callback:', error);
    }
  });
};

// Helper to initialize session from stored token
const initializeSession = async (): Promise<RailwaySession | null> => {
  const token = localStorage.getItem('railway_token');
  if (!token) return null;

  try {
    // Set token in API client
    railwayApi.setToken(token);
    
    // Get current user to validate token
    const userResponse = await railwayApi.getCurrentUser();
    
    if (userResponse.success && userResponse.user) {
      const session: RailwaySession = {
        access_token: token,
        user: userResponse.user,
        expires_at: Date.now() + (24 * 60 * 60 * 1000),
      };
      currentSession = session;
      return session;
    } else {
      // Token is invalid, clear it
      localStorage.removeItem('railway_token');
      railwayApi.clearToken();
      return null;
    }
  } catch (error) {
    console.error('Error initializing session:', error);
    localStorage.removeItem('railway_token');
    railwayApi.clearToken();
    return null;
  }
};

export const railwayAuth = {
  // Sign up with email and password
  signUp: async (email: string, password: string, options?: { firstName?: string; lastName?: string }) => {
    // Validate inputs
    if (!validateEmail(email)) {
      return { data: null, error: { message: 'Invalid email format' } };
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return { data: null, error: { message: passwordValidation.message } };
    }

    try {
      const result = await railwayApi.signUp({
        email, 
        password, 
        firstName: options?.firstName, 
        lastName: options?.lastName
      });

      if (result.success) {
        const session = createSession(result);
        if (session) {
          currentSession = session;
          notifyAuthChange('SIGNED_IN', session);
        }
        return { 
          data: { 
            user: result.user, 
            session 
          }, 
          error: null 
        };
      } else {
        return { 
          data: null, 
          error: { message: result.error || 'Registration failed' } 
        };
      }
    } catch (error: any) {
      return { 
        data: null, 
        error: { message: error.message || 'Authentication service error' } 
      };
    }
  },

  // Sign in with email and password
  signInWithPassword: async (email: string, password: string) => {
    // Validate inputs
    if (!validateEmail(email)) {
      return { data: null, error: { message: 'Invalid email format' } };
    }

    if (!password || password.length === 0) {
      return { data: null, error: { message: 'Password is required' } };
    }

    try {
      const result = await railwayApi.signIn({ email, password });

      if (result.success) {
        const session = createSession(result);
        if (session) {
          currentSession = session;
          notifyAuthChange('SIGNED_IN', session);
        }
        return { 
          data: { 
            user: result.user, 
            session 
          }, 
          error: null 
        };
      } else {
        return { 
          data: null, 
          error: { message: result.error || 'Login failed' } 
        };
      }
    } catch (error: any) {
      return { 
        data: null, 
        error: { message: error.message || 'Authentication service error' } 
      };
    }
  },

  // Sign in with OAuth provider
  signInWithProvider: async (provider: 'google' | 'github') => {
    try {
      const result = await railwayApi.signInWithOAuth({ provider });

      if (result.success) {
        const session = createSession(result);
        if (session) {
          currentSession = session;
          notifyAuthChange('SIGNED_IN', session);
        }
        return { 
          data: { 
            user: result.user, 
            session 
          }, 
          error: null 
        };
      } else {
        return { 
          data: null, 
          error: { message: result.error || 'OAuth login failed' } 
        };
      }
    } catch (error: any) {
      return { 
        data: null, 
        error: { message: error.message || 'OAuth authentication service error' } 
      };
    }
  },

  // Sign out
  signOut: async () => {
    try {
      const result = await railwayApi.signOut();
      
      // Clear session regardless of API response
      currentSession = null;
      notifyAuthChange('SIGNED_OUT', null);
      
      if (result.success) {
        return { error: null };
      } else {
        return { error: { message: result.error || 'Logout failed' } };
      }
    } catch (error: any) {
      // Clear session even if API call fails
      currentSession = null;
      notifyAuthChange('SIGNED_OUT', null);
      return { error: { message: error.message || 'Sign out error' } };
    }
  },

  // Get current user
  getUser: async () => {
    try {
      if (currentSession) {
        return { 
          data: { user: currentSession.user }, 
          error: null 
        };
      }
      
      // Try to initialize session from stored token
      const session = await initializeSession();
      if (session) {
        return { 
          data: { user: session.user }, 
          error: null 
        };
      }
      
      return { 
        data: { user: null }, 
        error: null 
      };
    } catch (error: any) {
      return { 
        data: { user: null }, 
        error: { message: error.message || 'Error getting current user' } 
      };
    }
  },

  // Listen to auth state changes
  onAuthStateChange: (callback: AuthChangeCallback) => {
    authCallbacks.add(callback);
    
    // Return subscription object with unsubscribe method
    return {
      data: {
        subscription: {
          unsubscribe: () => {
            authCallbacks.delete(callback);
          }
        }
      }
    };
  },

  // Get current session
  getSession: async () => {
    try {
      if (currentSession) {
        return { 
          data: { session: currentSession }, 
          error: null 
        };
      }
      
      // Try to initialize session from stored token
      const session = await initializeSession();
      
      return { 
        data: { session }, 
        error: null 
      };
    } catch (error: any) {
      return { 
        data: { session: null }, 
        error: { message: error.message || 'Error getting session' } 
      };
    }
  },

  // Refresh session (for compatibility)
  refreshSession: async () => {
    try {
      // For Railway, we just validate the current token
      if (currentSession) {
        const userResponse = await railwayApi.getCurrentUser();
        
        if (userResponse.success && userResponse.user) {
          // Update user data in session
          currentSession.user = userResponse.user;
          notifyAuthChange('TOKEN_REFRESHED', currentSession);
          
          return { 
            data: { 
              session: currentSession, 
              user: currentSession.user 
            }, 
            error: null 
          };
        }
      }
      
      // If no current session or validation failed, try to initialize
      const session = await initializeSession();
      
      return { 
        data: { 
          session, 
          user: session?.user || null 
        }, 
        error: null 
      };
    } catch (error: any) {
      return { 
        data: { session: null, user: null }, 
        error: { message: error.message || 'Error refreshing session' } 
      };
    }
  },

  // Initialize authentication on app start
  initialize: async () => {
    try {
      const session = await initializeSession();
      if (session) {
        currentSession = session;
        // Don't notify here to avoid duplicate events on app start
      }
      return session;
    } catch (error) {
      console.error('Error initializing auth:', error);
      return null;
    }
  }
};

// Backward compatibility aliases
export const auth = railwayAuth;
