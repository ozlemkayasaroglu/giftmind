// OAuth service placeholder
interface OAuthResponse {
  data?: { token?: string } | null;
  error?: { message?: string } | null;
}

export const oauthService = {
  handleCallback: async (_code: string): Promise<OAuthResponse> => {
    // OAuth callback implementation will be added here
    return { data: null, error: null };
  },
};
