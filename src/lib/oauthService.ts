import { API_ENDPOINTS } from './api';

interface OAuthResponse {
  data?: {
    url?: string;
    token?: string;
  };
  error?: {
    message: string;
  };
}

export const oauthService = {
  signInWithGoogle: async (): Promise<OAuthResponse> => {
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.OAUTH.GOOGLE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider: 'google',
          redirectTo: `${window.location.origin}/auth/callback`
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to initiate OAuth');
      }

      if (!data.success || !data.url) {
        throw new Error(data.message || 'Invalid response from OAuth service');
      }

      // Navigate to the authorization URL
      window.location.href = data.url;
      
      // This code will never be reached due to the redirect
      return { data };
    } catch (error: any) {
      console.error('Failed to initiate Google OAuth:', error);
      return {
        error: {
          message: error.message || 'Failed to initiate Google OAuth'
        }
      };
    }
  },

  handleCallback: async (code: string): Promise<OAuthResponse> => {
    try {
      const REDIRECT_URI = window.location.origin + '/auth/callback';
      
      const response = await fetch(API_ENDPOINTS.AUTH.OAUTH.CALLBACK, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          redirect_uri: REDIRECT_URI,
        }),
      });

      const data = await response.json();
      console.log('Callback response:', { data, status: response.status });

      if (!response.ok) {
        console.error('Callback failed:', { status: response.status, data });
        throw new Error(data.message || 'OAuth callback failed');
      }

      // Validate the token
      if (!data.token) {
        console.error('No token in response:', data);
        throw new Error('No token received from server');
      }

      console.log('Storing tokens...');
      
      // Store tokens for both auth systems
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('railway_token', data.token);
      localStorage.setItem('authTokenTimestamp', String(Date.now()));

      return { data };
    } catch (error: any) {
      // Clear any existing auth data on error
      localStorage.removeItem('authToken');
      localStorage.removeItem('authTokenTimestamp');
      
      console.error('OAuth callback error:', error);
      return {
        error: {
          message: error.message || 'Failed to complete authentication'
        }
      };
    }
  }
};
