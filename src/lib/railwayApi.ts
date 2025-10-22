// Railway API Client for GiftMind
// Backend deployment: https://giftmind-be-production.up.railway.app

const API_BASE_URL = 'https://giftmind-be-production.up.railway.app';

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

class RailwayAPI {
  private baseURL: string;
  private token: string | null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('railway_token') || localStorage.getItem('authToken') || null;
  }

  // Helper method for API calls
  private async apiCall<T = any>(
    method: string, 
    endpoint: string, 
    data: any = null
  ): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    console.log(`🌐 API Call: ${method} ${endpoint}`);
    console.log('📤 Headers:', headers);
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
        ...result
      };
    } catch (error: any) {
      console.error('🚨 Railway API Error:', error);
      return {
        success: false,
        error: error.message || 'API request failed'
      };
    }
  }

  // Set authentication token
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('railway_token', token);
  }

  // Clear authentication token
  clearToken() {
    this.token = null;
    localStorage.removeItem('railway_token');
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
    
    if (response.success && response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async signIn(credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await this.apiCall('POST', '/api/login', credentials);
    
    if (response.success && response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async signOut(): Promise<ApiResponse> {
    const response = await this.apiCall('POST', '/api/logout');
    this.clearToken();
    return response;
  }

  // Persona methods
  async getPersonas(): Promise<ApiResponse<Persona[]>> {
    return await this.apiCall<Persona[]>('GET', '/api/personas');
  }

  async createPersona(personaData: CreatePersonaData): Promise<ApiResponse<Persona>> {
    console.log('🔐 Token check:', this.token ? 'Token exists' : 'No token');
    console.log('🔐 Token value:', this.token ? `${this.token.substring(0, 20)}...` : 'null');
    console.log('📋 Creating persona:', personaData);
    
    // Let's also check localStorage directly
    const storedToken = localStorage.getItem('railway_token');
    console.log('💾 Stored token:', storedToken ? `${storedToken.substring(0, 20)}...` : 'null');
    
    const result = await this.apiCall<Persona>('POST', '/api/personas', personaData);
    console.log('✅ Create persona result:', result);
    return result;
  }

  async updatePersona(id: string, personaData: Partial<CreatePersonaData>): Promise<ApiResponse<Persona>> {
    return await this.apiCall<Persona>('PUT', `/api/personas/${id}`, personaData);
  }

  async deletePersona(id: string): Promise<ApiResponse> {
    return await this.apiCall('DELETE', `/api/personas/${id}`);
  }

  // Gift suggestions (future implementation)
  async getGiftSuggestions(personaId: string): Promise<ApiResponse<any[]>> {
    return await this.apiCall('GET', `/api/personas/${personaId}/gifts`);
  }
}

// Export singleton instance
export const railwayApi = new RailwayAPI();
export default railwayApi;