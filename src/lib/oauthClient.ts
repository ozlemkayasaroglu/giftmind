const API_BASE_URL = "https://giftmind-be-production.up.railway.app";

interface OAuthResponse {
  success: boolean;
  url?: string;
  token?: string;
  message?: string;
  error?: string;
}

export const oauthClient = {
  async signInWithOAuth(provider: string): Promise<OAuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/oauth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          provider: provider.toLowerCase(),
          redirectTo: 'http://localhost:5173/auth/callback' // Hardcoded for testing
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: OAuthResponse = await response.json();
      
      if (data.success && data.url) {
        return data;
      } else {
        throw new Error(data.message || 'OAuth login failed');
      }
    } catch (error: any) {
      console.error('OAuth login error:', error);
      return {
        success: false,
        error: error.message || 'Failed to initiate OAuth login'
      };
    }
  },

  async handleCallback(code: string, state: string): Promise<OAuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/oauth/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, state }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: OAuthResponse = await response.json();

      if (data.success && data.token) {
        // Store the token for both Railway API compatibility and OAuth
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('railway_token', data.token);
        return data;
      } else {
        throw new Error(data.message || 'OAuth callback failed');
      }
    } catch (error: any) {
      console.error('OAuth callback error:', error);
      return {
        success: false,
        error: error.message || 'Failed to complete OAuth login'
      };
    }
  }
};

export default oauthClient;
