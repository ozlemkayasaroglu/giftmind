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
          redirectTo: `${window.location.origin}/auth/callback`,
        }),
      });

      // Try parse JSON, fallback to text for debugging
      let data: any = null;
      let rawText: string | null = null;
      try {
        data = await response.json();
      } catch (jsonErr) {
        try {
          rawText = await response.text();
        } catch (textErr) {
          rawText = null;
        }
      }

      console.log('Initiate OAuth response:', { status: response.status, statusText: response.statusText, data, rawText });

      if (!response.ok) {
        const serverMessage = (data && data.message) || rawText || response.statusText || `HTTP ${response.status}`;
        throw new Error(serverMessage || 'Failed to initiate OAuth');
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
          message: error.message || 'Failed to initiate Google OAuth',
        },
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

      // Try to parse JSON, but fall back to text for debugging non-JSON responses
      let data: any = null;
      let rawText: string | null = null;
      try {
        data = await response.json();
      } catch (jsonErr) {
        try {
          rawText = await response.text();
        } catch (textErr) {
          rawText = null;
        }
      }

      console.log('Callback response:', { data, rawText, status: response.status, statusText: response.statusText });

      if (!response.ok) {
        // Surface server message or raw text to help debugging
        const serverMessage = (data && data.message) || rawText || response.statusText || `HTTP ${response.status}`;
        console.error('Callback failed:', { status: response.status, serverMessage, data, rawText });
        throw new Error(serverMessage || 'OAuth callback failed');
      }

      // Validate the token
      const token = data?.token;
      if (!token) {
        console.error('No token in response:', data, rawText);
        throw new Error('No token received from server');
      }

      console.log('Storing tokens...');

      // Store tokens for both auth systems
      localStorage.setItem('authToken', token);
      localStorage.setItem('railway_token', token);
      localStorage.setItem('authTokenTimestamp', String(Date.now()));

      return { data };
    } catch (error: any) {
      // Clear any existing auth data on error
      localStorage.removeItem('authToken');
      localStorage.removeItem('authTokenTimestamp');

      console.error('OAuth callback error:', error);
      return {
        error: {
          message: error.message || 'Failed to complete authentication',
        },
      };
    }
  }
};
