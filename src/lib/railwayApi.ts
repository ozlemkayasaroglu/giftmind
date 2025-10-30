// Railway API Client for GiftMind
// Backend deployment: https://giftmind-be-production.up.railway.app

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://giftmind-be-production.up.railway.app';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  user?: any;
  token?: string;
  session?: {
    accessToken?: string;
  };
  message?: string;
  error?: string;
}

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Persona {
  id: string;
  name: string;
  description: string;
  age?: number;
  gender?: string;
  interests?: string[];
  personality_traits?: string[];
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

interface CreatePersonaData {
  name: string;
  description: string;
  age?: number;
  gender?: string;
  interests?: string[];
  personality_traits?: string[];
}

interface Milestone {
  id: string;
  persona_id: string;
  user_id: string;
  title: string;
  details?: string;
  category?: string;
  tags?: string[];
  occurred_at?: string; // ISO date
  created_at?: string;
  updated_at?: string;
}

interface PersonaEvent {
  id: string;
  persona_id: string;
  user_id: string;
  title: string;
  details?: string;
  category?: string;
  type?: string;
  tags?: string[];
  occurred_at?: string; // ISO date
  created_at?: string;
  updated_at?: string;
}

class RailwayAPI {
  private baseURL: string;
  private token: string | null;

  constructor() {
    this.baseURL = API_BASE_URL;
    // Read any existing token from either key
    this.token =
      localStorage.getItem('railway_token') ||
      localStorage.getItem('authToken') ||
      null;
  }

  // Helper to always get the freshest token (in case another client set it)
  getToken(): string | null {
    const latest =
      this.token ||
      localStorage.getItem('railway_token') ||
      localStorage.getItem('authToken');
    if (latest && latest !== this.token) {
      this.token = latest;
    }
    return latest || null;
  }

  // Set authentication token and persist under both keys for compatibility
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('railway_token', token);
    localStorage.setItem('authToken', token);
  }

  // Clear authentication token from both keys
  clearToken() {
    this.token = null;
    localStorage.removeItem('railway_token');
    localStorage.removeItem('authToken');
  }

  // Helper method for API calls
  private async apiCall<T = any>(
    method: string,
    endpoint: string,
    data: any = null
  ): Promise<ApiResponse<T>> {
    // Ensure we use the latest token before each call
    const currentToken = this.getToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (currentToken) {
      headers['Authorization'] = `Bearer ${currentToken}`;
    }

    console.log(`🌐 API Call: ${method} ${endpoint}`);
    console.log('📤 Headers:', { ...headers, Authorization: headers['Authorization'] ? 'Bearer ***' : undefined });
    if (data) console.log('📤 Data:', data);

    const config: RequestInit = {
      method,
      headers,
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      console.log(`📥 Response status: ${response.status}`);
      console.log(`📥 Full URL: ${this.baseURL}${endpoint}`);

      // Get raw response text first
      const responseText = await response.text();
      console.log('📥 Raw response:', responseText.substring(0, 200) + (responseText.length > 200 ? '...' : ''));

      // Try to parse as JSON
      let result;
      try {
        result = JSON.parse(responseText);
        console.log('📥 Parsed JSON:', result);
      } catch (parseError) {
        console.error('🚨 JSON Parse Error:', parseError);
        console.log('📄 Response appears to be HTML/Text, not JSON');
        throw new Error(`Server returned non-JSON response: ${responseText.substring(0, 100)}...`);
      }

      if (!response.ok) {
        throw new Error(result.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return {
        success: true,
        ...result,
      };
    } catch (error: any) {
      console.error('🚨 Railway API Error:', error);
      return {
        success: false,
        error: error.message || 'API request failed',
      };
    }
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string }>> {
    return this.apiCall('GET', '/health');
  }

  // Get current user
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return await this.apiCall<User>('GET', '/api/users/me');
  }

  // Authentication methods
  async signUp(userData: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await this.apiCall('POST', '/api/register', userData);

    const token = response.token || response.session?.accessToken;
    if ((response as any).success && token) {
      this.setToken(token);
    }

    return response;
  }

  async signIn(credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await this.apiCall('POST', '/api/login', credentials);

    const token = response.token || response.session?.accessToken;
    if ((response as any).success && token) {
      this.setToken(token);
    }

    return response;
  }

  async signOut(): Promise<ApiResponse> {
    const response = await this.apiCall('POST', '/api/logout');
    this.clearToken();
    return response;
  }

  // Request password reset email
  async requestPasswordReset(email: string): Promise<ApiResponse<{ message?: string }>> {
    return this.apiCall('POST', '/api/password/forgot', { email });
  }

  // Backward-compat auth wrappers (used by httpClient)
  login(email: string, password: string) {
    return this.signIn({ email, password });
  }
  register(email: string, password: string, firstName?: string, lastName?: string) {
    return this.signUp({ email, password, firstName, lastName });
  }
  logout() {
    return this.signOut();
  }

  // Personas
  async getPersonas(): Promise<ApiResponse<Persona[]>> {
    const res = await this.apiCall<any>('GET', '/api/personas');
    if (!res.success) return res as ApiResponse<Persona[]>;
    const data = (res as any).data ?? (res as any).personas ?? (res as any).items ?? [];
    return { success: true, data };
  }

  async getPersona(id: string): Promise<ApiResponse<Persona>> {
    const res = await this.apiCall<any>('GET', `/api/personas/${id}`);
    if (!res.success) return res as ApiResponse<Persona>;
    const data = (res as any).data ?? (res as any).persona ?? res;
    return { success: true, data };
  }

  async createPersona(personaData: CreatePersonaData): Promise<ApiResponse<Persona>> {
    console.log('🔐 Token (before create):', this.getToken() ? 'exists' : 'missing');
    const res = await this.apiCall<any>('POST', '/api/personas', personaData);
    console.log('✅ Create persona raw result:', res);
    if (!res.success) return res as ApiResponse<Persona>;
    const data = (res as any).data ?? (res as any).persona ?? res;
    return { success: true, data };
  }

  async updatePersona(id: string, personaData: Partial<CreatePersonaData>): Promise<ApiResponse<Persona>> {
    const res = await this.apiCall<any>('PUT', `/api/personas/${id}`, personaData);
    if (!res.success) return res as ApiResponse<Persona>;
    const data = (res as any).data ?? (res as any).persona ?? res;
    return { success: true, data };
  }

  async deletePersona(id: string): Promise<ApiResponse> {
    return await this.apiCall('DELETE', `/api/personas/${id}`);
  }

  // Gift recommendations
  async getGiftRecommendations(personaId: string): Promise<ApiResponse<any[]>> {
    const res = await this.apiCall<any>('POST', `/api/gift/recommend`, { personaId });
    if (!res.success) return res as ApiResponse<any[]>;
    const data = (res as any).data ?? (res as any).suggestions ?? (res as any).recommendations ?? [];
    return { success: true, data };
  }

  // Milestones
  async getPersonaMilestones(personaId: string): Promise<ApiResponse<Milestone[]>> {
    const res = await this.apiCall<any>('GET', `/api/personas/${personaId}/milestones`);
    if (!res.success) return res as ApiResponse<Milestone[]>;
    const data = (res as any).data ?? (res as any).milestones ?? [];
    return { success: true, data };
  }

  async createPersonaMilestone(personaId: string, payload: {
    title: string;
    details?: string;
    category?: string;
    tags?: string[];
    occurred_at?: string; // YYYY-MM-DD
  }): Promise<ApiResponse<Milestone>> {
    const res = await this.apiCall<any>('POST', `/api/personas/${personaId}/milestones`, payload);
    if (!res.success) return res as ApiResponse<Milestone>;
    const data = (res as any).data ?? (res as any).milestone ?? res;
    return { success: true, data };
  }

  async deleteMilestone(milestoneId: string): Promise<ApiResponse> {
    return this.apiCall('DELETE', `/api/persona-milestones/${milestoneId}`);
  }

  // Events
  async getPersonaEvents(personaId: string): Promise<ApiResponse<PersonaEvent[]>> {
    const res = await this.apiCall<any>('GET', `/api/personas/${personaId}/events`);
    if (!res.success) return res as ApiResponse<PersonaEvent[]>;
    const data = (res as any).data ?? (res as any).events ?? [];
    return { success: true, data };
  }

  async createPersonaEvent(personaId: string, payload: {
    title: string;
    details?: string;
    category?: string;
    type?: string;
    tags?: string[];
    occurred_at?: string; // YYYY-MM-DD
  }): Promise<ApiResponse<PersonaEvent>> {
    const res = await this.apiCall<any>('POST', `/api/personas/${personaId}/events`, payload);
    if (!res.success) return res as ApiResponse<PersonaEvent>;
    const data = (res as any).data ?? (res as any).event ?? res;
    return { success: true, data };
  }

  async updateEvent(eventId: string, payload: Partial<{
    title: string;
    details?: string;
    category?: string;
    type?: string;
    tags?: string[];
    occurred_at?: string;
  }>): Promise<ApiResponse<PersonaEvent>> {
    const res = await this.apiCall<any>('PUT', `/api/events/${eventId}`, payload);
    if (!res.success) return res as ApiResponse<PersonaEvent>;
    const data = (res as any).data ?? (res as any).event ?? res;
    return { success: true, data };
  }

  async deleteEvent(eventId: string): Promise<ApiResponse> {
    return this.apiCall('DELETE', `/api/events/${eventId}`);
  }

  // Optional stubs for future endpoints
  async searchGifts(_query: string, _filters?: any): Promise<ApiResponse<any>> {
    return { success: false, error: 'Not implemented' } as any;
  }

  async getGiftCategories(): Promise<ApiResponse<any>> {
    return { success: false, error: 'Not implemented' } as any;
  }

  async getUserPreferences(): Promise<ApiResponse<any>> {
    return { success: false, error: 'Not implemented' } as any;
  }

  async updateUserPreferences(_preferences: any): Promise<ApiResponse<any>> {
    return { success: false, error: 'Not implemented' } as any;
  }
}

// Export singleton instance
export const railwayApi = new RailwayAPI();
export default railwayApi;